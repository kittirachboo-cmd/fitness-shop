# 🏋️‍♂️ IRONPULSE FITNESS — เว็บไซต์ขายอุปกรณ์ออกกำลังกายออนไลน์

เว็บไซต์ E-Commerce จำหน่ายอุปกรณ์ออกกำลังกายระดับพรีเมียม (ดัมเบลปรับน้ำหนัก, บาร์เบลโอลิมปิก, ลู่วิ่งไฟฟ้า, ม้านั่งยกน้ำหนัก, ยางยืด, ปืนนวด ฯลฯ) พร้อมระบบชำระเงิน QR พร้อมเพย์ แนบสลิปโอนเงิน และระบบเชื่อมต่อ Google Sheet สำหรับเจ้าของร้านดูแลผ่านโทรศัพท์มือถือและคอมพิวเตอร์

---

## 🛠 Tech Stack

| ส่วนประกอบ | เทคโนโลยีที่ใช้ |
|---|---|
| **Frontend & API** | Next.js 16 (App Router, React 19, TypeScript) |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons, Google Font Prompt & Inter |
| **ฐานข้อมูล (Database)** | Supabase (PostgreSQL) — ตาราง `products`, `orders`, `reviews`, `contact_inquiries` |
| **Storage (จัดเก็บสลิป)** | Supabase Storage (Bucket: `slips`) |
| **ชำระเงิน (Payment)** | PromptPay Dynamic QR Code (`promptpay-qr` + `qrcode`) |
| **ระบบจัดการร้าน (Store Ops)** | Google Sheets + Google Apps Script (ซิงค์ออเดอร์, สลิป, รีวิว, ติดต่อกลับ) |
| **แจ้งเตือนเจ้าของร้าน** | ส่งอีเมลเข้า `kittirach.boo@tsn.thai-tech.ac.th` อัตโนมัติ |
| **Version Control** | GitHub |
| **Hosting & Deploy** | Vercel |

---

## 📱 โครงสร้างระบบ Google Sheet สำหรับเจ้าของร้าน

ชีตเดียวแบ่งออกเป็น 3 แท็บ จัดการได้สะดวกบนสมาร์ทโฟน (iOS/Android) และคอมพิวเตอร์:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Google Sheet: IRONPULSE FITNESS                      │
├─────────────────┬──────────────────────────┬───────────────────────────┤
│ 🛒 1. คำสั่งซื้อ │ ⭐ 2. รีวิว              │ 📞 3. ติดต่อลูกค้ากลับ    │
├─────────────────┼──────────────────────────┼───────────────────────────┤
│ • เลขออเดอร์    │ • วันเวลา                │ • วันเวลา                 │
│ • วันเวลา       │ • สินค้าที่รีวิว         │ • ชื่อลูกค้า              │
│ • ชื่อลูกค้า     │ • ชื่อลูกค้า             │ • เบอร์โทร (คลิกโทรได้)   │
│ • เบอร์โทร      │ • ดาว (⭐⭐⭐⭐⭐)         │ • อีเมล                   │
│ • ที่อยู่จัดส่ง │ • คะแนน (1-5)            │ • เรื่องที่ติดต่อ         │
│ • รายการอุปกรณ์ │ • ข้อความรีวิว           │ • รายละเอียดที่สอบถาม     │
│ • ยอดรวมสุทธิ   │ • สถานะแสดงผล            │ • ช่องทาง/เวลาที่สะดวก    │
│ • ลิงก์รูปสลิป  │   (Dropdown)             │ • สถานะการติดต่อกลับ      │
│ • Dropdown สถานะ│                          │   (Dropdown)              │
│   (รอตรวจสลิป / │                          │ • บันทึกของร้าน           │
│    จัดส่งแล้ว)  │                          │                           │
└─────────────────┴──────────────────────────┴───────────────────────────┘
```

---

## 🚀 ขั้นตอนการติดตั้งและการใช้งาน (ทำตามลำดับ)

### ขั้นตอนที่ 1: ตั้งค่าฐานข้อมูล Supabase
1. เข้าไปที่ [https://supabase.com](https://supabase.com) แล้วลงชื่อเข้าใช้ด้วยบัญชีของคุณ (`kittirach.boo@tsn.thai-tech.ac.th`)
2. กด **New Project** แล้วตั้งชื่อโปรเจกต์ (เช่น `ironpulse-fitness`)
3. ไปที่เมนู **SQL Editor** (รูปไอคอน `>_` ด้านซ้าย)
4. เปิดไฟล์ [`supabase/schema.sql`](supabase/schema.sql) ในโปรเจกต์นี้ คัดลอกโค้ดทั้งหมดแล้วนำไปวางใน SQL Editor จากนั้นกดปุ่ม **Run**
   - ระบบจะสร้างตาราง `products` พร้อมข้อมูลตัวอย่าง 10 รายการ
   - สร้างตาราง `orders`, `reviews`, `contact_inquiries`
   - สร้างฟังก์ชัน `place_order` สำหรับตัดสต็อกอัตโนมัติ
   - สร้าง Bucket `slips` สำหรับเก็บรูปสลิป
5. ไปที่ **Project Settings** (ไอคอนฟันเฟือง) -> **API**
   - คัดลอก `Project URL` -> นำไปใส่ใน `NEXT_PUBLIC_SUPABASE_URL`
   - คัดลอก `Project API Keys` ช่อง `anon public` -> นำไปใส่ใน `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - คัดลอก `Project API Keys` ช่อง `service_role secret` -> นำไปใส่ใน `SUPABASE_SERVICE_ROLE_KEY`

