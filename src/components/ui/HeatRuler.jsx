export default function HeatRuler({ level = 1, color = "currentColor" }) {
  return (
    <div className="flex items-end gap-[3px]" aria-label={`Heat level ${level} of 5`}>
      {Array.from({ length: 25 }).map((_, i) => {
        const major = i % 5 === 0;
        const active = i < level * 5;
        return (
          <span
            key={i}
            style={{ background: active ? color : "currentColor", opacity: active ? 1 : 0.2 }}
            className={`w-[2px] ${major ? "h-5" : "h-3"}`}
          />
        );
      })}
    </div>
  );
}