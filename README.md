# FakeStore - Frontend Interview Project

Una aplicación frontend construida con **Next.js 16**, **TypeScript**, **Redux Toolkit** y **React Query** que demuestra buenas prácticas de arquitectura, manejo robusto de errores y resiliencia ante fallos de API.

## 🚀 Demo

La aplicación consume la [FakeStore API](https://fakestoreapi.com/) para mostrar un catálogo de productos con funcionalidades CRUD completas.

## 📋 Características

### Funcionalidades Principales

- ✅ **Listado de productos** con SSR (Server-Side Rendering)
- ✅ **Vista de detalle** de cada producto con SSG (Static Site Generation)
- ✅ **CRUD completo**: Crear, editar y eliminar productos
- ✅ **Filtrado por categoría** con botones interactivos
- ✅ **Búsqueda en tiempo real** por título y descripción
- ✅ **UI responsiva** y moderna con tema oscuro
- ✅ **Optimistic updates** para mejor UX

### Manejo de Errores y Resiliencia

- ✅ **Retry automático a nivel HTTP** con axios-retry (3 intentos, backoff exponencial)
- ✅ **Retry automático a nivel Query** con React Query (3 intentos adicionales)
- ✅ **Retry manual** con botón de reintentar
- ✅ **Clasificación de errores** (400, 404, 500, timeout, red, vacío, inválido)
- ✅ **Mensajes de error específicos** con indicación de cómo recuperarse
- ✅ **Fallback data** - Muestra datos de demostración cuando el API falla
- ✅ **Indicador de retry** - Toast visual cuando se están reintentando peticiones
- ✅ **Detección de conexión** - Auto-retry cuando vuelve la conexión

### Server-Side Rendering (SSR)

- ✅ **Página principal**: Productos pre-cargados en el servidor
- ✅ **Páginas de detalle**: Generación estática con `generateStaticParams`
- ✅ **ISR (Incremental Static Regeneration)**: Revalidación cada 60 segundos
- ✅ **Hydration**: React Query hydration para transición seamless

### Simulador de Errores (Dev Tool)

- 🧪 **Toolbar interactivo** para probar escenarios de error
- 🔥 Error 500 (Server Error)
- 🔍 Error 404 (Not Found)
- ⏱️ Timeout
- 📡 Network Error
- 📭 Empty Response
- 💔 Invalid Data

## 🏗️ Arquitectura

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout con providers globales
│   ├── page.tsx                 # Home - Server Component + SSR
│   ├── loading.tsx              # Loading UI (Suspense)
│   └── products/[id]/
│       ├── page.tsx             # Detalle - SSG con generateStaticParams
│       └── loading.tsx          # Loading UI para detalle
│
├── components/
│   ├── common/                  # Componentes compartidos
│   │   ├── ApiStatusBanner.tsx  # Banner de estado de conexión
│   │   ├── EmptyState.tsx       # Estado vacío
│   │   ├── ErrorMessage.tsx     # Mensajes de error detallados
│   │   ├── ErrorSimulatorToolbar.tsx # Dev tool para simular errores
│   │   ├── Header.tsx           # Header con navegación
│   │   ├── LoadingSpinner.tsx   # Spinner de carga
│   │   ├── Notification.tsx     # Sistema de notificaciones toast
│   │   └── RetryIndicator.tsx   # Indicador de retry en progreso
│   │
│   ├── products/                # Componentes de productos
│   │   ├── CategoryFilter.tsx   # Filtro por categorías
│   │   ├── ProductCard.tsx      # Tarjeta con acciones hover
│   │   ├── ProductCatalog.tsx   # Catálogo cliente con fallback
│   │   ├── ProductDetail.tsx    # Vista detallada
│   │   ├── ProductDetailContainer.tsx # Wrapper para hydration
│   │   ├── ProductForm.tsx      # Formulario crear/editar
│   │   ├── ProductFormModal.tsx # Modal de formulario
│   │   └── ProductList.tsx      # Lista con estados
│   │
│   └── ui/                      # Componentes UI base
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── ConfirmModal.tsx     # Modal de confirmación
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── Skeleton.tsx
│       └── Textarea.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts           # Axios + axios-retry + interceptores
│   │   ├── products.ts         # Endpoints de productos
│   │   └── server.ts           # API para Server Components
│   │
│   ├── helpers/
│   │   ├── colorCategory.ts    # Colores por categoría
│   │   ├── formatCategory.ts   # Formato de categorías
│   │   ├── formatPrice.ts      # Formato de precios
│   │   └── zodErrors.ts        # Mapeo de errores Zod
│   │
│   ├── hooks/
│   │   ├── useForm.ts          # Hook para formularios
│   │   ├── useProducts.ts      # Hooks React Query + Redux sync
│   │   └── useRetry.ts         # Hook para retry manual
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx   # React Query con retry config
│   │   └── StoreProvider.tsx   # Redux Provider
│   │
│   ├── schemas/
│   │   └── product.ts          # Esquemas Zod
│   │
│   ├── store/
│   │   ├── hooks.ts            # Typed hooks
│   │   ├── productSlice.ts     # Slice de productos
│   │   ├── selectors.ts        # Selectores tipados
│   │   ├── store.ts            # Configuración del store
│   │   └── uiSlice.ts          # Slice de UI (modales, notificaciones)
│   │
│   ├── types/
│   │   └── product.ts          # Tipos TypeScript
│   │
│   ├── errorSimulation.ts      # Sistema de simulación de errores
│   ├── fallbackData.ts         # Datos de demostración
│   └── queryKeys.ts            # Query keys compartidos (server/client)
```

## 🛠️ Stack Tecnológico

| Tecnología        | Propósito                            |
| ----------------- | ------------------------------------ |
| **Next.js 16**    | Framework React con App Router + SSR |
| **TypeScript**    | Tipado estático                      |
| **Redux Toolkit** | Estado global (UI)                   |
| **React Query**   | Estado servidor + cache + retry      |
| **Axios**         | Cliente HTTP con interceptores       |
| **axios-retry**   | Retry automático a nivel HTTP        |
| **Zod**           | Validación de formularios            |
| **TailwindCSS 4** | Estilos                              |

## 🚦 Instalación y Ejecución

```bash
# Clonar el repositorio
git clone <repo-url>

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Build de producción
pnpm build
pnpm start
```

## 🔄 Flujo de Datos

### Server-Side Rendering

```
┌─────────────────────────────────────────────────────────────┐
│                     BUILD TIME / REQUEST                    │
│  1. Server fetches products via serverApi                   │
│  2. QueryClient prefetches data                             │
│  3. HTML rendered with products embedded                    │
│  4. Dehydrated state sent to client                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT HYDRATION                        │
│  1. HydrationBoundary rehydrates QueryClient                │
│  2. useProducts() finds data in cache (no loading!)         │
│  3. useEffect syncs to Redux store                          │
│  4. UI is interactive immediately                           │
└─────────────────────────────────────────────────────────────┘
```

### Estado: React Query vs Redux

| Aspecto           | React Query           | Redux                            |
| ----------------- | --------------------- | -------------------------------- |
| **Uso**           | Estado del servidor   | Estado de UI                     |
| **Datos**         | Productos, categorías | Modales, filtros, notificaciones |
| **Cache**         | ✅ Automático         | Manual                           |
| **SSR Hydration** | ✅ Built-in           | Sync via useEffect               |
| **Retry**         | ✅ Automático         | N/A                              |

## 📖 Decisiones de Arquitectura

### ¿Por qué Redux Toolkit + React Query?

- **Redux Toolkit**: Para estado de UI (modales, notificaciones, filtros de búsqueda)
- **React Query**: Para estado del servidor con cache inteligente, retry automático y SSR hydration

### Separación de Capas

1. **API Layer** (`lib/api`): Abstracción de llamadas HTTP con manejo de errores centralizado
2. **Server API** (`lib/api/server.ts`): Funciones para Server Components (usa fetch nativo)
3. **State Layer** (`lib/store`): Estado global con Redux para UI
4. **Data Layer** (`lib/hooks`): React Query para datos del servidor + sync a Redux
5. **UI Layer** (`components`): Componentes presentacionales y contenedores

### Estrategia de Retry (3 Niveles)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. AXIOS-RETRY (HTTP Level)                                 │
│    - Automático, invisible al usuario                       │
│    - 3 intentos con backoff: 1s → 2s → 4s                   │
│    - Solo errores 5xx, 429, network                         │
└─────────────────────────────────────────────────────────────┘
                              ↓ Si todos fallan
┌─────────────────────────────────────────────────────────────┐
│ 2. REACT QUERY (Query Level)                                │
│    - Muestra RetryIndicator toast                           │
│    - 3 intentos adicionales con backoff                     │
└─────────────────────────────────────────────────────────────┘
                              ↓ Si todos fallan
┌─────────────────────────────────────────────────────────────┐
│ 3. MANUAL RETRY (User Level)                                │
│    - ErrorMessage muestra botón "Reintentar"                │
│    - Fallback data mientras tanto                           │
└─────────────────────────────────────────────────────────────┘
```

### Graceful Degradation

Cuando el API falla completamente:

1. **Si hay datos en caché** → Muestra datos con banner de advertencia
2. **Si no hay datos** → Muestra productos de demostración (fallback)
3. **Si está offline** → Detecta vía browser API, auto-retry al reconectar

## 🎨 Componentes UI

### Estados de UI

- **Loading**: Skeletons animados
- **Error**: Mensaje específico + retry button
- **Empty**: Estado vacío con CTA para crear
- **Fallback**: Datos de demostración con banner informativo
- **Success**: Contenido normal

### Notificaciones

- Toast notifications para feedback de acciones
- Auto-dismiss después de 5 segundos
- Tipos: success, error, warning, info

## 📝 API

Esta app usa [FakeStore API](https://fakestoreapi.com/):

| Endpoint               | Método | Descripción               |
| ---------------------- | ------ | ------------------------- |
| `/products`            | GET    | Lista de productos        |
| `/products?limit=n`    | GET    | Lista con límite          |
| `/products/:id`        | GET    | Detalle de producto       |
| `/products/categories` | GET    | Categorías                |
| `/products`            | POST   | Crear producto (simulado) |
| `/products/:id`        | PUT    | Actualizar producto       |
| `/products/:id`        | DELETE | Eliminar producto         |

## 🧪 Probar Manejo de Errores

### Usando el Simulador de Errores

1. Abre la aplicación en `http://localhost:3000`
2. Verás el **🧪 Simulador de Errores** en la parte superior
3. Haz clic para expandir y selecciona un tipo de error:
   - **Error 500**: Simula fallo del servidor
   - **Error 404**: Simula recurso no encontrado
   - **Timeout**: Simula conexión lenta
   - **Network**: Simula pérdida de conexión
   - **Empty**: Simula respuesta vacía
   - **Invalid**: Simula datos corruptos
4. Observa cómo la app maneja el error:
   - RetryIndicator aparece durante reintentos
   - Después de 3 fallos, muestra datos de fallback
   - Botón "Restaurar API Normal" para recuperar

### Escenarios Probados

| Error    | Retryable | Comportamiento                             |
| -------- | --------- | ------------------------------------------ |
| HTTP 500 | ✅ Sí     | Retry automático → Fallback data           |
| HTTP 404 | ❌ No     | Error inmediato con mensaje claro          |
| HTTP 400 | ❌ No     | Error de validación                        |
| Timeout  | ✅ Sí     | Retry automático → Fallback data           |
| Network  | ✅ Sí     | Retry automático → Auto-retry on reconnect |
| Empty    | ✅ Sí     | Retry → Fallback data                      |
| Invalid  | ✅ Sí     | Retry → Fallback data                      |

## 📄 Licencia

MIT
