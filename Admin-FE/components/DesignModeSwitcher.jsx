'use client';

import {useUiMode} from '@/contexts/UiModeContext';

const OPTIONS = [
  {value: 'modern', label: '신규 디자인'},
  {value: 'legacy', label: '레거시 디자인'},
];

export default function DesignModeSwitcher({size = 'md'}) {
  const {mode, setMode} = useUiMode();
  const className = size === 'sm' ? 'design-switcher design-switcher--sm' : 'design-switcher';

  return (
    <label className={className}>
      <span className="design-switcher__label">UI 모드</span>
      <select
        value={mode}
        onChange={(event) => setMode(event.target.value)}
        className="design-switcher__select"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
