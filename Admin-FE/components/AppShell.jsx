'use client';

import Link from 'next/link';
import AppSidebar from '@/components/AppSidebar';
import DesignModeSwitcher from '@/components/DesignModeSwitcher';
import {useAuth} from '@/contexts/AuthContext';
import {useUiMode} from '@/contexts/UiModeContext';

const LEGACY_LINKS = [
  {href: '/dashboard', label: '대시보드'},
  {href: '/logs', label: '전체 로그'},
  {href: '/detection-settings', label: '탐지 설정'},
  {href: '/projects', label: '프로젝트'},
  {href: '/system-settings', label: '시스템 설정'}
];

export default function AppShell({children}) {
  const {mode} = useUiMode();
  const {isAuthenticated, logout} = useAuth();

  if (mode === 'legacy') {
    return (
      <div className="legacy-layout">
        <header className="legacy-header">
          <div className="legacy-brand">PII Admin (Legacy)</div>
          <nav className="legacy-nav">
            {LEGACY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="legacy-nav__link">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="legacy-actions">
            {isAuthenticated ? (
              <button className="legacy-logout" onClick={logout} type="button">
                로그아웃
              </button>
            ) : null}
            <DesignModeSwitcher size="sm" />
          </div>
        </header>
        <div className="legacy-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 space-y-6 p-6">
        <div className="flex justify-end">
          <DesignModeSwitcher />
        </div>
        {children}
      </main>
    </div>
  );
}
