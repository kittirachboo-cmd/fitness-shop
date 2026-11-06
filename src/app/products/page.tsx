import React from 'react';
import Link from 'next/link';
import { Dumbbell, Search, SlidersHorizontal } from 'lucide-react';
import { getProducts } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, sort } = await searchParams;
  let products = await getProducts(category);

  // กรองตามคำค้นหา
  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q)
    );
  }

  // เรียงลำดับ
  if (sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const currentCategory = category || 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-400 text-xs font-semibold border border-emerald-900/60">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>แคตตาล็อกอุปกรณ์ออกกำลังกาย</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">สินค้าและอุปกรณ์ทั้งหมด</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          เลือกชมอุปกรณ์ออกกำลังกายคุณภาพสูง รับประกันศูนย์ไทย มีอะไหล่พร้อมบริการ และส่งฟรีเมื่อช้อปครบ 1,500 บาท
        </p>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.id;
          const href = cat.id === 'all' ? '/products' : `/products?category=${cat.id}`;
          return (
            <Link
              key={cat.id}
              href={href}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Products Count and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div>
          พบอุปกรณ์ทั้งหมด <strong className="text-white">{products.length}</strong> รายการ
        </div>

        <div className="flex items-center gap-2">
          <span>เรียงลำดับ:</span>
          <Link
            href={`/products?category=${currentCategory}`}
            className={`px-2.5 py-1 rounded-lg ${
              !sort ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-white'
            }`}
          >
            แนะนำ
          </Link>
          <Link
            href={`/products?category=${currentCategory}&sort=price-asc`}
            className={`px-2.5 py-1 rounded-lg ${
              sort === 'price-asc' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-white'
            }`}
          >
            ราคา: ต่ำ-สูง
          </Link>
          <Link
            href={`/products?category=${currentCategory}&sort=price-desc`}
            className={`px-2.5 py-1 rounded-lg ${
              sort === 'price-desc' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-white'
            }`}
          >
            ราคา: สูง-ต่ำ
          </Link>
          <Link
            href={`/products?category=${currentCategory}&sort=rating`}
            className={`px-2.5 py-1 rounded-lg ${
              sort === 'rating' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-white'
            }`}
          >
            คะแนนรีวิวสูงสุด
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <p className="text-slate-300 font-semibold">ไม่พบสินค้าในหมวดหมู่นี้</p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            ดูสินค้าทั้งหมด
          </Link>
        </div>
      )}
    </div>
  );
}
