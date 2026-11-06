/**
 * =========================================================================
 * IRONPULSE FITNESS - ระบบเชื่อมต่อร้านค้ากับ Google Sheet
 * เจ้าของร้าน: kittirach.boo@tsn.thai-tech.ac.th
 *
 * แสดงและจัดการ 3 ระบบในชีตเดียว:
 * 1. แท็บ "คำสั่งซื้อ" (Orders + สลิปโอนเงิน)
 * 2. แท็บ "รีวิว" (Customer Reviews)
 * 3. แท็บ "ติดต่อลูกค้ากลับ" (Contact / Consultation Inquiries)
 *
 * -------------------------------------------------------------------------
 * วิธีติดตั้ง (ทำครั้งเดียวประมาณ 3 นาที):
 * 1. เปิด https://sheets.new เพื่อสร้าง Google Sheet ใหม่
 *    (หรือตั้งชื่อชีตว่า "IRONPULSE FITNESS - ระบบจัดการร้าน")
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) -> "Apps Script"
 * 3. ลบโค้ดเดิมใน Apps Script ทั้งหมด แล้ววางโค้ดในไฟล์นี้ลงไป
 * 4. ตรวจสอบหรือแก้ SECRET ด้านล่าง (ต้องตรงกับ GOOGLE_SHEET_SECRET ใน Vercel/.env.local)
 * 5. เลือกฟังก์ชัน "setup" ด้านบน แล้วกดปุ่ม "▷ เรียกใช้" (Run)
 *    - ระบบจะขอสิทธิ์เข้าถึง Sheet และส่งอีเมล -> กด "ตรวจสอบสิทธิ์" (Review permissions)
 *    - เลือกอีเมล kittirach.boo@tsn.thai-tech.ac.th -> Advanced -> Go to ... (unsafe) -> Allow
 *    - เมื่อรันเสร็จ จะมีทั้ง 3 แท็บพร้อมหัวตารางสวยงาม และได้รับอีเมลทดสอบ 1 ฉบับ
 * 6. กดปุ่ม "ทำให้ใช้งานได้" (Deploy) มุมขวาบน -> "การทำให้ใช้งานได้ใหม่" (New deployment)
 *    - เลือกประเภท: เว็บแอป (Web app)
 *    - คำอธิบาย: Version 1
 *    - ปฏิบัติการในฐานะ (Execute as): ตัวฉัน (Me - kittirach.boo@tsn.thai-tech.ac.th)
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): ทุกคน (Anyone)  <-- สำคัญมาก! ต้องเลือก Anyone เพื่อให้เว็บส่งข้อมูลเข้ามาได้
 *    - กด "ทำให้ใช้งานได้" (Deploy)
 * 7. คัดลอก "URL เว็บแอป" (Web app URL ที่ลงท้ายด้วย /exec)
 *    นำไปใส่ใน Vercel Environment Variables:
 *    GOOGLE_SHEET_WEBHOOK_URL = <URL ที่เพิ่งก๊อปปี้>
 *
 * *คำแนะนำ: หากแก้ไขโค้ดนี้ในอนาคต ให้ไปที่ Deploy -> จัดการการทำให้ใช้งานได้ (Manage deployments)
 *            -> กดรูปดินสอ (Edit) -> เลือกเวอร์ชัน: เวอร์ชันใหม่ (New version) -> Deploy ทุกครั้ง
 * =========================================================================
 */

// 1. รหัสลับสำหรับยืนยันความปลอดภัยระหว่างเว็บกับ Google Sheet
const SECRET = 'ironpulse_secret_key_fitgear_2026';

// 2. อีเมลของเจ้าของร้านสำหรับรับการแจ้งเตือนทันทีเมื่อมีออเดอร์/รีวิว/ติดต่อกลับ
const NOTIFY_EMAIL = 'kittirach.boo@tsn.thai-tech.ac.th';

