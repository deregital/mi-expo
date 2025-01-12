'use client';
import { useEffect, useState } from 'react';

export function InstallPWAButton() {
  const [isIOS, setIsIOS] = useState(false);

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);

      if (!window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Install prompt fired');
        setShowInstall(true);
      }
    }
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  function handleInstallClick() {
    if (!installPrompt) return;
    installPrompt.preventDefault();
    setShowInstall(false);
    installPrompt.prompt();
  }

  return (
    <div>
      {showInstall && isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role='img' aria-label='share icon'>
            {' '}
            ⎋{' '}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role='img' aria-label='plus icon'>
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      )}
      {showInstall && !isIOS && (
        <button
          className='p-2 bg-blue-500 rounded-xl'
          onClick={handleInstallClick}
        >
          Install
        </button>
      )}
    </div>
  );
}
