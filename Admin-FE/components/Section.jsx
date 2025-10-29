'use client';

export default function Section({title, description, children, actions}) {
  return (
    <section className="card section space-y-4">
      <header className="section__header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="section__title text-lg font-semibold text-slate-900">{title}</h2>
          {description ? <p className="section__description text-sm text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="section__actions flex gap-2">{actions}</div> : null}
      </header>
      <div className="section__body space-y-4">{children}</div>
    </section>
  );
}
