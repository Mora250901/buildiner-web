'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

interface Distrito {
    id: number;
    nombre: string;
}

export default function NuevaConstruccionPage() {
    const router = useRouter();
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        distrito_id: '',
        direccion: '',
        latitud: '',
        longitud: '',
        propietario: '',
        ingeniero_responsable: '',
        numero_pisos: '1',
        estado: 'en_planos',
        tiene_licencia: false,
        numero_licencia: '',
        fecha_inicio: '',
        fecha_estimada_fin: '',
        avance_porcentaje: '0',
        observaciones: '',
    });

    useEffect(() => {
        api.get('/distritos').then(({ data }) => setDistritos(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.post('/construcciones', form);
            router.push('/dashboard/construcciones');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-3xl">

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
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Nueva construcción</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Registra una nueva obra en el sistema</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Ubicación */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h2 className="font-black text-gray-900">📍 Ubicación</h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Distrito *</label>
                            <select
                                required
                                value={form.distrito_id}
                                onChange={(e) => setForm({ ...form, distrito_id: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            >
                                <option value="">Selecciona un distrito</option>
                                {distritos.map((d) => (
                                    <option key={d.id} value={d.id}>{d.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dirección *</label>
                            <input
                                type="text" required
                                value={form.direccion}
                                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                                placeholder="Ej: Av. Larco 123"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Latitud</label>
                                <input
                                    type="number" step="any"
                                    value={form.latitud}
                                    onChange={(e) => setForm({ ...form, latitud: e.target.value })}
                                    placeholder="-12.1191"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Longitud</label>
                                <input
                                    type="number" step="any"
                                    value={form.longitud}
                                    onChange={(e) => setForm({ ...form, longitud: e.target.value })}
                                    placeholder="-77.0290"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Datos de la obra */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h2 className="font-black text-gray-900">🏗️ Datos de la obra</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Propietario</label>
                                <input
                                    type="text"
                                    value={form.propietario}
                                    onChange={(e) => setForm({ ...form, propietario: e.target.value })}
                                    placeholder="Nombre del propietario"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ingeniero responsable</label>
                                <input
                                    type="text"
                                    value={form.ingeniero_responsable}
                                    onChange={(e) => setForm({ ...form, ingeniero_responsable: e.target.value })}
                                    placeholder="Nombre del ingeniero"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">N° de pisos</label>
                                <input
                                    type="number" min="1"
                                    value={form.numero_pisos}
                                    onChange={(e) => setForm({ ...form, numero_pisos: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
                                <select
                                    value={form.estado}
                                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    {['en_planos','cimientos','estructura','albañileria','acabados','culminada','paralizada'].map((e) => (
                                        <option key={e} value={e}>{e.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Avance %</label>
                                <input
                                    type="number" min="0" max="100"
                                    value={form.avance_porcentaje}
                                    onChange={(e) => setForm({ ...form, avance_porcentaje: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha inicio</label>
                                <input
                                    type="date"
                                    value={form.fecha_inicio}
                                    onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha estimada de fin</label>
                                <input
                                    type="date"
                                    value={form.fecha_estimada_fin}
                                    onChange={(e) => setForm({ ...form, fecha_estimada_fin: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Observaciones</label>
                            <textarea
                                rows={3}
                                value={form.observaciones}
                                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                                placeholder="Observaciones adicionales..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                            />
                        </div>
                    </div>

                    {/* Licencia */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h2 className="font-black text-gray-900">📄 Licencia</h2>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.tiene_licencia}
                                onChange={(e) => setForm({ ...form, tiene_licencia: e.target.checked })}
                                className="w-4 h-4 accent-blue-600"
                            />
                            <span className="text-sm font-semibold text-gray-700">Tiene licencia de construcción</span>
                        </label>

                        {form.tiene_licencia && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Número de licencia</label>
                                <input
                                    type="text"
                                    value={form.numero_licencia}
                                    onChange={(e) => setForm({ ...form, numero_licencia: e.target.value })}
                                    placeholder="Ej: LC-2024-001"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <button
                            type="submit" disabled={saving}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : 'Guardar construcción'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}