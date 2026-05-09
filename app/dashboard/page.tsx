'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900">
                        Bienvenido, {user?.name} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Resumen general del sistema de monitoreo
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[
                        { label: 'Construcciones', valor: '0', color: 'bg-blue-500', icon: '🏗️' },
                        { label: 'Inspecciones', valor: '0', color: 'bg-green-500', icon: '📋' },
                        { label: 'Distritos', valor: '1', color: 'bg-purple-500', icon: '📍' },
                        { label: 'Sin licencia', valor: '0', color: 'bg-red-500', icon: '⚠️' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl">{stat.icon}</span>
                                <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                            </div>
                            <p className="text-3xl font-black text-gray-900">{stat.valor}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Placeholder mapa */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-lg font-black text-gray-900 mb-4">Mapa de construcciones</h2>
                    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                        <p className="text-gray-400 font-medium">🗺️ Mapa próximamente</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}