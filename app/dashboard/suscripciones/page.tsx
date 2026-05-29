'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/axios';

interface Suscripcion {
    id: number;
    plan: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
    monto: number;
    metodo_pago: string;
    user: { id: number; name: string; email: string };
}

interface Usuario {
    id: number;
    name: string;
    email: string;
}

const planColors: Record<string, string> = {
    standard: 'bg-gray-100 text-gray-700',
    pro:      'bg-blue-100 text-blue-700',
    premium:  'bg-purple-100 text-purple-700',
};

const estadoColors: Record<string, string> = {
    activa:    'bg-green-100 text-green-700',
    vencida:   'bg-yellow-100 text-yellow-700',
    cancelada: 'bg-red-100 text-red-700',
};

const planes = [
    { key: 'standard', label: 'Standard', precio: 49, features: ['Dashboard básico', 'Ver construcciones', 'Acceso limitado'] },
    { key: 'pro',      label: 'Pro',      precio: 99, features: ['Todo Standard', 'Datos históricos', 'Exportar Excel/PDF', 'Filtros avanzados'] },
    { key: 'premium',  label: 'Premium',  precio: 199, features: ['Todo Pro', 'Acceso API', 'Reportes automáticos', 'Alertas IA'] },
];

export default function SuscripcionesPage() {
    const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        user_id: '',
        plan: 'standard',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
        monto: '',
        metodo_pago: '',
    });

    const fetchData = () => {
        Promise.all([
            api.get('/suscripciones'),
            api.get('/usuarios'),
        ]).then(([s, u]) => {
            setSuscripciones(s.data);
            setUsuarios(u.data);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.post('/suscripciones', form);
            setShowForm(false);
            setForm({ user_id: '', plan: 'standard', fecha_inicio: new Date().toISOString().split('T')[0], fecha_fin: '', monto: '', metodo_pago: '' });
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    const cancelar = async (id: number) => {
        if (!confirm('¿Cancelar esta suscripción?')) return;
        await api.patch(`/suscripciones/${id}/cancelar`);
        fetchData();
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Suscripciones</h1>
                        <p className="text-gray-500 mt-1">Gestión de planes y accesos</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
                    >
                        {showForm ? 'Cancelar' : '+ Nueva suscripción'}
                    </button>
                </div>

                {/* Planes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {planes.map((plan) => (
                        <div key={plan.key} className={`bg-white rounded-2xl border p-6 ${plan.key === 'premium' ? 'border-purple-200' : 'border-gray-100'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${planColors[plan.key]}`}>
                                    {plan.label}
                                </span>
                                <span className="text-2xl font-black text-gray-900">S/ {plan.precio}<span className="text-sm text-gray-400 font-normal">/mes</span></span>
                            </div>
                            <ul className="space-y-2">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="text-green-500">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Formulario */}
                {showForm && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                        <h2 className="font-black text-gray-900 mb-5">Asignar suscripción</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
                        )}
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Usuario *</label>
                                <select
                                    required
                                    value={form.user_id}
                                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    <option value="">Selecciona un usuario</option>
                                    {usuarios.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Plan *</label>
                                <select
                                    value={form.plan}
                                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    <option value="standard">Standard — S/ 49/mes</option>
                                    <option value="pro">Pro — S/ 99/mes</option>
                                    <option value="premium">Premium — S/ 199/mes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monto cobrado (S/) *</label>
                                <input
                                    type="number" step="0.01" required
                                    value={form.monto}
                                    onChange={(e) => setForm({ ...form, monto: e.target.value })}
                                    placeholder="49.00"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha inicio *</label>
                                <input
                                    type="date" required
                                    value={form.fecha_inicio}
                                    onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha fin *</label>
                                <input
                                    type="date" required
                                    value={form.fecha_fin}
                                    onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Método de pago</label>
                                <input
                                    type="text"
                                    value={form.metodo_pago}
                                    onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
                                    placeholder="Transferencia, Yape, etc."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button
                                    type="submit" disabled={saving}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : 'Asignar suscripción'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabla */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando...</div>
                ) : suscripciones.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                        <p className="text-4xl mb-3">💳</p>
                        <p className="text-gray-400 font-medium">No hay suscripciones registradas aún</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Vigencia</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {suscripciones.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{s.user?.name}</p>
                                            <p className="text-xs text-gray-400">{s.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${planColors[s.plan]}`}>
                                                {s.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${estadoColors[s.estado]}`}>
                                                {s.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(s.fecha_inicio).toLocaleDateString('es-PE')} →{' '}
                                            {new Date(s.fecha_fin).toLocaleDateString('es-PE')}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            S/ {Number(s.monto).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {s.estado === 'activa' && (
                                                <button
                                                    onClick={() => cancelar(s.id)}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
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