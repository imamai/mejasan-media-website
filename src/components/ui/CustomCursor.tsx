'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a,button,[role="button"],input,textarea,select,[data-hover]';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  const x  = useSpring(rawX, { damping: 22, stiffness: 400, mass: 0.4 });
  const y  = useSpring(rawY, { damping: 22, stiffness: 400, mass: 0.4 });
  const fx = useSpring(rawX, { damping: 18, stiffness: 180, mass: 0.6 });
  const fy = useSpring(rawY, { damping: 18, stiffness: 180, mass: 0.6 });

  /* Use a ref so the effect below doesn't re-run when visible changes */
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    /* Signal to CSS that the cursor component is active */
    document.body.classList.add('cursor-ready');

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visibleRef.current) setVisible(true);
    };

    const onDown = () => setIsClick(true);
    const onUp   = () => setIsClick(false);

    /* Use event delegation on document — no per-element listeners, no duplication */
    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) setIsHover(true);
    };
    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) setIsHover(false);
    };

    window.addEventListener('mousemove',   onMove,       { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup',   onUp);
    document.addEventListener('mouseover',  onMouseOver);
    document.addEventListener('mouseout',   onMouseOut);
    document.addEventListener('mouseleave', () => setVisible(false));
    document.addEventListener('mouseenter', () => setVisible(true));

    return () => {
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup',   onUp);
      document.removeEventListener('mouseover',  onMouseOver);
      document.removeEventListener('mouseout',   onMouseOut);
    };
  }, [rawX, rawY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: isClick ? 0.4 : isHover ? 0 : 1 }}
        transition={{ duration: 0.12 }}
      >
        <div className="w-3 h-3 rounded-full bg-white" />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: fx, y: fy, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: isClick ? 0.6 : isHover ? 2 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isHover ? 'w-10 h-10 border-[#E10600] bg-[#E10600]/10' : 'w-7 h-7 border-white/30'
          }`}
        />
      </motion.div>
    </>
  );
}
