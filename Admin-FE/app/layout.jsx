import './globals.css';
import clsx from 'clsx';
import {Inter} from 'next/font/google';
import {AuthProvider} from '@/contexts/AuthContext';
import AppSidebar from '@/components/AppSidebar';

export const metadata = {
  title: 'PII Admin Console',
  description: 'PII 탐지 관리자 대시보드'
};

const inter = Inter({subsets: ['latin'], display: 'swap', variable: '--font-inter'});

export default function RootLayout({children}) {
  return (
    <html lang="ko" className="bg-slate-100">
      <body className={clsx('min-h-screen bg-slate-100 text-slate-900', inter.variable)}>
        <AuthProvider>
          <div className="flex min-h-screen"> 
            <AppSidebar />
            <main className="flex-1 space-y-6 bg-slate-50/60 p-8">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
