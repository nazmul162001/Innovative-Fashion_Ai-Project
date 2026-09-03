'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Download, Share, X } from 'lucide-react';
import { BRAND } from '../lib/brand';

const DISMISS_KEY = 'if-pwa-install-dismissed';
const PROMPT_SEEN_KEY = 'if-pwa-install-seen';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    localStorage.setItem(PROMPT_SEEN_KEY, '1');
  } catch {
    /* ignore */
  }
}

function wasSeen(): boolean {
  try {
    return localStorage.getItem(PROMPT_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const reduceMotion = useReducedMotion();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalone() || wasDismissed() || wasSeen()) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    const delay = window.setTimeout(() => {
      setReady(true);
      markSeen();
      if (isIos()) {
        setIosHint(true);
        setOpen(true);
        return;
      }
      setOpen(true);
    }, 4200);

    return () => {
      window.clearTimeout(delay);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  useEffect(() => {
    if (!ready || wasDismissed() || isStandalone()) return;
    if (deferred) setOpen(true);
  }, [deferred, ready]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (isIos()) {
      setIosHint(true);
      return;
    }
    if (!deferred) return;
    setBusy(true);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === 'accepted') dismiss();
      else setBusy(false);
    } catch {
      setBusy(false);
    }
  };

  const canNativeInstall = Boolean(deferred);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[85] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[24px] border border-white/12 bg-[#161b22]/95 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="flex items-start gap-3 p-4 sm:p-5">
              <img
                src="/icons/icon-192.png"
                alt=""
                width={48}
                height={48}
                className="mt-0.5 h-12 w-12 shrink-0 rounded-2xl border border-white/10"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium tracking-[0.2em] text-accent-cyan uppercase">Install app</p>
                <h2 className="mt-1 text-base font-semibold text-snow">{BRAND.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-mist">
                  {iosHint
                    ? 'Add Inovative to your Home Screen for a faster, full-screen shopping experience.'
                    : 'Install Inovative on your phone or PC — open it like an app, anytime.'}
                </p>

                {iosHint ? (
                  <p className="mt-3 flex items-start gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-fog">
                    <Share size={14} className="mt-0.5 shrink-0 text-accent-cyan" />
                    <span>
                      Tap <strong className="text-snow">Share</strong>, then{' '}
                      <strong className="text-snow">Add to Home Screen</strong>.
                    </span>
                  </p>
                ) : !canNativeInstall ? (
                  <p className="mt-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-fog">
                    Use your browser menu → <strong className="text-snow">Install app</strong> /{' '}
                    <strong className="text-snow">Add to Home screen</strong>.
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  {!iosHint && canNativeInstall ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void install()}
                      className="inline-flex items-center gap-2 rounded-xl bg-accent-blue px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Download size={14} />
                      {busy ? 'Installing…' : 'Install'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={dismiss}
                    className="rounded-xl border border-white/12 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-fog uppercase transition hover:border-white/25 hover:text-snow"
                  >
                    {iosHint || !canNativeInstall ? 'Got it' : 'Not now'}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full p-1.5 text-mist transition hover:bg-white/5 hover:text-snow"
                aria-label="Dismiss install prompt"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
