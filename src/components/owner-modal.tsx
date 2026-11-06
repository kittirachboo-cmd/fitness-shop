'use client';

import React, { useState } from 'react';
import { Sheet, ExternalLink, CheckCircle2, Mail, Smartphone, Laptop, Sparkles, X } from 'lucide-react';

export function OwnerSheetGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [testResult, setTestResult] = useState<{ ok?: boolean; message?: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/sheet-test');
      const data = await res.json();
      setTestResult(data);
    } catch (err: unknown) {
      setTestResult({ ok: false, message: 'เกิดข้อผิดพลาดในการทดสอบ: ' + String(err) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60 transition shadow-sm"
        title="ดูวิธีจัดการร้านผ่าน Google Sheet"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <Sheet className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">ระบบจัดการร้าน:</span>
        <span className="font-semibold underline decoration-emerald-500/50">Google Sheet</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  ระบบจัดการร้านผ่าน Google Sheet
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-normal">
                    Real-time Sync
                  </span>
                </h3>
                <p className="text-sm text-slate-400">
                  สำหรับเจ้าของร้าน: <span className="text-emerald-400 font-mono">kittirach.boo@tsn.thai-tech.ac.th</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  ทำไมถึงใช้ Google Sheet ดูแลร้าน?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>เปิดผ่านมือถือ</strong> แอป Google Sheets ดูออเดอร์และเปลี่ยนสถานะส่งของได้ทันที</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Laptop className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>เปิดผ่านคอม</strong> กรองข้อมูล สรุปยอดขายรายวัน ทำบัญชีง่าย</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>แจ้งเตือนเข้าเมล</strong> ได้อีเมลแจ้งเตือนทันทีเมื่อมีออเดอร์ใหม่ สลิปเข้า หรือลูกค้ารีวิว</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/70 px-4 py-2 font-semibold text-white text-xs uppercase tracking-wider">
                  3 แท็บข้อมูลใน Google Sheet
                </div>
                <div className="divide-y divide-slate-800/60 bg-slate-950/50">
                  <div className="p-3">
                    <span className="font-semibold text-emerald-400">1. แท็บ "คำสั่งซื้อ" (Orders):</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      แสดงเลขออเดอร์, วันเวลา, ชื่อลูกค้า, เบอร์โทร, รายการสินค้า, ยอดรวม, ลิงก์รูปสลิปโอนเงิน (คลิกดูได้ทันที) และ Dropdown เปลี่ยนสถานะ (รอตรวจสลิป / จัดส่งแล้ว ฯลฯ)
                    </p>
                  </div>
                  <div className="p-3">
                    <span className="font-semibold text-amber-400">2. แท็บ "รีวิว" (Customer Reviews):</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      แสดงความคิดเห็น คะแนนดาว ⭐ (1-5) และสินค้าที่ลูกค้ารีวิว เลือกว่าจะแสดงบนเว็บหรือซ่อนได้
                    </p>
                  </div>
                  <div className="p-3">
                    <span className="font-semibold text-blue-400">3. แท็บ "ติดต่อลูกค้ากลับ" (Inquiries):</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      แสดงคำขอปรึกษาจัด Home Gym, ขอใบเสนอราคาฟิตเนส, เบอร์โทรลูกค้า, ช่องทางที่สะดวก ให้เจ้าของร้านโทรกลับได้สะดวก
                    </p>
                  </div>
                </div>
              </div>

              {/* ทดสอบการเชื่อมต่อ */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">ทดสอบการเชื่อมต่อ Google Sheet Webhook</h4>
                    <p className="text-xs text-slate-400">เช็คสถานะการรับส่งข้อมูลระหว่างเว็บกับ Apps Script</p>
                  </div>
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition disabled:opacity-50"
                  >
                    {testing ? 'กำลังตรวจสอบ...' : 'ทดสอบ Webhook'}
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-xs ${
                      testResult.ok
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-amber-950/60 border border-amber-800 text-amber-300'
                    }`}
                  >
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.ok ? (
                      <p className="text-slate-400 mt-1">Webhook ตอบสนองสมบูรณ์ สามารถรับออเดอร์ รีวิว และข้อความได้ตามปกติ</p>
                    ) : (
                      <p className="text-slate-400 mt-1">
                        สามารถนำไฟล์ <code>google-sheet/Code.gs</code> ไปวางใน Google Sheet Apps Script แล้วก๊อปปี้ Web app URL มาใส่ใน <code>.env.local</code>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition"
              >
                เข้าใจแล้ว / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
