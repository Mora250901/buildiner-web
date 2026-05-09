'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                    Bienvenido, {user?.name}
                </h1>
                <p className="text-gray-500 mb-6">Rol: {user?.rol}</p>
                <button
                    onClick={() => { logout(); router.push('/login'); }}
                    className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}