import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const base =
  "display-s mt-2 block w-full rounded-none border-0 border-b-2 bg-transparent pb-2 text-lg sm:text-xl placeholder:text-soil/35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soil";

export default function Field({
  label, name, error, hint, optional, as: Tag = "input", className = "", children, ...rest
}) {
  const id = `f-${name}`;
  const described = [error && `${id}-err`, hint && !error && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  const extra =
    Tag === "select" ? "cursor-pointer appearance-none pr-8" : Tag === "textarea" ? "resize-none" : "";

  return (
    <div className={`min-w-0 scroll-mt-40 ${className}`}>
      <label htmlFor={id} className="label flex justify-between gap-4 opacity-70">
        <span>{label}</span>
        {optional && <span>Optional</span>}
      </label>

      <div className="relative">
        <Tag
          id={id}
          name={name}
          aria-invalid={!!error}
          aria-describedby={described}
          className={`${base} min-w-0 max-w-full ${extra} ${error ? "border-chili" : "border-soil/40 focus:border-soil"}`}
          {...rest}
        >
          {children}
        </Tag>
        {Tag === "select" && (
          <span aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-60">
            <FontAwesomeIcon icon={faChevronDown} />
          </span>
        )}
      </div>

      {hint && !error && <p id={`${id}-hint`} className="label mt-2 opacity-60">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="label mt-2 flex items-center gap-1.5 text-chili">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-xs" aria-hidden />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}