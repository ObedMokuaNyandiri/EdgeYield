import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { syncData } from '../db/sync';

export default function OfflineIndicator({ isSyncing }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    // Strictly enforce the check on component mount in case the browser cached the state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Automatically trigger sync when coming online
      syncData().catch(console.error);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isSyncing) {
    return (
      <div className="badge badge-syncing">
        <RefreshCw size={16} className="animate-pulse" />
        Syncing...
      </div>
    );
  }

  if (isOnline) {
    return (
      <div className="badge badge-online">
        <Wifi size={16} />
        Online
      </div>
    );
  }

  return (
    <div className="badge badge-offline">
      <WifiOff size={16} />
      Offline (Saving locally)
    </div>
  );
}
