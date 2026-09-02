'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ZoomIn, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getPageContent, galleryDefaults, type GalleryContent } from '@/lib/page-content-schema';

const BUCKET = 'mejasan-media';
const FOLDER = 'gallery';
const PAGE_SIZE = 12;

interface GalleryImage { name: string; url: string; }

/* Vary aspect ratios for masonry-like appearance, matching /portfolio */
function itemAspect(i: number) {
  if (i % 7 === 0) return 'aspect-[3/4]';
  if (i % 5 === 0) return 'aspect-[4/3]';
  return 'aspect-square';
}

function Lightbox({ items, idx, onClose }: { items: GalleryImage[]; idx: number; onClose: () => void }) {
  const [cur, setCur] = useState(idx);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowRight') setCur((i) => Math.min(i + 1, items.length - 1));
      if (e.key === 'ArrowLeft') setCur((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    overlayRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length, onClose]);

  const item = items[cur];
  return (
    <motion.div
      ref={overlayRef}
      role="dialog" aria-modal="true" aria-label="Gallery image"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt="" className="w-full max-h-[82vh] object-contain" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 flex items-end justify-end">
          <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open full image"
            className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <Download size={13} />
          </a>
        </div>
        <button onClick={onClose} aria-label="Close lightbox"
          className="absolute top-3 right-3 w-9 h-9 bg-black/70 flex items-center justify-center text-white hover:bg-[#E10600] transition-colors">
          <X size={16} />
        </button>
        {cur > 0 && (
          <button onClick={() => setCur((c) => c - 1)} aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 flex items-center justify-center text-white hover:bg-[#E10600] transition-colors">
            <ChevronLeft size={20} />
          </button>
        )}
        {cur < items.length - 1 && (
          <button onClick={() => setCur((c) => c + 1)} aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 flex items-center justify-center text-white hover:bg-[#E10600] transition-colors">
            <ChevronRight size={20} />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [content, setContent] = useState<GalleryContent>(galleryDefaults);
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    (async () => {
      const sb = createClient();
      try {
        const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'gallery').maybeSingle();
        setContent(getPageContent('gallery', data?.content) as GalleryContent);
      } catch { /* use defaults */ }
      try {
        const { data } = await sb.storage.from(BUCKET).list(FOLDER, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
        if (data) {
          setImages(
            data
              .filter((f) => f.name !== '.emptyFolderPlaceholder')
              .map((f) => ({ name: f.name, url: sb.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${f.name}`).data.publicUrl }))
          );
        }
      } finally { setLoading(false); }
    })();
  }, []);

  const visible = images.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < images.length;
  const loadMore = useCallback(() => setPage((p) => p + 1), []);

  return (
    <div className="bg-[#0B0B0B] min-h-screen">
      <div className="pt-32 pb-14 border-b border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">{content.eyebrow}</span>
            <div className="w-8 h-px bg-[#E10600]" />
          </div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-5">
            {content.titleStart} <em className="text-[#E10600] not-italic italic">{content.titleEm}</em>
          </h1>
          <p className="text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed">{content.intro}</p>
        </div>
      </div>

      <div ref={ref} className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
        {!loading && images.length === 0 && (
          <p className="text-center py-24 text-white/40 font-display text-sm">{content.emptyStateText}</p>
        )}

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5 items-start">
          <AnimatePresence>
            {visible.map((img, i) => (
              <motion.div
                key={img.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className={`relative overflow-hidden cursor-pointer group ${itemAspect(i)}`}
                onClick={() => setLightbox(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[#0B0B0B]/0 group-hover:bg-[#0B0B0B]/55 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <div className="text-center mt-12">
            <button onClick={loadMore} className="btn-outline px-12">Load More</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox items={visible} idx={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
