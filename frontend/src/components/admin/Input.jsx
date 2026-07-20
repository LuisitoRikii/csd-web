export const Input = ({ label, required, error, hint, children }) => (
  <div>
    {label && (
      <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 flex items-center gap-1">
        {label}
        {required && <span className="text-ink/60">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <span className="text-xs text-steel mt-1.5 block">{hint}</span>}
    {error && <span className="text-xs text-red-600 mt-1.5 block">{error}</span>}
  </div>
)
