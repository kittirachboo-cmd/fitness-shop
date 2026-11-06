import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getReviews } from '@/lib/supabase';
import { ProductDetailView } from '@/components/product-detail-view';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getReviews(product.id);

  return <ProductDetailView product={product} initialReviews={reviews} />;
}
