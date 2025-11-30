interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border border-slate-700",
    success: "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
    warning: "bg-amber-900/50 text-amber-400 border border-amber-700/50",
    danger: "bg-red-900/50 text-red-400 border border-red-700/50",
    info: "bg-indigo-900/50 text-indigo-400 border border-indigo-700/50",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
