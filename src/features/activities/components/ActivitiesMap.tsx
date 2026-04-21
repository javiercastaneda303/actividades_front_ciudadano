'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import type { Activity } from '@/types/api';
import { formatDateShort } from '@/lib/i18n';

// Fix default marker icons path (Next.js bundler)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FRONTERA_CENTER: [number, number] = [27.753548, -18.011032];

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) {
      map.setView(FRONTERA_CENTER, 14);
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, points]);
  return null;
}

function MapSizeInvalidator() {
  const map = useMap();
  useEffect(() => {
    const timers = [80, 250, 500].map((ms) => setTimeout(() => map.invalidateSize(), ms));
    const el = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    return () => {
      timers.forEach(clearTimeout);
      ro.disconnect();
    };
  }, [map]);
  return null;
}

interface Props {
  activities: Activity[];
  height?: string | number;
}

export default function ActivitiesMap({ activities, height = '70vh' }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, { place: Activity['place']; activities: Activity[] }>();
    for (const a of activities) {
      const existing = map.get(a.placeId);
      if (existing) existing.activities.push(a);
      else map.set(a.placeId, { place: a.place, activities: [a] });
    }
    return Array.from(map.values());
  }, [activities]);

  const points: [number, number][] = grouped.map((g) => [g.place.latitude, g.place.longitude]);

  return (
    <MapContainer
      center={FRONTERA_CENTER}
      zoom={14}
      scrollWheelZoom
      style={{ height, width: '100%', borderRadius: 8, overflow: 'hidden' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapSizeInvalidator />
      <FitBounds points={points} />

      {grouped.map((g) => (
        <Marker key={g.place.id} position={[g.place.latitude, g.place.longitude]}>
          <Popup>
            <div style={{ minWidth: 200 }}>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{g.place.name}</p>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>{g.place.address}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {g.activities.slice(0, 5).map((a) => (
                  <li key={a.id} style={{ marginBottom: 4 }}>
                    <Link
                      href={`/actividades/${a.id}`}
                      style={{ color: '#16a34a', textDecoration: 'none' }}
                    >
                      {a.title}
                    </Link>
                    <span style={{ display: 'block', fontSize: 11, color: '#999' }}>
                      {formatDateShort(a.startsAt)}
                    </span>
                  </li>
                ))}
                {g.activities.length > 5 && (
                  <li style={{ fontSize: 11, color: '#999' }}>
                    + {g.activities.length - 5} más
                  </li>
                )}
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
