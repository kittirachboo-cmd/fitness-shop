import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendToGoogleSheet } from '@/lib/sheet';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message, preferred_channel, preferred_time } = body;

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { ok: false, error: 'กรุณากรอกชื่อ เบอร์โทรศัพท์ และข้อความที่ต้องการสอบถาม' },
        { status: 400 }
      );
    }

    const inquiryId = `inq-${Date.now()}`;
    const createdAt = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

    // บันทึกลง Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('contact_inquiries').insert({
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          subject: subject?.trim() || 'ขอคำปรึกษาทั่วไป',
          message: message.trim(),
          preferred_channel: preferred_channel || 'โทรศัพท์',
          preferred_time: preferred_time || 'ตลอดเวลา',
          status: 'รอติดต่อกลับ',
        });
      } catch (err) {
        console.warn('Supabase contact insert warning:', err);
      }
    }

    // ซิงค์ไปยัง Google Sheet แท็บ "ติดต่อลูกค้ากลับ" และส่งอีเมลแจ้งเตือนเจ้าของร้าน
    sendToGoogleSheet({
      action: 'contact',
      inquiry_id: inquiryId,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      subject: subject?.trim() || 'ขอคำปรึกษาจัดฟิตเนส/สั่งซื้ออุปกรณ์',
      message: message.trim(),
      preferred_channel: preferred_channel || 'โทรศัพท์',
      preferred_time: preferred_time || 'ทุกเวลาทำการ',
      created_at: createdAt,
    }).catch((e) => console.error('Failed to sync contact to Google Sheet:', e));

    return NextResponse.json({
      ok: true,
      message: 'ได้รับข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับอย่างเร็วที่สุดครับ',
      inquiry_id: inquiryId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Error in contact API:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