// 3. ชื่อแท็บทั้ง 3 หน้า
const SHEET_ORDERS = 'คำสั่งซื้อ';
const SHEET_REVIEWS = 'รีวิว';
const SHEET_CONTACTS = 'ติดต่อลูกค้ากลับ';

// -------------------------------------------------------------
// หัวตารางแท็บ "คำสั่งซื้อ"
// -------------------------------------------------------------
const HEADERS_ORDERS = [
  'เลขออเดอร์',       // 1
  'วันเวลา',          // 2
  'ชื่อลูกค้า',         // 3
  'เบอร์โทร',         // 4
  'อีเมล',            // 5
  'ที่อยู่จัดส่ง',        // 6
  'จังหวัด/รหัสไปรษณีย์', // 7
  'รายการอุปกรณ์ที่สั่ง', // 8
  'จำนวนชิ้น',        // 9
  'ยอดสินค้า (บาท)',  // 10
  'ค่าจัดส่ง (บาท)',   // 11
  'ยอดรวมสุทธิ (บาท)', // 12
  'หมายเหตุลูกค้า',     // 13
  'สถานะออเดอร์',     // 14
  'สลิปโอนเงิน',       // 15
  'ผลตรวจสลิป/บันทึก', // 16
  'Order ID',        // 17
];

const ORDER_STATUSES = [
  'รอชำระเงิน',
  'รอตรวจสลิป',
  'ชำระแล้ว/เตรียมส่ง',
  'กำลังจัดส่ง',
  'จัดส่งสำเร็จ',
  'ยกเลิก',
];

const ORDER_STATUS_COLORS = {
  'รอชำระเงิน': '#fef3c7',        // เหลืองอ่อน
  'รอตรวจสลิป': '#fed7aa',        // ส้มอ่อน
  'ชำระแล้ว/เตรียมส่ง': '#d1fae5', // เขียวอ่อน
  'กำลังจัดส่ง': '#dbeafe',        // ฟ้าอ่อน
  'จัดส่งสำเร็จ': '#bbf7d0',       // เขียวเข้ม
  'ยกเลิก': '#fee2e2',            // แดงอ่อน
};

// -------------------------------------------------------------
// หัวตารางแท็บ "รีวิว"
// -------------------------------------------------------------
const HEADERS_REVIEWS = [
  'วันเวลา',          // 1
  'สินค้าที่รีวิว',      // 2
  'ชื่อลูกค้า',         // 3
  'คะแนนดาว',         // 4
  'ระดับคะแนน (1-5)', // 5
  'ข้อความรีวิว',      // 6
  'สถานะแสดงผล',      // 7
  'Review ID',        // 8
];

const REVIEW_STATUSES = ['แสดงบนเว็บ', 'ซ่อน/รอตรวจ'];

// -------------------------------------------------------------
// หัวตารางแท็บ "ติดต่อลูกค้ากลับ"
// -------------------------------------------------------------
const HEADERS_CONTACTS = [
  'วันเวลา',          // 1
  'ชื่อลูกค้า',         // 2
  'เบอร์โทร',         // 3
  'อีเมล',            // 4
  'เรื่องที่ติดต่อ',      // 5
  'รายละเอียดที่สอบถาม',// 6
  'ช่องทางที่สะดวก',    // 7
  'เวลาที่สะดวก',       // 8
  'สถานะดำเนินการ',    // 9
  'บันทึกของร้าน',     // 10
  'Inquiry ID',       // 11
];

const CONTACT_STATUSES = ['รอติดต่อกลับ', 'กำลังดำเนินการ', 'ติดต่อเรียบร้อย/ปิดเคส'];
const CONTACT_STATUS_COLORS = {
  'รอติดต่อกลับ': '#fed7aa',       // ส้มอ่อน
  'กำลังดำเนินการ': '#e0e7ff',     // ม่วงฟ้าอ่อน
  'ติดต่อเรียบร้อย/ปิดเคส': '#d1fae5' // เขียวอ่อน
};

