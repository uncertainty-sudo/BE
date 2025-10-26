'use client';

export default function ToggleField({label, description, checked, onChange, disabled = false}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-transparent p-3 transition hover:border-slate-200">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>
    </label>
  );
}
