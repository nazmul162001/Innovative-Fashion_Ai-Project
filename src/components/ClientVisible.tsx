'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Defers mounting until the section is near the viewport — Next equivalent of Astro client:visible.
 */
export default function ClientVisible({
  children,
  rootMargin = '200px 0px',
  placeholder,
}: {
  children: ReactNode;
  rootMargin?: string;
  placeholder?: ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!node || show) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, rootMargin, show]);

  return (
    <div ref={setNode}>
      {show ? children : (placeholder ?? <div className="min-h-[12rem]" aria-hidden />)}
    </div>
  );
}
