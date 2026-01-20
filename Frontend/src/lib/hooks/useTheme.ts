import { useEffect, useState } from 'react';
import useZustandStore from '../store/zustand';

export default function useTheme() {
  const zustandTheme = useZustandStore((state: any) => state.theme);
  const setTheme = useZustandStore((state: any) => state.setTheme);
  const [resolvedTheme, setResolvedTheme] = useState<string>(zustandTheme);

  useEffect(() => {
    if (zustandTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      setResolvedTheme(systemTheme);
    } else {
      setResolvedTheme(zustandTheme);
    }
  }, [zustandTheme]);

  return { theme: resolvedTheme, setTheme };
}
