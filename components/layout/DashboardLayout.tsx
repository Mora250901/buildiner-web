'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}