import { Star } from "lucide-react";

const baseClasses = "flex items-center gap-1 select-none";

const starBase = "w-5 h-5 transition-all duration-150 ease-out";

const activeStar = "text-brand fill-brand";
const inactiveStar = "text-neutral-800";

function StarIcon({ filled }) {
  return (
    <Star
      className={[starBase, filled ? activeStar : inactiveStar].join(" ")}
      fill={filled ? "currentColor" : "none"}
      strokeWidth={1.5}
    />
  );
}

export function Stars({
  value = 0,
  interactive = false,
  onChange,
  max = 5,
  className = "",
}) {
  const classes = [baseClasses, className].filter(Boolean).join(" ");

  const handleClick = (index) => {
    if (!interactive) return;
    onChange?.(index);
  };

  return (
    <div className={classes}>
      {Array.from({ length: max }).map((_, i) => {
        const index = i + 1;
        const filled = index <= value;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className="disabled:cursor-default"
            aria-label={`Rate ${index} star${index > 1 ? "s" : ""}`}
          >
            <StarIcon filled={filled} />
          </button>
        );
      })}
    </div>
  );
}

export default Stars;