---

### ขั้นตอนที่ 2: ตั้งค่า Google Sheet สำหรับดูแลร้าน
1. เปิดเว็บเบราว์เซอร์แล้วไปที่ [https://sheets.new](https://sheets.new) เพื่อสร้างสเปรดชีตใหม่
2. ตั้งชื่อสเปรดชีตว่า: **IRONPULSE FITNESS - ระบบจัดการร้าน**
3. ไปที่เมนู **ส่วนขยาย (Extensions)** -> **Apps Script**
4. ลบโค้ดเริ่มต้นทั้งหมดในหน้า Apps Script แล้วคัดลอกโค้ดจากไฟล์ [`google-sheet/Code.gs`](google-sheet/Code.gs) ทั้งหมดไปวาง
5. ด้านบนเลือกฟังก์ชัน **`setup`** แล้วกดปุ่ม **▷ เรียกใช้ (Run)**
   - ระบบจะขอสิทธิ์เข้าถึง Sheet และส่งอีเมล ให้กด *ตรวจสอบสิทธิ์ (Review permissions)*
   - เลือกบัญชี `kittirach.boo@tsn.thai-tech.ac.th` -> Advanced -> Go to ... (unsafe) -> Allow
   - เมื่อขึ้น Execution completed ให้กลับไปดูที่ Google Sheet จะพบ 3 แท็บถูกสร้างขึ้นพร้อมหัวตารางและสีสันสวยงาม พร้อมกับได้รับอีเมลทดสอบ 1 ฉบับ
6. กดปุ่มสีน้ำเงิน **ทำให้ใช้งานได้ (Deploy)** มุมขวาบน -> **การทำให้ใช้งานได้ใหม่ (New deployment)**
   - เลือกประเภท (ฟันเฟือง): **เว็บแอป (Web app)**
   - ปฏิบัติการในฐานะ (Execute as): **ตัวฉัน (Me)**
   - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): **ทุกคน (Anyone)** *(สำคัญมาก! ต้องเลือก Anyone เพื่อให้เว็บส่งข้อมูลเข้ามาได้)*
   - กด **ทำให้ใช้งานได้ (Deploy)**
7. คัดลอก **URL เว็บแอป (Web app URL)** ที่ลงท้ายด้วย `/exec`
   - นำไปใส่ในตัวแปร `GOOGLE_SHEET_WEBHOOK_URL` ในไฟล์ `.env.local` หรือใน Vercel

---

### ขั้นตอนที่ 3: รันโปรเจกต์ในเครื่อง (Local Development)

```bash
# ติดตั้ง dependencies
npm run dev
```

