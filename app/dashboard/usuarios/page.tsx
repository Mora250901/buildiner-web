'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

interface Usuario {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
    created_at: string;
}

const rolColors: Record<string, string> = {
    admin:      'bg-purple-100 text-purple-700',
    inspector:  'bg-blue-100 text-blue-700',
    suscriptor: 'bg-green-100 text-green-700',
};

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/usuarios')
            .then(({ data }) => setUsuarios(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Usuarios</h1>
                        <p className="text-gray-500 mt-1">Gestión de usuarios del sistema</p>
                    </div>
                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all">
                        + Nuevo usuario
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando...</div>
                ) : usuarios.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                        <p className="text-4xl mb-3">👥</p>
                        <p className="text-gray-400 font-medium">No hay usuarios registrados aún</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Registro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {usuarios.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400">#{u.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-black">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-900">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${rolColors[u.roles[0]?.name] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {u.roles[0]?.name ?? 'sin rol'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(u.created_at).toLocaleDateString('es-PE')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}