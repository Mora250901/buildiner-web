import Link from 'next/link';

const planes = [
    {
        key: 'standard',
        label: 'Standard',
        precio: 49,
        color: 'border-gray-200',
        badge: 'bg-gray-100 text-gray-700',
        features: [
            'Dashboard básico',
            'Ver listado de construcciones',
            'Filtro por distrito',
            'Acceso limitado a datos',
        ],
        noIncluye: ['Mapa interactivo', 'Exportar datos', 'Historial completo'],
    },
    {
        key: 'pro',
        label: 'Pro',
        precio: 99,
        color: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        popular: true,
        features: [
            'Todo lo de Standard',
            'Mapa interactivo',
            'Datos históricos completos',
            'Exportar Excel y PDF',
            'Filtros avanzados',
        ],
        noIncluye: ['Acceso API', 'Reportes automáticos'],
    },
    {
        key: 'premium',
        label: 'Premium',
        precio: 199,
        color: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-700',
        features: [
            'Todo lo de Pro',
            'Acceso API',
            'Reportes automáticos',
            'Alertas inteligentes',
            'Soporte prioritario',
        ],
        noIncluye: [],
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0f1117]">

            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
                        </svg>
                    </div>
                    <span className="text-white font-black text-xl">Buildiner</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                        Iniciar sesión
                    </Link>
                    <Link href="/registro" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all">
                        Registrarse
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm font-medium">Monitoreo en tiempo real</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                    Monitorea construcciones<br />
                    <span className="text-blue-400">en Lima</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                    Accede a datos actualizados sobre el estado de obras, inspecciones y avances por distrito. Información que necesitas para tomar mejores decisiones.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/registro" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all hover:scale-105">
                        Comenzar gratis
                    </Link>
                    <a href="https://wa.me/51999999999" target="_blank"
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10">
                        Hablar con ventas
                    </a>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-4xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { valor: '500+', label: 'Construcciones monitoreadas' },
                        { valor: '43',   label: 'Distritos de Lima' },
                        { valor: '98%',  label: 'Precisión en datos' },
                    ].map((s) => (
                        <div key={s.label} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-3xl font-black text-white">{s.valor}</p>
                            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Planes */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-white mb-3">Planes y precios</h2>
                    <p className="text-gray-400">Elige el plan que mejor se adapte a tus necesidades</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {planes.map((plan) => (
                        <div key={plan.key}
                            className={`relative bg-white/5 rounded-2xl border ${plan.color} p-8 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>

                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-blue-500 text-white text-xs font-black rounded-full">
                                        MÁS POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mb-3 ${plan.badge}`}>
                                    {plan.label}
                                </span>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black text-white">S/ {plan.precio}</span>
                                    <span className="text-gray-400 mb-1">/mes</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className="text-green-400">✓</span> {f}
                                    </li>
                                ))}
                                {plan.noIncluye.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>✗</span> {f}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/registro"
                                className={`block w-full py-3 text-center font-bold rounded-xl transition-all text-sm
                                    ${plan.popular
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                    }`}>
                                Comenzar con {plan.label}
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="text-center text-gray-500 text-sm mt-8">
                    ¿Tienes preguntas? <a href="https://wa.me/51999999999" target="_blank" className="text-blue-400 hover:underline">Contáctanos por WhatsApp</a>
                </p>
            </div>
        </div>
    );
}