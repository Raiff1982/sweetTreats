import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instructions for browsers that don't support the prompt
      alert(
        'To install Sweet Tracker:\n\n' +
        '📱 iPhone/iPad: Tap Share button → "Add to Home Screen"\n' +
        '🤖 Android: Tap menu (⋮) → "Add to Home screen"\n' +
        '💻 Desktop: Look for install icon in address bar'
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Show again after 24 hours
    setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true);
      }
    }, 24 * 60 * 60 * 1000);
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-slide-up">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-2 rounded-lg">
              <Smartphone className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Install Sweet Tracker</h3>
              <p className="text-xs text-gray-600">Get the full app experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
            <span>Works offline</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
            <span>Faster loading</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
            <span>Home screen access</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-cyan-600 transition-all flex items-center justify-center space-x-1"
          >
            <Download size={14} />
            <span>Install</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;