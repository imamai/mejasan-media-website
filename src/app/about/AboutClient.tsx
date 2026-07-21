'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Camera, Heart, Award, Users, Eye, Target, CheckCircle, ArrowRight } from 'lucide-react';
import type { AboutContent } from '@/lib/page-content-schema';

const VALUE_ICONS = [Camera, Heart, Award, Users];

function Counter({ to, active }: { to: number; active: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const step = to / 60;
    const id = setInterval(() => {
      cur += step;
      if (cur >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(id);
  }, [active, to]);
  return <>{val}</>;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-[#E10600]" />
      <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">{text}</span>
    </div>
  );
}

export default function AboutClient({ content }: { content: AboutContent }) {
  const { hero, stats, story, vision, mission, values, process, team, why } = content;

  const statsRef   = useRef(null);
  const storyRef   = useRef(null);
  const mvRef      = useRef(null);
  const valuesRef  = useRef(null);
  const processRef = useRef(null);
  const teamRef    = useRef(null);
  const whyRef     = useRef(null);

  const statsActive   = useInView(statsRef,   { once: true, margin: '-60px' });
  const storyActive   = useInView(storyRef,   { once: true, margin: '-80px' });
  const mvActive      = useInView(mvRef,      { once: true, margin: '-80px' });
  const valuesActive  = useInView(valuesRef,  { once: true, margin: '-80px' });
  const processActive = useInView(processRef, { once: true, margin: '-80px' });
  const teamActive    = useInView(teamRef,    { once: true, margin: '-80px' });
  const whyActive     = useInView(whyRef,     { once: true, margin: '-80px' });

  return (
    <div className="bg-[#0B0B0B]">

      {/* Hero — dark, keeps cinematic feel */}
      <div className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-40" style={{ objectPosition: hero.imagePosition }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#E10600]" />
              <span className="text-[11px] font-display tracking-[0.35em] text-[#E10600] uppercase font-semibold">{hero.label}</span>
              <div className="w-8 h-px bg-[#E10600]" />
            </div>
            <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92]">
              {hero.titleStart} <em className="text-[#E10600] not-italic italic">{hero.titleEm}</em>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Stats — red band, keep as-is */}
      <section ref={statsRef} className="red-band bg-[#E10600] py-14 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div className="text-[clamp(2.5rem,5vw,4.5rem)] font-heading font-light text-white leading-none mb-1">
                <Counter to={Number(value) || 0} active={statsActive} />{suffix}
              </div>
              <div className="text-xs font-display tracking-widest text-white/70 uppercase">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story — light */}
      <section ref={storyRef} className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={storyActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}>
            <SectionLabel text={story.label} />
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-6 leading-[1.05]">{story.heading}</h2>
            <div className="space-y-4 text-[15px] text-[#0F0F0F]/60 leading-[1.8]">
              <p>{story.paragraph1}</p>
              <p>{story.paragraph2}</p>
              <p>{story.paragraph3}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={storyActive ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.15, ease: [0.16,1,0.3,1] }} className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={story.image} alt="Our story" className="w-full h-full object-cover" style={{ objectPosition: story.imagePosition }} />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden sm:block bg-[#E10600] p-7">
              <div className="text-4xl font-heading font-light text-white">{story.badgeNumber}</div>
              <div className="text-xs text-white/80 font-display mt-1">{story.badgeLabel}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission — off-white */}
      <section ref={mvRef} className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid md:grid-cols-2 gap-6">
          {[
            { icon: Eye, title: vision.title, text: vision.text },
            { icon: Target, title: mission.title, text: mission.text },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={mvActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12 }} className="bg-white border border-[#0F0F0F]/[0.07] p-8 sm:p-12">
              <div className="w-12 h-12 bg-[#E10600]/10 flex items-center justify-center mb-6"><Icon size={22} className="text-[#E10600]" /></div>
              <h3 className="text-3xl sm:text-4xl font-heading font-light text-[#0F0F0F] mb-4">{title}</h3>
              <p className="text-[15px] text-[#0F0F0F]/60 leading-[1.8]">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values — white */}
      <section ref={valuesRef} className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="mb-14">
            <SectionLabel text="What Drives Us" />
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F]">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {values.map(({ title, desc }, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={valuesActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-[#F5F5F0] hover:bg-[#EDEDEA] transition-colors p-8 group">
                  <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center mb-5 group-hover:bg-[#E10600]/20 transition-colors">
                    <Icon size={18} className="text-[#E10600]" />
                  </div>
                  <h4 className="text-2xl font-heading font-light text-[#0F0F0F] mb-2">{title}</h4>
                  <p className="text-[13px] text-[#0F0F0F]/55 leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Creative Process — off-white */}
      <section ref={processRef} className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="mb-14">
            <SectionLabel text="How We Work" />
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F]">Our Creative Process</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map(({ num, title, desc }, i) => (
              <motion.div key={num} initial={{ opacity: 0, y: 20 }} animate={processActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }} className="flex gap-5">
                <span className="text-5xl font-heading font-light text-[#E10600]/20 shrink-0 leading-none mt-1">{num}</span>
                <div>
                  <h4 className="font-display font-semibold text-[#0F0F0F] mb-2 text-[15px]">{title}</h4>
                  <p className="text-[13px] text-[#0F0F0F]/55 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team — white */}
      <section ref={teamRef} className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="mb-14">
            <SectionLabel text="The Creatives" />
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F]">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5">
            {team.map(({ name, role, spec, img, imgPosition }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} animate={teamActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-[#F5F5F0] group overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: imgPosition }} />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-1">{spec}</div>
                  <h4 className="text-lg font-heading font-light text-[#0F0F0F]">{name}</h4>
                  <div className="text-[12px] text-[#0F0F0F]/50 font-display mt-0.5">{role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mejasan — off-white */}
      <section ref={whyRef} className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionLabel text={why.label} />
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-10">{why.heading}</h2>
            <div className="space-y-5">
              {why.items.map(({ title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, x: -16 }} animate={whyActive ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.08 }} className="flex gap-4 pb-5 border-b border-[#0F0F0F]/[0.07]">
                  <CheckCircle size={17} className="text-[#E10600] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-semibold text-[#0F0F0F] mb-0.5 text-[14px]">{title}</h4>
                    <p className="text-[13px] text-[#0F0F0F]/55 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={whyActive ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3, ease: [0.16,1,0.3,1] }} className="lg:sticky lg:top-24">
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={why.image} alt="Why Mejasan" className="w-full h-full object-cover" style={{ objectPosition: why.imagePosition }} />
            </div>
            <div className="bg-[#E10600] p-8">
              <h3 className="text-3xl font-heading font-light text-white mb-4">{why.ctaHeading}</h3>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-white text-[#E10600] font-display font-semibold text-[11px] tracking-widest uppercase px-6 py-3 hover:bg-black hover:text-white transition-colors">
                Book a Session <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