เปิดดูหน้าเว็บที่: [http://localhost:3000](http://localhost:3000)

**ทดสอบการเชื่อมต่อ Google Sheet:**
เปิด [http://localhost:3000/api/sheet-test](http://localhost:3000/api/sheet-test) ระบบจะแจ้งผลการเชื่อมต่อ Webhook ทันที

---

### ขั้นตอนที่ 4: เชื่อมต่อ GitHub Version Control

```bash
# 1. เริ่มต้น Git Repository
git init

# 2. Add และ Commit โค้ดทั้งหมด
git add .
git commit -m "feat: initial commit IronPulse fitness equipment store with Google Sheets & Supabase"

# 3. สร้าง Repository ใหม่ใน GitHub (บัญชี kittirachboo-cmd)
# แล้วเชื่อมโยง Remote และ Push ขึ้น GitHub
git branch -M main
git remote add origin https://github.com/kittirachboo-cmd/fitness-shop.git
git push -u origin main
```

---

### ขั้นตอนที่ 5: Deploy ขึ้น Vercel

1. เข้าสู่ระบบที่ [https://vercel.com](https://vercel.com) (เข้าสู่ระบบด้วย GitHub `kittirachboo-cmd` หรืออีเมล `kittirach.boo@tsn.thai-tech.ac.th`)
2. กด **Add New...** -> **Project** -> เลือก Repository `fitness-shop`
3. ไปที่ส่วน **Environment Variables** แล้วใส่ค่าตามตารางนี้:

| Key | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | URL ของ Supabase Project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Anon Key ของ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Service Role Key ของ Supabase |
| `PROMPTPAY_ID` | `0891234567` | เบอร์พร้อมเพย์ 10 หลัก หรือเลขบัตร 13 หลัก |
| `SHOP_BANK_NAME` | `ธนาคารกสิกรไทย (KBANK)` | ชื่อธนาคารร้าน |
| `SHOP_BANK_ACCOUNT` | `123-2-88990-1` | เลขที่บัญชีธนาคารร้าน |
| `SHOP_ACCOUNT_NAME` | `ร้านอุปกรณ์ออกกำลังกาย IRONPULSE` | ชื่อบัญชี |
| `GOOGLE_SHEET_WEBHOOK_URL` | `https://script.google.com/macros/s/AKfycb.../exec` | Web app URL จาก Apps Script |
| `GOOGLE_SHEET_SECRET` | `ironpulse_secret_key_fitgear_2026` | รหัสลับตรงกับใน Code.gs |
| `OWNER_NOTIFY_EMAIL` | `kittirach.boo@tsn.thai-tech.ac.th` | อีเมลสำหรับรับแจ้งเตือน |

4. กดปุ่ม **Deploy** ระบบจะ Build และเปิดเว็บใช้งานได้จริงทั่วโลกทันที!

---

## 🌟 หน้าเว็บหลักของระบบ

- `/` — หน้าแรก: แบนเนอร์ดีไซน์สปอร์ต, หมวดหมู่อุปกรณ์, สินค้าขายดี, รีวิวจากลูกค้า, ข้อมูลร้าน
- `/products` — แคตตาล็อกสินค้าทั้งหมด: กรองตามหมวดหมู่, ค้นหาตามชื่อ, เรียงลำดับราคา/คะแนนรีวิว
- `/products/[slug]` — หน้ารายละเอียดสินค้า: รูปภาพ, สเปกทางเทคนิค, เช็คสต็อก, เพิ่มลงตะกร้า, รีวิวจากผู้ใช้, ฟอร์มเขียนรีวิว
- `/cart` — ตะกร้าสินค้า & สั่งซื้อ: ปรับจำนวน, คำนวณค่าส่งฟรี (ครบ 1,500 บ.), ฟอร์มที่อยู่จัดส่ง
- `/order/[id]` — หน้าสรุปออเดอร์ & จ่ายเงิน: QR พร้อมเพย์ยอดตรงตามบิล, ข้อมูลโอนธนาคาร, ช่องแนบสลิปพร้อมพรีวิว
- `/reviews` — หน้ารวมรีวิวลูกค้า: สรุปคะแนนดาวเฉลี่ย, ฟีดรีวิว, ฟอร์มส่งรีวิวซิงค์เข้า Google Sheet
- `/contact` — ขอคำปรึกษา / ติดต่อกลับ: ฟอร์มขอคำปรึกษาจัด Home Gym, ขอใบเสนอราคาองค์กร ซิงค์เข้า Google Sheet แท็บ "ติดต่อลูกค้ากลับ"

---

## 📬 การติดต่อและช่วยเหลือ
หากมีข้อสงสัยเพิ่มเติม สามารถสอบถามได้ที่:
- **อีเมลเจ้าของระบบ:** `kittirach.boo@tsn.thai-tech.ac.th`
- **LINE:** `@ironpulse`
- **โทร:** `089-123-4567`
