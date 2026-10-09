import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CONTACT } from "../../pages/pages";

const ease = [0.2, 0.7, 0.2, 1];
const rule = "lg:border-t lg:border-[color-mix(in_srgb,currentColor_25%,transparent)]";

function Rows({ rows }) {
  return (
    <dl>
      {rows.map(([k, v]) => (
        <div key={k} className="hair flex justify-between gap-6 py-3 text-sm">
          <dt className="label opacity-60">{k}</dt>
          <dd className="text-right">{v}</dd>
        </div>
      ))}
      <div className="hair" />
    </dl>
  );
}

function Questions({ qa }) {
  return (
    <div className="hair-b">
      {qa.map(({ q, a }) => (
        <details key={q} className="hair group">
          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
            <span className="display-s text-xl lg:text-2xl">{q}</span>
            <span aria-hidden className="label shrink-0 group-open:hidden">+</span>
            <span aria-hidden className="label hidden shrink-0 group-open:inline">–</span>
          </summary>
          <p className="max-w-[58ch] pb-5 leading-relaxed opacity-85">{a}</p>
        </details>
      ))}
    </div>
  );
}

export default function Doc({ doc }) {
  const [active, setActive] = useState(doc.sections[0].id);

  useEffect(() => {
    document.title = `${doc.kicker.split(" / ").pop()}: Ember & Root`;
  }, [doc]);

  // highlight the section being read
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [doc]);

  return (
    <div className="px-5 pb-28 pt-10 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto min-w-0 max-w-[1400px]">
        <header className="grid grid-cols-12 gap-x-8 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <p className="label opacity-60">{doc.kicker}</p>
            <h1 className="display mt-5 text-[clamp(3.2rem,9vw,8rem)] font-semibold">
              {doc.title.map((t, i) => (
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
          </div>
          <div className="col-span-12 lg:col-span-4 lg:self-end">
            <p className="max-w-[38ch] leading-relaxed opacity-80">{doc.intro}</p>
            <p className="label mt-5 opacity-60">Last revised {doc.revised}</p>
          </div>
        </header>

        {doc.draft && (
          <p role="note" className="label mt-10 border border-dashed border-chili p-4 text-chili">
            Template text · have this reviewed against your real business and local law before launch
          </p>
        )}

        <div className="mt-14 min-w-0 grid grid-cols-1 gap-x-10 gap-y-10 lg:mt-20 lg:grid-cols-12">
          {/* contents */}
          <nav aria-label="Contents" className="col-span-1 min-w-0 lg:col-span-3">
            <div className="min-w-0 max-w-full overflow-hidden lg:sticky lg:top-[128px]">
              <p className="label opacity-60">Contents</p>
              <ol className="no-scrollbar mt-4 flex min-w-0 max-w-full gap-x-6 overflow-x-auto lg:block lg:overflow-visible">
                {doc.sections.map((s, i) => (
                  <li key={s.id} className={`shrink-0 ${rule}`}>
                    <a
                      href={`#${s.id}`}
                      aria-current={active === s.id ? "true" : undefined}
                      className={`flex items-baseline gap-3 py-2 transition-opacity duration-300 lg:py-3 ${
                        active === s.id ? "opacity-100" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <span className="label">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display-s whitespace-nowrap text-lg lg:text-xl">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* clauses */}
          <div className="col-span-1 min-w-0 lg:col-span-9">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="hair scroll-mt-40 pb-12 pt-6">
                <h2 className="flex items-baseline gap-4">
                  <span className="label opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display-s text-3xl lg:text-4xl">{s.title}</span>
                </h2>

                <div className="mt-6 max-w-[64ch] space-y-5 leading-relaxed">
                  {s.body?.map((p) => <p key={p}>{p}</p>)}
                  {s.list && (
                    <ul>
                      {s.list.map((li) => (
                        <li key={li} className="hair flex gap-4 py-3 text-sm">
                          <span aria-hidden className="label opacity-60">—</span>
                          <span>{li}</span>
                        </li>
                      ))}
                      <li className="hair" />
                    </ul>
                  )}
                  {s.rows && <Rows rows={s.rows} />}
                </div>

                {s.qa && <div className="mt-6 max-w-[72ch]"><Questions qa={s.qa} /></div>}
              </section>
            ))}

            <p className="label hair pt-6 opacity-70">
              Something unclear? Write to{" "}
              <a href={`mailto:${CONTACT}`} className="border-b border-current pb-0.5">{CONTACT}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}