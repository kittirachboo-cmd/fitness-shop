import { Product, Review } from './types';

export const CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'free-weights', name: 'ดัมเบล & บาร์เบล' },
  { id: 'cardio', name: 'เครื่องคาร์ดิโอ' },
  { id: 'strength', name: 'ม้านั่ง & แร็ค' },
  { id: 'accessories', name: 'อุปกรณ์เสริม' },
  { id: 'recovery', name: 'ฟื้นฟูกล้ามเนื้อ' },
] as const;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'adjustable-dumbbell-24kg',
    name: 'ดัมเบลปรับน้ำหนักอัจฉริยะ 24 kg (IronFit QuickLock)',
    category: 'free-weights',
    category_name: 'ดัมเบล & บาร์เบล',
    price: 3590,
    original_price: 4990,
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'ดัมเบลปรับน้ำหนักรุ่นยอดนิยม หมุนเปลี่ยนน้ำหนักได้ง่ายใน 1 วินาที ตั้งแต่ 2.5 ถึง 24 กิโลกรัม แทนดัมเบล 15 คู่ ประหยัดพื้นที่จัดเก็บได้กว่า 90% ด้ามจับกระชับมือกันลื่น',
    specs: {
      'ช่วงน้ำหนัก': '2.5 - 24 kg',
      'การปรับ': '15 ระดับน้ำหนัก',
      'วัสดุ': 'เหล็กซิลิคอนพรีเมียมเคลือบหนา + ฐานไนลอนคอมโพสิต',
      'ขนาด': '40 x 20 x 23 ซม.',
      'สี': 'ดำด้านขอบแดงสปอร์ต'
    },
    features: [
      'ปรับน้ำหนักได้ 15 ระดับ (2.5 - 24 kg) เพียงหมุนแป้นเดียว',
      'วัสดุเหล็กซิลิคอนพรีเมียม ไร้เสียงกระทบ',
      'มีถาดรองวางกันรอยขีดข่วนพื้นห้อง',
      'ประหยัดเนื้อที่แทนดัมเบล 15 คู่'
    ],
    warranty: 'รับประกันกลไก 2 ปี',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviews_count: 24,
    sort_order: 1
  },
  {
    id: 2,
    slug: 'commercial-foldable-treadmill-3hp',
    name: 'ลู่วิ่งไฟฟ้ารุ่น ProRun X7 พับเก็บได้ มอเตอร์ 3.5 HP',
    category: 'cardio',
    category_name: 'เครื่องคาร์ดิโอ',
    price: 14900,
    original_price: 19900,
    stock: 7,
    image_url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'ลู่วิ่งไฟฟ้าระดับ Semi-Commercial มอเตอร์พลังสูง 3.5 HP ต่อเนื่อง วิ่งนุ่มไม่สะดุด ระบบรองรับแรงกระแทก 8 จุด ถนอมเข่าและข้อเท้า รองรับน้ำหนักผู้ใช้ 130 kg พับเก็บด้วยไฮดรอลิกในสัมผัสเดียว',
    specs: {
      'กำลังมอเตอร์': '3.5 HP Peak Drive Motor',
      'ความเร็ว': '1.0 - 18.0 km/h',
      'พื้นที่วิ่ง': '130 x 48 ซม. (สายพาน Diamond Pattern)',
      'รับน้ำหนักสูงสุด': '130 kg',
      'หน้าจอ': 'LED Touch Screen + บลูทูธ Zwift / Kinomap'
    },
    features: [
      'มอเตอร์ 3.5 HP เงียบ ทนทาน ใช้งานต่อเนื่องได้ยาวนาน',
      'ระบบโช้คซับแรงกระแทก 8 จุด ดูดซับแรงกระแทกเข่า 40%',
      'หน้าจอทัชสกรีน พร้อมลำโพงบลูทูธและที่วางแท็บเล็ต',
      'พับเก็บด้วยระบบไฮดรอลิก Hydraulic Soft-Drop'
    ],
    warranty: 'รับประกันมอเตอร์ 5 ปี / โครงสร้าง 2 ปี',
    is_featured: true,
    is_active: true,
    rating: 4.8,
    reviews_count: 19,
    sort_order: 2
  },
  {
    id: 3,
    slug: 'olympic-barbell-bumper-plates-100kg',
    name: 'เซ็ตบาร์เบลโอลิมปิก 2.2m + แผ่นน้ำหนัก Bumper Plates 100 kg',
    category: 'free-weights',
    category_name: 'ดัมเบล & บาร์เบล',
    price: 11500,
    original_price: 13900,
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    description: 'ชุดบาร์เบลมาตรฐานโอลิมปิกความยาว 2.2 เมตร (20 kg) รับน้ำหนักได้ถึง 700 kg มาพร้อมลูกปืนเข็ม Needle Bearings 8 ตลับ หมุนสมูท และแผ่นยาง Bumper Plates ยางแท้ไร้กลิ่น ซับแรงกระแทก ทิ้งบาร์ได้ไม่แตกหัก',
    specs: {
      'สเปกบาร์': 'Olympic 2.2m (20 kg, 28mm grip, 50mm sleeve)',
      'แผ่นน้ำหนักในเซ็ต': '5kg x2, 10kg x2, 15kg x2, 20kg x2 (รวม 100kg)',
      'วัสดุแผ่น': 'Virgin Rubber ไร้กลิ่น แกนกลางสแตนเลสสตีล',
      'แถมฟรี': 'กิ๊บล็อคโอลิมปิก Quick-Collar 1 คู่'
    },
    features: [
      'บาร์มาตรฐานแข่งขัน 2.2m ทนแรงดึงสูง ไม่โก่งงอ',
      'แผ่นน้ำหนักยางพาราบริสุทธิ์ ไร้กลิ่น ทนแรงกระแทก',
      'แถมฟรี กิ๊บล็อคโอลิมปิก Quick-Collar 1 คู่'
    ],
    warranty: 'รับประกันบาร์เบล 3 ปี',
    is_featured: true,
    is_active: true,
    rating: 5.0,
    reviews_count: 15,
    sort_order: 3
  },
  {
    id: 4,
    slug: 'adjustable-workout-bench-pro',
    name: 'ม้านั่งยกน้ำหนักปรับระดับ Multi-Angle Pro Bench',
    category: 'strength',
    category_name: 'ม้านั่ง & แร็ค',
    price: 3890,
    original_price: 5200,
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    description: 'ม้านั่งดัมเบลโครงสร้างเหล็กหนา 2.5 mm ปรับได้ทั้ง Incline, Flat, และ Decline (ปรับพนักพิง 7 ระดับ เบาะนั่ง 3 ระดับ) เบาะหุ้มหนัง PU หนา 6 ซม. นุ่มแน่น ไม่ยุบตัว รองรับน้ำหนักรวม 350 kg',
    specs: {
      'โครงสร้าง': 'เหล็กกล้าพาณิชย์ขนาด 70x50 มม. หนา 2.5 มม.',
      'การปรับ': 'พนักพิง 7 ระดับ, เบาะนั่ง 3 ระดับ (-20° ถึง 85°)',
      'เบาะ': 'โฟม EPE หนาแน่นสูง + หนัง PU ป้องกันเหงื่อ หนา 6 ซม.',
      'รับน้ำหนักรวม': '350 kg'
    },
    features: [
      'ปรับได้ครบทั้งระนาบเอียงขึ้น แบนราบ และเอียงลาดต่ำ',
      'เบาะหนาพิเศษ รองรับแผ่นหลัง ไม่เจ็บกระดูกสันหลัง',
      'มีล้อเลื่อนด้านหลัง ยกเคลื่อนย้ายได้ง่ายผู้หญิงก็ทำได้'
    ],
    warranty: 'รับประกันโครงสร้าง 3 ปี',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviews_count: 31,
    sort_order: 4
  },
  {
    id: 5,
    slug: 'magnetic-spin-bike-silent',
    name: 'จักรยานออกกำลังกายแม่เหล็ก Spin Bike SilentFly (ไร้เสียง)',
    category: 'cardio',
    category_name: 'เครื่องคาร์ดิโอ',
    price: 6990,
    original_price: 9500,
    stock: 14,
    image_url: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?auto=format&fit=crop&w=800&q=80',
    description: 'จักรยานปั่นในร่มระบบแรงต้านแม่เหล็กคู่ Magnetic Resistance ปั่นนุ่มเงียบกริบ ไร้เสียงรบกวนคนในบ้านหรือคอนโด ล้อช่วยแรง Flywheel 11 kg ควบคุมแรงต้านด้วยลูกบิด ปรับเบาะและแฮนด์ได้ 4 ทิศทาง',
    specs: {
      'ล้อช่วยแรง': '11 kg Solid Steel Flywheel',
      'ระบบแรงต้าน': 'Magnetic Resistance ไร้การเสียดสี',
      'ระบบขับเคลื่อน': 'สายพาน Silent Belt Drive (ไร้เสียง)',
      'รับน้ำหนักผู้ใช้': 'สูงสุด 150 kg'
    },
    features: [
      'ระบบต้านทานแม่เหล็ก ไร้การเสียดสี ไร้เสียง 0 dB',
      'เชื่อมต่อแอปปั่นเสมือนจริง Zwift & Kinomap ผ่านบลูทูธ',
      'โครงสร้างรูปสามเหลี่ยม มั่นคง ไม่โคลงเคลง'
    ],
    warranty: 'รับประกันโครงสร้าง 2 ปี / ระบบแม่เหล็ก 1 ปี',
    is_featured: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 12,
    sort_order: 5
  },
  {
    id: 6,
    slug: 'power-rack-pullup-dip-station',
    name: 'พาวเวอร์แร็คอเนกประสงค์ Power Rack + สถานีดึงข้อ Dip Station',
    category: 'strength',
    category_name: 'ม้านั่ง & แร็ค',
    price: 16500,
    original_price: 21900,
    stock: 5,
    image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    description: 'ชุดเคจพาวเวอร์แร็คสำหรับสายฟิตเนสตัวจริง เล่นได้ครบทั้ง Squat, Bench Press, Pull-Up, Dip เสาเหล็กหนาพิเศษ 3.0mm เจาะรูระยะมาตรฐาน พร้อมบาร์เซฟตี้รองรับตก และจุดเก็บบาร์เบล/แผ่นน้ำหนักในตัว',
    specs: {
      'ขนาดภายนอก': '140 x 120 x 215 ซม.',
      'ขนาดเหล็กเสา': 'Heavy Duty 60x60 มม. หนา 3.0 มม.',
      'รับน้ำหนักสูงสุด': '500 kg',
      'อุปกรณ์ที่แถม': 'J-Hooks x2, เซฟตี้อาร์ม x2, บาร์ดิพ x2'
    },
    features: [
      'ปลอดภัยสูงสุดสำหรับการฝึกซ้อมน้ำหนักมากคนเดียวที่บ้าน',
      'เสาเหล็กหนา 3.0 มิลลิเมตร แข็งแกร่งระดับพาณิชย์',
      'รองรับน้ำหนักได้ถึง 500 กิโลกรัม'
    ],
    warranty: 'รับประกันโครงสร้าง 5 ปี',
    is_featured: true,
    is_active: true,
    rating: 5.0,
    reviews_count: 8,
    sort_order: 6
  },
  {
    id: 7,
    slug: 'resistance-bands-11pcs-set',
    name: 'ชุดยางยืดออกกำลังกายแรงต้าน 11 ชิ้น (Resistance Bands Set 150 lbs)',
    category: 'accessories',
    category_name: 'อุปกรณ์เสริม',
    price: 590,
    original_price: 990,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
    description: 'ยางยืดแรงต้านผลิตจากยางธรรมชาติ 100% ปลอดภัยไม่ขาดง่าย 5 เส้น 5 ระดับแรงต้าน (10, 20, 30, 40, 50 lbs รวมแรงต้านสูงสุด 150 lbs) มาพร้อมที่จับนุ่มมือ สายรัดข้อเท้า สมอยึดประตู และกระเป๋าพกพา',
    specs: {
      'วัสดุ': '100% Natural Malaysian Latex',
      'ระดับแรงต้าน': '5 เส้น (10, 20, 30, 40, 50 lbs รวม 150 lbs)',
      'ในชุดประกอบด้วย': 'ยางยืด 5 เส้น + มือจับโฟม 2 ชิ้น + สายรัดข้อเท้า 2 ชิ้น + ตัวล็อคประตู 1 ชิ้น + ถุงผ้าพกพา'
    },
    features: [
      'ยางแท้จากธรรมชาติ เหนียวทนทาน ยืดหยุ่นดีเยี่ยม',
      'ผสมแรงต้านได้มากถึง 150 ปอนด์',
      'พกพาสะดวก ออกกำลังกายได้ทุกที่ ทั้งในบ้าน โรงแรม สวนสาธารณะ'
    ],
    warranty: 'รับประกัน 6 เดือน',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 42,
    sort_order: 7
  },
  {
    id: 8,
    slug: 'deep-tissue-massage-gun-pro',
    name: 'ปืนนวดกล้ามเนื้อ Deep Tissue Massage Gun 30 ระดับความแรง',
    category: 'recovery',
    category_name: 'ฟื้นฟูกล้ามเนื้อ',
    price: 1790,
    original_price: 2590,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    description: 'ปืนนวดสลายความเมื่อยล้าหลังออกกำลังกาย มอเตอร์ Brushless เงียบ แรงกระแทกลึก 12mm ปรับความเร็วได้ 30 สปีด หน้าจอ LCD สัมผัส แบตเตอรี่ลิเธียมความจุสูง 2500mAh ใช้งานได้นาน 6-8 ชม. พร้อมหัวนวดเปลี่ยน 6 แบบ',
    specs: {
      'ระยะชักลึก': '12 มม. Deep Tissue Impact',
      'ความเร็ว': '30 ระดับ (1,200 - 3,500 รอบ/นาที)',
      'แบตเตอรี่': '2,500 mAh ชาร์จไว ใช้งานได้ 6-8 ชั่วโมง',
      'อุปกรณ์ในกล่อง': 'ปืนนวด + หัวนวด 6 แบบ + สายชาร์จ Type-C + กระเป๋าเคสแข็ง'
    },
    features: [
      'ผ่อนคลายกล้ามเนื้อชั้นลึก สลายกรดแลคติกหลังออกกำลังกาย',
      'มอเตอร์ Brushless ลดเสียงรบกวนต่ำกว่า 45 dB',
      'หัวนวดเฉพาะทาง 6 แบบ ครอบคลุมทุกสัดส่วนของร่างกาย'
    ],
    warranty: 'รับประกัน 1 ปี',
    is_featured: true,
    is_active: true,
    rating: 4.9,
    reviews_count: 27,
    sort_order: 8
  },
  {
    id: 9,
    slug: 'heavy-duty-doorway-pullup-bar',
    name: 'บาร์ดึงข้อติดประตูไม่ต้องเจาะ Heavy-Duty Lock 200 kg',
    category: 'accessories',
    category_name: 'อุปกรณ์เสริม',
    price: 790,
    original_price: 1290,
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    description: 'บาร์โหนติดวงกบประตูแบบล็อกคู่ ไม่ต้องเจาะผนังหรือวงกบประตู ยางซิลิโคนขนาดใหญ่พิเศษกระจายแรงกด ไม่ทิ้งรอย แกนเหล็กกล้าเสริมความหนาพิเศษ รับน้ำหนักได้สูงถึง 200 kg ปลอดภัยมั่นใจ 100%',
    specs: {
      'ความยาวบาร์': 'ปรับขยายได้ 72 - 97 ซม.',
      'ความหนาเหล็ก': 'หนาพิเศษ 3.0 มม.',
      'รับน้ำหนัก': 'สูงสุด 200 kg',
      'ระบบล็อค': 'Gear Lock หมุนขยายแน่นหนา 2 ทิศทาง'
    },
    features: [
      'ติดตั้งง่ายใน 30 วินาที ไม่ต้องเจาะ ไม่ทำลายวงกบ',
      'ระบบเกียร์ล็อคคู่ ป้องกันการหมุนหลุดขณะโหน 100%',
      'ยางซิลิโคนฐานกว้างพิเศษ ป้องกันผนังเป็นรอย'
    ],
    warranty: 'รับประกัน 1 ปี',
    is_featured: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 38,
    sort_order: 9
  },
  {
    id: 10,
    slug: 'high-density-yoga-gym-mat-10mm',
    name: 'เสื่อโยคะและฟิตเนส NBR หนานุ่มพิเศษ 10mm กันลื่น',
    category: 'accessories',
    category_name: 'อุปกรณ์เสริม',
    price: 490,
    original_price: 790,
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    description: 'เสื่อฟิตเนสและโยคะความหนา 10 มิลลิเมตร ผลิตจากวัสดุ NBR ความหนาแน่นสูง นุ่มสบาย ช่วยรองรับข้อศอกและเข่าขณะทำท่า Plank หรือกระโดด พื้นผิวลายรวงผึ้งกันลื่นทั้งสองด้าน มาพร้อมสายสะพายและถุงตาข่าย',
    specs: {
      'ขนาด': '183 x 61 ซม. หนา 10 มม.',
      'วัสดุ': 'Eco-Friendly High Density NBR',
      'น้ำหนัก': '850 กรัม',
      'อุปกรณ์ที่แถม': 'สายสะพายพกพา + ถุงตาข่ายระบายอากาศ'
    },
    features: [
      'หนา 10 มิลลิเมตร รองรับแรงกระแทกได้ดีเยี่ยม ไม่เจ็บเข่า',
      'ผิวสัมผัสกันลื่นทั้งหน้าและหลัง ไม่เลื่อนขณะออกกำลังกาย',
      'กันน้ำ กันเหงื่อ เช็ดทำความสะอาดได้ง่าย'
    ],
    warranty: 'รับประกัน 6 เดือน',
    is_featured: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 53,
    sort_order: 10
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    product_id: 1,
    product_name: 'ดัมเบลปรับน้ำหนักอัจฉริยะ 24 kg (IronFit QuickLock)',
    customer_name: 'โค้ชเอก ฟิตเนส',
    rating: 5,
    comment: 'สินค้าคุณภาพดีมากครับ ปรับน้ำหนักได้สมูทมาก หมุนทีเดียวจบไม่ต้องเสียเวลาถอดจานเหล็ก ประหยัดที่ในห้องได้เยอะ แนะนำเลยครับ!',
    is_approved: true,
    created_at: '2026-11-04 14:32:00'
  },
  {
    id: 'rev-002',
    product_id: 1,
    product_name: 'ดัมเบลปรับน้ำหนักอัจฉริยะ 24 kg (IronFit QuickLock)',
    customer_name: 'คุณเมย์ สาทร',
    rating: 5,
    comment: 'สั่งให้แฟน แฟนชอบมากค่ะ เหล็กดูแข็งแรงมาก มีถาดวางเรียบร้อย พื้นห้องไม่เป็นรอย จัดส่งเร็ว 2 วันได้ของแล้ว',
    is_approved: true,
    created_at: '2026-11-03 10:15:00'
  },
  {
    id: 'rev-003',
    product_id: 2,
    product_name: 'ลู่วิ่งไฟฟ้ารุ่น ProRun X7 พับเก็บได้ มอเตอร์ 3.5 HP',
    customer_name: 'พ.ต.ท. วรพงษ์',
    rating: 5,
    comment: 'ลู่วิ่งวิ่งเงียบมากครับ มอเตอร์แรงดี วิ่งสปีด 12-14 สบายๆ ไม่กระตุก โช้ครองรับแรงกระแทกเข่าได้ดีมาก สมราคาครับ',
    is_approved: true,
    created_at: '2026-11-01 18:40:00'
  },
  {
    id: 'rev-004',
    product_id: 4,
    product_name: 'ม้านั่งยกน้ำหนักปรับระดับ Multi-Angle Pro Bench',
    customer_name: 'คุณธนภัทร เชียงใหม่',
    rating: 5,
    comment: 'ม้านั่งแข็งแรงมาก เหล็กหนาจริง เบาะแน่นไม่ยวบ ปรับระดับเอียงเล่นอกบนอกล่างได้ครบ ช่างบริการให้คำแนะนำดีมากครับ',
    is_approved: true,
    created_at: '2026-10-28 11:20:00'
  },
  {
    id: 'rev-005',
    product_id: 8,
    product_name: 'ปืนนวดกล้ามเนื้อ Deep Tissue Massage Gun 30 ระดับความแรง',
    customer_name: 'คุณกานต์ เทรนเนอร์อิสระ',
    rating: 5,
    comment: 'ปืนนวดแรงกระแทกถึงกล้ามเนื้อชั้นในจริง แบตอึดมากใช้ทั้งวันยังไม่หมด หัวนวดมีให้เลือกเยอะ คุ้มราคามากครับ',
    is_approved: true,
    created_at: '2026-10-25 16:05:00'
  }
];
