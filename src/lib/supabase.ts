import { createClient } from '@supabase/supabase-js';
import { Product, Review } from './types';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from './mock-data';

let rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Normalize URL: If user provided ref or publishable key, extract ref from anon key JWT
if (rawUrl && !rawUrl.startsWith('http')) {
  if (rawAnonKey && rawAnonKey.includes('.')) {
    try {
      const parts = rawAnonKey.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        if (payload?.ref) {
          rawUrl = `https://${payload.ref}.supabase.co`;
        }
      }
    } catch {
      // fallback
    }
  }
  if (!rawUrl.startsWith('http')) {
    rawUrl = `https://${rawUrl}.supabase.co`;
  }
}

export const supabaseUrl = rawUrl;
export const supabaseAnonKey = rawAnonKey;
export const supabaseServiceRoleKey = rawServiceKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

// Client-side Supabase instance (anon key)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Server-side Supabase admin instance (service role key)
export const supabaseAdmin = Boolean(supabaseUrl && supabaseServiceRoleKey && !supabaseUrl.includes('your-project-id'))
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

/**
 * ดึงรายการสินค้าทั้งหมด
 */
export async function getProducts(category?: string): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    if (!category || category === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.category === category);
  }

  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (!category || category === 'all') return MOCK_PRODUCTS;
      return MOCK_PRODUCTS.filter(p => p.category === category);
    }

    return data as Product[];
  } catch (err) {
    console.warn('Error fetching products from Supabase, fallback to mock:', err);
    if (!category || category === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.category === category);
  }
}

/**
 * ดึงสินค้าจาก slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
    }

    return data as Product;
  } catch {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }
}

/**
 * ดึงรีวิวสินค้า
 */
export async function getReviews(productId?: number): Promise<Review[]> {
  if (!isSupabaseConfigured || !supabase) {
    if (!productId) return MOCK_REVIEWS;
    return MOCK_REVIEWS.filter(r => r.product_id === productId);
  }

  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (!productId) return MOCK_REVIEWS;
      return MOCK_REVIEWS.filter(r => r.product_id === productId);
    }

    return data as Review[];
  } catch {
    if (!productId) return MOCK_REVIEWS;
    return MOCK_REVIEWS.filter(r => r.product_id === productId);
  }
}
