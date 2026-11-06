'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, ShoppingCart, Menu, X, PhoneCall, Star, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { OwnerSheetGuide } from './owner-modal';

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/products', label: 'สินค้าทั้งหมด' },
    { href: '/reviews', label: 'รีวิวลูกค้า' },
    { href: '/contact', label: 'ขอคำปรึกษา / ติดต่อเรา' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Top Notification Bar */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/40 text-emerald-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>จัดส่งด่วนทั่วไทย! ฟรีค่าจัดส่งเมื่อสั่งซื้อครบ 1,500 บาทขึ้นไป</span>
        <span className="hidden sm:inline text-emerald-500">• รับประกันศูนย์ไทย 1-5 ปีทุกชิ้น</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition">
                  IRONPULSE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase tracking-widest border border-emerald-500/30">
                  PRO FIT
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 tracking-wider uppercase font-medium">
                Gym & Fitness Equipment
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Google Sheet Guide Button */}
            <OwnerSheetGuide />

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition flex items-center gap-2"
              title="ดูตะกร้าสินค้า"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <span className="hidden sm:inline text-xs font-semibold">ตะกร้า</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>โทรสั่งด่วน: 089-123-4567</span>
            <span>LINE: @ironpulse</span>
          </div>
        </div>
      )}
    </header>
  );
}
