'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Dumbbell,
  ShoppingCart,
  Menu,
  X,
  PhoneCall,
  Star,
  Sparkles,
  LogOut,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { GoogleLogo } from './login-prompt-modal';

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, signInWithGoogle, signOut, setShowLoginPrompt } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/products', label: 'สินค้าทั้งหมด' },
    { href: '/reviews', label: 'รีวิวลูกค้า' },
    { href: '/contact', label: 'ขอคำปรึกษา / ติดต่อเรา' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Top Reminder Banner: Always emphasizes logging in if guest */}
      {!user ? (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-800/50 text-amber-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>คำแนะนำสำคัญ:</strong> โปรดเข้าสู่ระบบด้วย Google ด้านขวาบน เพื่อไม่ให้ออเดอร์สับสนและให้ร้านติดต่อกลับได้ถูกต้อง
          </span>
          <button
            onClick={() => setShowLoginPrompt(true)}
            className="underline text-amber-200 hover:text-white font-bold ml-1"
          >
            ดูลายละเอียด
          </button>
        </div>
      ) : (
        <div className="bg-emerald-950/80 border-b border-emerald-900/40 text-emerald-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>เข้าสู่ระบบแล้วในชื่อ: <strong>{user.name}</strong> ({user.email}) — คำสั่งซื้อจะบันทึกเข้าบัญชีของคุณโดยตรง</span>
        </div>
      )}

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
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
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

          {/* Right Action Icons: Prominent Google Login + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prominent Google Auth Section */}
            {!user ? (
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition hover:scale-[1.02] border border-slate-200"
                title="เข้าสู่ระบบด้วย Google เพื่อไม่ให้ออเดอร์สับสน"
              >
                <GoogleLogo />
                <span className="hidden sm:inline">เข้าสู่ระบบด้วย Google</span>
                <span className="sm:hidden">เข้าสู่ระบบ</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white transition text-xs"
                >
                  {user.avatarUrl ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-emerald-500">
                      <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden md:inline font-semibold max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                    <div className="p-2 border-b border-slate-800">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-slate-400 truncate text-[11px] font-mono">{user.email}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400">
                        <UserCheck className="w-3 h-3" /> ยืนยันตัวตนแล้ว
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2 transition mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition flex items-center gap-2"
              title="ดูตะกร้าสินค้า"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <span className="hidden md:inline text-xs font-semibold">ตะกร้า</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
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

          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>โทรสั่งด่วน: 093-758-6699</span>
              <span>LINE: @ironpulse</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
