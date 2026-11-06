'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, CheckCircle2, AlertCircle, FileImage, RefreshCw } from 'lucide-react';

interface SlipUploaderProps {
  orderId: string;
  orderNo: number | string;
  customerName: string;
  phone: string;
  total: number;
  initialStatus: string;
  initialSlipUrl?: string;
}

export function SlipUploader({
  orderId,
  orderNo,
  customerName,
  phone,
  total,
  initialStatus,
  initialSlipUrl,
}: SlipUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialSlipUrl || null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      formData.append('total', String(total));

      const res = await fetch(`/api/orders/${orderId}/slip`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการอัปโหลดสลิป');
      }

      setStatus('รอตรวจสลิป');
      setMessage('✅ แนบสลิปเรียบร้อยแล้ว! ข้อมูลถูกส่งเข้า Google Sheet แจ้งเตือนเจ้าของร้านแล้วครับ');
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

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <span>แนบหลักฐานการโอนเงิน (สลิป)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            เมื่อแนบสลิปแล้ว ระบบจะเขียนอัปเดตลง Google Sheet ของร้านทันที
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
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
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
                <span>ยืนยันการแนบสลิปนี้</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
