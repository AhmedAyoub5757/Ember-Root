import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { api } from "../lib/api";
import { PASSWORD_MIN, strength, strengthWords, validateAuth } from "../lib/authValidate";
import { useMediaQuery } from "../lib/useMediaQuery";
import { useAuth } from "../store/auth";
import logo from "../assets/images/logo.png";
import AuthField from "../components/auth/AuthField";
import Roll from "../components/ui/Roll";

const EASE = [0.7, 0, 0.2, 1]; // the panels
const OUT = [0.2, 0.7, 0.2, 1]; // everything else
const PANEL = { signin: "#B8321F", signup: "#1F1A14" };

const COPY = {
  signin: {
    kicker: "01 / Sign in",
    lines: ["Welcome", "back."],
    sub: "Your order slips and your details, right where you left them.",
    cta: "Sign in",
    word: "Ember",
    tag: "Returning",
  },
  signup: {
    kicker: "01 / Create account",
    lines: ["Join the", "field."],
    sub: "An account keeps your order slips and fills in checkout for you. Nothing else, for now.",
    cta: "Create account",
    word: "Root",
    tag: "New member",
  },
};
const PERKS = ["Keeps every order slip in one place", "Fills in checkout for you"];

// only same-site paths, and never back into the auth page
const safeNext = (n) =>
  typeof n === "string" && /^\/(?!\/)\S*$/.test(n) && !n.startsWith("/auth") ? n : "/";

