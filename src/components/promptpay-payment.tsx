'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import promptpayQR from 'promptpay-qr';
import QRCode from 'qrcode';
import {
  QrCode,
  FlaskConical,
  Check,
  Copy,
  Building,
  CreditCard,
  User,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface PromptPayPaymentProps {
  promptpayId: string;
  totalAmount: number;
  orderNo: number | string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  initialQrUrl?: string;
  onAmountChange?: (amount: number, isTestMode: boolean) => void;
}

export function PromptPayPayment({
  promptpayId,
  totalAmount,
  orderNo,
  bankName,
  bankAccount,
  accountName,
  initialQrUrl,
  onAmountChange,
}: PromptPayPaymentProps) {
  const [isTestMode, setIsTestMode] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(totalAmount);
  const [qrUrl, setQrUrl] = useState<string>(initialQrUrl || '');
  const [copied, setCopied] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);

  // Generate QR dynamically when amount or mode changes
  const generateQR = async (amount: number) => {
    setLoadingQr(true);
    try {
      const payload = promptpayQR(promptpayId, { amount });
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate PromptPay QR:', err);
    } finally {
      setLoadingQr(false);
    }
  };

  const toggleTestMode = (test: boolean) => {
    setIsTestMode(test);
    const newAmt = test ? 1 : totalAmount;
    setCurrentAmount(newAmt);
    generateQR(newAmt);
    if (onAmountChange) {
      onAmountChange(newAmt, test);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankAccount.replace(/[^0-9]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!initialQrUrl) {
      generateQR(totalAmount);
    }
  }, [totalAmount]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
          <QrCode className="w-4 h-4" />
          <span>สแกนจ่ายผ่าน QR พร้อมเพย์</span>
        </div>

        {/* 1-Baht Test Mode Toggle Pill */}
        <button
          type="button"
          onClick={() => toggleTestMode(!isTestMode)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${
            isTestMode
              ? 'bg-amber-500 text-slate-950 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
          }`}
          title="สลับเป็นโหมดทดสอบจ่าย 1 บาท"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{isTestMode ? 'โหมดทดสอบ 1 บ. (เปิดอยู่)' : '🧪 ทดลองโอน 1 บาท'}</span>
        </button>
      </div>

      {/* Amount Switcher Buttons */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => toggleTestMode(false)}
          className={`py-2 px-3 rounded-xl transition ${
            !isTestMode
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ยอดจริง ฿{totalAmount.toLocaleString()} บ.
        </button>
        <button
          type="button"
          onClick={() => toggleTestMode(true)}
          className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            isTestMode
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'text-amber-400 hover:bg-amber-950/40'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>ทดลองโอน 1.00 บาท</span>
        </button>
      </div>

      {/* Test Mode Explanatory Notice */}
      {isTestMode ? (
        <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-amber-600/60 text-left text-xs space-y-1 text-amber-200 animate-fadeIn">
          <p className="font-bold flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>เปิดโหมดทดสอบชำระเงิน 1.00 บาท</span>
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            QR Code ด้านล่างนี้ตั้งยอดไว้ที่ <strong>1.00 บาท</strong> (โอนเข้าเบอร์ <strong>{promptpayId}</strong>) เพื่อให้คุณสแกนจ่ายจริงจากแอปธนาคาร และได้สลิปจริงมาทดสอบระบบ โดยไม่ต้องโอนยอดเต็ม ฿{totalAmount.toLocaleString()} บาท!
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          สแกนด้วยแอปธนาคารใดก็ได้ ยอดเงินจะถูกระบุให้อัตโนมัติ
        </p>
      )}

      {/* QR Code Card */}
      <div className="relative p-5 bg-white rounded-3xl max-w-[280px] mx-auto shadow-2xl transition-all">
        {loadingQr ? (
          <div className="aspect-square flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-900" />
          </div>
        ) : (
          qrUrl && (
            <div className="relative aspect-square w-full">
              <Image
                src={qrUrl}
                alt="PromptPay QR Code"
                fill
                className="object-contain"
                priority
              />
            </div>
          )
        )}

        <div className="mt-3 pt-3 border-t border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1.5">
            {isTestMode && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-black">TEST</span>}
            <span className="text-sm font-black text-slate-900">
              ยอดชำระ ฿{currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-mono mt-0.5">
            พร้อมเพย์: {promptpayId}
          </p>
        </div>
      </div>

      {/* Manual Bank Transfer Info with Copy Button */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-400" /> ธนาคาร:
          </span>
          <span className="font-bold text-white">{bankName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> เลขบัญชี:
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {bankAccount}
            </span>
            <button
              type="button"
              onClick={handleCopyAccount}
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="คัดลอกเลขบัญชี"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" /> ชื่อบัญชี:
          </span>
          <span className="font-bold text-white truncate max-w-[180px]">{accountName}</span>
        </div>
      </div>
    </div>
  );
}
