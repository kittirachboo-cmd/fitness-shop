'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldAlert, CheckCircle2, X, Lock, PhoneCall, PackageCheck } from 'lucide-react';

export function GoogleLogo() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function LoginPromptModal() {
  const { user, showLoginPrompt, dismissPrompt, signInWithGoogle } = useAuth();

  if (!showLoginPrompt || user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-slate-200 shadow-2xl shadow-emerald-950/50">
        {/* Close button */}
        <button
          onClick={dismissPrompt}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 transition"
          title="ปิดหน้าต่างนี้ชั่วคราว"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              คำแนะนำสำคัญก่อนสั่งซื้อ
            </div>
            <h3 className="text-xl font-black text-white">
              กรุณาเข้าสู่ระบบด้วย Google
            </h3>
          </div>
        </div>

        {/* Content & Why login */}
        <div className="space-y-3.5 text-xs text-slate-300 mb-6">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            เพื่อความปลอดภัยและมอบประสบการณ์ที่ดีที่สุด ขอแนะนำให้ท่านเข้าสู่ระบบด้วยบัญชี Google ก่อนทำรายการ:
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">ป้องกันออเดอร์และสลิปสับสน:</strong>
                <span className="text-slate-400">คำสั่งซื้อและหลักฐานการโอนจะถูกผูกกับบัญชีของท่านโดยตรง</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">ติดต่อกลับได้อย่างแม่นยำ:</strong>
                <span className="text-slate-400">ร้านค้าสามารถประสานงานเรื่องจัดส่ง นัดเวลาติดตั้ง หรือแจ้งเลขพัสดุได้ทันที</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">ติดตามสถานะได้ทุกอุปกรณ์:</strong>
                <span className="text-slate-400">เปิดดูสถานะและประวัติคำสั่งซื้อได้ทั้งบนมือถือและคอมพิวเตอร์</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition hover:scale-[1.01]"
          >
            <GoogleLogo />
            <span>เข้าสู่ระบบด้วย Google (แนะนำ)</span>
          </button>

          <button
            onClick={dismissPrompt}
            className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-slate-200 transition"
          >
            เลือกดูสินค้าก่อน (จะเข้าสู่ระบบในขั้นตอนชำระเงิน)
          </button>
        </div>
      </div>
    </div>
  );
}
