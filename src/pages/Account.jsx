import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowRightFromBracket, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import { fmt } from "../lib/money";
import { useAuth } from "../store/auth";
import MemberCard from "../components/auth/MemberCard";

const ease = [0.2, 0.7, 0.2, 1];
const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
const words = {
  pending: "Awaiting payment",
  paid: "Paid",
  cod: "Cash on delivery",
  failed: "Payment failed",
  cancelled: "Cancelled",
};

export default function Account() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const signOut = useAuth((s) => s.signOut);
  const [orders, setOrders] = useState(null);
  const leaving = useRef(false);

  useEffect(() => { document.title = "Your journal: Ember & Root"; }, []);

  useEffect(() => {
    if (status === "ready" && !user && !leaving.current) {
      navigate("/auth?next=%2Faccount", { replace: true });
    }
  }, [status, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let live = true;
    api("/auth/orders")
      .then((r) => live && setOrders(r.orders))
      .catch(() => live && setOrders([]));
    return () => { live = false; };
  }, [user]);

  if (!user) return <p className="label px-5 py-24 lg:px-8">Opening your journal…</p>;

  const leave = async () => {
    leaving.current = true;
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="px-4 pb-24 pt-8 sm:px-5 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="label opacity-60">Account / Your journal</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,8vw,7.5rem)] font-semibold">
          {["Your field", "journal."].map((t, i) => (
            <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[8vw]" : ""}`}>
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease }}
              >
                {t}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid grid-cols-12 gap-x-12 gap-y-12 sm:mt-14 lg:mt-20">
          <aside className="col-span-12 min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[128px]">
              <div className="overflow-hidden py-1 sm:overflow-visible sm:py-3">
                <MemberCard name={user.name} memberNo={user.memberNo} className="mx-auto w-full max-w-[420px] lg:mx-0" />
              </div>
              <dl className="mt-8 max-w-[420px] sm:mt-10">
                {[["Name", user.name], ["Email", user.email]].map(([k, v]) => (
                  <div key={k} className="hair flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <dt className="label opacity-60">{k}</dt>
                    <dd className="break-all font-medium sm:text-right sm:font-normal">{v}</dd>
                  </div>
                ))}
                <div className="hair" />
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-5 sm:mt-8 sm:gap-6">
                <button
                  type="button"
                  onClick={leave}
                  className="label inline-flex items-center gap-2 border-b border-current pb-1"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-xs" aria-hidden />
                  <span>Sign out</span>
                </button>
                {user.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="label inline-flex items-center gap-2 border-b border-current pb-1"
                  >
                    <span>Open dashboard</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" aria-hidden />
                  </Link>
                )}
              </div>
            </div>
          </aside>

          <section className="col-span-12 min-w-0 lg:col-span-7" aria-labelledby="orders-title">
            <p id="orders-title" className="label opacity-60">Order slips</p>

            {orders === null && <p className="label mt-6 opacity-60">Finding your slips…</p>}

            {orders?.length === 0 && (
              <div className="hair hair-b mt-6 py-12 sm:py-16">
                <p className="display text-4xl font-semibold sm:text-5xl lg:text-6xl">
                  No orders<br />yet.
                </p>
                <p className="mt-5 max-w-[38ch] leading-relaxed opacity-80">
                  Orders you place while signed in will be kept here.
                </p>
                <Link to="/shop" className="label mt-8 inline-flex items-center gap-2 border-b border-current pb-1">
                  <span>Browse the sauces</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
                </Link>
              </div>
            )}

            {orders?.length > 0 && (
              <ul className="hair-b mt-6">
                {orders.map((o) => (
                  <li key={o.no} className="hair">
                    <Link
                      to={`/order/${o.no}?t=${o.token}`}
                      className="group flex flex-col gap-2 py-4 transition-colors sm:grid sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-x-6 sm:gap-y-1 sm:py-5"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="display-s text-2xl transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                          No. {o.no}
                        </span>
                        <span className="display-s text-xl tabular-nums sm:hidden">{fmt(o.money.total)}</span>
                      </div>
                      <span className="display-s hidden text-2xl tabular-nums sm:inline">{fmt(o.money.total)}</span>
                      <span className="label text-xs opacity-60 sm:text-sm">
                        {when.format(new Date(o.placedAt))} · {words[o.status] ?? o.status}
                      </span>
                      <span className="label inline-flex items-center justify-end gap-1.5 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden>
                        <span>Open slip</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}