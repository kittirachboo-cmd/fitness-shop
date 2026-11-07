'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  AlertCircle,
  Dumbbell,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { GoogleLogo } from '@/components/login-prompt-modal';

export default function CartPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    total,
    isLoaded,
  } = useCart();

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [postalCode, setPostalCode] = useState('');
  const [note, setNote] = useState('');

  // Auto-fill from user when user logs in
  React.useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('ตะกร้าสินค้าว่างเปล่า');
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      setErrorMsg('กรุณากรอกข้อมูลชื่อ เบอร์โทรศัพท์ ที่อยู่ และรหัสไปรษณีย์ให้ครบถ้วน');
      return;
    }

    // ตรวจสอบเบอร์โทร (ตัวเลข 9-10 หลัก)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 10) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: name.trim(),
            phone: cleanPhone,
            email: email.trim(),
            address: address.trim(),
            province: province.trim(),
            postal_code: postalCode.trim(),
            note: note.trim(),
          },
          items: items.map((i) => ({
            id: i.product.id,
            qty: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'ไม่สามารถสั่งซื้อได้ โปรดลองอีกครั้ง');
      }

      // สั่งซื้อสำเร็จ -> ล้างตะกร้า และส่งต่อไปหน้าชำระเงิน
      clearCart();
      router.push(`/order/${data.order_id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        กำลังโหลดตะกร้าสินค้า...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">ตะกร้าสินค้าของคุณยังว่างเปล่า</h1>
          <p className="text-sm text-slate-400">
            เลือกดูอุปกรณ์ออกกำลังกายคุณภาพสูง แล้วเริ่มฟิตไปด้วยกันได้เลย!
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
        >
          <Dumbbell className="w-4 h-4" />
          <span>ไปเลือกดูสินค้า</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">ตะกร้าสินค้า & สั่งซื้อ</h1>
        <p className="text-sm text-slate-400 mt-1">
          ตรวจสอบรายการอุปกรณ์ที่คุณเลือก และกรอกที่อยู่จัดส่งด้านล่าง
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span>รายการสินค้า ({items.length} รายการ)</span>
            <button
              onClick={clearCart}
              className="text-rose-400 hover:text-rose-300 transition"
            >
              ล้างตะกร้าทั้งหมด
            </button>
          </div>

          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-bold text-white text-sm hover:text-emerald-400 truncate block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ฿{product.price.toLocaleString()} / ชิ้น
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="text-sm font-black text-white">
                      ฿{(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition"
                  title="ลบรายการนี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Shipping Policy Note */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300">
            <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              {subtotal >= 1500 ? (
                <strong className="text-emerald-400">คุณได้รับสิทธิ์จัดส่งฟรีทั่วประเทศ!</strong>
              ) : (
                <>ช้อปเพิ่มอีก ฿{(1500 - subtotal).toLocaleString()} เพื่อรับสิทธิ์จัดส่งฟรี</>
              )}
            </span>
          </div>
        </div>

        {/* Right Column: Checkout Form & Total */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSubmitOrder}
            className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-5"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>ข้อมูลจัดส่งสินค้า</span>
            </h2>

            {/* Google Login Status or Prompt */}
            {user ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">
                    สั่งซื้อในนาม: {user.name} ({user.email})
                  </strong>
                  <span className="text-slate-400 text-[11px]">
                    คำสั่งซื้อนี้จะผูกกับบัญชี Google ของท่าน ปลอดภัย ไม่อับสนออเดอร์แน่นอน
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-xs space-y-2">
                <div className="flex items-start gap-2 text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">
                      คำแนะนำ: เข้าสู่ระบบด้วย Google ก่อนสั่งซื้อ
                    </strong>
                    <span className="text-slate-300 text-[11px] leading-relaxed block mt-0.5">
                      เพื่อไม่ให้ออเดอร์และสลิปสับสน และให้ร้านค้าติดต่อกลับ/แจ้งเลขพัสดุได้ตรงตัว
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow transition"
                >
                  <GoogleLogo />
                  <span>เข้าสู่ระบบด้วย Google ทันที</span>
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ชื่อ-นามสกุล ผู้รับ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย แข็งแรง"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    เบอร์โทรศัพท์ (10 หลัก) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    อีเมล (สำหรับรับใบเสร็จ)
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ที่อยู่จัดส่ง (บ้านเลขที่, หมู่บ้าน/อาคาร, ซอย, ถนน) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="เช่น 123/45 หมู่บ้านฟิตเนสวิลล์ ถ.สุขุมวิท..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    จังหวัด *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น กรุงเทพฯ, เชียงใหม่"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    รหัสไปรษณีย์ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 10110"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  หมายเหตุเพิ่มเติม (ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="เช่น ฝากไว้ที่นิติ, โทรแจ้งก่อนเข้าส่ง, ให้ช่วยยกขึ้นชั้น 2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>ยอดรวมสินค้า</span>
                <span className="text-white font-semibold">฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ค่าจัดส่ง</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">ฟรี</span>
                  ) : (
                    <span className="text-white font-semibold">฿{shippingFee}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>ยอดชำระสุทธิ</span>
                <span className="text-emerald-400 text-xl">฿{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {loading ? (
                <span>กำลังบันทึกคำสั่งซื้อ...</span>
              ) : (
                <>
                  <span>ยืนยันการสั่งซื้อ • ฿{total.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              *เมื่อกดยืนยัน ระบบจะนำท่านไปสู่หน้าชำระเงินผ่าน QR พร้อมเพย์ และสามารถแนบสลิปได้ทันที
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
