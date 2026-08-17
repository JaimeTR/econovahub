'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-soft/20 to-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
