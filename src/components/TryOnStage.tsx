import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, Loader2, Pause, Play } from 'lucide-react';
import {
  AVATAR_POSES,
  AVATAR_SIZES,
  GENERATE_GARMENTS,
  HERO_LOOKS,
  type AvatarSize,
} from '../data/looks';
import { showToast } from '../stores/shop';

export type TryOnStep = 'upload' | 'size' | 'generating' | 'poses' | 'ready';

interface TryOnStageProps {
  selfie: string | null;
  onRequestPhoto: () => void;
  onStepChange?: (step: TryOnStep) => void;
}

const GENERATE_MS = 9000;
const SAVE_MS = 2400;

export default function TryOnStage({ selfie, onRequestPhoto, onStepChange }: TryOnStageProps) {
  const [step, setStep] = useState<TryOnStep>('upload');
  const [size, setSize] = useState<AvatarSize | null>(null);
  const [poseId, setPoseId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const go = (next: TryOnStep) => setStep(next);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (!selfie) return;
    setStep((current) => (current === 'upload' ? 'size' : current));
  }, [selfie]);

  useEffect(() => {
    if (step !== 'generating') return;
    const timer = window.setTimeout(() => setStep('poses'), GENERATE_MS);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (!saving) return;
    const timer = window.setTimeout(() => {
      setSaving(false);
      setStep('ready');
    }, SAVE_MS);
    return () => window.clearTimeout(timer);
  }, [saving]);

  useEffect(() => {
    if (step !== 'ready') return;
    showToast('Saved! Tap on any product to Try it on.', 4500);
  }, [step]);

  const selectedPose = AVATAR_POSES.find((pose) => pose.id === poseId) ?? AVATAR_POSES[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-8"
    >
      <AnimatePresence mode="wait">
        {step === 'upload' ? (
          <motion.div key="upload" {...fade} className="overflow-hidden rounded-[28px] bg-[#2a2c2f]">
            <UploadHero selfie={selfie} onRequestPhoto={onRequestPhoto} />
          </motion.div>
        ) : null}

        {step === 'size' ? (
          <motion.div key="size" {...fade} className="overflow-hidden rounded-[28px] bg-[#2a2c2f]">
            <SizeStep
              selected={size}
              onSelect={setSize}
              onGenerate={() => go('generating')}
              onSkip={() => go('generating')}
            />
          </motion.div>
        ) : null}

        {step === 'generating' ? (
          <motion.div key="generating" {...fade} className="overflow-hidden rounded-[28px] bg-[#2a2c2f]">
            <GeneratingStep />
          </motion.div>
        ) : null}

        {step === 'poses' ? (
          <motion.div key="poses" {...fade} className="overflow-hidden rounded-[28px] bg-[#2a2c2f]">
            <PoseStep
              selectedId={poseId}
              saving={saving}
              onSelect={setPoseId}
              onSave={() => {
                if (!poseId || saving) return;
                setSaving(true);
              }}
              onStartOver={() => {
                setPoseId(null);
                setSize(null);
                go('size');
              }}
            />
          </motion.div>
        ) : null}

        {step === 'ready' ? (
          <motion.div key="ready" {...fade} className="overflow-hidden rounded-[28px] bg-[#2a2c2f]">
            <ReadyBar poseImage={selectedPose?.image ?? null} onBack={() => go('poses')} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
};

function UploadHero({ selfie, onRequestPhoto }: { selfie: string | null; onRequestPhoto: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImage = HERO_LOOKS[heroIndex] ?? HERO_LOOKS[0];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_LOOKS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="grid md:h-[540px] md:grid-cols-2 lg:h-[580px]">
      <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
        <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-[52px] md:leading-[1.05]">
          See yourself in every look.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
          One photo. Endless outfits. Watch pieces drape, move, and match on you — before anything ships.
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRequestPhoto}
          className="mt-8 inline-flex w-fit rounded-full bg-[#d9d9d9] px-6 py-3 text-sm font-medium text-black"
        >
          {selfie ? 'Use a different photo' : 'Start with your photo'}
        </motion.button>
        <p className="mt-8 text-[11px] leading-relaxed text-white/35 md:mt-10">
          Previews are experimental and may not match real fit. For inspiration only.
        </p>
      </div>
      <div className="relative aspect-[4/5] p-4 md:aspect-auto md:h-full md:p-5">
        <div className="relative h-full overflow-hidden rounded-[22px] bg-[#e7e7e7]">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroImage}
              src={heroImage}
              alt="Virtual try-on look"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </AnimatePresence>
          <motion.button
            type="button"
            aria-label={playing ? 'Pause look' : 'Play look'}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setPlaying((value) => !value)}
            className="absolute right-4 bottom-4 grid h-10 w-10 place-items-center rounded-full bg-white text-black"
          >
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function SizeStep({
  selected,
  onSelect,
  onGenerate,
  onSkip,
}: {
  selected: AvatarSize | null;
  onSelect: (size: AvatarSize) => void;
  onGenerate: () => void;
  onSkip: () => void;
}) {
  const enabled = Boolean(selected);

  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center px-5 py-12 md:min-h-[540px] md:px-10 lg:min-h-[580px]">
      <p className="text-sm text-white/50">Select body size</p>
      <h2 className="mt-3 max-w-xl text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[42px] md:leading-[1.15]">
        Choose a body size for your avatar
      </h2>
      <div className="mt-10 grid w-full max-w-xl grid-cols-4 gap-3 sm:gap-4">
        {AVATAR_SIZES.map((item) => {
          const active = selected === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={`aspect-square rounded-2xl text-lg font-medium text-white transition ${
                active ? 'bg-[#3a3c40] ring-2 ring-white' : 'bg-[#35373b] hover:bg-[#3d3f43]'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <motion.button
        type="button"
        disabled={!enabled}
        whileHover={enabled ? { scale: 1.02 } : undefined}
        whileTap={enabled ? { scale: 0.98 } : undefined}
        onClick={onGenerate}
        className={`mt-10 w-full max-w-md rounded-full py-3.5 text-sm font-medium transition ${
          enabled ? 'bg-[#d9d9d9] text-black' : 'cursor-not-allowed bg-[#5c5e62] text-white/45'
        }`}
      >
        Generate
      </motion.button>
      <button type="button" onClick={onSkip} className="mt-5 text-sm text-white underline underline-offset-4">
        Skip
      </button>
    </div>
  );
}

function GeneratingStep() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const garment = GENERATE_GARMENTS[index] ?? GENERATE_GARMENTS[0];

  useEffect(() => {
    const ms = reduceMotion ? 2800 : 2200;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % GENERATE_GARMENTS.length);
    }, ms);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="relative flex min-h-[520px] flex-col items-center justify-center px-5 py-12 md:min-h-[540px] lg:min-h-[580px]">
      <motion.div
        className="pointer-events-none absolute top-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500"
        initial={{ width: '6%' }}
        animate={{ width: '100%' }}
        transition={{ duration: GENERATE_MS / 1000, ease: 'linear' }}
      />

      <div className="relative h-[340px] w-[250px] sm:h-[390px] sm:w-[280px]">
        <div className="absolute inset-0 overflow-hidden rounded-[22px] bg-[#d8d8d8] shadow-2xl">
          <AnimatePresence initial={false}>
            <motion.img
              key={garment}
              src={garment}
              alt=""
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: reduceMotion ? 0.4 : 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
          </AnimatePresence>
          {reduceMotion ? null : (
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-white/25 to-transparent"
              animate={{ top: ['-30%', '110%'] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>

        <div className="absolute top-[40%] -left-[4.25rem] z-10 w-[7.25rem] overflow-hidden rounded-2xl bg-white shadow-xl sm:-left-[4.75rem] sm:w-[8.25rem]">
          <div className="relative aspect-square">
            <AnimatePresence initial={false}>
              <motion.img
                key={`card-${garment}`}
                src={garment}
                alt=""
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-white/70">Bringing your selfie to life...</p>
      <p className="mt-8 text-center text-[11px] leading-relaxed text-white/35">
        Generative AI can make mistakes.
        <br />
        Fit and appearance won&apos;t be exact.
      </p>
    </div>
  );
}

function PoseCard({
  pose,
  active,
  onSelect,
}: {
  pose: (typeof AVATAR_POSES)[number];
  active: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`relative w-[46%] shrink-0 overflow-hidden rounded-2xl sm:w-auto ${
        active ? 'ring-2 ring-white' : 'ring-1 ring-white/35'
      }`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#d8d8d8]">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.58 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '50% 16%' }}
        >
          <img
            src={pose.image}
            alt={pose.name}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 18%' }}
          />
        </motion.div>
      </div>
      <span
        className={`absolute top-3 right-3 z-20 grid h-5 w-5 place-items-center rounded-full border border-white ${
          active ? 'bg-white' : 'bg-black/20'
        }`}
      >
        {active ? <span className="h-2 w-2 rounded-full bg-[#2a2c2f]" /> : null}
      </span>
    </button>
  );
}

function PoseStep({
  selectedId,
  saving,
  onSelect,
  onSave,
  onStartOver,
}: {
  selectedId: string | null;
  saving: boolean;
  onSelect: (id: string) => void;
  onSave: () => void;
  onStartOver: () => void;
}) {
  const enabled = Boolean(selectedId) && !saving;

  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center px-5 py-10 md:min-h-[540px] md:px-10 lg:min-h-[580px]">
      <p className="text-sm text-white/50">All done!</p>
      <h2 className="mt-3 max-w-2xl text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[40px] md:leading-[1.15]">
        Save your favorite, then start trying things on
      </h2>

      <div className="mt-8 flex w-full max-w-4xl gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible">
        {AVATAR_POSES.map((pose) => (
          <PoseCard
            key={pose.id}
            pose={pose}
            active={selectedId === pose.id}
            onSelect={() => onSelect(pose.id)}
          />
        ))}
      </div>

      <motion.button
        type="button"
        disabled={!enabled}
        whileHover={enabled ? { scale: 1.02 } : undefined}
        whileTap={enabled ? { scale: 0.98 } : undefined}
        onClick={onSave}
        className={`relative mt-8 w-full max-w-md overflow-hidden rounded-full py-3.5 text-sm font-medium ${
          enabled || saving ? 'bg-[#d9d9d9] text-black' : 'cursor-not-allowed bg-[#5c5e62] text-white/45'
        }`}
      >
        {saving ? (
          <>
            <motion.span
              className="absolute inset-y-0 left-0 bg-black/10"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SAVE_MS / 1000, ease: 'linear' }}
            />
            <span className="relative inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Saving
            </span>
          </>
        ) : (
          'Save'
        )}
      </motion.button>

      <p className="mt-5 text-sm text-white/70">
        Don&apos;t like any of these?{' '}
        <button type="button" onClick={onStartOver} className="underline underline-offset-4">
          Start over
        </button>
      </p>
      <p className="mt-6 text-[11px] text-white/35">
        AI images may include mistakes.{' '}
        <button
          type="button"
          className="underline underline-offset-2"
          onClick={() => showToast('Thanks — feedback noted')}
        >
          Give feedback
        </button>
      </p>
    </div>
  );
}

function ReadyBar({
  poseImage,
  onBack,
}: {
  poseImage: string | null;
  onBack: () => void;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-4 sm:items-center sm:gap-4 md:gap-5 md:px-6 md:py-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex shrink-0 items-center gap-1 pt-1 text-sm text-white/80 hover:text-white sm:pt-0"
      >
        <ChevronLeft size={18} />
        Back
      </button>
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-[#d8d8d8] sm:h-[72px] sm:w-[52px]">
        {poseImage ? (
          <img src={poseImage} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 18%' }} />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white/50">Let&apos;s get started</p>
        <p className="mt-0.5 text-[17px] leading-snug font-semibold tracking-tight wrap-break-word text-white sm:text-2xl md:text-[28px] md:leading-tight">
          Try on a look below or search for something new
        </p>
      </div>
    </div>
  );
}
