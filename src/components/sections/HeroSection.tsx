'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, ChevronDown, Volume2, VolumeX, X } from 'lucide-react';

const SUB = ['Photography.', 'Videography.', 'Weddings.', 'Corporate Productions.'];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const [subIdx,      setSubIdx]      = useState(0);
  const [muted,       setMuted]       = useState(true);
  const [mounted,     setMounted]     = useState(false);
  const [videoErr,    setVideoErr]    = useState(false);
  const [showReel,    setShowReel]    = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setSubIdx((p) => (p + 1) % SUB.length), 3000);
    return () => clearInterval(id);
  }, []);

  /* Close showreel on Escape */
  useEffect(() => {
    if (!showReel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowReel(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showReel]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <>
      <div ref={containerRef} className="relative h-screen min-h-[700px] flex items-end overflow-hidden bg-[#0B0B0B]">

        {/* Cinematic video background */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.08]">
          {!videoErr ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80"
              onError={() => setVideoErr(true)}
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            >
              {/* Replace with your actual showreel: /videos/hero-showreel.mp4 */}
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-br from-[#120000] via-[#0B0B0B] to-black" />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 70% 20%, rgba(225,6,0,0.18) 0%, transparent 55%),
                radial-gradient(ellipse at 20% 80%, rgba(225,6,0,0.08) 0%, transparent 55%)
              `,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-35"
            style={{ objectPosition: 'center 30%' }}
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 hero-vignette" />

        {/* Scan-line film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* Red left accent */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E10600] origin-top"
        />

        {/* Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-20 sm:pb-24 md:pb-32"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.35em] text-[#E10600] uppercase">
              Mejasan Media Production
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-7">
            {['Stories That', 'Move People.'].map((line, i) => (
              <div key={line} className="overflow-hidden">
                <motion.div
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[clamp(3.2rem,8.5vw,8.5rem)] font-heading font-light leading-[0.9] tracking-tight text-white"
                >
                  {i === 1 ? (
                    <>Move <em className="text-[#E10600] not-italic">People.</em></>
                  ) : line}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Rotating sub-line */}
          <div className="h-8 mb-10 overflow-hidden">
            {mounted && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={subIdx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg sm:text-xl font-display font-light text-white/55 tracking-wide"
                >
                  {SUB[subIdx]}
                </motion.p>
              </AnimatePresence>
            )}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 mb-14 sm:mb-16"
          >
            <Link href="/booking" className="btn-primary group">
              Book a Consultation
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/portfolio" className="btn-outline">
              View Our Work
            </Link>
            {/* Showreel button — opens video modal */}
            <button
              onClick={() => setShowReel(true)}
              aria-label="Watch our showreel"
              className="ml-1 flex items-center gap-2.5 text-white/50 hover:text-white transition-colors group"
            >
              <div className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center group-hover:border-[#E10600]/60 group-hover:bg-[#E10600]/10 transition-all">
                <Play size={12} fill="currentColor" className="ml-0.5" />
              </div>
              <span className="text-[11px] font-display tracking-widest uppercase">Showreel</span>
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-7 border-t border-white/[0.1]"
          >
            {[
              { num: '500+', label: 'Projects' },
              { num: '200+', label: 'Weddings' },
              { num: '8+',   label: 'Years' },
              { num: '50+',  label: 'Corporate Clients' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-heading font-light text-white mb-1">{num}</div>
                <div className="text-[11px] font-display text-white/40 tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mute toggle */}
        {!videoErr && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            onClick={toggleMute}
            aria-label={muted ? 'Unmute background video' : 'Mute background video'}
            className="absolute bottom-7 left-5 sm:left-10 z-20 w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/35 transition-all"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-7 right-6 sm:right-12 z-20 flex flex-col items-center gap-2"
          aria-hidden
        >
          <span className="text-[9px] font-display text-white/50 tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown size={13} className="text-white/50" />
          </motion.div>
        </motion.div>
      </div>

      {/* Showreel modal */}
      <AnimatePresence>
        {showReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center px-4"
            onClick={() => setShowReel(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Showreel video"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-black">
                <video
                  autoPlay
                  controls
                  className="w-full h-full object-cover"
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                >
                  {/* Replace with /videos/showreel.mp4 */}
                </video>
              </div>
              <button
                onClick={() => setShowReel(false)}
                aria-label="Close showreel"
                className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-[12px] font-display tracking-widest uppercase"
              >
                <X size={14} /> Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
