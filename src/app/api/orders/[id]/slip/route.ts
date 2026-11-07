import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendToGoogleSheet } from '@/lib/sheet';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const orderNo = formData.get('order_no') as string | null;
    const customerName = formData.get('customer_name') as string | null;
    const phone = formData.get('phone') as string | null;
    const total = formData.get('total') as string | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: 'กรุณาเลือกไฟล์รูปภาพสลิป' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${id}/${Date.now()}.${fileExt}`;
    let slipUrl = '';

    // 1. อัปโหลดขึ้น Supabase Storage (ถ้ามีการตั้งค่าไว้)
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from('slips')
          .upload(fileName, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('slips')
            .getPublicUrl(fileName);
          slipUrl = publicUrlData?.publicUrl || '';
        } else {
          console.warn('Storage upload error:', uploadErr?.message);
        }
      } catch (err) {
        console.warn('Failed to upload to Supabase storage:', err);
      }
    }

    // ถ้าไม่มี Supabase Storage หรือไม่ได้ต่อ ให้ใช้ Data URL หรือ Mock URL ชั่วคราว
    if (!slipUrl) {
      // แปลงเป็น Data URL เพื่อให้เปิดดูรูปได้ในการทดสอบ
      const base64 = buffer.toString('base64');
      slipUrl = `data:${file.type || 'image/jpeg'};base64,${base64.substring(0, 50)}...[demo]`;
    }

    // 2. อัปเดตสถานะใน Supabase DB
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin
          .from('orders')
          .update({
            slip_path: fileName,
            slip_url: slipUrl.startsWith('data:') ? 'แนบสลิปแล้ว (โหมดทดสอบ)' : slipUrl,
            status: 'รอตรวจสลิป',
            slip_result: 'ลูกค้าอัปโหลดสลิปแล้ว รอร้านค้าตรวจสอบ',
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Failed to update order status in DB:', err);
      }
    }

    // 3. ส่งข้อมูลไปอัปเดตช่องสลิปใน Google Sheet + อีเมลแจ้งเตือนเจ้าของร้าน
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSynced = false;
    let sheetError = '';

    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const sheetRes = await sendToGoogleSheet({
          action: 'slip',
          order_id: id,
          order_no: orderNo || '---',
          customer_name: customerName || 'ลูกค้า',
          phone: phone || '-',
          total: Number(total || 0),
          status: 'รอตรวจสลิป',
          slip_url: slipUrl,
          slip_result: 'แนบสลิปเรียบร้อย รอเจ้าของร้านตรวจสอบ',
        });
        sheetSynced = sheetRes.ok;
        if (!sheetRes.ok) sheetError = sheetRes.error || '';
      } catch (e) {
        console.error('Failed to notify sheet on slip upload:', e);
      }
    }

    const message = sheetSynced
      ? '✅ แนบสลิปสำเร็จ! ข้อมูลถูกบันทึกลง Google Sheet และแจ้งเตือนเจ้าของร้านแล้ว'
      : (webhookUrl
          ? `แนบสลิปแล้ว แต่เชื่อมต่อ Google Sheet ไม่สำเร็จ: ${sheetError}`
          : '⚠️ แนบสลิปสำเร็จ! แต่ยังไม่ได้ตั้งค่า GOOGLE_SHEET_WEBHOOK_URL ใน Vercel ข้อมูลจึงยังไม่เด้งเข้าชีต');

    return NextResponse.json({
      ok: true,
      message,
      sheet_synced: sheetSynced,
      slip_url: slipUrl,
      status: 'รอตรวจสลิป',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Error handling slip upload:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
