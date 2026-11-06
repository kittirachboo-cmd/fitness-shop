-- =====================================================================
-- IRONPULSE FITNESS - Supabase Database Schema
-- เว็บขายอุปกรณ์ออกกำลังกาย (Fitness / Gym Equipment Store)
-- เจ้าของร้าน: kittirach.boo@tsn.thai-tech.ac.th
--
-- วิธีใช้งาน:
-- 1. เข้าไปที่ https://supabase.com แล้วเปิดโปรเจกต์ของคุณ
-- 2. ไปที่เมนู "SQL Editor" ด้านซ้าย
-- 3. คัดลอกโค้ดในไฟล์นี้ทั้งหมด แล้ววางในช่อง Query จากนั้นกด "Run"
-- =====================================================================

-- เปิดการใช้งาน uuid-ossp (ปกติ Supabase มี gen_random_uuid() อยู่แล้ว)
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------
-- 1. ตารางสินค้าอุปกรณ์ออกกำลังกาย (products)
-- -------------------------------------------------------------
create table if not exists public.products (
  id              serial primary key,
  slug            text not null unique,
  name            text not null,
  category        text not null check (category in ('free-weights', 'cardio', 'strength', 'accessories', 'recovery')),
  category_name   text not null default 'อุปกรณ์ออกกำลังกาย',
  price           integer not null check (price >= 0),
  original_price  integer check (original_price is null or original_price >= price),
  stock           integer not null default 10 check (stock >= 0),
  image_url       text not null,
  images          jsonb default '[]'::jsonb,
  description     text not null default '',
  specs           jsonb default '{}'::jsonb,
  features        jsonb default '[]'::jsonb,
  warranty        text default 'รับประกัน 1 ปี',
  is_featured     boolean not null default false,
  is_active       boolean not null default true,
  rating          numeric(3,1) not null default 5.0,
  reviews_count   integer not null default 0,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_is_active on public.products (is_active);

-- -------------------------------------------------------------
-- 2. ตารางคำสั่งซื้อ (orders)
-- -------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        bigint generated always as identity,
  customer_name   text not null,
  phone           text not null,
  email           text,
  address         text not null,
  province        text not null,
  postal_code     text not null,
  note            text not null default '',
  items           jsonb not null, -- [{id, name, qty, price, line_total, image_url}]
  items_count     integer not null default 1,
  subtotal        integer not null check (subtotal >= 0),
  shipping_fee    integer not null default 0,
  total           integer not null check (total >= 0),
  status          text not null default 'รอชำระเงิน'
                  check (status in ('รอชำระเงิน','รอตรวจสลิป','ชำระแล้ว/เตรียมส่ง','กำลังจัดส่ง','จัดส่งสำเร็จ','ยกเลิก')),
  slip_path       text,
  slip_url        text,
  slip_hash       text,
  slip_result     text,
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_phone on public.orders (phone);

-- -------------------------------------------------------------
-- 3. ตารางรีวิวสินค้าจากลูกค้า (reviews)
-- -------------------------------------------------------------
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  product_id      integer references public.products(id) on delete cascade,
  product_name    text not null,
  customer_name   text not null,
  rating          integer not null check (rating >= 1 and rating <= 5),
  comment         text not null,
  is_approved     boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists idx_reviews_product_id on public.reviews (product_id);
create index if not exists idx_reviews_created_at on public.reviews (created_at desc);

-- -------------------------------------------------------------
-- 4. ตารางแบบฟอร์มติดต่อกลับ / ปรึกษาผู้เชี่ยวชาญ (contact_inquiries)
-- -------------------------------------------------------------
create table if not exists public.contact_inquiries (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  phone              text not null,
  email              text,
  subject            text not null,
  message            text not null,
  preferred_channel  text default 'โทรศัพท์',
  preferred_time     text default 'ตลอดเวลา',
  status             text default 'รอติดต่อกลับ'
                     check (status in ('รอติดต่อกลับ','กำลังดำเนินการ','ติดต่อเรียบร้อย/ปิดเคส')),
  notes              text,
  created_at         timestamptz not null default now()
);

create index if not exists idx_contact_created_at on public.contact_inquiries (created_at desc);

-- -------------------------------------------------------------
-- 5. Storage Bucket สำหรับเก็บสลิปโอนเงิน (slips) และรูปสินค้า
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('slips', 'slips', true, 10485760, array['image/jpeg','image/png','image/webp','image/heic']),
  ('products', 'products', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- ปล่อยนโยบาย Storage ให้ทุกคนอัปโหลดสลิปได้
create policy "Allow Public Upload Slips"
  on storage.objects for insert
  with check (bucket_id = 'slips');

create policy "Allow Public Read Slips"
  on storage.objects for select
  using (bucket_id = 'slips');

create policy "Allow Public Read Products Images"
  on storage.objects for select
  using (bucket_id = 'products');

-- -------------------------------------------------------------
-- 6. Row Level Security (RLS)
-- -------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_inquiries enable row level security;

-- Products: ใครก็อ่านสินค้าได้ (สำหรับแสดงหน้าเว็บ)
create policy "Allow public read active products"
  on public.products for select
  using (is_active = true);

-- Reviews: ใครก็อ่านรีวิวที่อนุมัติแล้วได้
create policy "Allow public read approved reviews"
  on public.reviews for select
  using (is_approved = true);

-- Reviews: ใครก็เขียนรีวิวได้
create policy "Allow public insert reviews"
  on public.reviews for insert
  with check (true);

-- Orders: อ่านหรืออัปเดตออเดอร์ (ผ่าน Service Role หรือ ID)
create policy "Allow public read orders by id"
  on public.orders for select
  using (true);

create policy "Allow public update order slip"
  on public.orders for update
  using (true);

-- Contact Inquiries: ใครก็ส่งแบบฟอร์มติดต่อกลับได้
create policy "Allow public insert contact"
  on public.contact_inquiries for insert
  with check (true);

-- -------------------------------------------------------------
-- 7. Stored Procedure: place_order (ตัดสต็อกสินค้า + บันทึกออเดอร์ในทรานแซกชันเดียว)
-- -------------------------------------------------------------
create or replace function public.place_order(
  p_customer jsonb,
  p_items jsonb,
  p_subtotal integer,
  p_shipping_fee integer,
  p_total integer
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_item jsonb;
  v_product_id integer;
  v_qty integer;
  v_stock integer;
  v_order_id uuid;
  v_order_no bigint;
begin
  -- 1. ตรวจสอบและตัดสต็อกสินค้าทุกรายการ
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'id')::integer;
    v_qty := (v_item->>'qty')::integer;

    select stock into v_stock
    from public.products
    where id = v_product_id
    for update;

    if not found then
      raise exception 'ไม่พบสินค้า ID % ในระบบ', v_product_id;
    end if;

    if v_stock < v_qty then
      raise exception 'สินค้า % สต็อกไม่เพียงพอ (เหลือ % ชิ้น)', (v_item->>'name'), v_stock;
    end if;

    update public.products
    set stock = stock - v_qty
    where id = v_product_id;
  end loop;

  -- 2. บันทึกคำสั่งซื้อ
  insert into public.orders (
    customer_name,
    phone,
    email,
    address,
    province,
    postal_code,
    note,
    items,
    items_count,
    subtotal,
    shipping_fee,
    total,
    status
  ) values (
    p_customer->>'name',
    p_customer->>'phone',
    p_customer->>'email',
    p_customer->>'address',
    p_customer->>'province',
    p_customer->>'postal_code',
    coalesce(p_customer->>'note', ''),
    p_items,
    jsonb_array_length(p_items),
    p_subtotal,
    p_shipping_fee,
    p_total,
    'รอชำระเงิน'
  )
  returning id, order_no into v_order_id, v_order_no;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_no', v_order_no,
    'total', p_total
  );
end;
$$;

-- -------------------------------------------------------------
-- 8. ข้อมูลตัวอย่างสินค้า (Seed Data)
-- -------------------------------------------------------------
insert into public.products (slug, name, category, category_name, price, original_price, stock, image_url, description, specs, features, warranty, is_featured, rating, reviews_count, sort_order)
values
(
  'adjustable-dumbbell-24kg',
  'ดัมเบลปรับน้ำหนักอัจฉริยะ 24 kg (IronFit QuickLock)',
  'free-weights',
  'ดัมเบล & บาร์เบล',
  3590,
  4990,
  18,
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  'ดัมเบลปรับน้ำหนักรุ่นยอดนิยม หมุนเปลี่ยนน้ำหนักได้ง่ายใน 1 วินาที ตั้งแต่ 2.5 ถึง 24 กิโลกรัม แทนดัมเบล 15 คู่ ประหยัดพื้นที่จัดเก็บได้กว่า 90% ด้ามจับกระชับมือกันลื่น',
  '{"weight_range": "2.5 - 24 kg", "increments": "15 ระดับ", "material": "High-Grade Silicone Steel & Nylon Base", "dimension": "40 x 20 x 23 cm", "color": "ดำ-แดง"}'::jsonb,
  '["ปรับน้ำหนักได้ 15 ระดับ (2.5 - 24 kg) เพียงหมุนแป้นเดียว", "วัสดุเหล็กซิลิคอนพรีเมียม ไร้เสียงกระทบ", "มีถาดรองวางกันรอยขีดข่วนพื้นห้อง", "ประหยัดเนื้อที่แทนดัมเบล 15 คู่"]'::jsonb,
  'รับประกันกลไก 2 ปี',
  true,
  4.9,
  24,
  1
),
(
  'commercial-foldable-treadmill-3hp',
  'ลู่วิ่งไฟฟ้ารุ่น ProRun X7 พับเก็บได้ มอเตอร์ 3.5 HP',
  'cardio',
  'เครื่องคาร์ดิโอ',
  14900,
  19900,
  7,
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
  'ลู่วิ่งไฟฟ้าระดับ Semi-Commercial มอเตอร์พลังสูง 3.5 HP ต่อเนื่อง วิ่งนุ่มไม่สะดุด ระบบรองรับแรงกระแทก 8 จุด ถนอมเข่าและข้อเท้า รองรับน้ำหนักผู้ใช้ 130 kg พับเก็บด้วยไฮดรอลิกในสัมผัสเดียว',
  '{"motor": "3.5 HP Peak Drive Motor", "speed": "1.0 - 18.0 km/h", "running_area": "130 x 48 cm", "max_weight": "130 kg", "screen": "LED Touch Screen + Bluetooth App Connect"}'::jsonb,
  '["มอเตอร์ 3.5 HP เงียบ ทนทาน ใช้งานต่อเนื่องได้ยาวนาน", "ระบบโช้คซับแรงกระแทก 8 จุด ดูดซับแรงกระแทกเข่า 40%", "หน้าจอทัชสกรีน พร้อมลำโพงบลูทูธและที่วางแท็บเล็ต", "พับเก็บด้วยระบบไฮดรอลิก Hydraulic Soft-Drop"]'::jsonb,
  'รับประกันมอเตอร์ 5 ปี / โครงสร้าง 2 ปี',
  true,
  4.8,
  19,
  2
),
(
  'olympic-barbell-bumper-plates-100kg',
  'เซ็ตบาร์เบลโอลิมปิก 2.2m + แผ่นน้ำหนัก Bumper Plates 100 kg',
  'free-weights',
  'ดัมเบล & บาร์เบล',
  11500,
  13900,
  12,
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  'ชุดบาร์เบลมาตรฐานโอลิมปิกความยาว 2.2 เมตร (20 kg) รับน้ำหนักได้ถึง 700 kg มาพร้อมลูกปืนเข็ม Needle Bearings 8 ตลับ หมุนสมูท และแผ่นยาง Bumper Plates ยางแท้ไร้กลิ่น ซับแรงกระแทก ทิ้งบาร์ได้ไม่แตกหัก',
  '{"bar_spec": "Olympic 2.2m (20 kg, 28mm grip, 50mm sleeve)", "plates_set": "5kg x2, 10kg x2, 15kg x2, 20kg x2 (รวม 100kg)", "material": "Virgin Rubber + Alloy Steel Bar"}'::jsonb,
  '["บาร์มาตรฐานแข่งขัน 2.2m ทนแรงดึงสูง ไม่โก่งงอ", "แผ่นน้ำหนักยางพาราบริสุทธิ์ ไร้กลิ่น ทนแรงกระแทก", "แถมฟรี กิ๊บล็อคโอลิมปิก Quick-Collar 1 คู่"]'::jsonb,
  'รับประกันบาร์เบล 3 ปี',
  true,
  5.0,
  15,
  3
),
(
  'adjustable-workout-bench-pro',
  'ม้านั่งยกน้ำหนักปรับระดับ Multi-Angle Pro Bench',
  'strength',
  'ม้านั่ง & แร็ค',
  3890,
  5200,
  20,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'ม้านั่งดัมเบลโครงสร้างเหล็กหนา 2.5 mm ปรับได้ทั้ง Incline, Flat, และ Decline (ปรับพนักพิง 7 ระดับ เบาะนั่ง 3 ระดับ) เบาะหุ้มหนัง PU หนา 6 ซม. นุ่มแน่น ไม่ยุบตัว รองรับน้ำหนักรวม 350 kg',
  '{"material": "Commercial Steel Tube 70x50mm", "adjustment": "พนักพิง 7 ระดับ, เบาะนั่ง 3 ระดับ (-20° ถึง 85°)", "cushion": "High Density EPE Foam + PU Leather 6cm", "max_capacity": "350 kg"}'::jsonb,
  '["ปรับได้ครบทั้งระนาบเอียงขึ้น แบนราบ และเอียงลาดต่ำ", "เบาะหนาพิเศษ รองรับแผ่นหลัง ไม่เจ็บกระดูกสันหลัง", "มีล้อเลื่อนด้านหลัง ยกเคลื่อนย้ายได้ง่ายผู้หญิงก็ทำได้"]'::jsonb,
  'รับประกันโครงสร้าง 3 ปี',
  true,
  4.9,
  31,
  4
),
(
  'magnetic-spin-bike-silent',
  'จักรยานออกกำลังกายแม่เหล็ก Spin Bike SilentFly (ไร้เสียง)',
  'cardio',
  'เครื่องคาร์ดิโอ',
  6990,
  9500,
  14,
  'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?auto=format&fit=crop&w=800&q=80',
  'จักรยานปั่นในร่มระบบแรงต้านแม่เหล็กคู่ Magnetic Resistance ปั่นนุ่มเงียบกริบ ไร้เสียงรบกวนคนในบ้านหรือคอนโด ล้อช่วยแรง Flywheel 11 kg ควบคุมแรงต้านด้วยลูกบิด ปรับเบาะและแฮนด์ได้ 4 ทิศทาง',
  '{"flywheel": "11 kg Solid Steel", "resistance": "Magnetic Infinite Resistance", "drive_system": "Silent Belt Drive", "max_user_weight": "150 kg", "connect": "Bluetooth Kinomap & Zwift"}'::jsonb,
  '["ระบบต้านทานแม่เหล็ก ไร้การเสียดสี ไร้เสียง 0 dB", "เชื่อมต่อแอปปั่นเสมือนจริง Zwift & Kinomap ผ่านบลูทูธ", "โครงสร้างรูปสามเหลี่ยม มั่นคง ไม่โคลงเคลง"]'::jsonb,
  'รับประกันโครงสร้าง 2 ปี / ระบบแม่เหล็ก 1 ปี',
  false,
  4.7,
  12,
  5
),
(
  'power-rack-pullup-dip-station',
  'พาวเวอร์แร็คอเนกประสงค์ Power Rack + สถานีดึงข้อ Dip Station',
  'strength',
  'ม้านั่ง & แร็ค',
  16500,
  21900,
  5,
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
  'ชุดเคจพาวเวอร์แร็คสำหรับสายฟิตเนสตัวจริง เล่นได้ครบทั้ง Squat, Bench Press, Pull-Up, Dip เสาเหล็กหนาพิเศษ 3.0mm เจาะรูระยะมาตรฐาน พร้อมบาร์เซฟตี้รองรับตก และจุดเก็บบาร์เบล/แผ่นน้ำหนักในตัว',
  '{"dimensions": "140 x 120 x 215 cm", "steel_gauge": "Heavy Duty 60x60mm x 3mm", "max_load": "500 kg", "included": "J-Hooks x2, Safety Spotter Arms x2, Dip Bars x2"}'::jsonb,
  '["ปลอดภัยสูงสุดสำหรับการฝึกซ้อมน้ำหนักมากคนเดียวที่บ้าน", "เสาเหล็กหนา 3.0 มิลลิเมตร แข็งแกร่งระดับพาณิชย์", "รองรับน้ำหนักได้ถึง 500 กิโลกรัม"]'::jsonb,
  'รับประกันโครงสร้าง 5 ปี',
  true,
  5.0,
  8,
  6
),
(
  'resistance-bands-11pcs-set',
  'ชุดยางยืดออกกำลังกายแรงต้าน 11 ชิ้น (Resistance Bands Set 150 lbs)',
  'accessories',
  'อุปกรณ์เสริม',
  590,
  990,
  50,
  'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
  'ยางยืดแรงต้านผลิตจากยางธรรมชาติ 100% ปลอดภัยไม่ขาดง่าย 5 เส้น 5 ระดับแรงต้าน (10, 20, 30, 40, 50 lbs รวมแรงต้านสูงสุด 150 lbs) มาพร้อมที่จับนุ่มมือ สายรัดข้อเท้า สมอยึดประตู และกระเป๋าพกพา',
  '{"material": "100% Natural Malaysian Latex", "levels": "5 Bands (10 - 50 lbs)", "package": "5 Bands + 2 Foam Handles + 2 Ankle Straps + 1 Door Anchor + Bag"}'::jsonb,
  '["ยางแท้จากธรรมชาติ เหนียวทนทาน ยืดหยุ่นดีเยี่ยม", "ผสมแรงต้านได้มากถึง 150 ปอนด์", "พกพาสะดวก ออกกำลังกายได้ทุกที่ ทั้งในบ้าน โรงแรม สวนสาธารณะ"]'::jsonb,
  'รับประกัน 6 เดือน',
  false,
  4.8,
  42,
  7
),
(
  'deep-tissue-massage-gun-pro',
  'ปืนนวดกล้ามเนื้อ Deep Tissue Massage Gun 30 ระดับความแรง',
  'recovery',
  'ฟื้นฟูกล้ามเนื้อ',
  1790,
  2590,
  25,
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  'ปืนนวดสลายความเมื่อยล้าหลังออกกำลังกาย มอเตอร์ Brushless เงียบ แรงกระแทกลึก 12mm ปรับความเร็วได้ 30 สปีด หน้าจอ LCD สัมผัส แบตเตอรี่ลิเธียมความจุสูง 2500mAh ใช้งานได้นาน 6-8 ชม. พร้อมหัวนวดเปลี่ยน 6 แบบ',
  '{"amplitude": "12 mm Deep Stroke", "speeds": "30 Levels (1200 - 3500 RPM)", "battery": "2500mAh Rechargeable Li-ion (6-8 hours)", "heads": "6 Replaceable Heads + Hard Case"}'::jsonb,
  '["ผ่อนคลายกล้ามเนื้อชั้นลึก สลายกรดแลคติกหลังออกกำลังกาย", "มอเตอร์ Brushless ลดเสียงรบกวนต่ำกว่า 45 dB", "หัวนวดเฉพาะทาง 6 แบบ ครอบคลุมทุกสัดส่วนของร่างกาย"]'::jsonb,
  'รับประกัน 1 ปี',
  true,
  4.9,
  27,
  8
),
(
  'heavy-duty-doorway-pullup-bar',
  'บาร์ดึงข้อติดประตูไม่ต้องเจาะ Heavy-Duty Lock 200 kg',
  'accessories',
  'อุปกรณ์เสริม',
  790,
  1290,
  35,
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  'บาร์โหนติดวงกบประตูแบบล็อกคู่ ไม่ต้องเจาะผนังหรือวงกบประตู ยางซิลิโคนขนาดใหญ่พิเศษกระจายแรงกด ไม่ทิ้งรอย แกนเหล็กกล้าเสริมความหนาพิเศษ รับน้ำหนักได้สูงถึง 200 kg ปลอดภัยมั่นใจ 100%',
  '{"length": "ปรับได้ 72 - 97 cm (เหมาะกับประตูทั่วไป)", "material": "High Density Alloy Steel (厚 3mm)", "max_load": "200 kg", "lock_type": "Double Safety Gear Lock"}'::jsonb,
  '["ติดตั้งง่ายใน 30 วินาที ไม่ต้องเจาะ ไม่ทำลายวงกบ", "ระบบเกียร์ล็อคคู่ ป้องกันการหมุนหลุดขณะโหน 100%", "ยางซิลิโคนฐานกว้างพิเศษ ป้องกันผนังเป็นรอย"]'::jsonb,
  'รับประกัน 1 ปี',
  false,
  4.7,
  38,
  9
),
(
  'high-density-yoga-gym-mat-10mm',
  'เสื่อโยคะและฟิตเนส NBR หนานุ่มพิเศษ 10mm กันลื่น',
  'accessories',
  'อุปกรณ์เสริม',
  490,
  790,
  60,
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
  'เสื่อฟิตเนสและโยคะความหนา 10 มิลลิเมตร ผลิตจากวัสดุ NBR ความหนาแน่นสูง นุ่มสบาย ช่วยรองรับข้อศอกและเข่าขณะทำท่า Plank หรือกระโดด พื้นผิวลายรวงผึ้งกันลื่นทั้งสองด้าน มาพร้อมสายสะพายและถุงตาข่าย',
  '{"size": "183 x 61 cm x 10 mm", "material": "Eco-friendly High Density NBR", "weight": "850 g", "features": "Waterproof, Anti-Tear, Double Sided Non-slip"}'::jsonb,
  '["หนา 10 มิลลิเมตร รองรับแรงกระแทกได้ดีเยี่ยม ไม่เจ็บเข่า", "ผิวสัมผัสกันลื่นทั้งหน้าและหลัง ไม่เลื่อนขณะออกกำลังกาย", "กันน้ำ กันเหงื่อ เช็ดทำความสะอาดได้ง่าย"]'::jsonb,
  'รับประกัน 6 เดือน',
  false,
  4.8,
  53,
  10
);

-- -------------------------------------------------------------
-- 9. รีวิวเริ่มต้น (Initial Reviews)
-- -------------------------------------------------------------
insert into public.reviews (product_id, product_name, customer_name, rating, comment, is_approved)
values
(
  1,
  'ดัมเบลปรับน้ำหนักอัจฉริยะ 24 kg (IronFit QuickLock)',
  'โค้ชเอก ฟิตเนส',
  5,
  'สินค้าคุณภาพดีมากครับ ปรับน้ำหนักได้สมูทมาก หมุนทีเดียวจบไม่ต้องเสียเวลาถอดจานเหล็ก ประหยัดที่ในห้องได้เยอะ แนะนำเลยครับ!',
  true
),
(
  1,
  'ดัมเบลปรับน้ำหนักอัจฉริยะ 24 kg (IronFit QuickLock)',
  'คุณเมย์ สาทร',
  5,
  'สั่งให้แฟน แฟนชอบมากค่ะ เหล็กดูแข็งแรงมาก มีถาดวางเรียบร้อย พื้นห้องไม่เป็นรอย จัดส่งเร็ว 2 วันได้ของแล้ว',
  true
),
(
  2,
  'ลู่วิ่งไฟฟ้ารุ่น ProRun X7 พับเก็บได้ มอเตอร์ 3.5 HP',
  'พ.ต.ท. วรพงษ์',
  5,
  'ลู่วิ่งวิ่งเงียบมากครับ มอเตอร์แรงดี วิ่งสปีด 12-14 สบายๆ ไม่กระตุก โช้ครองรับแรงกระแทกเข่าได้ดีมาก สมราคาครับ',
  true
),
(
  4,
  'ม้านั่งยกน้ำหนักปรับระดับ Multi-Angle Pro Bench',
  'คุณธนภัทร เชียงใหม่',
  5,
  'ม้านั่งแข็งแรงมาก เหล็กหนาจริง เบาะแน่นไม่ยวบ ปรับระดับเอียงเล่นอกบนอกล่างได้ครบ ช่างบริการให้คำแนะนำดีมากครับ',
  true
);
