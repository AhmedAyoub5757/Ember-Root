import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../store/auth";

export default function AccountLink() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);

  return (
    <Link
      to={user ? "/account" : "/auth"}
      className={`label hidden h-10 items-center gap-2 border border-current px-4 lg:inline-flex ${
        status === "ready" ? "" : "invisible"
      }`}
    >
      <FontAwesomeIcon icon={faUser} className="text-xs" aria-hidden />
      <span>{user ? user.name.split(" ")[0] : "Sign in"}</span>
    </Link>
  );
}