/**
 * ฟังก์ชัน setup: กด Run ครั้งแรกเพื่อเตรียมชีตและส่งอีเมลทดสอบ
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // สร้างและจัดรูปแบบแท็บคำสั่งซื้อ
  setupOrdersSheet_(ss);

  // สร้างและจัดรูปแบบแท็บรีวิว
  setupReviewsSheet_(ss);

  // สร้างและจัดรูปแบบแท็บติดต่อกลับ
  setupContactsSheet_(ss);

  // ส่งอีเมลทดสอบ
  notifyEmail_(
    '✅ ระบบจัดการร้าน IRONPULSE FITNESS พร้อมใช้งานแล้ว',
    'เรียน คุณกิตติรัช (เจ้าของร้าน)\n\n' +
    'ระบบ Google Sheet สำหรับร้าน IRONPULSE FITNESS เชื่อมต่อสำเร็จเรียบร้อยแล้ว!\n\n' +
    '📊 แท็บที่มีในชีต:\n' +
    '1. "คำสั่งซื้อ" - สำหรับดูออเดอร์ สลิป ยอดโอน และเปลี่ยนสถานะส่งของ\n' +
    '2. "รีวิว" - สำหรับอ่านรีวิว ความคิดเห็น และคะแนนดาวจากลูกค้า\n' +
    '3. "ติดต่อลูกค้ากลับ" - สำหรับดูลูกค้าที่ขอคำปรึกษา ขอใบเสนอราคา หรือแจ้งติดต่อกลับ\n\n' +
    '📱 สามารถเปิดดูและอัปเดตผ่านมือถือ แท็บเล็ต หรือคอมพิวเตอร์ได้ตลอด 24 ชม.\n\n' +
    'ลิงก์เปิดชีต: ' + ss.getUrl()
  );
}

function setupOrdersSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_ORDERS);
  if (!sheet) sheet = ss.insertSheet(SHEET_ORDERS);
  
  const head = sheet.getRange(1, 1, 1, HEADERS_ORDERS.length);
  head.setValues([HEADERS_ORDERS])
    .setFontWeight('bold')
    .setBackground('#0f172a') // Slate dark
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');
    
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 110); // เลขออเดอร์
  sheet.setColumnWidth(2, 140); // วันเวลา
  sheet.setColumnWidth(3, 150); // ชื่อ
  sheet.setColumnWidth(4, 120); // เบอร์โทร
  sheet.setColumnWidth(5, 180); // อีเมล
  sheet.setColumnWidth(6, 260); // ที่อยู่
  sheet.setColumnWidth(7, 160); // จังหวัด/รหัส
  sheet.setColumnWidth(8, 280); // รายการ
  sheet.setColumnWidth(9, 80);  // จำนวน
  sheet.setColumnWidth(10, 110);// ยอดสินค้า
  sheet.setColumnWidth(11, 100);// ค่าส่ง
  sheet.setColumnWidth(12, 130);// ยอดรวม
  sheet.setColumnWidth(13, 200);// หมายเหตุ
  sheet.setColumnWidth(14, 150);// สถานะ
  sheet.setColumnWidth(15, 110);// สลิป
  sheet.setColumnWidth(16, 180);// ผลตรวจ
  sheet.setColumnWidth(17, 140);// Order ID
}

function setupReviewsSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_REVIEWS);
  if (!sheet) sheet = ss.insertSheet(SHEET_REVIEWS);

  const head = sheet.getRange(1, 1, 1, HEADERS_REVIEWS.length);
  head.setValues([HEADERS_REVIEWS])
    .setFontWeight('bold')
    .setBackground('#065f46') // Emerald green
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 140); // วันเวลา
  sheet.setColumnWidth(2, 220); // สินค้า
  sheet.setColumnWidth(3, 150); // ชื่อลูกค้า
  sheet.setColumnWidth(4, 110); // ดาว
  sheet.setColumnWidth(5, 110); // ระดับ
  sheet.setColumnWidth(6, 320); // ข้อความ
  sheet.setColumnWidth(7, 130); // สถานะ
  sheet.setColumnWidth(8, 140); // ID
}

function setupContactsSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_CONTACTS);
  if (!sheet) sheet = ss.insertSheet(SHEET_CONTACTS);

  const head = sheet.getRange(1, 1, 1, HEADERS_CONTACTS.length);
  head.setValues([HEADERS_CONTACTS])
    .setFontWeight('bold')
    .setBackground('#1e3a8a') // Navy blue
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 140); // วันเวลา
  sheet.setColumnWidth(2, 160); // ชื่อ
  sheet.setColumnWidth(3, 130); // เบอร์โทร
  sheet.setColumnWidth(4, 190); // อีเมล
  sheet.setColumnWidth(5, 200); // เรื่อง
  sheet.setColumnWidth(6, 320); // รายละเอียด
  sheet.setColumnWidth(7, 140); // ช่องทาง
  sheet.setColumnWidth(8, 130); // เวลา
  sheet.setColumnWidth(9, 160); // สถานะ
  sheet.setColumnWidth(10, 200);// บันทึก
  sheet.setColumnWidth(11, 140);// ID
}

/**
 * Webhook รับ POST Request จากเว็บไซต์
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const raw = e.postData.contents;
    const data = JSON.parse(raw);

    // 1. ตรวจสอบรหัสลับ
    if (data.secret !== SECRET) {
      return jsonResponse_({ ok: false, error: 'Unauthorized: SECRET ไม่ตรงกัน' });
    }

    // 2. Health check / Ping
    if (data.action === 'ping') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      return jsonResponse_({
        ok: true,
        message: 'Google Apps Script เชื่อมต่อสมบูรณ์',
        sheet_url: ss.getUrl(),
        tabs: ss.getSheets().map(s => s.getName())
      });
    }

    lock.waitLock(12000); // ป้องกันเขียนทับกันกรณีมี Request เข้ามาพร้อมกัน
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 3. แยกการทำงานตาม action
    if (data.action === 'order' || data.action === 'slip') {
      return handleOrder_(ss, data);
    } else if (data.action === 'review') {
      return handleReview_(ss, data);
    } else if (data.action === 'contact') {
      return handleContact_(ss, data);
    } else {
      return jsonResponse_({ ok: false, error: 'Unknown action: ' + data.action });
    }
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/**
 * จัดการบันทึกหรืออัปเดตออเดอร์
 */
