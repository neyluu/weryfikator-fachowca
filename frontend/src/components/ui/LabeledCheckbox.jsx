export function LabeledCheckbox({
  id,
  label,
  name,
  checked,
  onChange,
  className = "",
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      <input
        type="checkbox"
        name={name ?? id}
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer hidden"
      />
      <div
        className="
        w-5 h-5 rounded-[5px] border-2 border-yellow-300 shrink-0
        flex items-center justify-center
        transition-all duration-150
        group-has-[input:checked]:bg-yellow-300
        group-has-[input:checked]:ring-2
        group-has-[input:checked]:ring-yellow-300/30
        hover:ring-2 hover:ring-yellow-300/20
      "
      >
        <svg
          className="w-3 h-2 text-black transition-all duration-150 opacity-0 scale-50 group-has-[input:checked]:opacity-100 group-has-[input:checked]:scale-100"
          viewBox="0 0 12 9"
          fill="none"
        >
          <path
            d="M1 4L4.5 7.5L11 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
}
