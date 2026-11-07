'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sheet,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  React.useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user]);
  const [subject, setSubject] = useState('ปรึกษาเลือกอุปกรณ์จัด Home Gym ในบ้าน/คอนโด');
  const [message, setMessage] = useState('');
  const [preferredChannel, setPreferredChannel] = useState<'โทรศัพท์' | 'LINE' | 'อีเมล'>('โทรศัพท์');
  const [preferredTime, setPreferredTime] = useState('ตลอดเวลาทำการ (09:00 - 18:00)');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('กรุณากรอกชื่อ เบอร์โทรศัพท์ และข้อความที่ต้องการปรึกษา');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
          preferred_channel: preferredChannel,
          preferred_time: preferredTime,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
      }

      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-900/60">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>CONTACT & CONSULTATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          ขอคำปรึกษาจัดฟิตเนส หรือให้ติดต่อกลับ
        </h1>
        <p className="text-slate-400 text-sm">
          ไม่ว่าจะเป็นการเลือกอุปกรณ์จัด Home Gym ในบ้าน ขอใบเสนอราคาสำหรับคอนโด/องค์กร หรือสอบถามบริการติดตั้ง ทีมงานพร้อมดูแลคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>กรอกแบบฟอร์มขอให้ติดต่อกลับ</span>
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/50 flex items-center gap-1">
                <Sheet className="w-3 h-3" />
                <span>บันทึกลงชีต &quot;ติดต่อลูกค้ากลับ&quot;</span>
              </span>
            </div>

            {success && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">ได้รับข้อมูลเรียบร้อยแล้ว!</p>
                  <p className="text-xs text-emerald-400 mt-0.5">
                    ข้อมูลส่งเข้า Google Sheet และแจ้งเตือนทีมงานแล้ว จะมีเจ้าหน้าที่ติดต่อกลับตามช่องทางที่คุณสะดวกครับ
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    ชื่อ-นามสกุล ของคุณ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณกานต์ หรือ โค้ชพีท"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    เบอร์โทรศัพท์ติดต่อกลับ *
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
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  อีเมล (ถ้ามี)
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  หัวข้อเรื่องที่ต้องการสอบถาม *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="ปรึกษาเลือกอุปกรณ์จัด Home Gym ในบ้าน/คอนโด">
                    ปรึกษาเลือกอุปกรณ์จัด Home Gym ในบ้าน/คอนโด
                  </option>
                  <option value="ขอใบเสนอราคา (องค์กร / โรงยิม / ฟิตเนสคอนโด)">
                    ขอใบเสนอราคา (องค์กร / โรงยิม / ฟิตเนสคอนโด)
                  </option>
                  <option value="สอบถามบริการขนส่งและทีมช่างติดตั้ง">
                    สอบถามบริการขนส่งและทีมช่างติดตั้ง
                  </option>
                  <option value="สอบถามสเปกสินค้า หรืออุปกรณ์สั่งทำพิเศษ">
                    สอบถามสเปกสินค้า หรืออุปกรณ์สั่งทำพิเศษ
                  </option>
                  <option value="บริการหลังการขาย / เคลมประกันสินค้า">
                    บริการหลังการขาย / เคลมประกันสินค้า
                  </option>
                  <option value="เรื่องอื่นๆ">เรื่องอื่นๆ</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    ช่องทางที่สะดวกให้ติดต่อกลับ
                  </label>
                  <select
                    value={preferredChannel}
                    onChange={(e) =>
                      setPreferredChannel(e.target.value as 'โทรศัพท์' | 'LINE' | 'อีเมล')
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="โทรศัพท์">โทรศัพท์ (รวดเร็วที่สุด)</option>
                    <option value="LINE">LINE</option>
                    <option value="อีเมล">อีเมล</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    ช่วงเวลาที่สะดวก
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ตลอดเวลาทำการ (09:00 - 18:00)">
                      ตลอดเวลาทำการ (09:00 - 18:00)
                    </option>
                    <option value="ช่วงเช้า (09:00 - 12:00)">ช่วงเช้า (09:00 - 12:00)</option>
                    <option value="ช่วงบ่าย (13:00 - 17:00)">ช่วงบ่าย (13:00 - 17:00)</option>
                    <option value="ช่วงเย็น (17:00 - 19:00)">ช่วงเย็น (17:00 - 19:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  รายละเอียดที่ต้องการสอบถามหรือปรึกษา *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="เช่น ขนาดห้องกว้างกี่เมตร งบประมาณโดยประมาณ อุปกรณ์ที่สนใจเป็นพิเศษ หรือสถานที่ติดตั้ง..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {loading ? (
                <span>กำลังส่งข้อมูล...</span>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>ส่งข้อมูลขอคำปรึกษา</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              *ข้อมูลนี้จะบันทึกเข้าแท็บ &ldquo;ติดต่อลูกค้ากลับ&rdquo; ใน Google Sheet และแจ้งเตือนทีมงานทันที
            </p>
          </form>
        </div>

        {/* Right Column: Direct Contact Info & Perks */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contact Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              ช่องทางติดต่อด่วน
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">โทรศัพท์สายด่วน</span>
                  <a href="tel:0937586699" className="text-sm font-bold text-white hover:text-emerald-400">
                    093-758-6699
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">LINE Official</span>
                  <span className="text-sm font-bold text-emerald-400">@ironpulse</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-slate-400 block">อีเมลสำหรับเอกสาร/ใบเสนอราคา</span>
                  <span className="text-xs font-mono font-bold text-white truncate block">
                    kittirach.boo@tsn.thai-tech.ac.th
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">เวลาทำการ</span>
                  <span className="text-xs font-semibold text-white">
                    จันทร์ - อาทิตย์ 09:00 - 18:00 น.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Perks Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3.5 text-xs text-slate-300">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>บริการให้คำปรึกษาฟรี</span>
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>ช่วยประเมินพื้นที่ จัดวางตำแหน่งอุปกรณ์ให้ปลอดภัยและใช้งานได้คุ้มค่าที่สุด</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>จัดเซ็ตอุปกรณ์ตามงบประมาณ (สำหรับบ้าน คอนโด หรือองค์กร)</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>มีช่างบริการจัดส่ง ประกอบและทดสอบเครื่องถึงบ้านในเขตกรุงเทพฯ และปริมณฑล</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
