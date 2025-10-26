'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useAuth} from '@/contexts/AuthContext';

const NAV_LINKS = [
  {href: '/dashboard', label: '대시보드'},
  {href: '/logs', label: '전체 로그'},
  {href: '/detection-settings', label: '탐지 설정'},
  {href: '/projects', label: '프로젝트 관리'},
  {href: '/system-settings', label: '시스템 설정'}
];

export default function AppSidebar() {
  const {isAuthenticated, user, logout} = useAuth();
  const pathname = usePathname();

  return (
    <nav className="flex min-h-screen w-64 flex-col gap-6 bg-slate-950/95 px-6 py-8 text-slate-100 shadow-2xl">
      <div className="space-y-1">
        <span className="text-lg font-semibold tracking-tight">PII Admin</span>
        {isAuthenticated && user ? (
          <p className="text-xs text-slate-400">{user.email ?? user.username}</p>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {NAV_LINKS.map(({href, label}) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                'rounded-lg px-4 py-2 text-sm font-medium transition',
                active
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              ].join(' ')}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <div className="space-y-2">
        {isAuthenticated ? (
          <button
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            onClick={logout}
          >
            로그아웃
          </button>
        ) : (
          <Link
            href="/login"
            className="block rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
