# Ciudadano — Fiestas

Next.js 15 (App Router) + TypeScript + Tailwind. Portal público para ciudadanos (rol `CITIZEN`, también navegable sin login según la ruta).

## Stack
- Next.js 15 (App Router, Server Components por defecto), React 19
- Tailwind CSS 3
- TanStack Query (server state) + Zustand (client/auth state)
- React Hook Form + Zod (formularios y validación)
- Axios (HTTP) hablando con `fiestas_backend` en `NEXT_PUBLIC_API_URL`

## Puerto

Dev: **3003** (`npm run dev`). Admin corre en 3002.

## Estructura

```
src/
├── app/                       # rutas (App Router)
│   ├── layout.tsx             # raíz, monta <Providers>
│   ├── page.tsx
│   ├── globals.css
│   └── (group)/...            # route groups según convenga
├── components/
│   ├── ui/                    # primitivos reusables (Button, Input, ...)
│   └── layout/                # Header, Footer, etc.
├── features/<feature>/        # feature-sliced
│   ├── api/                   # llamadas HTTP del feature
│   ├── components/            # componentes propios del feature
│   └── hooks/                 # hooks (useQuery/useMutation, etc.)
├── hooks/                     # hooks compartidos cross-feature
├── lib/                       # api-client, env, utils, providers
├── services/                  # integraciones (storage, analytics, etc.)
├── store/                     # stores Zustand (auth, ui...)
├── types/                     # tipos compartidos (api.ts, etc.)
└── styles/                    # CSS extra si hace falta
```

## Convenciones

- **Server Components por defecto.** Marca `'use client'` solo si necesitas estado, efectos, eventos o hooks de cliente.
- **SEO/SSR**: aprovecha que es público. Usa `metadata` por ruta y prefiere fetching server-side donde puedas (en RSC con `fetch` directo o con `apiClient` server-safe).
- **Server state vs client state**:
  - Datos del servidor → React Query (en partes interactivas) o RSC fetch (en páginas).
  - Estado de UI/sesión → Zustand.
- **Imports**: alias `@/`. Sin `../../../`.
- **Feature-sliced**: una carpeta por dominio en `src/features/`. UI cross-feature en `src/components/`.
- **HTTP**: usa `apiClient` de `@/lib/api-client`. Errores: `ApiError.from(err)`.
- **Tipos del API**: `src/types/api.ts` espeja DTOs del backend.
- **Tailwind**: usa `cn()` para combinar clases. Sin `style={{}}` salvo valores dinámicos.
- **Formularios**: React Hook Form + `zodResolver`. Schema en `features/<x>/api/<x>.schema.ts`.
- **Auth opcional**: muchas vistas son públicas. Solo bloquea con auth lo que el ticket pida explícitamente.
- **Naming**: archivos `kebab-case.tsx` para rutas, `PascalCase.tsx` para componentes, `camelCase.ts` para hooks/utils. Named exports salvo en `page.tsx`/`layout.tsx`.
- **Env**: por `src/lib/env.ts`. Nunca `process.env.X` directo en componentes.
- **Accesibilidad y mobile-first**: este front lo usa el público general; revisa que funcione en móvil y con teclado.

## Cómo añadir una feature `X`

1. `src/features/X/api/X.api.ts` — funciones que hablan con el backend.
2. `src/features/X/api/X.schema.ts` — Zod schemas para forms.
3. `src/features/X/hooks/useX*.ts` — `useQuery` / `useMutation`.
4. `src/features/X/components/` — componentes específicos.
5. `src/app/.../page.tsx` — ruta que consume los componentes.
6. Si hay tipo nuevo cross-feature: `src/types/api.ts`.

## Comandos

- `npm run dev` — :3003
- `npm run build && npm run start`
- `npm run lint` / `npm run typecheck` / `npm run format`

## Reglas operativas para Claude

- **No preguntar** antes de instalar deps, correr `dev`/`build`/`lint`/`typecheck`/`format`, crear/borrar archivos dentro de `src/`. Preautorizado en `.claude/settings.local.json`.
- **Sí preguntar** antes de: cambiar el puerto, modificar `next.config.ts`, eliminar features completas, modificar `.env`.
- Por defecto Server Components; añade `'use client'` solo cuando lo necesites de verdad.
- Si tocas un endpoint del backend, actualiza también el tipo en `src/types/api.ts`.
- Nunca metas lógica de auth fuera de `src/store/auth.store.ts` y `src/lib/api-client.ts`.
- Cuida SEO: añade `metadata` exportada en cada ruta pública.
- Si vas a probar la UI, arranca el dev server y verifica en navegador antes de marcar la tarea como hecha.
- No introduzcas otra librería de estado ni de fetching. Si te falta algo, propónlo primero.
