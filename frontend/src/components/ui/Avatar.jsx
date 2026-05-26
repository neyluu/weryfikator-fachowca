const baseClasses =
  "w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs text-neutral-200";

export function Avatar({ name, className = "" }) {
  const classes = [baseClasses, className].filter(Boolean).join(" ");

  return <div className={classes}>{name?.[0] ?? "?"}</div>;
}

export default Avatar;
