'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

interface Metricas {
    total_construcciones: number;
    sin_licencia: number;
    culminadas: number;
    paralizadas: number;
    total_inspecciones: number;
    total_distritos: number;
    total_usuarios: number;
    por_estado: Record<string, number>;
    recientes: {
        id: number;
        direccion: string;
        estado: string;
        avance_porcentaje: number;
        distrito: { nombre: string };
    }[];
}

const estadoColors: Record<string, string> = {
    en_planos:   'bg-gray-100 text-gray-600',
    cimientos:   'bg-yellow-100 text-yellow-700',
    estructura:  'bg-blue-100 text-blue-700',
    albañileria: 'bg-orange-100 text-orange-700',
    acabados:    'bg-purple-100 text-purple-700',
    culminada:   'bg-green-100 text-green-700',
    paralizada:  'bg-red-100 text-red-700',
};

export default function DashboardPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [metricas, setMetricas] = useState<Metricas | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/metricas')
            .then(({ data }) => setMetricas(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900">
                        Bienvenido, {user?.name} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Resumen general del sistema de monitoreo</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando métricas...</div>
                ) : metricas && (
                    <>
                        {/* Stats principales */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                            {[
                                { label: 'Construcciones', valor: metricas.total_construcciones, icon: '🏗️', color: 'bg-blue-500' },
                                { label: 'Inspecciones', valor: metricas.total_inspecciones, icon: '📋', color: 'bg-green-500' },
                                { label: 'Sin licencia', valor: metricas.sin_licencia, icon: '⚠️', color: 'bg-red-500' },
                                { label: 'Paralizadas', valor: metricas.paralizadas, icon: '🚫', color: 'bg-orange-500' },
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Por estado */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h2 className="font-black text-gray-900 mb-5">📊 Construcciones por estado</h2>
                                {Object.keys(metricas.por_estado).length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
                                ) : (
                                    <div className="space-y-3">
                                        {Object.entries(metricas.por_estado).map(([estado, total]) => (
                                            <div key={estado} className="flex items-center gap-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold w-28 text-center ${estadoColors[estado]}`}>
                                                    {estado.replace('_', ' ')}
                                                </span>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${(total / metricas.total_construcciones) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-gray-700 w-6 text-right">{total}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Construcciones recientes */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-black text-gray-900">🏗️ Recientes</h2>
                                    <button
                                        onClick={() => router.push('/dashboard/construcciones')}
                                        className="text-xs text-blue-600 font-semibold hover:underline"
                                    >
                                        Ver todas →
                                    </button>
                                </div>
                                {metricas.recientes.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-8">Sin construcciones aún</p>
                                ) : (
                                    <div className="space-y-3">
                                        {metricas.recientes.map((c) => (
                                            <div
                                                key={c.id}
                                                onClick={() => router.push(`/dashboard/construcciones/${c.id}`)}
                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{c.direccion}</p>
                                                    <p className="text-xs text-gray-400">{c.distrito?.nombre}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${estadoColors[c.estado]}`}>
                                                        {c.estado?.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs font-bold text-blue-600">{c.avance_porcentaje}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}