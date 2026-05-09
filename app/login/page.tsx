'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/login', { email, password });
            setAuth(data.user, data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Credenciales incorrectas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* Panel izquierdo */}
            <div className="hidden md:flex w-1/2 flex-col justify-between p-12 bg-[#1a1f2e]">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
                            </svg>
                        </div>
                        <span className="text-white font-black text-2xl tracking-tight">Buildiner</span>
                    </div>
                    <p className="text-gray-400 text-sm">Plataforma de monitoreo de construcciones</p>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl font-black text-white leading-tight">
                        Monitorea construcciones<br />
                        <span className="text-blue-400">en tiempo real</span>
                    </h1>
                    <p className="text-gray-400 leading-relaxed">
                        Accede a datos actualizados sobre el estado de construcciones, inspecciones y avances por distrito en Lima.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { valor: '500+', label: 'Construcciones' },
                        { valor: '43', label: 'Distritos' },
                        { valor: '98%', label: 'Precisión' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                            <p className="text-2xl font-black text-white">{stat.valor}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel derecho */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="md:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
                            </svg>
                        </div>
                        <span className="font-black text-xl text-gray-900">Buildiner</span>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-1">Bienvenido</h2>
                    <p className="text-sm text-gray-500 mb-8">Ingresa tus credenciales para continuar</p>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@buildiner.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}