import { useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  type: 'candy' | 'ice_cream';
  lat: number;
  lng: number;
  rating: number;
  priceRange: '$' | '$$' | '$$$';
  hours: string;
  isOpen: boolean;
  description: string;
  reportedBy: string;
  timestamp: Date;
  synced?: boolean;
}

const STORAGE_KEY = 'sweet-tracker-locations';
const OFFLINE_QUEUE_KEY = 'sweet-tracker-offline-queue';

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<Location[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline queue on mount
    loadOfflineQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveToLocalStorage = (locations: Location[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadFromLocalStorage = (): Location[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored).map((loc: any) => ({
          ...loc,
          timestamp: new Date(loc.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return [];
  };

  const addToOfflineQueue = (location: Location) => {
    const queue = [...offlineQueue, { ...location, synced: false }];
    setOfflineQueue(queue);
    
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  };

  const loadOfflineQueue = () => {
    try {
      const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (stored) {
        const queue = JSON.parse(stored).map((loc: any) => ({
          ...loc,
          timestamp: new Date(loc.timestamp)
        }));
        setOfflineQueue(queue);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline || offlineQueue.length === 0) return;

    try {
      // In a real app, you would sync with your backend here
      console.log('Syncing offline data:', offlineQueue);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark all items as synced
      const syncedQueue = offlineQueue.map(item => ({ ...item, synced: true }));
      
      // Clear the offline queue
      setOfflineQueue([]);
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
      
      // Show success notification
      if ('serviceWorker' in navigator && 'Notification' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Sweet Tracker', {
            body: `${offlineQueue.length} locations synced successfully!`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png'
          });
        });
      }
      
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    setOfflineQueue([]);
  };

  return {
    isOnline,
    offlineQueue,
    saveToLocalStorage,
    loadFromLocalStorage,
    addToOfflineQueue,
    syncOfflineData,
    clearAllData
  };
};