function handleOrder_(ss, data) {
  let sheet = ss.getSheetByName(SHEET_ORDERS);
  if (!sheet) {
    setupOrdersSheet_(ss);
    sheet = ss.getSheetByName(SHEET_ORDERS);
  }

  const orderId = String(data.order_id || '');
  let row = findRowById_(sheet, 17, orderId); // หาในคอลัมน์ 17 (Order ID)

  if (!row) {
    // เพิ่มแถวใหม่
    sheet.appendRow([
      '#' + (data.order_no || '---'),
      data.created_at || Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss'),
      data.customer_name || '',
      "'" + (data.phone || ''),
      data.email || '',
      data.address || '',
      (data.province || '') + ' ' + (data.postal_code || ''),
      data.items_text || '',
      Number(data.items_count || 1),
      Number(data.subtotal || 0),
      Number(data.shipping_fee || 0),
      Number(data.total || 0),
      data.note || '',
      data.status || 'รอชำระเงิน',
      '', // ช่องสลิป
      data.slip_result || '',
      orderId,
    ]);

    row = sheet.getLastRow();

    // เซ็ต Dropdown ให้ช่องสถานะ
    sheet.getRange(row, 14).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(ORDER_STATUSES, true).build()
    );

    // สีพื้นหลังสถานะ
    const color = ORDER_STATUS_COLORS[data.status || 'รอชำระเงิน'];
    if (color) sheet.getRange(row, 14).setBackground(color);

    sheet.getRange(row, 1, 1, HEADERS_ORDERS.length).setVerticalAlignment('top').setWrap(true);

    // แจ้งเตือนอีเมลเมื่อมีออเดอร์ใหม่
    notifyEmail_(
      '🛒 ออเดอร์ใหม่ #' + (data.order_no || '') + ' ยอด ' + Number(data.total || 0).toLocaleString() + ' บาท',
      'มีคำสั่งซื้ออุปกรณ์ออกกำลังกายเข้ามาใหม่!\n\n' +
      'เลขออเดอร์: #' + data.order_no + '\n' +
      'ลูกค้า: ' + data.customer_name + ' (โทร ' + data.phone + ')\n' +
      'ที่อยู่จัดส่ง: ' + data.address + ' ' + (data.province || '') + ' ' + (data.postal_code || '') + '\n\n' +
      'รายการที่สั่ง:\n' + (data.items_text || '') + '\n\n' +
      'ยอดรวม: ' + Number(data.total || 0).toLocaleString() + ' บาท\n' +
      'หมายเหตุ: ' + (data.note || '-') + '\n\n' +
      'ดูข้อมูลใน Google Sheet: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '&range=A' + row
    );
  } else {
    // อัปเดตแถวเดิม
    if (data.status) {
      sheet.getRange(row, 14).setValue(data.status);
      const color = ORDER_STATUS_COLORS[data.status];
      if (color) sheet.getRange(row, 14).setBackground(color);
    }
  }

  // ถ้ามีการแนบสลิป
  if (data.slip_url) {
    sheet.getRange(row, 15).setFormula('=HYPERLINK("' + String(data.slip_url).replace(/"/g, '""') + '","ดูรูปสลิป")');
    if (data.slip_result) {
      sheet.getRange(row, 16).setValue(data.slip_result);
    }

    notifyEmail_(
      '💳 ลูกค้าแนบสลิปโอนเงิน ออเดอร์ #' + (data.order_no || '') + ' (' + (data.customer_name || '') + ')',
      'มีการอัปโหลดสลิปโอนเงินเข้ามา:\n\n' +
      'เลขออเดอร์: #' + data.order_no + '\n' +
      'ลูกค้า: ' + data.customer_name + ' (โทร ' + data.phone + ')\n' +
      'ยอดรวม: ' + Number(data.total || 0).toLocaleString() + ' บาท\n' +
      'สถานะ: ' + (data.status || 'รอตรวจสลิป') + '\n\n' +
      '🔗 ลิงก์ดูสลิป: ' + data.slip_url + '\n\n' +
      'ดูแถวใน Google Sheet: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '&range=A' + row
    );
  }

  return jsonResponse_({ ok: true, action: 'order', row: row });
}