function Strength({ pw }) {
  const n = strength(pw);
  return (
    <div className="pb-1 pt-4" aria-live="polite">
      <div className="flex items-end gap-[3px]" aria-hidden>
        {Array.from({ length: 25 }, (_, i) => (
          <span
            key={i}
            className={`w-[2px] bg-soil transition-opacity duration-300 ${i % 5 === 0 ? "h-4" : "h-2.5"}`}
            style={{ opacity: i < n * 5 ? 1 : 0.2 }}
          />
        ))}
      </div>
      <p className="label mt-2 opacity-70">
        {pw ? `Strength: ${strengthWords[n]}` : `At least ${PASSWORD_MIN} characters. A short phrase works well.`}
      </p>
    </div>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);

  const mode = params.get("mode") === "signup" ? "signup" : "signin";
  const signup = mode === "signup";
  const copy = COPY[mode];
  const next = safeNext(params.get("next"));
  const move = reduce ? { duration: 0 } : { duration: 1, ease: EASE };
  const grow = { duration: reduce ? 0 : 0.5, ease: OUT };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("idle"); // idle | sending | welcome
  const [welcome, setWelcome] = useState(null);
  const timer = useRef(null);

  useEffect(() => { document.title = `${copy.cta}: Ember & Root`; }, [copy.cta]);
  useEffect(() => () => clearTimeout(timer.current), []);

  // already signed in? skip the form (but never cut the welcome moment short)
  useEffect(() => {
    if (status === "ready" && user && phase === "idle") navigate(next, { replace: true });
  }, [status, user, phase, next, navigate]);

  const setMode = (m) => {
    const p = new URLSearchParams(params);
    if (m === "signup") p.set("mode", "signup");
    else p.delete("mode");
    setParams(p, { replace: true });
    setErrors({});
  };

  const edit = (setter, key) => (e) => {
    setter(e.target.value);
    if (errors[key] || errors.form) setErrors((s) => ({ ...s, [key]: undefined, form: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (phase !== "idle") return;

    const errs = validateAuth({ mode, name, email, password });
    setErrors(errs);
    const first = ["name", "email", "password"].find((k) => errs[k]);
    if (first) {
      document.getElementById(`a-${first}`)?.focus();
      return;
    }

    setPhase("sending");
    try {
      const { user: u } = await api(`/auth/${signup ? "signup" : "login"}`, {
        method: "POST",
        body: { name, email, password, remember },
      });
      setWelcome({ ...u, created: signup });
      if (signup) {
        await api("/auth/logout", { method: "POST", body: {} });
        setPhase("registered");
        timer.current = setTimeout(() => {
          const p = new URLSearchParams(params);
          p.delete("mode");
          setParams(p, { replace: true });
          setPassword("");
          setPhase("idle");
        }, reduce ? 200 : 1800);
      } else {
        setPhase("welcome");
        useAuth.getState().setUser(u);
        timer.current = setTimeout(() => navigate(next, { replace: true }), reduce ? 200 : 1800);
      }
    } catch (err) {
      setPhase("idle");
      if (err.fields && Object.keys(err.fields).length) {
        setErrors(err.fields);
        const f = ["name", "email", "password"].find((k) => err.fields[k]);
        if (f) document.getElementById(`a-${f}`)?.focus();
      } else {
        setErrors({ form: err.message || "Something went wrong on our side. Please try again." });
      }
    }
  };

  const welcomed = phase === "welcome" || phase === "registered";

  return (
    <main className="relative min-h-svh overflow-x-clip bg-paper text-soil lg:h-svh lg:overflow-hidden">
      <div className="flex min-h-svh flex-col lg:block lg:h-full lg:min-h-0">
        {/* ---------- the form sheet ---------- */}
        <motion.section
          initial={false}
          animate={{ x: desktop && signup ? "100%" : "0%" }}
          transition={move}
          className="relative z-0 flex flex-1 flex-col bg-paper lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 lg:flex-none lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col px-5 py-6 lg:px-10 lg:py-8">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" aria-label="Ember & Root, back to the site">
                <img src={logo} alt="" className="h-9 w-auto mix-blend-multiply" />
              </Link>
              <Link to="/" className="label border-b border-current pb-0.5">Back to the site →</Link>
            </div>

            <div className="my-auto py-8">
              <p className="label opacity-60">{copy.kicker}</p>

              <div role="group" aria-label="Account" className="mt-4 flex gap-7 border-b border-soil/20">
                {[["signin", "Sign in"], ["signup", "Create account"]].map(([id, label]) => {
                  const on = mode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setMode(id)}
                      className={`label relative pb-3 transition-opacity duration-300 ${on ? "" : "opacity-55 hover:opacity-100"}`}
                    >
                      {label}
                      <motion.span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-soil"
                        initial={false}
                        animate={{ scaleX: on ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.45, ease: OUT }}
                      />
                    </button>
                  );
                })}
              </div>

              <h1 className="display mt-8 text-[clamp(2.8rem,5.4vw,5.2rem)] font-semibold">
                <AnimatePresence mode="wait">
                  <motion.span key={mode} className="block" initial="hidden" animate="show" exit="exit">
                    {copy.lines.map((t, i) => (
                      <span key={t} className="block overflow-hidden pb-[0.1em]">
                        <motion.span
                          className="block"
                          variants={{
                            hidden: { y: "105%" },
                            show: { y: 0, transition: { duration: reduce ? 0 : 0.8, delay: 0.15 + i * 0.1, ease: OUT } },
                            exit: { y: "-105%", transition: { duration: reduce ? 0 : 0.35, delay: i * 0.05 } },
                          }}
                        >
                          {t}
                        </motion.span>
                      </span>
                    ))}
                  </motion.span>
                </AnimatePresence>
              </h1>

              {!welcomed && (
                <p className="mt-5 hidden max-w-[40ch] leading-relaxed opacity-80 sm:block [@media(min-height:820px)]:block [@media(max-height:819px)]:lg:hidden">
                  {copy.sub}
                </p>
              )}

              {welcomed ? (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: OUT }}
                  className="mt-10"
                >
                  <p className="label opacity-60">{phase === "registered" ? "Account created" : "You're in"}</p>
                  <p className="display-s mt-3 text-4xl">
                    {phase === "registered"
                      ? "One more step."
                      : `Welcome${welcome.created ? "" : " back"}, ${welcome.name.split(" ")[0]}.`}
                  </p>
                  <p className="label mt-4 opacity-70">
                    {phase === "registered" ? "Taking you to sign in…" : "Taking you there…"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (phase === "registered") {
                        const p = new URLSearchParams(params);
                        p.delete("mode");
                        setParams(p, { replace: true });
                        setPassword("");
                        setPhase("idle");
                      } else {
                        navigate(next, { replace: true });
                      }
                    }}
                    className="label mt-6 border-b border-current pb-1"
                  >
                    {phase === "registered" ? "Sign in now →" : "Continue now →"}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={submit} noValidate className="mt-9">
                  <AnimatePresence initial={false}>
                    {signup && (
                      <motion.div
                        key="name"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={grow}
                        className="-mx-2 overflow-hidden px-2 pb-7 pt-2"
                      >
                        <AuthField
                          label="Your name"
                          name="name"
                          autoComplete="name"
                          value={name}
                          onChange={edit(setName, "name")}
                          error={errors.name}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AuthField
                    label="Email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@yourtable.com"
                    value={email}
                    onChange={edit(setEmail, "email")}
                    error={errors.email}
                  />

                  <div className="mt-7">
                    <AuthField
                      label="Password"
                      name="password"
                      type={show ? "text" : "password"}
                      autoComplete={signup ? "new-password" : "current-password"}
                      value={password}
                      onChange={edit(setPassword, "password")}
                      error={errors.password}
                      adornment={
                        <button
                          type="button"
                          aria-pressed={show}
                          onClick={() => setShow((v) => !v)}
                          className="label border-b border-current pb-0.5"
                        >
                          {show ? "Hide" : "Show"}
                        </button>
                      }
                    />
                    <AnimatePresence initial={false}>
                      {signup && (
                        <motion.div
                          key="meter"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={grow}
                          className="overflow-hidden"
                        >
                          <Strength pw={password} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <label className="label mt-7 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="h-4 w-4 border border-soil transition-colors peer-checked:bg-soil peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-soil"
                    />
                    Keep me signed in on this device
                  </label>

                  {errors.form && (
                    <p role="alert" className="label mt-6 text-chili">✕ {errors.form}</p>
                  )}

                  <button
                    type="submit"
                    disabled={phase === "sending"}
                    className="label mt-7 flex h-14 w-full items-center justify-between bg-soil px-6 text-paper transition-colors duration-200 hover:bg-chili disabled:opacity-60"
                  >
                    <Roll value={phase === "sending" ? "Checking…" : copy.cta} height="1.5em" />
                    <span aria-hidden>→</span>
                  </button>

                  <p className="label mt-5 opacity-60">
                    By continuing you agree to our{" "}
                    <Link to="/terms" className="border-b border-current">Terms</Link> and{" "}
                    <Link to="/privacy" className="border-b border-current">Privacy policy</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.section>

        {/* ---------- the coloured sheet ---------- */}
        <motion.section
          aria-hidden="true"
          initial={false}
          animate={{ x: desktop && signup ? "-100%" : "0%", backgroundColor: PANEL[mode] }}
          transition={move}
          className="relative z-10 order-first h-[36svh] min-h-[240px] overflow-hidden text-paper lg:absolute lg:inset-y-0 lg:left-1/2 lg:order-none lg:h-auto lg:min-h-0 lg:w-1/2"
        >
          {/* the giant tone-on-tone word */}
          <div className="absolute inset-0 grid place-items-center">
            <span className="block overflow-hidden px-[0.05em] py-[0.08em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={copy.word}
                  initial={{ y: "105%" }}
                  animate={{ y: 0, transition: { duration: reduce ? 0 : 0.8, delay: 0.2, ease: OUT } }}
                  exit={{ y: "-105%", transition: { duration: reduce ? 0 : 0.4 } }}
                  className="display block whitespace-nowrap text-[min(30vw,24svh)] font-semibold opacity-[0.14] lg:text-[min(15.5vw,34svh)]"
                >
                  {copy.word}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <p className="label absolute left-5 top-5 opacity-80 lg:left-8 lg:top-8">
            The Field Journal / {copy.tag}
          </p>

          <div className="absolute inset-0 flex items-center justify-center px-8 pb-4 lg:pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={copy.word}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: reduce ? 0 : 0.65, delay: 0.2, ease: OUT }}
                className="w-full max-w-md"
              >
                <div className="flex items-center justify-between label opacity-70">
                  <span>FIELD NOTE / 01</span>
                  <span>{signup ? "NEW" : "RETURNING"}</span>
                </div>
                <motion.div
                  className="mt-4 h-px origin-left bg-paper/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduce ? 0 : 0.9, delay: 0.35, ease: OUT }}
                />
                <p className="display mt-8 text-[clamp(3rem,7vw,7rem)] leading-[0.85]">
                  {copy.word}
                </p>
                <motion.div
                  className="mt-8 h-px origin-left bg-paper/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduce ? 0 : 0.9, delay: 0.55, ease: OUT }}
                />
                <p className="label mt-4 max-w-[22rem] opacity-70">
                  {signup ? "A quiet place for what you keep." : "Your place, kept close."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-8 bottom-8 hidden lg:block">
            <p className="label opacity-70">What an account does</p>
            <ul className="mt-3">
              {PERKS.map((p) => (
                <li key={p} className="hair py-3 text-sm">{p}</li>
              ))}
            </ul>
          </div>
        </motion.section>
      </div>
    </main>
  );
}