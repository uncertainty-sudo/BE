'use client';

import clsx from 'clsx';

const toneStyles = {
  default: 'bg-white text-slate-900 border-slate-200/80 shadow-soft',
  success: 'bg-emerald-600 text-emerald-50 shadow-soft shadow-emerald-900/30',
  danger: 'bg-rose-600 text-rose-50 shadow-soft shadow-rose-900/30',
  info: 'bg-slate-900 text-white shadow-soft shadow-slate-900/40'
};

export default function DataCard({title, value, description, tone = 'default'}) {
  return (
    <section
      className={clsx(
        'rounded-2xl border p-6 transition duration-200',
        toneStyles[tone] ?? toneStyles.default
      )}
    >
      <p className="text-sm font-semibold uppercase tracking-wide opacity-70">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {description ? <p className="mt-2 text-sm opacity-80">{description}</p> : null}
    </section>
  );
}
