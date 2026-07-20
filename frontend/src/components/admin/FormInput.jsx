export const FormInput = ({ label, error, required, children }) => (
  <div>
    {label && (
      <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 flex items-center gap-1">
        {label}
        {required && <span className="text-ink/60">*</span>}
      </label>
    )}
    {children}
    {error && (
      <span className="text-xs text-red-600 mt-1.5 block">
        {typeof error === 'string' ? error : 'Invalid'}
      </span>
    )}
  </div>
)
