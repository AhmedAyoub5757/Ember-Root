import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Button({ children, variant = "solid", ...props }) {
  const base =
    "label inline-flex items-center gap-3 px-6 py-4 border border-soil transition-all duration-200 cursor-pointer";
  const styles = {
    solid: "bg-soil text-paper hover:bg-chili hover:border-chili",
    outline: "bg-transparent text-soil hover:bg-soil hover:text-paper",
  };
  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
      <FontAwesomeIcon icon={faArrowRight} aria-hidden className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
    </button>
  );
}