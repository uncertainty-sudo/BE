'use client';

export default function Section({title, description, children, actions}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </header>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
