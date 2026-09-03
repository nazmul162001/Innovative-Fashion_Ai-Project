import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { lookCollections, type LookItem, type WearTab } from '../data/looks';
import LookCarousel from './LookCarousel';
import TryOnStage, {
  TRYON_CAMERA_INPUT_ID,
  TRYON_GALLERY_INPUT_ID,
  type TryOnStep,
} from './TryOnStage';
import TryOnSidebar, { TRYON_SIDEBAR_RESERVE_PX, tryOnSidebarTransition } from './TryOnSidebar';
import { showToast, toastMessage } from '../stores/shop';

function useDesktopPush() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return desktop;
}

const TABS: { id: WearTab; label: string }[] = [
  { id: 'womenswear', label: 'Womenswear' },
  { id: 'menswear', label: 'Menswear' },
];

export default function TryOnExperience() {
  const [tab, setTab] = useState<WearTab>('womenswear');
  const [selfie, setSelfie] = useState<string | null>(null);
  const [activeLook, setActiveLook] = useState<LookItem | null>(null);
  const [lookSession, setLookSession] = useState<LookItem | null>(null);
  const [dockDismissed, setDockDismissed] = useState(false);
  const [step, setStep] = useState<TryOnStep>('upload');
  const dockPointer = useRef<{ y: number; moved: boolean } | null>(null);
  const toast = useStore(toastMessage, { ssr: 'initial' });
  const ready = step === 'ready';
  const desktop = useDesktopPush();
  const sidebarOpen = ready && Boolean(activeLook);
  const pushFeed = sidebarOpen && desktop;
  const showDock = ready && !sidebarOpen && Boolean(lookSession) && !dockDismissed;

  const openLook = (look: LookItem) => {
    setLookSession(look);
    setActiveLook(look);
    setDockDismissed(false);
  };

  useEffect(() => {
    return () => {
      if (selfie) URL.revokeObjectURL(selfie);
    };
  }, [selfie]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (selfie) URL.revokeObjectURL(selfie);
    const url = URL.createObjectURL(file);
    setSelfie(url);
  };

  const onDockPointerDown = (event: ReactPointerEvent) => {
    dockPointer.current = { y: event.clientY, moved: false };
  };

  const onDockPointerMove = (event: ReactPointerEvent) => {
    if (!dockPointer.current) return;
    if (Math.abs(event.clientY - dockPointer.current.y) > 8) {
      dockPointer.current.moved = true;
    }
  };

  const onDockPointerUp = (event: ReactPointerEvent) => {
    if (!dockPointer.current || !lookSession) {
      dockPointer.current = null;
      return;
    }
    const dy = dockPointer.current.y - event.clientY;
    const moved = dockPointer.current.moved;
    dockPointer.current = null;

    if (!moved) {
      openLook(lookSession);
      return;
    }
    if (dy > 40) openLook(lookSession);
    else if (dy < -40) setDockDismissed(true);
  };

  return (
    <motion.div
      className={`min-w-0 origin-left ${showDock || toast ? 'pb-32' : 'pb-20'}`}
      initial={false}
      animate={{ paddingRight: pushFeed ? TRYON_SIDEBAR_RESERVE_PX : 0 }}
      transition={tryOnSidebarTransition}
    >
      <TryOnStage selfie={selfie} onStepChange={setStep} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className={`mx-auto max-w-7xl px-4 text-center md:px-6 ${ready ? 'mt-8' : 'mt-16'}`}
      >
        {ready ? null : (
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Pick a look. Make it yours.</h2>
        )}
        <div className={`flex justify-center gap-6 sm:gap-8 ${ready ? 'mt-0' : 'mt-8'}`} role="tablist" aria-label="Try-on categories">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`relative pb-3 text-base sm:text-lg ${
                  active ? 'text-white' : 'text-white/45 hover:text-white/70'
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full transition-opacity duration-200 ${
                    active ? 'bg-white opacity-100' : 'bg-white opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.28 }}
          className="mx-auto max-w-7xl"
        >
          {lookCollections[tab].map((collection) => (
            <LookCarousel
              key={collection.id}
              collection={collection}
              onSelect={(look) => {
                if (!ready) {
                  showToast('Finish creating your avatar first');
                  return;
                }
                openLook(look);
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <input
        id={TRYON_GALLERY_INPUT_ID}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      <input
        id={TRYON_CAMERA_INPUT_ID}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => onFile(event.target.files?.[0])}
      />

      {lookSession ? (
        <TryOnSidebar
          look={lookSession}
          open={sidebarOpen}
          onClose={() => setActiveLook(null)}
          onSelectLook={openLook}
        />
      ) : null}

      <AnimatePresence>
        {showDock ? (
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[70] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 touch-none"
          >
            <div
              className="flex cursor-grab items-center rounded-2xl bg-[#3b517d] px-4 py-3.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.4)] active:cursor-grabbing"
              onPointerDown={onDockPointerDown}
              onPointerMove={onDockPointerMove}
              onPointerUp={onDockPointerUp}
              onPointerCancel={() => {
                dockPointer.current = null;
              }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <ChevronUp size={18} />
                <span className="text-sm font-medium">See all your looks</span>
              </div>
              <button
                type="button"
                aria-label="Hide looks bar"
                onClick={(event) => {
                  event.stopPropagation();
                  setDockDismissed(true);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                className="ml-3 grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
