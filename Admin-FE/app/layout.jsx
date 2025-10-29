import './globals.css';
import './legacy-theme.css';
import Providers from './providers';
import AppShell from '@/components/AppShell';

const DEFAULT_UI_MODE = process.env.NEXT_PUBLIC_DEFAULT_UI_MODE ?? 'modern';

export const metadata = {
  title: 'PII Admin Console',
  description: 'PII 탐지 관리자 대시보드'
};

export default function RootLayout({children}) {
  return (
    <html lang="ko">
      <body
        className="min-h-screen bg-slate-100 text-slate-900"
        data-ui-mode={DEFAULT_UI_MODE}
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
