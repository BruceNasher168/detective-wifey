import { useEffect, useState } from 'react';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePwa() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const complete = () => { setInstalled(true); setPrompt(null); };
    const media = window.matchMedia('(display-mode: standalone)');
    const change = () => setInstalled(media.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', complete);
    media.addEventListener('change', change);
    return () => {
      window.removeEventListener('beforeinstallprompt', capture);
      window.removeEventListener('appinstalled', complete);
      media.removeEventListener('change', change);
    };
  }, []);
  const install = async () => {
    if (!prompt || busy) return;
    setBusy(true);
    setError(false);
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch { setError(true); }
    finally { setPrompt(null); setBusy(false); }
  };
  return { installed, canInstall: Boolean(prompt), install, busy, error };
}
