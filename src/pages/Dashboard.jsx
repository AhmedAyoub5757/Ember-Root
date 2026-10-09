import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Package, Users, Utensils } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

const ease = [0.2, 0.7, 0.2, 1];
const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-US")}`;
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const fullDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  };
}

function StatCard({ icon: Icon, label, value, detail, delay, accent = "soil" }) {
  const accentClass = {
    soil: "bg-soil text-paper",
    "paper-dark": "bg-paper-dark text-soil",
    chili: "bg-chili text-paper",
    leaf: "bg-leaf text-paper",
  }[accent] || "bg-soil text-paper";
  return (
    <motion.article
      {...fadeUp(delay)}
      className={`relative overflow-hidden border border-soil/20 p-5 ${accentClass}`}
    >
      <div className="flex items-start justify-between">
        <span className="label opacity-65">{label}</span>
        <Icon size={18} strokeWidth={1.5} aria-hidden />
      </div>
      <p className="display-s mt-8 text-4xl font-medium">{value}</p>
      <p className="label mt-2 opacity-60">{detail}</p>
      <span className="absolute -bottom-10 -right-5 display text-[9rem] leading-none opacity-[0.06]" aria-hidden>+</span>
    </motion.article>
  );
}

function RevenueChart({ orders }) {
  const points = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return { date, value: 0 };
    });
    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const match = days.find((day) => day.date.toDateString() === date.toDateString());
      if (match) match.value += Number(order.total || 0);
    });
    const max = Math.max(...days.map((day) => day.value), 1);
    return days.map((day, index) => ({
      ...day,
      x: 5 + index * (90 / 6),
      y: 92 - (day.value / max) * 72,
      label: shortDate.format(day.date),
    }));
  }, [orders]);

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `5,92 ${line} 95,92`;

  return (
    <div className="relative mt-6">
      <svg viewBox="0 0 100 100" className="h-56 w-full overflow-visible" role="img" aria-label="Revenue for the last seven days">
        {[20, 44, 68, 92].map((y) => <line key={y} x1="5" x2="95" y1={y} y2={y} stroke="currentColor" strokeOpacity=".12" strokeDasharray="1 2" />)}
        <polygon points={area} fill="currentColor" opacity=".09" />
        <polyline points={line} fill="none" stroke="currentColor" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
        {points.map((point) => <circle key={point.label} cx={point.x} cy={point.y} r="1.5" fill="var(--color-chili)" stroke="var(--color-paper)" strokeWidth=".7" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="mt-1 flex justify-between px-[5%]">
        {points.map((point) => <span className="label text-[9px] opacity-55" key={point.label}>{point.label}</span>)}
      </div>
    </div>
  );
}

function StatusRing({ orders }) {
  const counts = orders.reduce((result, order) => {
    result[order.status] = (result[order.status] || 0) + 1;
    return result;
  }, {});
  const total = orders.length || 1;
  const paid = Math.round(((counts.paid || 0) / total) * 100);
  const pending = Math.round(((counts.pending || 0) / total) * 100);
  const paidEnd = paid * 3.6;

  return (
    <div className="flex items-center gap-7">
      <div
        className="grid h-36 w-36 shrink-0 place-items-center rounded-full"
        style={{ background: `conic-gradient(var(--color-leaf) 0 ${paidEnd}deg, var(--color-turmeric) ${paidEnd}deg ${paidEnd + pending * 3.6}deg, color-mix(in srgb, var(--color-soil) 14%, transparent) ${paidEnd + pending * 3.6}deg 360deg)` }}
      >
        <div className="grid h-24 w-24 place-items-center rounded-full bg-paper">
          <span className="display-s text-3xl">{orders.length}</span>
        </div>
      </div>
      <div className="space-y-4">
        {[["Paid", counts.paid || 0, "bg-leaf"], ["Pending", counts.pending || 0, "bg-turmeric"], ["Other", total - (counts.paid || 0) - (counts.pending || 0), "bg-soil/30"]].map(([label, count, color]) => (
          <div className="flex items-center gap-2" key={label}>
            <span className={`h-2 w-2 rounded-full ${color}`} />
            <span className="label opacity-65">{label}</span>
            <span className="label ml-auto">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, eyebrow, children, className = "" }) {
  return (
    <section className={`mt-12 ${className}`}>
      <div className="flex items-end justify-between border-b border-soil/25 pb-3">
        <div><p className="label opacity-55">{eyebrow}</p><h2 className="display-s mt-2 text-3xl">{title}</h2></div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Dashboard() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") api("/admin/dashboard").then(setData).catch((err) => setError(err.message));
  }, [user]);

  if (status === "loading") return null;
  if (!user) return <Navigate to="/auth?next=%2Fdashboard" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  if (error) return <p className="px-5 py-24 lg:px-8">{error}</p>;
  if (!data) return <p className="label px-5 py-24 lg:px-8">Opening the dashboard...</p>;

  const revenue = data.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const latest = data.orders.slice(0, 5);

  return (
    <div className="overflow-hidden px-5 pb-28 pt-10 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <motion.div {...fadeUp()} className="relative">
          <p className="label opacity-60">Admin / Operations · {fullDate.format(new Date())}</p>
          <h1 className="display mt-5 max-w-5xl text-[clamp(3.2rem,9vw,8rem)] font-semibold">The cellar<br /><span className="lg:pl-[7vw]">dashboard.</span></h1>
          <motion.div animate={{ rotate: [0, 4, -3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-8 top-5 hidden h-28 w-28 rounded-full border border-chili/50 p-2 text-center text-chili md:block">
            <span className="label block rotate-12 pt-4">Fresh batch<br />of insight</span>
          </motion.div>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:mt-20">
          <StatCard icon={Package} label="Gross revenue" value={money(revenue)} detail={`${data.orders.length} recorded orders`} delay={.1} />
          <StatCard icon={Utensils} label="Order slips" value={data.orders.length} detail="Across every status" delay={.17} accent="paper-dark" />
          <StatCard icon={Mail} label="Inbox" value={data.contacts.length} detail="Customer messages" delay={.24} accent="chili" />
          <StatCard icon={Users} label="Community" value={data.subscribers.length + data.users.length} detail={`${data.subscribers.length} subscribers · ${data.users.length} accounts`} delay={.31} accent="leaf" />
        </div>

        <div className="mt-12 grid grid-cols-12 gap-8">
          <motion.div {...fadeUp(.38)} className="col-span-12 border border-soil/20 bg-paper-dark/45 p-5 lg:col-span-8 lg:p-8">
            <div className="flex items-end justify-between"><div><p className="label opacity-55">Seven day pulse</p><h2 className="display-s mt-2 text-3xl">Revenue flow</h2></div><ArrowUpRight size={21} strokeWidth={1.5} /></div>
            <RevenueChart orders={data.orders} />
          </motion.div>
          <motion.div {...fadeUp(.45)} className="col-span-12 border border-soil/20 p-5 lg:col-span-4 lg:p-8">
            <p className="label opacity-55">Order health</p><h2 className="display-s mt-2 text-3xl">At a glance</h2>
            <div className="mt-7"><StatusRing orders={data.orders} /></div>
            <p className="mt-7 border-t border-soil/15 pt-4 text-sm leading-relaxed opacity-70">A quick read of what is moving through the kitchen right now.</p>
          </motion.div>
        </div>

        <Section eyebrow="Latest movement" title="Order slips">
          <motion.div {...fadeUp(.5)} className="border-b border-soil/20">
            {latest.length === 0 && <p className="py-8 opacity-60">No orders yet.</p>}
            {latest.map((order, index) => (
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .55 + index * .07, ease }} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-soil/15 py-4" key={order.no}>
                <span className="label opacity-50">#{order.no}</span>
                <div><p className="font-medium">{order.contact?.name || "Guest"} <span className="ml-2 text-xs opacity-50">{order.contact?.email}</span></p><p className="label mt-1 opacity-50">{order.status} · {shortDate.format(new Date(order.created_at))}</p></div>
                <span className="display-s text-xl">{money(order.total)}</span>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Section eyebrow="The kitchen inbox" title={`Contact notes · ${data.contacts.length}`}>
            {data.contacts.slice(0, 4).map((contact) => <article className="border-t border-soil/15 py-4" key={contact.id}><p className="label opacity-55">{contact.topic} · {contact.name}</p><p className="mt-2 line-clamp-2 text-sm leading-relaxed">{contact.message}</p></article>)}
          </Section>
          <Section eyebrow="Growing the circle" title={`Subscribers · ${data.subscribers.length}`}>
            {data.subscribers.slice(0, 4).map((subscriber) => <p className="flex justify-between border-t border-soil/15 py-4 text-sm" key={subscriber.id}><span>{subscriber.email}</span><span className="label opacity-50">Batch {subscriber.batch_no ?? "Any"}</span></p>)}
          </Section>
        </div>
      </div>
    </div>
  );
}
