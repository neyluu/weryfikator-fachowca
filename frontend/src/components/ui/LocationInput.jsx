import { useState, useEffect, useRef } from "react";

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
  "outline-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  "disabled:opacity-40 disabled:pointer-events-none",
  "w-full",
].join(" ");

const MAX_SUGGESTIONS = 8;
const MIN_CHARS = 3;

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

let citiesCache = [];
import("../../data/cities.json").then((mod) => {
  citiesCache = mod.default.map((city) => ({
    ...city,
    _n: normalize(city.n),
  }));
});

export default function LocationInput({
  value,
  onChange,
  placeholder = "Miejscowość",
  disabled = false,
  size = "md",
  className = "",
}) {
  const [inputValue, setInputValue] = useState(value?.n ?? "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value?.n ?? "");
  }, [value]);

  function handleInputChange(e) {
    const v = e.target.value;
    setInputValue(v);

    if (value != null) onChange(null);

    if (v.length < MIN_CHARS) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const q = normalize(v);
    const results = [];

    for (const city of citiesCache) {
      if (city._n.startsWith(q)) results.push(city);
      if (results.length >= MAX_SUGGESTIONS) break;
    }
    if (results.length < MAX_SUGGESTIONS) {
      for (const city of citiesCache) {
        if (!results.includes(city) && city._n.includes(q)) {
          results.push(city);
          if (results.length >= MAX_SUGGESTIONS) break;
        }
      }
    }

    setSuggestions(results);
    setOpen(results.length > 0);
    setActiveIndex(-1);
  }

  function handleSelect(city) {
    const { _n, ...rest } = city;
    onChange(rest);
    setInputValue(city.n);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputClasses = [baseClasses, sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={inputClasses}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `loc-option-${activeIndex}` : undefined
        }
      />

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-2xl border border-neutral-700 bg-neutral-900 shadow-lg overflow-hidden"
        >
          {suggestions.map((city, i) => (
            <li
              key={`${city.n}-${city.p}-${i}`}
              id={`loc-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(city);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={[
                "flex items-center justify-between px-4 py-2 cursor-pointer text-sm transition-colors",
                i === activeIndex
                  ? "bg-neutral-700 text-neutral-100"
                  : "text-neutral-300 hover:bg-neutral-800",
              ].join(" ")}
            >
              <span>{city.n}</span>
              <span className="text-neutral-500 text-xs">{city.p}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
