'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

export default function NuevaInspeccionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const construccionId = searchParams.get('construccion_id');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [form, setForm] = useState({
        construccion_id: construccionId || '',
        fecha_inspeccion: new Date().toISOString().split('T')[0],
        estado_encontrado: 'en_planos',
        avance_porcentaje: '0',
        descripcion: '',
        observaciones: '',
    });

    const handleImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImagenes(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Crear inspección
            const { data: inspeccion } = await api.post('/inspecciones', form);

            // Subir evidencias si hay imágenes
            if (imagenes.length > 0) {
                for (const imagen of imagenes) {
                    const formData = new FormData();
                    formData.append('inspeccion_id', inspeccion.id.toString());
                    formData.append('imagen', imagen);
                    await api.post('/evidencias', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }

            // Redirigir al detalle de la construcción
            if (construccionId) {
                router.push(`/dashboard/construcciones/${construccionId}`);
            } else {
                router.push('/dashboard/inspecciones');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-2xl">

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
                        <h1 className="text-2xl font-black text-gray-900">Nueva inspección</h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            {construccionId ? `Construcción #${construccionId}` : 'Registra una nueva inspección'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h2 className="font-black text-gray-900">📋 Datos de la inspección</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha *</label>
                                <input
                                    type="date" required
                                    value={form.fecha_inspeccion}
                                    onChange={(e) => setForm({ ...form, fecha_inspeccion: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
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

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado encontrado *</label>
                            <select
                                required
                                value={form.estado_encontrado}
                                onChange={(e) => setForm({ ...form, estado_encontrado: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            >
                                {['en_planos','cimientos','estructura','albañileria','acabados','culminada','paralizada'].map((e) => (
                                    <option key={e} value={e}>{e.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
                            <textarea
                                rows={3}
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                placeholder="Describe lo que encontraste..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Observaciones</label>
                            <textarea
                                rows={2}
                                value={form.observaciones}
                                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                                placeholder="Observaciones adicionales..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                            />
                        </div>
                    </div>

                    {/* Evidencias */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h2 className="font-black text-gray-900">📸 Evidencias fotográficas</h2>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagenes}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                        {imagenes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {imagenes.map((img, i) => (
                                    <div key={i} className="relative">
                                        <img
                                            src={URL.createObjectURL(img)}
                                            className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                                            alt={`preview ${i}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-400">Puedes subir múltiples fotos. JPG, PNG o WebP.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit" disabled={saving}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : 'Guardar inspección'}
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