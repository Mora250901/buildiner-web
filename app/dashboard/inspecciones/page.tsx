'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

interface Inspeccion {
    id: number;
    fecha_inspeccion: string;
    estado_encontrado: string;
    avance_porcentaje: number;
    descripcion: string;
    construccion: {
        id: number;
        direccion: string;
        distrito: { nombre: string };
    };
    inspector: {
        id: number;
        name: string;
    };
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

export default function InspeccionesPage() {
    const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/inspecciones')
            .then(({ data }) => setInspecciones(data.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Inspecciones</h1>
                        <p className="text-gray-500 mt-1">Historial de inspecciones realizadas</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando...</div>
                ) : inspecciones.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                        <p className="text-4xl mb-3">📋</p>
                        <p className="text-gray-400 font-medium">No hay inspecciones registradas aún</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Construcción</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Distrito</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Avance</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Inspector</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {inspecciones.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400">#{i.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {i.construccion?.direccion}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {i.construccion?.distrito?.nombre}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${estadoColors[i.estado_encontrado]}`}>
                                                {i.estado_encontrado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${i.avance_porcentaje}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">{i.avance_porcentaje}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{i.inspector?.name}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(i.fecha_inspeccion).toLocaleDateString('es-PE')}
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