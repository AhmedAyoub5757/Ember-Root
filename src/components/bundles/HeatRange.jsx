export default function HeatRange({ picks }) {
  if (!picks.length) {
    return <p className="label opacity-50">Choose varieties to see the heat range.</p>;
  }

  const values = picks.map((pick) => pick.heat);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const left = `${((min - 1) / 4) * 100}%`;
  const width = `${((max - min) / 4) * 100}%`;
  const diamond = `${((average - 1) / 4) * 100}%`;

  return (
    <div aria-label={`Heat range from ${min} to ${max} of 5`}>
      <div className="relative mt-5 h-7">
        <div className="absolute inset-x-0 top-3 h-1 bg-soil/15" />
        <div className="absolute top-3 h-1 bg-chili/60" style={{ left, width: Math.max(3, parseFloat(width)) + "%" }} />
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="absolute top-1 h-5 w-px bg-soil/40"
            style={{ left: `${(index / 4) * 100}%` }}
          />
        ))}
        <span
          className="absolute top-[7px] h-3 w-3 -translate-x-1/2 rotate-45 bg-turmeric ring-2 ring-paper"
          style={{ left: diamond }}
          aria-hidden
        />
      </div>
      <div className="label flex justify-between opacity-60">
        <span>Gentle</span><span>Warm</span><span>Hot</span><span>Fierce</span><span>Reckless</span>
      </div>
      <p className="display-s mt-3 text-xl">
        {min === max ? `Heat level ${min}` : `${["Gentle", "Warm", "Hot", "Fierce", "Reckless"][min - 1]} to ${["Gentle", "Warm", "Hot", "Fierce", "Reckless"][max - 1]}`}
      </p>
    </div>
  );
}
