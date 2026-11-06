import { NextRequest, NextResponse } from 'next/server';
import { sendToGoogleSheet } from '@/lib/sheet';

export async function GET(req: NextRequest) {
  const secretParam = req.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.GOOGLE_SHEET_SECRET || 'ironpulse_secret_key_fitgear_2026';

  if (secretParam && secretParam !== expectedSecret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized secret' }, { status: 401 });
  }

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({
      ok: false,
      message: 'GOOGLE_SHEET_WEBHOOK_URL ยังไม่ได้ตั้งค่าใน .env.local หรือ Vercel',
      hint: 'กรุณาสร้าง Google Sheet และนำ URL จาก Apps Script (Web app URL) มาใส่ในไฟล์ .env.local',
      owner_email: process.env.OWNER_NOTIFY_EMAIL || 'kittirach.boo@tsn.thai-tech.ac.th',
    });
  }

  try {
    const res = await sendToGoogleSheet({ action: 'ping' });
    return NextResponse.json({
      ok: res.ok,
      message: res.ok ? '✅ เชื่อมต่อ Google Sheet สำเร็จเรียบร้อย!' : 'เชื่อมต่อไม่สำเร็จ',
      details: res,
      webhook_url: webhookUrl.replace(/(\/macros\/s\/)[^/]+(\/exec)/, '$1...$2'),
      owner_email: process.env.OWNER_NOTIFY_EMAIL || 'kittirach.boo@tsn.thai-tech.ac.th',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
