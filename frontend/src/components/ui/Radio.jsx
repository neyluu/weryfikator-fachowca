const baseClasses = [
  "flex items-center gap-2",
  "cursor-pointer select-none",
  "text-neutral-100",
].join(" ");

export function Radio({
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className = "",
  children,
}) {
  return (
    <label
      className={[
        baseClasses,
        disabled ? "opacity-40 pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={[
          "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
          "transition-all duration-150 ease-out",
          checked
            ? "border-brand bg-brand"
            : "border-neutral-700 bg-neutral-900",
        ].join(" ")}
      >
        {checked && (
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-100" />
        )}
      </span>
      {children}
    </label>
  );
}

export default Radio;
