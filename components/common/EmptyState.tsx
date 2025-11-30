interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-slate-500" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      {description && (
        <p className="mt-2 text-slate-400 max-w-md">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Default empty state for products
export function ProductsEmptyState({
  onCreateClick,
}: {
  onCreateClick?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      }
      title="No hay productos"
      description="No se encontraron productos. Puedes crear uno nuevo para comenzar."
      action={
        onCreateClick ? (
          <button
            onClick={onCreateClick}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear producto
          </button>
        ) : undefined
      }
    />
  );
}