/**
 * จัดการบันทึกรีวิว
 */
function handleReview_(ss, data) {
  let sheet = ss.getSheetByName(SHEET_REVIEWS);
  if (!sheet) {
    setupReviewsSheet_(ss);
    sheet = ss.getSheetByName(SHEET_REVIEWS);
  }

  const rating = Number(data.rating || 5);
  const stars = '⭐'.repeat(Math.max(1, Math.min(5, rating)));

  sheet.appendRow([
    data.created_at || Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss'),
    data.product_name || 'สินค้าทั่วไป',
    data.customer_name || 'ลูกค้า',
    stars,
    rating,
    data.comment || '',
    data.is_approved ? 'แสดงบนเว็บ' : 'ซ่อน/รอตรวจ',
    String(data.review_id || ''),
  ]);

  const row = sheet.getLastRow();
  sheet.getRange(row, 7).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(REVIEW_STATUSES, true).build()
  );
  sheet.getRange(row, 1, 1, HEADERS_REVIEWS.length).setVerticalAlignment('top').setWrap(true);

  notifyEmail_(
    '⭐ มีรีวิวสินค้าใหม่: ' + (data.product_name || '') + ' (' + stars + ')',
    'มีลูกค้ารีวิวสินค้าในเว็บ:\n\n' +
    'สินค้า: ' + data.product_name + '\n' +
    'ลูกค้า: ' + data.customer_name + '\n' +
    'คะแนน: ' + stars + ' (' + rating + '/5)\n' +
    'ความคิดเห็น: ' + data.comment + '\n\n' +
    'ดูและจัดการรีวิวใน Google Sheet: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '&range=A' + row
  );

  return jsonResponse_({ ok: true, action: 'review', row: row });
}

