const baseClasses = [
  "bg-neutral-900/40 border border-neutral-800",
  "rounded-2xl p-4",
  "text-sm text-neutral-300",
].join(" ");

export function Card({ children, className = "" }) {
  const classes = [baseClasses, className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}

export default Card;
