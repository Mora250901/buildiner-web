'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const estadoColors: Record<string, string> = {
    en_planos:   '#6b7280',
    cimientos:   '#d97706',
    estructura:  '#3b82f6',
    albañileria: '#f97316',
    acabados:    '#8b5cf6',
    culminada:   '#22c55e',
    paralizada:  '#ef4444',
};

interface Construccion {
    id: number;
    direccion: string;
    estado: string;
    avance_porcentaje: number;
    latitud: string;
    longitud: string;
    distrito: { nombre: string };
}

interface Props {
    construcciones: Construccion[];
    onSelect?: (id: number) => void;
}

export default function MapaConstrucciones({ construcciones, onSelect }: Props) {
    const conCoordenadas = construcciones.filter(
        (c) => c.latitud && c.longitud
    );

    return (
        <MapContainer
            center={[-12.0464, -77.0428]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {conCoordenadas.map((c) => {
                const color = estadoColors[c.estado] ?? '#3b82f6';
                const icon = L.divIcon({
                    className: '',
                    html: `<div style="
                        width: 14px; height: 14px;
                        background: ${color};
                        border: 2px solid white;
                        border-radius: 50%;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    "></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7],
                });

                return (
                    <Marker
                        key={c.id}
                        position={[parseFloat(c.latitud), parseFloat(c.longitud)]}
                        icon={icon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <p className="font-bold">{c.direccion}</p>
                                <p className="text-gray-500">{c.distrito?.nombre}</p>
                                <p className="mt-1">Estado: <strong>{c.estado?.replace('_', ' ')}</strong></p>
                                <p>Avance: <strong>{c.avance_porcentaje}%</strong></p>
                                {onSelect && (
                                    <button
                                        onClick={() => onSelect(c.id)}
                                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg"
                                    >
                                        Ver detalle
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}