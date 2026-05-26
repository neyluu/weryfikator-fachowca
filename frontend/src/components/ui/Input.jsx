const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-4 text-lg",
};

const baseClasses = [
  "w-full",
  "border border-neutral-700",
  "bg-neutral-900 text-neutral-100",
  "placeholder:text-neutral-500",
  "rounded-4xl",
  "transition-all duration-150 ease-out",
  "outline-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  "disabled:opacity-40 disabled:pointer-events-none",
].join(" ");

export function Input({
  size = "md",
  className = "",
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
}) {
  const classes = [baseClasses, sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      className={classes}
    />
  );
}

export default Input;