/**
 * จัดการบันทึกข้อมูลติดต่อกลับ / ปรึกษาอุปกรณ์
 */
function handleContact_(ss, data) {
  let sheet = ss.getSheetByName(SHEET_CONTACTS);
  if (!sheet) {
    setupContactsSheet_(ss);
    sheet = ss.getSheetByName(SHEET_CONTACTS);
  }

  sheet.appendRow([
    data.created_at || Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss'),
    data.name || '',
    "'" + (data.phone || ''),
    data.email || '',
    data.subject || 'ขอคำปรึกษาทั่วไป',
    data.message || '',
    data.preferred_channel || 'โทรศัพท์',
    data.preferred_time || 'ตลอดเวลา',
    'รอติดต่อกลับ',
    '', // บันทึกของร้าน
    String(data.inquiry_id || ''),
  ]);

  const row = sheet.getLastRow();

  // ตั้ง Dropdown สำหรับสถานะ
  sheet.getRange(row, 9).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(CONTACT_STATUSES, true).build()
  );
  sheet.getRange(row, 9).setBackground(CONTACT_STATUS_COLORS['รอติดต่อกลับ']);
  sheet.getRange(row, 1, 1, HEADERS_CONTACTS.length).setVerticalAlignment('top').setWrap(true);

  notifyEmail_(
    '📞 มีลูกค้าขอให้ติดต่อกลับ: ' + (data.name || '') + ' (' + (data.subject || 'สอบถามสินค้า') + ')',
    'ลูกค้าส่งแบบฟอร์มขอให้ติดต่อกลับผ่านหน้าเว็บ:\n\n' +
    'ชื่อ: ' + data.name + '\n' +
    'เบอร์โทร: ' + data.phone + '\n' +
    'อีเมล: ' + (data.email || '-') + '\n' +
    'เรื่องที่ติดต่อ: ' + data.subject + '\n' +
    'ช่องทางที่สะดวก: ' + (data.preferred_channel || 'โทรศัพท์') + ' (เวลา: ' + (data.preferred_time || 'ทุกเวลา') + ')\n\n' +
    'ข้อความ/รายละเอียด:\n' + data.message + '\n\n' +
    'เปิดดูใน Google Sheet: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '&range=A' + row
  );

  return jsonResponse_({ ok: true, action: 'contact', row: row });
}

/**
 * ฟังก์ชันช่วยค้นหาแถวจาก ID ในคอลัมน์ที่กำหนด
 */
function findRowById_(sheet, colIndex, targetId) {
  if (!targetId) return 0;
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;
  const values = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(targetId).trim()) {
      return i + 2; // แถวจริงใน sheet (เริ่มที่แถว 2 หลังหัวตาราง)
    }
  }
  return 0;
}

/**
 * ส่งอีเมลแจ้งเตือน
 */
function notifyEmail_(subject, body) {
  const email = NOTIFY_EMAIL.trim();
  if (!email || email.toLowerCase() === 'off') return;
  try {
    MailApp.sendEmail({
      to: email,
      subject: '[IRONPULSE FIT] ' + subject,
      body: body,
    });
  } catch (err) {
    Logger.log('ส่งอีเมลไม่สำเร็จ: ' + err);
  }
}

/**
 * Response JSON กลับไปยังเว็บ
 */
function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
