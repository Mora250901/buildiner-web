'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

interface Construccion {
    id: number;
    direccion: string;
    estado: string;
    avance_porcentaje: number;
    tiene_licencia: boolean;
    numero_licencia: string;
    numero_pisos: number;
    propietario: string;
    ingeniero_responsable: string;
    fecha_inicio: string;
    fecha_estimada_fin: string;
    observaciones: string;
    distrito: { nombre: string };
    inspecciones: {
        id: number;
        fecha_inspeccion: string;
        estado_encontrado: string;
        avance_porcentaje: number;
        descripcion: string;
        inspector: { name: string };
        evidencias: { id: number; imagen: string }[];
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

export default function DetalleConstruccionPage() {
    const { id } = useParams();
    const router = useRouter();
    const [construccion, setConstruccion] = useState<Construccion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/construcciones/${id}`)
            .then(({ data }) => setConstruccion(data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <DashboardLayout>
            <div className="p-8 text-center text-gray-400">Cargando...</div>
        </DashboardLayout>
    );

    if (!construccion) return (
        <DashboardLayout>
            <div className="p-8 text-center text-gray-400">Construcción no encontrada.</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="p-8 max-w-4xl">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-black text-gray-900">{construccion.direccion}</h1>
                        <p className="text-gray-500 text-sm mt-0.5">{construccion.distrito?.nombre}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-bold ${estadoColors[construccion.estado]}`}>
                        {construccion.estado?.replace('_', ' ') ?? '—'}
                    </span>
                </div>

                {/* Info general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="font-black text-gray-900 mb-4">📋 Información general</h2>
                        <dl className="space-y-3 text-sm">
                            {[
                                { label: 'Propietario', value: construccion.propietario || '—' },
                                { label: 'Ingeniero', value: construccion.ingeniero_responsable || '—' },
                                { label: 'N° de pisos', value: construccion.numero_pisos },
                                { label: 'Fecha inicio', value: construccion.fecha_inicio || '—' },
                                { label: 'Fecha est. fin', value: construccion.fecha_estimada_fin || '—' },
                                { label: 'Licencia', value: construccion.tiene_licencia ? construccion.numero_licencia || 'Sí' : 'No' },
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between">
                                    <dt className="text-gray-500 font-medium">{item.label}</dt>
                                    <dd className="text-gray-900 font-semibold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="font-black text-gray-900 mb-4">📊 Avance</h2>
                        <div className="flex items-center justify-center h-32">
                            <div className="text-center">
                                <p className="text-6xl font-black text-blue-600">{construccion.avance_porcentaje}%</p>
                                <p className="text-gray-400 text-sm mt-2">Avance total</p>
                                <div className="w-48 h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all"
                                        style={{ width: `${construccion.avance_porcentaje}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        {construccion.observaciones && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Observaciones</p>
                                <p className="text-sm text-gray-700">{construccion.observaciones}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Historial de inspecciones */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-black text-gray-900">🔍 Historial de inspecciones</h2>
                        <button
                            onClick={() => router.push(`/dashboard/inspecciones/nueva?construccion_id=${construccion.id}`)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
                        >
                            + Nueva inspección
                        </button>
                    </div>

                    {construccion.inspecciones.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-3xl mb-2">📋</p>
                            <p className="font-medium">No hay inspecciones registradas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {construccion.inspecciones.map((insp) => (
                                <div key={insp.id} className="border border-gray-100 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${estadoColors[insp.estado_encontrado]}`}>
                                                {insp.estado_encontrado.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(insp.fecha_inspeccion).toLocaleDateString('es-PE')}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-blue-600">{insp.avance_porcentaje}%</span>
                                    </div>
                                    {insp.descripcion && (
                                        <p className="text-sm text-gray-600 mt-1">{insp.descripcion}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">Inspector: {insp.inspector?.name}</p>
                                    {insp.evidencias.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {insp.evidencias.map((ev) => (
                                                <img
                                                    key={ev.id}
                                                    src={`http://127.0.0.1:8000/storage/${ev.imagen}`}
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                    alt="evidencia"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}