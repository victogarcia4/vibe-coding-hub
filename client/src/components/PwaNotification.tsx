// PwaNotification — Handles offline status banner & PWA update toast notifications
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useI18n } from "@/i18n/I18nContext";

export default function PwaNotification() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [showOfflineAlert, setShowOfflineAlert] = useState<boolean>(false);
  const { language } = useI18n();
  const isEs = language === "es";

  // Register PWA Service Worker via virtual module
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r?: ServiceWorkerRegistration) {
      console.log("PWA Service Worker registered:", r);
    },
    onRegisterError(error: unknown) {
      console.error("PWA Service Worker registration error:", error);
    },
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      setShowOfflineAlert(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Status Alert */}
      <AnimatePresence>
        {showOfflineAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 z-50 p-3.5 rounded-xl bg-gold-soft border border-gold-border text-xs font-semibold text-text-strong shadow-lg flex items-center gap-3 max-w-sm"
          >
            <WifiOff size={16} className="text-gold flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold font-display">
                {isEs ? "Modo Sin Conexión" : "Offline Mode"}
              </p>
              <p className="text-[11px] text-text-muted font-normal">
                {isEs
                  ? "Estás sin conexión a internet. La aplicación sigue funcionando con la base de datos local."
                  : "You're offline. The app continues working with your local database."
                }
              </p>
            </div>
            <button
              onClick={() => setShowOfflineAlert(false)}
              className="p-1 rounded text-text-subtle hover:text-text-strong"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Update Ready Toast */}
      <AnimatePresence>
        {needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50 p-4 rounded-xl bg-surface-1 border border-signal-border shadow-xl flex items-center gap-3 max-w-sm"
          >
            <RefreshCw size={18} className="text-signal animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold font-display text-text-strong">
                {isEs ? "Nueva versión disponible" : "New version available"}
              </p>
              <p className="text-[11px] text-text-muted">
                {isEs
                  ? "Una nueva actualización está lista para cargarse."
                  : "A new update is ready to load."
                }
              </p>
            </div>
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-signal text-primary-foreground hover:opacity-90 transition-all flex-shrink-0"
            >
              {isEs ? "Recargar" : "Reload"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
