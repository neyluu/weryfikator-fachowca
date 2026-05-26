const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-4 text-lg",
};

const lookClasses = {
  primary: [
    "bg-brand text-neutral-100",
    "border border-brand",
    "hover:brightness-90",
    "active:brightness-75",
  ].join(" "),
  secondary: [
    "bg-neutral-900 text-neutral-100",
    "border border-neutral-100",
    "hover:bg-neutral-800",
    "active:bg-neutral-700",
  ].join(" "),
};

const baseClasses = [
  "inline-flex items-center justify-center gap-2",
  "rounded-4xl",
  "transition-all duration-150 ease-out",
  "cursor-pointer select-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  "disabled:opacity-40 disabled:pointer-events-none",
].join(" ");

export function Button({
  look = "primary",
  size = "md",
  disabled = false,
  className = "",
  children,
  href,
  target,
  rel,
  onClick,
  type = "button",
}) {
  const classes = [baseClasses, lookClasses[look], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  if (href !== undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        onClick={onClick}
        aria-disabled={disabled}
        className={classes}
        style={disabled ? { pointerEvents: "none", opacity: 0.4 } : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}

export default Button;
