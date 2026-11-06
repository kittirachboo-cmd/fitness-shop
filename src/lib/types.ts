export type ProductCategory = 
  | 'free-weights'
  | 'cardio'
  | 'strength'
  | 'accessories'
  | 'recovery';

export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: ProductCategory;
  category_name: string;
  price: number;
  original_price?: number;
  stock: number;
  image_url: string;
  images?: string[];
  description: string;
  specs?: ProductSpecs;
  features?: string[];
  warranty?: string;
  is_featured?: boolean;
  is_active?: boolean;
  rating?: number;
  reviews_count?: number;
  sort_order?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'รอชำระเงิน'
  | 'รอตรวจสลิป'
  | 'ชำระแล้ว/เตรียมส่ง'
  | 'กำลังจัดส่ง'
  | 'จัดส่งสำเร็จ'
  | 'ยกเลิก';

export interface OrderItemSnapshot {
  id: number;
  slug: string;
  name: string;
  price: number;
  qty: number;
  line_total: number;
  image_url: string;
}

export interface Order {
  id: string;
  order_no: number | string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  province: string;
  postal_code: string;
  note?: string;
  items: OrderItemSnapshot[];
  items_count: number;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  slip_path?: string;
  slip_url?: string;
  slip_result?: string;
  created_at: string;
  paid_at?: string;
}

export interface Review {
  id: string;
  product_id: number;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  preferred_channel: 'โทรศัพท์' | 'LINE' | 'อีเมล';
  preferred_time?: string;
  status: 'รอติดต่อกลับ' | 'กำลังดำเนินการ' | 'ติดต่อเรียบร้อย/ปิดเคส';
  created_at: string;
}
