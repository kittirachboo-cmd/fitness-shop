'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Product, Review } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface ProductDetailViewProps {
  product: Product;
  initialReviews: Review[];
}

export function ProductDetailView({ product, initialReviews }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image_url);
  const [added, setAdded] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.name,
          customer_name: reviewerName,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setReviewSuccess(true);
        setReviews([
          {
            id: data.review?.id || `rev-${Date.now()}`,
            product_id: product.id,
            product_name: product.name,
            customer_name: reviewerName,
            rating,
            comment,
            is_approved: true,
            created_at: 'เมื่อสักครู่',
          },
          ...reviews,
        ]);
        setReviewerName('');
        setComment('');
        setTimeout(() => {
          setReviewSuccess(false);
          setShowReviewForm(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-emerald-400">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/products?category=${product.category}`} className="hover:text-emerald-400">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center"
            />
            {discountPercent && discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-xs font-black bg-rose-500 text-white shadow">
                ลด {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img ? 'border-emerald-500' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {product.category_name}
              </span>
              {product.warranty && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {product.warranty}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating summary */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold">{product.rating || 5.0}</span>
            <span className="text-slate-500">• ({reviews.length} รีวิวจากผู้ใช้จริง)</span>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-white">
              ฿{product.price.toLocaleString()}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-base text-slate-500 line-through">
                ฿{product.original_price.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-medium ml-auto">
              {product.stock > 0 ? `สต็อกคงเหลือ ${product.stock} ชิ้น` : 'สินค้าหมด'}
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Key Features List */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">จุดเด่นของรุ่นนี้:</p>
              <ul className="space-y-1.5">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-300">จำนวน:</span>
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-400 hover:text-white transition"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-2 text-slate-400 hover:text-white transition"
                  disabled={quantity >= (product.stock || 99)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition ${
                  added
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>เพิ่มลงตะกร้าแล้ว!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>เพิ่มลงตะกร้า • ฿{(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-2 transition"
              >
                ดูตะกร้าสินค้า
              </Link>
            </div>
          </div>

          {/* Quick Assurance */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-900/40">
              <Truck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span>ส่งด่วน 1-3 วัน</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span>{product.warranty || 'ประกันศูนย์ไทย'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/40">
              <RotateCcw className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span>เปลี่ยนสินค้าใน 7 วัน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="border border-slate-800 rounded-2xl p-6 sm:p-8 bg-slate-900/40 space-y-4">
          <h3 className="text-xl font-bold text-white">ข้อมูลจำเพาะทางเทคนิค (Specifications)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 border-b border-slate-800/80 text-sm">
                <span className="text-slate-400">{key}</span>
                <span className="text-slate-200 font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="border-t border-slate-800/80 pt-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              รีวิวจากผู้ใช้สินค้านี้
              <span className="text-sm font-normal text-slate-400">({reviews.length} ความคิดเห็น)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              รีวิวทุกรายการเชื่อมต่อกับ Google Sheet สำหรับเจ้าของร้านตรวจสอบ
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>{showReviewForm ? 'ปิดแบบฟอร์ม' : 'เขียนรีวิวสินค้านี้'}</span>
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="p-6 rounded-2xl bg-slate-900 border border-emerald-800/50 space-y-4 animate-fadeIn"
          >
            <h4 className="font-bold text-white text-base">เขียนรีวิวและให้คะแนน</h4>

            {reviewSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>ขอบคุณสำหรับรีวิว! ข้อมูลถูกบันทึกลงระบบและส่งเข้า Google Sheet เรียบร้อยแล้ว</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ชื่อของคุณ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น คุณกานต์ หรือ โค้ชต้น"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ระดับความพึงพอใจ (ให้คะแนนดาว)
                    </label>
                    <div className="flex items-center gap-1.5 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-slate-600 hover:text-amber-400 transition"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-amber-400">{rating} / 5 ดาว</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ความคิดเห็นและรีวิวสินค้า *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="บอกเล่าความรู้สึก คุณภาพวัสดุ การใช้งาน หรือความคุ้มค่า..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                  >
                    {submittingReview ? 'กำลังส่ง...' : 'โพสต์รีวิว'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{rev.customer_name}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-slate-500">{rev.created_at}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
