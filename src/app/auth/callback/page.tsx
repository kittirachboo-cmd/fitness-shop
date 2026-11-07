'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('กำลังยืนยันการเข้าสู่ระบบด้วย Google...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Callback error:', error);
          } else if (data.session) {
            setStatus('เข้าสู่ระบบสำเร็จ กำลังนำท่านกลับสู่หน้าหลัก...');
          }
        }
      } catch (e) {
        console.warn('Error handling callback:', e);
      } finally {
        setTimeout(() => {
          router.push('/');
        }, 800);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <RefreshCw className="w-7 h-7 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-white">ยืนยันตัวตน Google Account</h2>
        <p className="text-sm text-slate-400">{status}</p>
      </div>
    </div>
  );
}
