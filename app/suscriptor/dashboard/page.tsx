'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

interface Suscripcion {
    plan: string;
    estado: string;
    fecha_fin: string;
}

interface Construccion {
    id: number;
    direccion: string;
    estado: string;
    avance_porcentaje: number;
    distrito: { nombre: string };
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

const planColors: Record<string, string> = {
    standard: 'bg-gray-100 text-gray-700',
    pro:      'bg-blue-100 text-blue-700',
    premium:  'bg-purple-100 text-purple-700',
};

export default function SuscriptorDashboard() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
    const [construcciones, setConstrucciones] = useState<Construccion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/mi-suscripcion'),
            api.get('/construcciones'),
        ]).then(([s, c]) => {
            setSuscripcion(s.data);
            setConstrucciones(c.data.data);
        }).finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
                            </svg>
                        </div>
                        <span className="font-black text-gray-900 text-lg">Buildiner</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {suscripcion && (
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${planColors[suscripcion.plan]}`}>
                                Plan {suscripcion.plan}
                            </span>
                        )}
                        <span className="text-sm text-gray-500">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Sin suscripción */}
                {!loading && !suscripcion && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
                        <div>
                            <p className="font-black text-yellow-800">No tienes una suscripción activa</p>
                            <p className="text-yellow-600 text-sm mt-0.5">Adquiere un plan para acceder a toda la información</p>
                        </div>
                        <a
                            href="https://wa.me/51999999999?text=Hola, quiero adquirir un plan de Buildiner"
                            target="_blank"
                            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-all text-sm"
                        >
                            Ver planes
                        </a>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900">
                        Bienvenido, {user?.name} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {suscripcion
                            ? `Plan ${suscripcion.plan} — activo hasta ${new Date(suscripcion.fecha_fin).toLocaleDateString('es-PE')}`
                            : 'Sin suscripción activa'}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando...</div>
                ) : (
                    <>
                        {/* Construcciones */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-black text-gray-900">🏗️ Construcciones</h2>
                                <span className="text-xs text-gray-400">{construcciones.length} registros</span>
                            </div>

                            {construcciones.length === 0 ? (
                                <div className="py-16 text-center text-gray-400">
                                    <p className="text-3xl mb-2">🏗️</p>
                                    <p>No hay construcciones disponibles</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección</th>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Distrito</th>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Avance</th>
                                            {/* Solo Pro y Premium ven el detalle */}
                                            {suscripcion && ['pro', 'premium'].includes(suscripcion.plan) && (
                                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Detalle</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {construcciones.map((c) => (
                                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-900">{c.direccion}</td>
                                                <td className="px-6 py-4 text-gray-500">{c.distrito?.nombre}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${estadoColors[c.estado]}`}>
                                                        {c.estado?.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.avance_porcentaje}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-500">{c.avance_porcentaje}%</span>
                                                    </div>
                                                </td>
                                                {suscripcion && ['pro', 'premium'].includes(suscripcion.plan) && (
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => router.push(`/suscriptor/construccion/${c.id}`)}
                                                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            Ver más
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Mapa solo Pro y Premium */}
                        {suscripcion && ['pro', 'premium'].includes(suscripcion.plan) && (
                            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-black text-gray-900">🗺️ Mapa</h2>
                                </div>
                                <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <button
                                        onClick={() => router.push('/suscriptor/mapa')}
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                                    >
                                        Abrir mapa interactivo
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bloqueo Standard */}
                        {(!suscripcion || suscripcion.plan === 'standard') && (
                            <div className="mt-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
                                <p className="text-2xl mb-2">🚀</p>
                                <h3 className="text-white font-black text-lg mb-2">Desbloquea más funciones</h3>
                                <p className="text-white/70 text-sm mb-4">Accede al mapa interactivo, datos históricos y más con el plan Pro o Premium</p>
                                <a
                                    href="https://wa.me/51999999999?text=Hola, quiero mejorar mi plan de Buildiner"
                                    target="_blank"
                                    className="inline-block px-6 py-2.5 bg-white text-blue-600 font-bold rounded-xl hover:scale-105 transition-all text-sm"
                                >
                                    Mejorar plan
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}