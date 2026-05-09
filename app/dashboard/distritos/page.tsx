'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

interface Distrito {
    id: number;
    nombre: string;
    provincia: string;
    departamento: string;
    latitud: string;
    longitud: string;
    activo: boolean;
}

export default function DistritosPage() {
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        nombre: '', provincia: 'Lima', departamento: 'Lima',
        latitud: '', longitud: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchDistritos = () => {
        api.get('/distritos')
            .then(({ data }) => setDistritos(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchDistritos(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.post('/distritos', form);
            setShowForm(false);
            setForm({ nombre: '', provincia: 'Lima', departamento: 'Lima', latitud: '', longitud: '' });
            fetchDistritos();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Distritos</h1>
                        <p className="text-gray-500 mt-1">Gestión de distritos monitoreados</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
                    >
                        {showForm ? 'Cancelar' : '+ Nuevo distrito'}
                    </button>
                </div>

                {/* Formulario */}
                {showForm && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                        <h2 className="font-black text-gray-900 mb-5">Nuevo distrito</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre *</label>
                                <input
                                    type="text" required
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    placeholder="Ej: San Isidro"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Provincia</label>
                                <input
                                    type="text"
                                    value={form.provincia}
                                    onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Departamento</label>
                                <input
                                    type="text"
                                    value={form.departamento}
                                    onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Latitud</label>
                                <input
                                    type="number" step="any"
                                    value={form.latitud}
                                    onChange={(e) => setForm({ ...form, latitud: e.target.value })}
                                    placeholder="-12.0464"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Longitud</label>
                                <input
                                    type="number" step="any"
                                    value={form.longitud}
                                    onChange={(e) => setForm({ ...form, longitud: e.target.value })}
                                    placeholder="-77.0428"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button
                                    type="submit" disabled={saving}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : 'Guardar distrito'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabla */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando...</div>
                ) : distritos.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                        <p className="text-4xl mb-3">📍</p>
                        <p className="text-gray-400 font-medium">No hay distritos registrados aún</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Provincia</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Departamento</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Coordenadas</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {distritos.map((d) => (
                                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{d.nombre}</td>
                                        <td className="px-6 py-4 text-gray-500">{d.provincia}</td>
                                        <td className="px-6 py-4 text-gray-500">{d.departamento}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                                            {d.latitud}, {d.longitud}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${d.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {d.activo ? 'Activo' : 'Inactivo'}
                                            </span>
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