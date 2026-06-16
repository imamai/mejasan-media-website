'use client';

import { useEffect } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId: number;

    (async () => {
      try {
        const { default: Lenis } = await import('@studio-freight/lenis');
        lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true, wheelMultiplier: 0.8 });
        const raf = (t: number) => { lenis!.raf(t); rafId = requestAnimationFrame(raf); };
        rafId = requestAnimationFrame(raf);
      } catch { /* native scroll fallback */ }
    })();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
