# Actividades — Ciudadano

Portal público para descubrir actividades y actividades culturales en Barcelona.

## Stack 

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 3
- TanStack Query (server state) + Zustand (auth/UI state)
- React Hook Form + Zod (formularios)
- Leaflet + OpenStreetMap (mapa)
- date-fns (calendario e i18n de fechas)
- Axios (HTTP)

## Requisitos

- Node.js ≥ 20
- Backend corriendo en `http://localhost:3004` (ver `../actividades_backend`)

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev                # http://localhost:3003
```

## Variables de entorno

| Variable | Default | Notas |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3004/api/v1` | Base del backend |
| `NEXT_PUBLIC_APP_NAME` | `Actividades` | |

## Rutas

| Ruta | Descripción | Auth |
|---|---|---|
| `/` | Home con próximas actividades y actividades | Público |
| `/mapa` | Mapa Leaflet con marcadores agrupados por lugar | Público |
| `/calendario` | Vista mes filtrable por categoría | Público |
| `/actividades` | Listado filtrable con búsqueda | Público |
| `/actividades/[id]` | Detalle de actividad | Público |
| `/festivales` | Listado de actividades próximas | Público |
| `/festivales/[slug]` | Detalle de fiesta con sus actividades | Público |
| `/login` · `/registro` | Autenticación | Público |
| `/cuenta` | Datos del usuario | Autenticado |
| `/cuenta/suscripciones` | Gestión de suscripciones por categoría | Autenticado |

## Suscripciones y notificaciones

Un usuario registrado puede suscribirse a una o varias categorías (Fiesta, Pintura, Danza, Teatro, Taichí, Música…). Cuando el admin crea una nueva actividad de esa categoría, el backend le envía un email automático. También puede recibir broadcasts manuales del admin.

## Estructura

```
src/
├── app/                       # rutas App Router
├── components/
│   ├── ui/                    # Button, etc.
│   └── layout/                # Header, Footer
├── features/<feature>/        # feature-sliced
│   ├── api/                   # llamadas al backend
│   ├── components/            # UI específica del feature
│   └── hooks/                 # useQuery / useMutation
├── lib/
│   ├── api-client.ts          # axios + interceptores JWT
│   ├── env.ts                 # validación de env con Zod
│   ├── i18n.ts                # formato de fechas y strings
│   ├── providers.tsx          # QueryClientProvider
│   └── utils.ts               # cn()
├── store/                     # Zustand stores (auth)
└── types/api.ts               # tipos espejados del backend
```

## i18n

Arquitectura preparada para múltiples locales. Por defecto `es-ES` con zona horaria `Europe/Madrid`. Las strings viven en `src/lib/i18n.ts`. Para añadir un nuevo locale, extiende el mapa `locales` con su `dateFnsLocale` e `intlLocale`.

## Mapa

Leaflet + OpenStreetMap (sin API key). El componente `ActivitiesMap` se carga con `next/dynamic` y `ssr: false` para evitar problemas con `window` en SSR.

## Scripts

- `npm run dev` — :3000
- `npm run build && npm start` — producción
- `npm run lint` / `npm run typecheck` / `npm run format`
