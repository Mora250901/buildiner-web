'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

interface Construccion {
    id: number;
    direccion: string;
    estado: string;
    avance_porcentaje: number;
    tiene_licencia: boolean;
    numero_pisos: number;
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

export default function ConstruccionesPage() {
    const [construcciones, setConstrucciones] = useState<Construccion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/construcciones')
            .then(({ data }) => setConstrucciones(data.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Construcciones</h1>
                        <p className="text-gray-500 mt-1">Listado de obras registradas</p>
                    </div>
                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all">
                        + Nueva construcción
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando...</div>
                ) : construcciones.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                        <p className="text-4xl mb-3">🏗️</p>
                        <p className="text-gray-400 font-medium">No hay construcciones registradas aún</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Distrito</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Avance</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Licencia</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Pisos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {construcciones.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400">#{c.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{c.direccion}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.distrito?.nombre}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${estadoColors[c.estado]}`}>
                                                {c.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${c.avance_porcentaje}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">{c.avance_porcentaje}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${c.tiene_licencia ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {c.tiene_licencia ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{c.numero_pisos}</td>
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