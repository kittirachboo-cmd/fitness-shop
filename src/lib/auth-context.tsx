'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
  dismissPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROMPT_DISMISSED_KEY = 'ironfit_login_prompt_dismissed_v1';
const DEMO_USER_KEY = 'ironfit_demo_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // 1. ตรวจสอบว่าเคยเข้าสู่ระบบผ่าน Supabase ไว้หรือไม่
    const checkSession = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'ลูกค้า',
              avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              provider: 'google',
            });
            setIsLoading(false);
            return;
          }

          // ฟัง Event การเปลี่ยนแปลง Auth state
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (currentSession?.user) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'ลูกค้า',
                avatarUrl: currentSession.user.user_metadata?.avatar_url || currentSession.user.user_metadata?.picture,
                provider: 'google',
              });
            } else {
              // ถ้าไม่ได้ล็อกอินใน Supabase ให้เช็ค Demo User
              const savedDemo = localStorage.getItem(DEMO_USER_KEY);
              if (savedDemo) {
                try {
                  setUser(JSON.parse(savedDemo));
                } catch {
                  setUser(null);
                }
              } else {
                setUser(null);
              }
            }
          });

          // ถ้าไม่มี session ให้เช็ค demo user
          const savedDemo = localStorage.getItem(DEMO_USER_KEY);
          if (savedDemo) {
            try {
              setUser(JSON.parse(savedDemo));
            } catch {
              setUser(null);
            }
          }
        } else {
          // ถ้ายังไม่ได้ต่อ Supabase เช็ค local demo user
          const savedDemo = localStorage.getItem(DEMO_USER_KEY);
          if (savedDemo) {
            try {
              setUser(JSON.parse(savedDemo));
            } catch {
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.warn('Error loading auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // ย้ำลูกค้าตั้งแต่เข้าเว็บครั้งแรกถ้ายังไม่ได้เข้าสู่ระบบ
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      const dismissed = sessionStorage.getItem(PROMPT_DISMISSED_KEY);
      if (!dismissed) {
        // ดีเลย์เล็กน้อยเพื่อให้เว็บเรนเดอร์สวยงามก่อนแสดง Popup ย้ำเตือน
        const timer = setTimeout(() => {
          setShowLoginPrompt(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } else {
      setShowLoginPrompt(false);
    }
  }, [user, isLoading]);

  const signInWithGoogle = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          console.warn('Supabase OAuth error, offering fallback demo login:', error.message);
          // กรณีใน Supabase Dashboard ยังไม่ได้เปิด Provider "Google" (Client ID/Secret)
          // ให้ใช้ Simulated Google Login เพื่อให้ทดสอบระบบสั่งซื้อและเชื่อมต่อได้ทันที
          const demoUser: AuthUser = {
            id: `google-user-${Date.now()}`,
            email: 'customer.fitness@gmail.com',
            name: 'คุณลูกค้า (Google Account)',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            provider: 'google',
          };
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
          setUser(demoUser);
          setShowLoginPrompt(false);
          alert('เข้าสู่ระบบสำเร็จ! (หมายเหตุ: หากต้องการใช้ Google Login จริง อย่าลืมเปิด Provider "Google" ใน Supabase Dashboard -> Authentication -> Providers)');
        }
      } else {
        // Fallback Demo Google Account
        const demoUser: AuthUser = {
          id: `google-user-${Date.now()}`,
          email: 'customer.fitness@gmail.com',
          name: 'คุณลูกค้า (Google Account)',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          provider: 'google',
        };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        setShowLoginPrompt(false);
      }
    } catch (err) {
      console.error('Failed to sign in with Google:', err);
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      localStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
    }
  };

  const dismissPrompt = () => {
    sessionStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
    setShowLoginPrompt(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signOut,
        showLoginPrompt,
        setShowLoginPrompt,
        dismissPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
