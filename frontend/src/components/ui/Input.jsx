import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-4 text-lg",
};

const baseClasses = [
  "border border-neutral-700",
  "bg-neutral-900 text-neutral-100",
  "placeholder:text-neutral-500",
  "rounded-full",
  "transition-all duration-150 ease-out",
  "outline-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  "disabled:opacity-40 disabled:pointer-events-none",
  "w-full",
].join(" ");

export function Input({
  size = "md",
  className = "",
  type = "text",
  name,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;
  const classes = [
    baseClasses,
    sizeClasses[size],
    isPassword ? "pr-10" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative w-full">
      <input
        type={resolvedType}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={classes}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

export default Input;
