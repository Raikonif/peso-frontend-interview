# FakeStore - Frontend Interview Project

Una aplicación frontend construida con **Next.js 16**, **TypeScript**, **Redux Toolkit** y **React Query** que demuestra buenas prácticas de arquitectura, manejo robusto de errores y resiliencia ante fallos de API.

## 🚀 Demo

La aplicación consume la [FakeStore API](https://fakestoreapi.com/) para mostrar un catálogo de productos con funcionalidades CRUD.

## 📋 Características

### Funcionalidades Principales

- ✅ **Listado de productos** con paginación (20 items)
- ✅ **Vista de detalle** de cada producto
- ✅ **Creación de productos** mediante formulario con validación
- ✅ **Filtrado por categoría**
- ✅ **Búsqueda en tiempo real** por título y descripción
- ✅ **UI responsiva** y moderna

### Manejo de Errores y Resiliencia

- ✅ **Retry automático** con backoff exponencial (hasta 3 intentos)
- ✅ **Retry manual** con botón de reintentar
- ✅ **Clasificación de errores** (400, 404, 500, timeout, red)
- ✅ **Mensajes de error específicos** (no genéricos)
- ✅ **Estados de UI**: loading, error, empty, success
- ✅ **Recuperación automática** cuando la API vuelve a estar disponible

## 🏗️ Arquitectura

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal con providers
│   ├── page.tsx                 # Página home (listado)
│   └── products/[id]/page.tsx   # Página de detalle
│
├── components/
│   ├── common/                  # Componentes compartidos
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Notification.tsx
│   │
│   ├── products/                # Componentes de productos
│   │   ├── CategoryFilter.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductForm.tsx
│   │   └── ProductList.tsx
│   │
│   └── ui/                      # Componentes UI base
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── Skeleton.tsx
│       └── Textarea.tsx
│
├── lib/
│   ├── api/                     # Capa de API
│   │   ├── client.ts           # Axios con interceptores
│   │   └── products.ts         # Endpoints de productos
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useForm.ts          # Hook para formularios
│   │   ├── useProducts.ts      # Hooks de React Query
│   │   └── useRetry.ts         # Hook para retry manual
│   │
│   ├── providers/               # Context providers
│   │   ├── QueryProvider.tsx   # React Query
│   │   └── StoreProvider.tsx   # Redux
│   │
│   ├── store/                   # Redux Toolkit
│   │   ├── hooks.ts            # Typed hooks
│   │   ├── productSlice.ts     # Slice de productos
│   │   ├── selectors.ts        # Selectores tipados
│   │   ├── store.ts            # Configuración del store
│   │   └── uiSlice.ts          # Slice de UI
│   │
│   └── types/                   # TypeScript types
│       └── product.ts          # Tipos de productos
```

## 🛠️ Stack Tecnológico

| Tecnología        | Propósito                         |
| ----------------- | --------------------------------- |
| **Next.js 16**    | Framework React con App Router    |
| **TypeScript**    | Tipado estático                   |
| **Redux Toolkit** | Estado global                     |
| **React Query**   | Cache, fetching, retry automático |
| **Axios**         | Cliente HTTP con interceptores    |
| **Zod**           | Validación de formularios         |
| **TailwindCSS 4** | Estilos                           |

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

## 📖 Decisiones de Arquitectura

### ¿Por qué Redux Toolkit + React Query?

- **Redux Toolkit**: Para estado global de UI (modales, notificaciones, filtros)
- **React Query**: Para estado del servidor con cache inteligente y retry automático

### Separación de Capas

1. **API Layer** (`lib/api`): Abstracción de llamadas HTTP con manejo de errores centralizado
2. **State Layer** (`lib/store`): Estado global con Redux para UI
3. **Data Layer** (`lib/hooks`): React Query para datos del servidor
4. **UI Layer** (`components`): Componentes presentacionales y de lógica

### Manejo de Errores

```typescript
// Clasificación de errores en lib/api/client.ts
export function classifyError(error: AxiosError): ApiError {
  // Clasifica por código HTTP y tipo de error
  // Retorna mensaje específico y si es reintentable
}
```

### Retry Strategy

- **Automático**: React Query con backoff exponencial (1s, 2s, 4s)
- **Manual**: Botón de reintentar en componentes de error
- **Solo para errores retryables**: 500, timeout, network (no 400, 404)

## 🎨 Componentes UI

### Estados de UI

- **Loading**: Skeletons animados
- **Error**: Mensaje específico + retry button
- **Empty**: Estado vacío con CTA
- **Success**: Contenido normal

### Notificaciones

- Toast notifications para feedback de acciones
- Auto-dismiss después de 5 segundos
- Tipos: success, error, warning, info

## 📝 API Mock

Esta app usa [FakeStore API](https://fakestoreapi.com/):

| Endpoint               | Método | Descripción               |
| ---------------------- | ------ | ------------------------- |
| `/products`            | GET    | Lista de productos        |
| `/products/:id`        | GET    | Detalle de producto       |
| `/products/categories` | GET    | Categorías                |
| `/products`            | POST   | Crear producto (simulado) |

## 🧪 Escenarios de Error Manejados

1. **HTTP 500**: "Error interno del servidor"
2. **HTTP 404**: "Recurso no encontrado"
3. **HTTP 400**: "Datos inválidos"
4. **Timeout**: "La conexión tardó demasiado"
5. **Network Error**: "Sin conexión a internet"
6. **Datos inválidos**: "Respuesta con datos corruptos"

## 📄 Licencia

MIT
