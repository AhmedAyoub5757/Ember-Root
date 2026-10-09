import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth";

export default function AccountLink() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);

  return (
    <Link
      to={user ? "/account" : "/auth"}
      className={`label hidden h-10 items-center border border-current px-4 lg:inline-flex ${
        status === "ready" ? "" : "invisible"
      }`}
    >
      {user ? user.name.split(" ")[0] : "Sign in"}
    </Link>
  );
}