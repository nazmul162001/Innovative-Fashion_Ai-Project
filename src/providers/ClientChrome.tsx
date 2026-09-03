'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import NavigationEffects from './NavigationEffects';

const Drawers = dynamic(() => import('../components/Drawers'), { ssr: false });
const Toaster = dynamic(() => import('../components/Toaster'), { ssr: false });
const FloatingCart = dynamic(() => import('../components/FloatingCart'), { ssr: false });
const SplashLoader = dynamic(() => import('../components/SplashLoader'), { ssr: false });
const InstallPrompt = dynamic(() => import('../components/InstallPrompt'), { ssr: false });

/**
 * Client-only chrome. Mounts after hydration so `dynamic(..., { ssr: false })`
 * islands never disagree with the server HTML.
 */
export default function ClientChrome() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <NavigationEffects />
      {mounted ? (
        <>
          <Drawers />
          <Toaster />
          <FloatingCart />
          <SplashLoader />
          <InstallPrompt />
        </>
      ) : null}
    </>
  );
}
