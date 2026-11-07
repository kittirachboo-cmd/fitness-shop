'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, CheckCircle2, AlertCircle, FileImage, RefreshCw, Sheet, FlaskConical } from 'lucide-react';

interface SlipUploaderProps {
  orderId: string;
  orderNo: number | string;
  customerName: string;
  phone: string;
  total: number;
  initialStatus: string;
  initialSlipUrl?: string;
  currentAmount?: number;
  isTestMode?: boolean;
}

export function SlipUploader({
  orderId,
  orderNo,
  customerName,
  phone,
  total,
  initialStatus,
  initialSlipUrl,
  currentAmount,
  isTestMode = false,
}: SlipUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialSlipUrl || null);
  const [uploading, setUploading] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState('');
  const [sheetSynced, setSheetSynced] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const effectiveTotal = isTestMode ? (currentAmount || 1) : total;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('ขนาดไฟล์ต้องไม่เกิน 10MB');
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      setError('กรุณาเลือกรูปสลิปก่อนกดอัปโหลด');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('order_no', String(orderNo));
      formData.append('customer_name', customerName);
      formData.append('phone', phone);
      formData.append('total', String(effectiveTotal));

      const res = await fetch(`/api/orders/${orderId}/slip`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการอัปโหลดสลิป');
      }

      setStatus('รอตรวจสลิป');
      setMessage(data.message || 'แนบสลิปเรียบร้อยแล้ว');
      setSheetSynced(Boolean(data.sheet_synced));
      if (data.slip_url) {
        setPreviewUrl(data.slip_url);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  // ปุ่มกดส่งเข้า Google Sheet อีกครั้ง (สำหรับกรณีที่เพิ่งไปใส่ Webhook ใน Vercel)
  const handleResyncSheet = async () => {
    setResyncing(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${orderId}/resync-sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_no: orderNo,
          customer_name: customerName,
          phone,
          total: effectiveTotal,
          test_amount: isTestMode ? effectiveTotal : undefined,
          status: 'รอตรวจสลิป',
          slip_url: previewUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || data.message || 'ซิงค์เข้าชีตไม่สำเร็จ');
      }

      setSheetSynced(true);
      setMessage(data.message || '✅ ส่งข้อมูลเข้า Google Sheet สำเร็จแล้ว!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setResyncing(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <span>แนบหลักฐานการโอนเงิน (สลิป)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTestMode ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5" /> โหมดทดสอบ: ยอดสลิป 1.00 บาท
              </span>
            ) : (
              'เมื่อแนบสลิปแล้ว ระบบจะเขียนอัปเดตลง Google Sheet ของร้านทันที'
            )}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            status === 'รอชำระเงิน'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {status}
        </span>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
            sheetSynced
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              : 'bg-amber-950/70 border-amber-800 text-amber-300'
          }`}
        >
          {sheetSynced ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          )}
          <div className="space-y-1">
            <span>{message}</span>
            {sheetSynced === false && (
              <p className="text-[11px] text-slate-400">
                หากเพิ่งนำ Webhook URL ไปใส่ใน Vercel ให้กดปุ่ม <strong>&quot;ส่งเข้า Google Sheet อีกครั้ง&quot;</strong> ด้านล่างได้เลยครับ
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="space-y-3">
        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative aspect-[3/4] max-w-[240px] mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
              <Image
                src={previewUrl}
                alt="สลิปโอนเงิน"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <label className="text-xs text-emerald-400 hover:underline cursor-pointer">
                เปลี่ยนรูปภาพ
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="block p-8 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl text-center cursor-pointer bg-slate-950/40 transition">
            <FileImage className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <span className="text-sm font-semibold text-white block">
              กดเลือกรูปภาพ หรือลากไฟล์สลิปมาวางที่นี่
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              รองรับรูปภาพ JPG, PNG, WebP (ไม่เกิน 10MB)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {file && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>กำลังอัปโหลดและส่งเข้า Google Sheet...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>ยืนยันการแนบสลิปนี้ (ยอด {effectiveTotal} บ.)</span>
              </>
            )}
          </button>
        )}

        {/* ปุ่มลองซิงค์เข้าชีตอีกครั้งสำหรับออเดอร์นี้ */}
        {previewUrl && (
          <button
            type="button"
            onClick={handleResyncSheet}
            disabled={resyncing}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition border border-slate-700/80 disabled:opacity-50"
          >
            {resyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังซิงค์เข้า Google Sheet...</span>
              </>
            ) : (
              <>
                <Sheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>🔄 ส่งข้อมูลออเดอร์และสลิปนี้เข้า Google Sheet</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
