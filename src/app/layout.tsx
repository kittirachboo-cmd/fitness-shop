import type { Metadata } from 'next';
import { Prompt, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LoginPromptModal } from '@/components/login-prompt-modal';

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-prompt',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IRONPULSE FITNESS | ร้านขายอุปกรณ์ออกกำลังกาย Home Gym & Commercial',
  description:
    'ผู้นำเข้าและจำหน่ายอุปกรณ์ออกกำลังกาย ดัมเบลปรับน้ำหนัก บาร์เบลโอลิมปิก ลู่วิ่งไฟฟ้า ม้านั่งยกน้ำหนัก อุปกรณ์เสริมสร้างกล้ามเนื้อ ส่งด่วนทั่วไทย รับประกันศูนย์',
  keywords: [
    'อุปกรณ์ออกกำลังกาย',
    'ดัมเบลปรับน้ำหนัก',
    'บาร์เบล',
    'ลู่วิ่งไฟฟ้า',
    'ม้านั่งยกน้ำหนัก',
    'Home Gym',
    'ฟิตเนส',
    'ออกกำลังกายที่บ้าน',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <LoginPromptModal />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
