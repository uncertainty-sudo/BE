'use client';

import {AuthProvider} from '@/contexts/AuthContext';
import {UiModeProvider} from '@/contexts/UiModeContext';

export default function Providers({children}) {
  return (
    <AuthProvider>
      <UiModeProvider>{children}</UiModeProvider>
    </AuthProvider>
  );
}
