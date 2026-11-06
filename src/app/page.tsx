import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dumbbell, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2, Star, PhoneCall, Sheet, Award } from 'lucide-react';
import { getProducts, getReviews } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  const reviews = await getReviews();
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 border-b border-slate-800/60">
        {/* Athletic Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>อุปกรณ์ออกกำลังกายเกรด Commercial & Home Gym</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                สร้างฟิตเนสในบ้าน <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  สู่เป้าหมายที่แข็งแกร่ง
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                ศูนย์รวมดัมเบลปรับน้ำหนัก บาร์เบลโอลิมปิก ลู่วิ่งไฟฟ้า และสถานีเพาะกายมาตรฐานสากล โครงสร้างเหล็กหนาพิเศษ ปลอดภัย รับประกันศูนย์ไทยสูงสุด 5 ปี จัดส่งด่วนทั่วประเทศ
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition"
                >
                  <Dumbbell className="w-5 h-5" />
                  <span>เลือกซื้ออุปกรณ์ทั้งหมด</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 font-bold text-base flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>ขอคำปรึกษาจัด Home Gym</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-slate-800/70">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">ส่งฟรี ฿1,500+</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">ประกันศูนย์ 1-5 ปี</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 shrink-0 fill-current" />
                  <span className="text-xs text-slate-300 font-medium">รีวิว 4.9 / 5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">พร้อมช่างติดตั้ง</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80"
                    alt="อุปกรณ์ออกกำลังกาย Home Gym"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>

                {/* Floating Highlight Box */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      BEST SELLER
                    </span>
                    <h4 className="text-sm font-bold text-white">ชุดพาวเวอร์แร็ค + ดัมเบลปรับน้ำหนัก</h4>
                    <p className="text-xs text-slate-400">ครบ จบ ทุกท่าเล่นกล้ามในพื้นที่ 2 ตร.ม.</p>
                  </div>
                  <Link
                    href="/products?category=strength"
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Quick Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">เลือกตามหมวดหมู่อุปกรณ์</h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 group"
          >
            <span>ดูสินค้าทั้งหมด</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const href = cat.id === 'all' ? '/products' : `/products?category=${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                className="group p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col items-center text-center space-y-2 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Best-Selling Equipment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>สินค้าแนะนำ & ขายดี</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">อุปกรณ์ยอดนิยมประจำสัปดาห์</h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 group"
          >
            <span>ดูสินค้าทั้งหมด ({products.length} รายการ)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Owner Google Sheet Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-800/40 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <Sheet className="w-4 h-4" />
                <span>Google Sheet Store Integration</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ดูแลร้านง่ายใน Google Sheet ดูได้ทั้งบนมือถือและคอมพิวเตอร์
              </h3>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                ออเดอร์ใหม่ สลิปโอนเงิน รีวิวจากลูกค้า และคำขอติดต่อกลับ จะถูกส่งเข้า Google Sheet ของร้านทันทีอัตโนมัติ เจ้าของร้าน (<span className="text-emerald-400 font-mono">kittirach.boo@tsn.thai-tech.ac.th</span>) สามารถเปิดเช็กออเดอร์ กดดูสลิป และเปลี่ยนสถานะจัดส่งผ่านมือถือได้ทุกที่ ทุกเวลา!
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> แท็บคำสั่งซื้อ + ลิงก์สลิป
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> แท็บรีวิวสินค้า (ให้ดาว)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> แท็บติดต่อลูกค้ากลับ
                </span>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                href="/api/sheet-test"
                target="_blank"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition"
              >
                <span>ทดสอบเชื่อมต่อ Sheet Webhook</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              REVIEWS & FEEDBACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">เสียงตอบรับจากลูกค้าจริง</h2>
          </div>
          <Link
            href="/reviews"
            className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 group"
          >
            <span>ดูรีวิวทั้งหมด & ร่วมเขียนรีวิว</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-emerald-400 font-medium">{rev.product_name}</p>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white">{rev.customer_name}</span>
                <span className="text-[11px] text-slate-500">ผู้ซื้อจริง</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Consultation & Custom Gym Quote Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5">
          <h3 className="text-2xl sm:text-4xl font-black text-white">
            ต้องการจัดฟิตเนสส่วนตัว หรือขอใบเสนอราคาโครงการ?
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            ทีมผู้เชี่ยวชาญพร้อมให้คำแนะนำ ออกแบบพื้นที่ 3D และจัดเซ็ตอุปกรณ์ที่เหมาะกับงบประมาณของคุณ ฟรีไม่มีค่าใช้จ่าย
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base transition shadow-lg shadow-emerald-500/20"
            >
              <PhoneCall className="w-5 h-5" />
              <span>ขอรับคำปรึกษา / ขอใบเสนอราคาฟรี</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
