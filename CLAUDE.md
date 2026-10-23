# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto
SplitUp: app Nuxt 4 para dividir facturas compartidas entre participantes. UI, comentarios, mensajes de error y commits en español.

## Comandos
Gestor de paquetes: **pnpm**.
- `pnpm dev` — servidor de desarrollo (http://localhost:3000)
- `pnpm build` / `pnpm preview` — build de producción y previsualización
- `pnpm reset` — borra `node_modules`, `.nuxt`, `.output`, `.nitro` y reinstala
- Agregar componentes shadcn: `pnpm dlx shadcn-vue@latest add <componente>` (se generan en `app/components/ui/`, config en `components.json`)

No hay linter ni suite de tests configurados.

## Base de datos
- SQLite vía `sqlite` + `sqlite3`. Conexión singleton en `server/utils/db.ts` (`getDb()`), activa `PRAGMA foreign_keys = ON`.
- Ruta definida por `DB_PATH` en `.env` → `runtimeConfig.dbPath`.
- `*.db` está en `.gitignore`; `data/splitup.db.bk` sí se versiona y es la referencia del esquema (no hay migraciones ni archivo SQL).
- Tablas: `member`, `place`, `bill` (`place`, `amount`, `is_paid`, `date`), `bill_member` (`bill`, `member`, `amount`, `is_paid`). Columnas en snake_case; la API las mapea a camelCase (`placeId`, `billId`, `memberId`, `isPaid`) y convierte booleanos 0/1.

## Arquitectura
- **Server** (`server/api/<recurso>/`): rutas de archivo Nitro por recurso (`members`, `places`, `bills`, `bills-members`) con `index.get`, `index.post`, `[id].put`, `[id].delete`. Validación de body con `readValidatedBody` + esquemas zod en `server/schemas/`. Errores: `console.error` + `createError('<mensaje en español>')`.
- **Estado** (`app/stores/split-up.ts`): un único store Pinia `useSplitUpStore` concentra todo el CRUD (llamadas `$fetch`), validaciones de cliente, toasts (`vue-sonner`) y lógica derivada (filtro por rango de fechas `fromDate`/`toDate`, resúmenes por miembro, `isBillPaid`). Las páginas llaman `initData()` dentro de `useAsyncData`; `initData` solo carga listas vacías.
- Reglas de negocio en el store, no en el servidor: p. ej. `deleteBill` borra primero sus `bill_member` uno por uno; el reparto de montos entre participantes se recalcula del lado del cliente.
- Errores de fetch en el cliente: `handleFetchError` (`app/utils/handleFetchError.ts`) → toast si status < 500, si no `showError`.
- **Tipos**: interfaces globales (`Member`, `Place`, `Bill`, `BillMember` y DTOs de UI `*DTO`) en `app/types/index.d.ts`, sin import.
- **UI**: shadcn-vue (estilo new-york, reka-ui) en `app/components/ui/` — generados, no editar a mano salvo necesidad. Componentes propios por dominio en `app/components/<dominio>/<componente>/Componente.vue`; envoltorios reutilizables en `app/components/common/` (prefijo `My*`). Tailwind v4 vía `@tailwindcss/vite`, CSS en `app/assets/css/tailwind.css`. Modo oscuro con `@nuxtjs/color-mode`.
- Navegación del sidebar definida en `app/composables/useNavigation.ts`.
- Utilidades auto-importadas en `app/utils/` (formato de moneda/fecha, normalización de fechas, export a PNG con `html-to-image`).

## Convenciones de git
- Ramas: `<issue>-<descripcion-en-kebab>`; PRs contra `master`.
- Commits: Conventional Commits con número de issue, en español: `feat(#15): ...`, `fix(#18): ...`, `refactor(#16): ...`.
