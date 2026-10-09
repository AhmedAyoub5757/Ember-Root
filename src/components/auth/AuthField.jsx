export default function AuthField({
  label,
  name,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
  adornment,
}) {
  return (
    <label className="block">
      <span className="label mb-2 block opacity-70">{label}</span>
      <span className="relative block">
        <input
          id={`a-${name}`}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `a-${name}-error` : undefined}
          className="hair w-full border-b border-soil/30 bg-transparent py-3 pr-16 outline-none transition-colors placeholder:text-soil/35 focus:border-soil"
        />
        {adornment && <span className="absolute right-0 top-3">{adornment}</span>}
      </span>
      {error && (
        <span id={`a-${name}-error`} className="label mt-2 block text-chili">
          {error}
        </span>
      )}
    </label>
  );
}
