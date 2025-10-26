'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import {useAuth} from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const {login, isAuthenticated} = useAuth();
  const [form, setForm] = useState({username: '', password: ''});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      router.push('/dashboard');
    } catch (err) {
      const message = err?.body?.detail ?? err?.message ?? '로그인에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8">
      <PageHeader title="로그인" description="관리자 계정으로 로그인하여 대시보드를 이용하세요." />
      {isAuthenticated ? (
        <div className="card space-y-2">
          <p className="text-sm">이미 로그인된 상태입니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-700">이메일 또는 사용자명</span>
              <input
                type="text"
                required
                value={form.username}
                onChange={(event) => setForm((prev) => ({...prev, username: event.target.value}))}
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-700">비밀번호</span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((prev) => ({...prev, password: event.target.value}))}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-900/30 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      )}
    </div>
  );
}
