'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function RegistroPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/registro', form);
            // Login automático después del registro
            const { data } = await api.post('/login', {
                email: form.email,
                password: form.password,
            });
            setAuth(data.user, data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
                        </svg>
                    </div>
                    <span className="text-white font-black text-2xl">Buildiner</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h1 className="text-2xl font-black text-white mb-1">Crear cuenta</h1>
                    <p className="text-gray-400 text-sm mb-6">Completa los datos para registrarte</p>

                    {error && (
                        <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Nombre completo *</label>
                            <input
                                type="text" required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Tu nombre"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Correo electrónico *</label>
                            <input
                                type="email" required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="tucorreo@empresa.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Contraseña *</label>
                            <input
                                type="password" required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Mínimo 8 caracteres"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Confirmar contraseña *</label>
                            <input
                                type="password" required
                                value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                placeholder="Repite tu contraseña"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/login" className="text-blue-400 hover:underline font-medium">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}