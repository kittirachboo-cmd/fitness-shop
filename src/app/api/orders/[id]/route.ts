import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Order ID is required' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && order) {
        return NextResponse.json({ ok: true, order });
      }
    }

    // Fallback if not found or DB not setup yet
    return NextResponse.json({
      ok: true,
      order: {
        id,
        order_no: '---',
        customer_name: 'คุณลูกค้า',
        phone: '---',
        address: 'ที่อยู่จัดส่ง',
        province: 'ไทย',
        postal_code: '',
        items: [],
        total: 0,
        subtotal: 0,
        shipping_fee: 0,
        status: 'รอชำระเงิน',
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
