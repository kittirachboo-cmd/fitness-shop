import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, Truck, Wrench, CreditCard, Mail, Phone, MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">ส่งด่วนทั่วไทย</p>
                <p className="text-xs text-slate-400">ฟรีค่าส่งเมื่อช้อปครบ 1,500 บ.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">รับประกันศูนย์ไทย</p>
                <p className="text-xs text-slate-400">รับประกันโครงสร้างและมอเตอร์ 1-5 ปี</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">มีบริการประกอบติดตั้ง</p>
                <p className="text-xs text-slate-400">ทีมช่างมืออาชีพพร้อมให้คำแนะนำ</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">ชำระเงินสะดวกรวดเร็ว</p>
                <p className="text-xs text-slate-400">QR พร้อมเพย์ทุกธนาคาร</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                <Dumbbell className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">IRONPULSE FITNESS</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              ผู้นำเข้าและจำหน่ายอุปกรณ์ออกกำลังกายเกรดพรีเมียม ทั้งระดับ Home Gym และ Commercial สำหรับผู้รักสุขภาพ คอนโด และฟิตเนสทั่วประเทศ มุ่งมั่นคัดสรรอุปกรณ์ที่ทนทาน ปลอดภัย และคุ้มค่าที่สุด
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <p className="text-white font-semibold uppercase tracking-wider text-xs">หมวดหมู่อุปกรณ์</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=free-weights" className="hover:text-emerald-400 transition">
                  ดัมเบล & บาร์เบล
                </Link>
              </li>
              <li>
                <Link href="/products?category=cardio" className="hover:text-emerald-400 transition">
                  เครื่องคาร์ดิโอ & ลู่วิ่ง
                </Link>
              </li>
              <li>
                <Link href="/products?category=strength" className="hover:text-emerald-400 transition">
                  ม้านั่ง & พาวเวอร์แร็ค
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-emerald-400 transition">
                  ยางยืด & อุปกรณ์เสริม
                </Link>
              </li>
              <li>
                <Link href="/products?category=recovery" className="hover:text-emerald-400 transition">
                  ปืนนวด & ฟื้นฟูกล้ามเนื้อ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <p className="text-white font-semibold uppercase tracking-wider text-xs">ติดต่อร้านค้า</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>093-758-6699</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>LINE: @ironpulse</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-xs">kittirach.boo@tsn.thai-tech.ac.th</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-semibold transition"
                >
                  แบบฟอร์มขอคำปรึกษา / ติดต่อกลับ →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} IRONPULSE FITNESS. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/reviews" className="hover:text-emerald-400">
              รีวิวลูกค้า
            </Link>
            <Link href="/contact" className="hover:text-emerald-400">
              ติดต่อเรา
            </Link>
            <Link href="/cart" className="hover:text-emerald-400">
              ตะกร้าสินค้า
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
