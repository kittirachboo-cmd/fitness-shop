import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendToGoogleSheet } from '@/lib/sheet';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, product_name, customer_name, rating, comment } = body;

    if (!customer_name?.trim() || !comment?.trim() || !rating) {
      return NextResponse.json(
        { ok: false, error: 'กรุณากรอกชื่อ ระดับคะแนน และข้อความรีวิว' },
        { status: 400 }
      );
    }

    const reviewId = `rev-${Date.now()}`;
    const createdAt = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const numRating = Math.max(1, Math.min(5, Number(rating)));

    // บันทึกลง Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('reviews').insert({
          product_id: Number(product_id) || 1,
          product_name: product_name || 'อุปกรณ์ออกกำลังกาย',
          customer_name: customer_name.trim(),
          rating: numRating,
          comment: comment.trim(),
          is_approved: true,
        });
      } catch (err) {
        console.warn('Supabase review insert warning:', err);
      }
    }

    // ซิงค์ไปยัง Google Sheet แท็บ "รีวิว" และส่งอีเมลแจ้งเตือนเจ้าของร้าน
    sendToGoogleSheet({
      action: 'review',
      review_id: reviewId,
      product_name: product_name || 'อุปกรณ์ทั่วไป',
      customer_name: customer_name.trim(),
      rating: numRating,
      comment: comment.trim(),
      is_approved: true,
      created_at: createdAt,
    }).catch((e) => console.error('Failed to sync review to Google Sheet:', e));

    return NextResponse.json({
      ok: true,
      message: 'ขอบคุณสำหรับรีวิว! ความคิดเห็นของคุณถูกบันทึกเรียบร้อยแล้ว',
      review: {
        id: reviewId,
        product_id,
        product_name,
        customer_name,
        rating: numRating,
        comment,
        created_at: createdAt,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Error in review API:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
