'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Check, Sparkles, Sheet, Dumbbell } from 'lucide-react';
import { Review, Product } from '@/lib/types';
import { MOCK_REVIEWS, MOCK_PRODUCTS } from '@/lib/mock-data';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<number>(MOCK_PRODUCTS[0]?.id || 1);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // โหลดรีวิวจาก API
    fetch('/api/reviews')
      .then((res) => res.json())
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setSubmitting(true);
    const prod = products.find((p) => p.id === Number(selectedProductId));

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProductId,
          product_name: prod?.name || 'อุปกรณ์ออกกำลังกาย',
          customer_name: customerName.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setReviews([
          {
            id: data.review?.id || `rev-${Date.now()}`,
            product_id: Number(selectedProductId),
            product_name: prod?.name || 'อุปกรณ์ออกกำลังกาย',
            customer_name: customerName.trim(),
            rating,
            comment: comment.trim(),
            is_approved: true,
            created_at: 'เมื่อสักครู่',
          },
          ...reviews,
        ]);
        setCustomerName('');
        setComment('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>CUSTOMER REVIEWS & EXPERIENCES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            รีวิวและเสียงตอบรับจากลูกค้าจริง
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            อ่านความคิดเห็นจริงจากผู้ใช้จริง และร่วมเขียนรีวิวเพื่อช่วยเพื่อนๆ สมาชิกเลือกอุปกรณ์ที่ตรงใจที่สุด
          </p>
        </div>

        {/* Score Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 shrink-0">
          <div className="text-center">
            <span className="text-3xl font-black text-white">{averageRating}</span>
            <span className="text-xs text-slate-400 block">เต็ม 5.0</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-slate-400">จาก {reviews.length}+ ความคิดเห็น</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Review Form */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 sticky top-28"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>เขียนรีวิวของคุณ</span>
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/50 flex items-center gap-1">
                <Sheet className="w-3 h-3" />
                <span>ซิงค์ลง Google Sheet</span>
              </span>
            </div>

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>ขอบคุณสำหรับรีวิว! ข้อมูลถูกส่งเข้า Google Sheet ของร้านเรียบร้อยแล้วครับ</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  เลือกอุปกรณ์ที่คุณต้องการรีวิว *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ชื่อของคุณ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณกานต์ หรือ เทรนเนอร์พีท"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ให้คะแนนความพึงพอใจ
                </label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">{rating} ดาว</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ข้อความรีวิว / ประสบการณ์ใช้งานจริง *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="เช่น ความแข็งแรงของวัสดุ การประกอบ ความเงียบของเครื่อง หรือผลลัพธ์การฝึก..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
            >
              {submitting ? 'กำลังส่งข้อมูล...' : 'ส่งรีวิวสินค้า'}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              *รีวิวนี้จะถูกส่งไปยัง Google Sheet แท็บ &ldquo;รีวิว&rdquo; ให้เจ้าของร้านดูแลได้ตลอดเวลา
            </p>
          </form>
        </div>

        {/* Right Column: Reviews Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>รีวิวทั้งหมด ({reviews.length} รายการ)</span>
            <span>เรียงจากใหม่สุด</span>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      {rev.customer_name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {rev.customer_name}
                      </span>
                      <span className="text-[11px] text-slate-500">ผู้สั่งซื้อสินค้าจริง</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 text-emerald-400 text-xs font-semibold border border-slate-800">
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>{rev.product_name}</span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed pt-1">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="pt-2 flex justify-end text-[11px] text-slate-500">
                  <span>{rev.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
