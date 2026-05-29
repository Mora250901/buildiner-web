'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

const MapaConstrucciones = dynamic(
    () => import('@/components/map/MapaConstrucciones'),
    { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-gray-400">Cargando mapa...</div> }
);

interface Construccion {
    id: number;
    direccion: string;
    estado: string;
    avance_porcentaje: number;
    latitud: string;
    longitud: string;
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

export default function MapaPage() {
    const router = useRouter();
    const [construcciones, setConstrucciones] = useState<Construccion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/construcciones?per_page=100')
            .then(({ data }) => setConstrucciones(data.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-gray-900">Mapa</h1>
                    <p className="text-gray-500 mt-1">Ubicación de construcciones registradas</p>
                </div>

                {/* Leyenda */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries({
                        en_planos: '#6b7280',
                        cimientos: '#d97706',
                        estructura: '#3b82f6',
                        albañileria: '#f97316',
                        acabados: '#8b5cf6',
                        culminada: '#22c55e',
                        paralizada: '#ef4444',
                    }).map(([estado, color]) => (
                        <div key={estado} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-lg">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                            <span className="text-xs font-medium text-gray-600">{estado.replace('_', ' ')}</span>
                        </div>
                    ))}
                </div>

                {/* Mapa */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: '550px' }}>
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Cargando construcciones...
                        </div>
                    ) : (
                        <MapaConstrucciones
                            construcciones={construcciones}
                            onSelect={(id) => router.push(`/dashboard/construcciones/${id}`)}
                        />
                    )}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                    Solo se muestran construcciones con coordenadas registradas. Total: {construcciones.filter(c => c.latitud && c.longitud).length} de {construcciones.length}
                </p>
            </div>
        </DashboardLayout>
    );
}