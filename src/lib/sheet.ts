/**
 * ส่งข้อมูลไปยัง Google Apps Script Webhook เพื่อเขียนลง Google Sheet
 * และส่งอีเมลแจ้งเตือนถึง kittirach.boo@tsn.thai-tech.ac.th
 */

interface BaseSheetPayload {
  action: 'order' | 'slip' | 'review' | 'contact' | 'ping';
  secret?: string;
}

export interface OrderSheetPayload extends BaseSheetPayload {
  action: 'order';
  order_id: string;
  order_no: number | string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  province?: string;
  postal_code?: string;
  items_text: string;
  items_count: number;
  subtotal: number;
  shipping_fee: number;
  total: number;
  note?: string;
  status: string;
  created_at?: string;
}

export interface SlipSheetPayload extends BaseSheetPayload {
  action: 'slip';
  order_id: string;
  order_no: number | string;
  customer_name: string;
  phone: string;
  total: number;
  status: string;
  slip_url: string;
  slip_result?: string;
}

export interface ReviewSheetPayload extends BaseSheetPayload {
  action: 'review';
  review_id: string;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at?: string;
}

export interface ContactSheetPayload extends BaseSheetPayload {
  action: 'contact';
  inquiry_id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  preferred_channel: string;
  preferred_time?: string;
  created_at?: string;
}

export type SheetPayload =
  | OrderSheetPayload
  | SlipSheetPayload
  | ReviewSheetPayload
  | ContactSheetPayload
  | (BaseSheetPayload & { [key: string]: unknown });

export async function sendToGoogleSheet(payload: SheetPayload): Promise<{ ok: boolean; message?: string; error?: string }> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_SECRET;

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    console.warn('⚠️ GOOGLE_SHEET_WEBHOOK_URL is not configured. Skipping Sheet sync.');
    return { ok: false, message: 'Google Sheet Webhook URL not set' };
  }

  const body = {
    ...payload,
    secret: secret || 'ironpulse_secret_key_fitgear_2026',
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Apps Script อาจใช้เวลา 3-8 วิ
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Google Sheet webhook HTTP error:', res.status, text);
      return { ok: false, error: `HTTP ${res.status}: ${text}` };
    }

    const data = await res.json().catch(() => ({ ok: true }));
    return data;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Failed to notify Google Sheet:', msg);
    return { ok: false, error: msg };
  }
}
