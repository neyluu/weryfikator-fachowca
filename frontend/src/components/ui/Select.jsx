import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-4 text-lg",
};

const baseClasses = [
  "min-w-40 w-full",
  "border border-neutral-700",
  "bg-neutral-900 text-neutral-100",
  "rounded-4xl",
  "transition-all duration-150 ease-out",
  "outline-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  "disabled:opacity-40 disabled:pointer-events-none",
  "cursor-pointer",
  "flex items-center justify-between gap-2",
].join(" ");

const dropdownClasses = [
  "absolute z-50 w-full mt-2",
  "bg-neutral-900 border border-neutral-700",
  "rounded-2xl overflow-hidden",
  "shadow-lg",
].join(" ");

const optionClasses = [
  "px-4 py-2",
  "text-neutral-100",
  "cursor-pointer",
  "transition-all duration-150 ease-out",
  "hover:bg-neutral-800",
  "active:bg-neutral-700",
].join(" ");

const selectedOptionClasses = "text-brand";

export function Select({
  size = "md",
  className = "",
  name,
  value,
  onChange,
  disabled = false,
  placeholder,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange({ target: { name, value: optValue } });
    setOpen(false);
  };

  const classes = [baseClasses, sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={classes}
      >
        <span className={selected ? "" : "text-neutral-500"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
      </button>

      {open && (
        <div className={dropdownClasses}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={[
                optionClasses,
                opt.value === value ? selectedOptionClasses : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
