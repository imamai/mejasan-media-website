'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';

const WA_MSG = encodeURIComponent("Hi, I would like to enquire about your media production services.");
const WA_NUM = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254700864849';

export default function ContactCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-[#141414] py-24 md:py-32 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E10600]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full bg-[#E10600]/[0.03] blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Let&apos;s Create Together</span>
            <div className="w-8 h-px bg-[#E10600]" />
          </div>

          <h2 className="text-[clamp(2.5rem,6vw,7rem)] font-heading font-light text-white leading-[0.95] mb-8 max-w-4xl mx-auto">
            Your Story Deserves to Be <em className="text-[#E10600] not-italic">Told.</em>
          </h2>

          <p className="text-base sm:text-lg text-white/55 mb-12 max-w-xl mx-auto leading-relaxed">
            Every great project starts with a conversation. Tell us your vision — we&apos;ll bring the expertise, equipment, and artistry to make it real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="btn-primary group">
              Book a Consultation
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline group flex items-center gap-2"
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
