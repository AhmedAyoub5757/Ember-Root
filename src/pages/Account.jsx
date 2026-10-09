import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="px-5 pb-28 pt-10 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="label opacity-60">Account / Your journal</p>
        <h1 className="display mt-5 text-[clamp(3.2rem,9vw,8rem)] font-semibold">
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

        <div className="mt-14 grid grid-cols-12 gap-x-12 gap-y-14 lg:mt-20">
          <aside className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-[128px]">
              <MemberCard name={user.name} memberNo={user.memberNo} className="w-full max-w-[420px]" />
              <dl className="mt-10 max-w-[420px]">
                {[["Name", user.name], ["Email", user.email]].map(([k, v]) => (
                  <div key={k} className="hair flex justify-between gap-6 py-3 text-sm">
                    <dt className="label opacity-60">{k}</dt>
                    <dd className="break-all text-right">{v}</dd>
                  </div>
                ))}
                <div className="hair" />
              </dl>
              <button type="button" onClick={leave} className="label mt-8 border-b border-current pb-1">
                Sign out
              </button>
              {user.role === "admin" && (
                <Link to="/dashboard" className="label ml-6 border-b border-current pb-1">
                  Open dashboard
                </Link>
              )}
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-7" aria-labelledby="orders-title">
            <p id="orders-title" className="label opacity-60">Order slips</p>

            {orders === null && <p className="label mt-6 opacity-60">Finding your slips…</p>}

            {orders?.length === 0 && (
              <div className="hair hair-b mt-6 py-16">
                <p className="display text-5xl font-semibold lg:text-6xl">
                  No orders<br />yet.
                </p>
                <p className="mt-5 max-w-[38ch] leading-relaxed opacity-80">
                  Orders you place while signed in will be kept here.
                </p>
                <Link to="/shop" className="label mt-8 inline-block border-b border-current pb-1">
                  Browse the sauces →
                </Link>
              </div>
            )}

            {orders?.length > 0 && (
              <ul className="hair-b mt-6">
                {orders.map((o) => (
                  <li key={o.no} className="hair">
                    <Link
                      to={`/order/${o.no}?t=${o.token}`}
                      className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5"
                    >
                      <span className="display-s text-3xl transition-transform duration-300 group-hover:translate-x-1">
                        No. {o.no}
                      </span>
                      <span className="display-s text-2xl tabular-nums">{fmt(o.money.total)}</span>
                      <span className="label opacity-60">
                        {when.format(new Date(o.placedAt))} · {words[o.status] ?? o.status}
                      </span>
                      <span className="label text-right opacity-60" aria-hidden>Open slip →</span>
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