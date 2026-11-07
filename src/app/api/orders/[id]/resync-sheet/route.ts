import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendToGoogleSheet } from '@/lib/sheet';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const testAmount = body?.test_amount;

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      return NextResponse.json({
        ok: false,
        error: 'ยังไม่ได้กด Redeploy ใน Vercel: หลังเพิ่มตัวแปร GOOGLE_SHEET_WEBHOOK_URL ต้องกดปุ่ม [Redeploy] ใน Vercel 1 ครั้งก่อน เพื่อให้เซิร์ฟเวอร์เปิดรับค่าใหม่ครับ',
        hint: 'ไปที่หน้า Vercel -> Deployments -> กด ... ที่ตัวล่าสุด -> กด Redeploy แล้วกลับมากดปุ่มนี้อีกทีได้เลยครับ',
      }, { status: 400 });
    }

    let orderData = null;

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        orderData = data;
      }
    }

    // Fallback if not found in db
    if (!orderData) {
      orderData = {
        id,
        order_no: body?.order_no || '1088',
        customer_name: body?.customer_name || 'คุณลูกค้า',
        phone: body?.phone || '093-758-6699',
        email: body?.email || '',
        address: body?.address || 'ที่อยู่จัดส่ง',
        province: body?.province || 'ไทย',
        postal_code: body?.postal_code || '',
        items: body?.items || [],
        subtotal: body?.subtotal || 3590,
        shipping_fee: body?.shipping_fee || 0,
        total: testAmount || body?.total || 3590,
        note: body?.note || '',
        status: body?.status || 'รอตรวจสลิป',
        slip_url: body?.slip_url || '',
        slip_result: body?.slip_result || '',
        created_at: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
      };
    }

    const itemsTextArr = Array.isArray(orderData.items)
      ? orderData.items.map((i: { name: string; qty: number; line_total?: number }) => `- ${i.name} x ${i.qty}`)
      : ['- อุปกรณ์ออกกำลังกาย x 1'];

    // 1. ส่งข้อมูลออเดอร์เข้า Google Sheet
    const orderRes = await sendToGoogleSheet({
      action: 'order',
      order_id: orderData.id,
      order_no: orderData.order_no,
      customer_name: orderData.customer_name,
      phone: orderData.phone,
      email: orderData.email || '',
      address: orderData.address,
      province: orderData.province || '',
      postal_code: orderData.postal_code || '',
      items_text: itemsTextArr.join('\n'),
      items_count: Array.isArray(orderData.items) ? orderData.items.length : 1,
      subtotal: orderData.subtotal,
      shipping_fee: orderData.shipping_fee,
      total: testAmount ? Number(testAmount) : orderData.total,
      note: testAmount ? `(โหมดทดสอบ ${testAmount} บ.) ${orderData.note || ''}` : (orderData.note || ''),
      status: orderData.status || 'รอตรวจสลิป',
      created_at: orderData.created_at,
    });

    // 2. ถ้ามีสลิป ส่งข้อมูลสลิปตามไปด้วย
    if (orderData.slip_url) {
      await sendToGoogleSheet({
        action: 'slip',
        order_id: orderData.id,
        order_no: orderData.order_no,
        customer_name: orderData.customer_name,
        phone: orderData.phone,
        total: testAmount ? Number(testAmount) : orderData.total,
        status: orderData.status || 'รอตรวจสลิป',
        slip_url: orderData.slip_url,
        slip_result: testAmount ? `ทดสอบโอน ${testAmount} บาท สำเร็จ` : 'แนบสลิปเรียบร้อย',
      });
    }

    if (!orderRes.ok) {
      return NextResponse.json({
        ok: false,
        error: orderRes.error || 'ส่งเข้าชีตไม่สำเร็จ',
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: '✅ ส่งข้อมูลออเดอร์และสลิปเข้า Google Sheet เรียบร้อยแล้ว!',
      details: orderRes,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
