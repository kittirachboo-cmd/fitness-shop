'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Check, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-slate-900/80 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-500 text-white shadow">
              ลด {discountPercent}%
            </span>
          )}
          {product.is_featured && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 shadow">
              ขายดี ⭐
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {product.stock > 0 ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-900/60">
              มีสินค้า ({product.stock})
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950/80 backdrop-blur-md text-rose-400 border border-rose-900/60">
              สินค้าหมดชั่วคราว
            </span>
          )}
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category & Warranty */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="text-emerald-400 font-medium">{product.category_name}</span>
          {product.warranty && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {product.warranty}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block flex-1 group/title">
          <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover/title:text-emerald-400 transition">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">
            {product.description}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 my-3 text-xs">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 font-bold text-slate-200">{product.rating || 5.0}</span>
          </div>
          <span className="text-slate-500">({product.reviews_count || 10}+ รีวิว)</span>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white">
                ฿{product.price.toLocaleString()}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  ฿{product.original_price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">รวมภาษีแล้ว</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              added
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="เพิ่มลงในตะกร้า"
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">เพิ่มแล้ว</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">ใส่ตะกร้า</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
