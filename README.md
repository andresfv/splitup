# SplitUp

Aplicación web para administrar y dividir gastos familiares entre sus miembros.
Registra facturas por comercio, las reparte entre los participantes y lleva el
control de cuánto le corresponde a cada uno y si ya lo pagó.

## Pantallas

### Administrativas

- **Participantes**: permite agregar, modificar o eliminar a los participantes que serán enlazados a las facturas.
- **Comercios**: permite agregar, modificar o eliminar los comercios a los cuales pertenecen las facturas.

### Operativas

- **Facturas**: permite agregar, modificar o eliminar las facturas y enlazarlas a los participantes.
- **Facturas por Participante**: permite visualizar cada factura por participante, modificar el monto que le corresponde y su estado (pagado o no). También permite exportar como imagen la tarjeta del participante seleccionado.

## Tecnologías

- [Nuxt 4](https://nuxt.com) + Vue 3 + TypeScript
- Pinia (estado), Zod (validación)
- SQLite (`sqlite` + `sqlite3`)
- Tailwind CSS v4 + shadcn-vue (reka-ui)

## Requisitos

- Node.js
- pnpm

## Configuración

1. Instalar dependencias:

   ```bash
   pnpm install
   ```

2. Crear la base de datos a partir del respaldo versionado:

   ```bash
   cp data/splitup.db.bk data/splitup.db
   ```

3. Crear un archivo `.env` en la raíz con la ruta de la base de datos:

   ```env
   DB_PATH=./data/splitup.db
   ```

## Desarrollo

Iniciar el servidor de desarrollo en `http://localhost:3000`:

```bash
pnpm dev
```

## Producción

```bash
pnpm build     # build de producción
pnpm preview   # previsualizar el build
```

## Otros comandos

```bash
pnpm reset     # borra node_modules, .nuxt, .output y .nitro, y reinstala
```
