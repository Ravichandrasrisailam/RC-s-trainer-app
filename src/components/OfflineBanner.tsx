import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertCircle, Wifi, Database } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simple health check ping
      const res = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setTimeout(() => setIsTesting(false), 500);
    }
  };

  if (isOnline || dismissed) return null;

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs flex items-center justify-between gap-3 animate-fadeIn backdrop-blur-md select-none">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
          <WifiOff className="w-3 h-3" />
        </div>
        <div>
          <span className="text-amber-300 font-bitcount font-normal block leading-tight">
            Connection Lost • Offline Mode Active
          </span>
          <span className="text-zinc-400 text-[10px] font-mono font-light">
            Local meal & workout tracking are cached. AI analysis will use fast offline fallbacks.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-light"
        >
          <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Pinging...' : 'Retry'}</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-zinc-300 text-[10px] font-mono p-1"
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
