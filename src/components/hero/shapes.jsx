/* eslint-disable react-refresh/only-export-components */
const S = ({ children }) => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const shapes = {
  chili: ({ a, b, c }) => (
    <S>
      <path d="M20 22 C42 16 64 36 90 84 C66 70 42 62 24 46 C14 38 12 26 20 22Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M24 28 C40 28 58 42 76 72" stroke={b} strokeWidth="3" opacity=".55" />
      <path d="M20 22 C17 14 22 8 31 6" stroke={c} strokeWidth="4" />
      <path d="M12 24 C14 16 24 14 28 22 C24 28 16 30 12 24Z" fill={c} />
    </S>
  ),
  jalapeno: ({ a, b, c }) => (
    <S>
      <path d="M24 30 C46 16 74 24 86 46 C94 62 82 80 66 78 C48 76 30 64 24 50 C20 42 20 34 24 30Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M30 34 C46 28 68 34 78 50" stroke={b} strokeWidth="3" opacity=".55" />
      <path d="M24 30 C20 22 24 14 32 12" stroke={c} strokeWidth="4" />
      <path d="M16 32 C16 24 28 22 30 30 C26 36 18 38 16 32Z" fill={c} />
    </S>
  ),
  habanero: ({ a, b, c }) => (
    <S>
      <path d="M50 24 C74 22 90 42 82 64 C78 80 62 92 50 96 C38 92 22 80 18 64 C10 42 26 22 50 24Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M32 40 C30 54 34 68 42 80" stroke={b} strokeWidth="3" opacity=".55" />
      <path d="M50 24 L50 8" stroke={c} strokeWidth="4" />
      <path d="M34 26 C40 16 60 16 66 26 C60 32 40 32 34 26Z" fill={c} />
    </S>
  ),
  bhut: ({ a, b, c }) => (
    <S>
      <path d="M26 20 C52 10 80 30 86 58 C90 76 80 92 68 88 C52 84 44 68 34 56 C22 42 16 26 26 20Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M36 26 C44 34 46 40 44 46 M52 30 C58 40 60 48 58 56 M66 44 C70 52 72 58 70 66 M44 52 C48 58 54 62 60 66" stroke={b} strokeWidth="2.5" opacity=".6" />
      <path d="M26 20 C22 12 26 6 34 4" stroke={c} strokeWidth="4" />
      <path d="M18 22 C18 14 30 12 32 20 C28 26 20 28 18 22Z" fill={c} />
    </S>
  ),
  lime: ({ a, b, c }) => (
    <S>
      <path d="M6 66 A44 44 0 0 1 94 66 Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M14 66 A36 36 0 0 1 86 66 Z" fill={b} />
      <path d="M50 66 L50 30 M50 66 L68 34.8 M50 66 L32 34.8 M50 66 L81 48 M50 66 L19 48" stroke={a} strokeWidth="2" />
    </S>
  ),
  mango: ({ a, b, c }) => (
    <S>
      <path d="M52 8 C84 10 96 42 86 68 C78 90 42 98 22 80 C4 62 16 6 52 8Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M52 20 C76 22 84 44 77 62 C70 80 44 86 30 72 C20 58 28 18 52 20Z" fill={b} />
      <ellipse cx="52" cy="50" rx="10" ry="19" transform="rotate(20 52 50)" fill={a} opacity=".35" />
    </S>
  ),
  garlic: ({ a, b, c }) => (
    <S>
      <path d="M50 8 C52 22 60 26 70 36 C88 52 90 80 70 90 C60 95 40 95 30 90 C10 80 12 52 30 36 C40 26 48 22 50 8Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M50 26 C43 48 43 72 50 92 M37 36 C27 54 30 76 38 90 M63 36 C73 54 70 76 62 90" stroke={b} strokeWidth="2.5" opacity=".7" />
      <path d="M44 93 L42 99 M50 94 L50 100 M56 93 L58 99" stroke={c} strokeWidth="2" />
    </S>
  ),
  leaf: ({ a, b, c }) => (
    <S>
      <path d="M10 90 C8 42 48 10 92 8 C94 50 58 90 10 90Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M10 90 C34 62 56 38 84 16" stroke={b} strokeWidth="2.5" />
      <path d="M34 66 L44 70 M46 52 L58 56 M58 38 L70 40 M30 58 L28 46 M44 44 L44 32" stroke={b} strokeWidth="1.5" opacity=".8" />
    </S>
  ),
  seeds: ({ a, b, c }) => (
    <S>
      {[[22, 30, -30], [52, 22, 20], [76, 40, -60], [34, 58, 40], [62, 64, -15], [46, 82, 70], [80, 80, 10]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="7" ry="3.4" transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? b : a} stroke={c} strokeWidth="1" />
      ))}
    </S>
  ),
  smoke: ({ a }) => (
    <S>
      <path d="M44 98 C20 82 70 70 48 52 C28 36 66 24 50 4" stroke={a} strokeWidth="5" opacity=".7" />
      <path d="M62 90 C48 78 78 68 66 56" stroke={a} strokeWidth="3" opacity=".45" />
    </S>
  ),
  flame: ({ a, b }) => (
    <S>
      <path d="M50 4 C58 28 82 40 80 64 C78 84 62 96 50 96 C36 96 20 84 20 64 C20 50 30 44 34 34 C40 42 44 44 46 44 C44 30 46 16 50 4Z" fill={a} />
      <path d="M50 54 C56 64 66 68 64 80 C62 90 56 92 50 92 C44 92 38 90 38 80 C38 72 46 68 50 54Z" fill={b} />
    </S>
  ),
  drop: ({ a, b, c }) => (
    <S>
      <path d="M50 6 C62 30 80 46 80 64 C80 82 66 94 50 94 C34 94 20 82 20 64 C20 46 38 30 50 6Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M34 62 C34 72 40 80 48 82" stroke={b} strokeWidth="4" opacity=".7" />
    </S>
  ),
  pod: ({ a, b, c }) => (
    <S>
      <path d="M50 4 C82 22 82 78 50 96 C18 78 18 22 50 4Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M50 8 L50 92 M37 16 C28 40 28 60 37 84 M63 16 C72 40 72 60 63 84" stroke={b} strokeWidth="2" opacity=".6" />
    </S>
  ),
  tamarind: ({ a, b, c }) => (
    <S>
      <path d="M8 56 C10 40 24 44 30 34 C38 22 50 32 58 24 C68 14 84 20 90 34 C93 46 84 54 74 56 C64 58 60 70 48 72 C36 74 32 66 24 68 C14 70 6 66 8 56Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M18 56 C30 50 44 56 58 46 C66 40 76 40 84 36" stroke={b} strokeWidth="2.5" opacity=".6" />
    </S>
  ),
  salt: ({ a, b, c }) => (
    <S>
      <path d="M50 8 L86 36 L74 86 L26 86 L14 36Z" fill={a} stroke={c} strokeWidth="2" />
      <path d="M50 8 L50 50 M14 36 L50 50 L86 36 M50 50 L26 86 M50 50 L74 86" stroke={b} strokeWidth="2" opacity=".6" />
    </S>
  ),
  ring: ({ a, b, c }) => (
    <S>
      <circle cx="50" cy="50" r="42" fill={a} stroke={c} strokeWidth="2" />
      <circle cx="50" cy="50" r="31" fill={b} />
      {[[50, 34], [64, 44], [60, 62], [40, 62], [36, 44]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={a} opacity=".75" />
      ))}
      <path d="M50 50 L50 20 M50 50 L78 59 M50 50 L22 59" stroke={a} strokeWidth="2" opacity=".6" />
    </S>
  ),
  spark: ({ a }) => (
    <S>
      <path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4Z" fill={a} />
    </S>
  ),
};