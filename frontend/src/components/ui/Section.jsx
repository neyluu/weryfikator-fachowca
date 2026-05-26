const baseClasses = ["flex flex-col gap-3"].join(" ");

export function Section({ title, children, className = "" }) {
  const classes = [baseClasses, className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <h3 className="text-xl font-medium text-neutral-100">{title}</h3>
      {children}
    </div>
  );
}

export default Section;
