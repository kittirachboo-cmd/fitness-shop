import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendToGoogleSheet } from '@/lib/sheet';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Product } from '@/lib/types';

interface OrderItemInput {
  id: number;
  qty: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items } = body as {
      customer: {
        name: string;
        phone: string;
        email?: string;
        address: string;
        province: string;
        postal_code: string;
        note?: string;
      };
      items: OrderItemInput[];
    };

    // Validation
    if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim()) {
      return NextResponse.json(
        { ok: false, error: 'กรุณากรอกข้อมูลชื่อ เบอร์โทร และที่อยู่จัดส่งให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'ไม่มีสินค้าในตะกร้า' },
        { status: 400 }
      );
    }

    // ดึงราคาสินค้าจริงจากระบบ (ป้องกันการแก้ราคาจากฝั่ง Client)
    let productCatalog: Product[] = MOCK_PRODUCTS;

    if (isSupabaseConfigured && supabaseAdmin) {
      const ids = items.map((i) => i.id);
      const { data: dbProducts } = await supabaseAdmin
        .from('products')
        .select('*')
        .in('id', ids);

      if (dbProducts && dbProducts.length > 0) {
        productCatalog = dbProducts as Product[];
      }
    }

    // คำนวณยอดเงินจริง
    const orderItemsSnapshot = [];
    let subtotal = 0;
    let itemsTextArr = [];

    for (const item of items) {
      const prod = productCatalog.find((p) => p.id === item.id) || MOCK_PRODUCTS.find((p) => p.id === item.id);
      if (!prod) {
        return NextResponse.json(
          { ok: false, error: `ไม่พบสินค้า ID ${item.id} ในระบบ` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.floor(item.qty || 1));
      const lineTotal = prod.price * qty;
      subtotal += lineTotal;

      orderItemsSnapshot.push({
        id: prod.id,
        slug: prod.slug,
        name: prod.name,
        price: prod.price,
        qty,
        line_total: lineTotal,
        image_url: prod.image_url,
      });

      itemsTextArr.push(`- ${prod.name} x ${qty} (${lineTotal.toLocaleString()} บ.)`);
    }

    const isTestOnly = orderItemsSnapshot.length > 0 && orderItemsSnapshot.every((i) => i.price === 1);
    const shippingFee = (subtotal >= 1500 || isTestOnly) ? 0 : 100;
    const total = subtotal + shippingFee;

    let orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let orderNo: number | string = Math.floor(1000 + Math.random() * 9000);
    const createdAt = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

    // บันทึกลง Supabase ถ้าเชื่อมต่อไว้
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data: inserted, error: insertErr } = await supabaseAdmin
          .from('orders')
          .insert({
            customer_name: customer.name.trim(),
            phone: customer.phone.trim(),
            email: customer.email?.trim() || null,
            address: customer.address.trim(),
            province: customer.province?.trim() || 'กรุงเทพมหานคร',
            postal_code: customer.postal_code?.trim() || '',
            note: customer.note?.trim() || '',
            items: orderItemsSnapshot,
            items_count: orderItemsSnapshot.length,
            subtotal,
            shipping_fee: shippingFee,
            total,
            status: 'รอชำระเงิน',
          })
          .select('id, order_no')
          .single();

        if (!insertErr && inserted) {
          orderId = inserted.id;
          orderNo = inserted.order_no;
        } else {
          console.warn('Supabase order insert warning:', insertErr);
        }
      } catch (err) {
        console.warn('Supabase DB unavailable, continuing with generated orderId', err);
      }
    }

    // ซิงค์ไปยัง Google Sheet แท็บ "คำสั่งซื้อ" (Non-blocking)
    const itemsText = itemsTextArr.join('\n');
    sendToGoogleSheet({
      action: 'order',
      order_id: orderId,
      order_no: orderNo,
      customer_name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || '',
      address: customer.address.trim(),
      province: customer.province?.trim() || '',
      postal_code: customer.postal_code?.trim() || '',
      items_text: itemsText,
      items_count: orderItemsSnapshot.reduce((s, i) => s + i.qty, 0),
      subtotal,
      shipping_fee: shippingFee,
      total,
      note: customer.note?.trim() || '',
      status: 'รอชำระเงิน',
      created_at: createdAt,
    }).catch((e) => console.error('Background sheet sync failed:', e));

    return NextResponse.json({
      ok: true,
      order_id: orderId,
      order_no: orderNo,
      total,
      subtotal,
      shipping_fee: shippingFee,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Error creating order:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
