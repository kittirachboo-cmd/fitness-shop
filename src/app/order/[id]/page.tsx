import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import promptpayQR from 'promptpay-qr';
import QRCode from 'qrcode';
import {
  CheckCircle2,
  Clock,
  QrCode,
  Building,
  CreditCard,
  User,
  Phone,
  MapPin,
  Dumbbell,
  ArrowRight,
  Sheet
} from 'lucide-react';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { SlipUploader } from '@/components/slip-uploader';
import { Order } from '@/lib/types';

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;

  let order: Order | null = null;

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        order = data as Order;
      }
    } catch (e) {
      console.warn('Failed to load order from supabase:', e);
    }
  }

  // Fallback demo order if direct URL opened without prior database record
  if (!order) {
    order = {
      id,
      order_no: 1088,
      customer_name: 'คุณลูกค้า',
      phone: '081-234-5678',
      email: 'customer@example.com',
      address: '123/45 ถนนสุขุมวิท',
      province: 'กรุงเทพมหานคร',
      postal_code: '10110',
      note: 'จัดส่งด่วน',
      items: [
        {
          id: 1,
          slug: 'adjustable-dumbbell-24kg',
          name: 'ดัมเบลปรับน้ำหนักอัจฉริยะ 24 kg (IronFit QuickLock)',
          price: 3590,
          qty: 1,
          line_total: 3590,
          image_url:
            'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
        },
      ],
      items_count: 1,
      subtotal: 3590,
      shipping_fee: 0,
      total: 3590,
      status: 'รอชำระเงิน',
      created_at: new Date().toISOString(),
    };
  }

  // Generate PromptPay QR
  const promptpayId = process.env.PROMPTPAY_ID || '0891234567';
  let qrDataUrl = '';
  try {
    const ppPayload = promptpayQR(promptpayId, { amount: order.total });
    qrDataUrl = await QRCode.toDataURL(ppPayload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate promptpay qr:', err);
  }

  const bankName = process.env.SHOP_BANK_NAME || 'ธนาคารกสิกรไทย (KBANK)';
  const bankAccount = process.env.SHOP_BANK_ACCOUNT || '123-2-88990-1';
  const accountName = process.env.SHOP_ACCOUNT_NAME || 'ร้านอุปกรณ์ออกกำลังกาย IRONPULSE';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Status Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                ORDER CONFIRMED
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                #{order.order_no}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              คำสั่งซื้อสำเร็จ #{order.order_no}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Order ID: <span className="font-mono">{order.id}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">ยอดชำระสุทธิ</span>
            <span className="text-3xl font-black text-emerald-400">
              ฿{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">
              สถานะปัจจุบัน: <strong className="text-amber-400 font-bold">{order.status}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sheet className="w-4 h-4 text-emerald-400" />
            <span>เชื่อมต่อกับ Google Sheet ของร้านอัตโนมัติ</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: PromptPay Payment Card */}
        <div className="md:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              <QrCode className="w-4 h-4" />
              <span>สแกนจ่ายผ่านพร้อมเพย์ (PromptPay)</span>
            </div>

            {/* QR Code Container */}
            {qrDataUrl && (
              <div className="p-4 bg-white rounded-2xl max-w-[260px] mx-auto shadow-xl">
                <div className="relative aspect-square w-full">
                  <Image
                    src={qrDataUrl}
                    alt="PromptPay QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-900 block">
                    ยอดชำระ ฿{order.total.toLocaleString()} บาท
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {promptpayId}
                  </span>
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ธนาคาร:</span>
                <span className="font-bold text-white">{bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">เลขที่บัญชี:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {bankAccount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ชื่อบัญชี:</span>
                <span className="font-bold text-white">{accountName}</span>
              </div>
            </div>
          </div>

          {/* Slip Uploader Component */}
          <SlipUploader
            orderId={order.id}
            orderNo={order.order_no}
            customerName={order.customer_name}
            phone={order.phone}
            total={order.total}
            initialStatus={order.status}
            initialSlipUrl={order.slip_url}
          />
        </div>

        {/* Right Column: Order Summary & Shipping Details */}
        <div className="md:col-span-6 space-y-6">
          {/* Customer & Address Details */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              รายละเอียดผู้รับสินค้า
            </h3>
            <div className="flex items-start gap-2.5 text-slate-300">
              <User className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{order.customer_name}</span>
            </div>
            <div className="flex items-start gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{order.phone}</span>
            </div>
            <div className="flex items-start gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {order.address} {order.province} {order.postal_code}
              </span>
            </div>
            {order.note && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                <strong>หมายเหตุ:</strong> {order.note}
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              รายการอุปกรณ์ที่สั่งซื้อ
            </h3>

            <div className="space-y-3 divide-y divide-slate-800/60">
              {order.items &&
                order.items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                    {item.image_url && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        ฿{item.price.toLocaleString()} x {item.qty} ชิ้น
                      </p>
                    </div>
                    <span className="text-xs font-bold text-white">
                      ฿{item.line_total.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>

            {/* Price breakdown */}
            <div className="pt-4 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>ยอดรวมสินค้า</span>
                <span>฿{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ค่าจัดส่ง</span>
                <span>
                  {order.shipping_fee === 0 ? (
                    <span className="text-emerald-400 font-bold">ฟรี</span>
                  ) : (
                    `฿${order.shipping_fee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>ยอดรวมสุทธิ</span>
                <span className="text-emerald-400">฿{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>เลือกซื้ออุปกรณ์อื่นเพิ่มเติม</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
