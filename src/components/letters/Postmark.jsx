export default function Postmark({ id, city, date, className = "" }) {
  const path = `pm-${id}`;
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" aria-hidden>
      <defs>
        <path id={path} d="M13 50 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
      </defs>
      <circle cx="50" cy="50" r="47" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="26" strokeWidth="0.9" />
      <text fontSize="8.6" fill="currentColor" stroke="none" fontFamily="var(--font-mono)">
        <textPath href={`#${path}`} textLength="226" lengthAdjust="spacing">
          {`${city} · ${date}`.toUpperCase()}
        </textPath>
      </text>
      <path
        d="M32 44 q4 -4 9 0 t9 0 t9 0 t9 0 M32 52 q4 -4 9 0 t9 0 t9 0 t9 0 M32 60 q4 -4 9 0 t9 0 t9 0 t9 0"
        strokeWidth="1"
      />
    </svg>
  );
}