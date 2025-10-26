'use client';

export default function PageHeader({title, description, actions}) {
  return (
    <header className="page-header flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="page-header__title text-2xl font-semibold text-slate-900">{title}</h1>
        {description ? <p className="page-header__description mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="page-header__actions flex gap-2">{actions}</div> : null}
    </header>
  );
}
