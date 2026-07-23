'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Check } from 'lucide-react';
import type { ContactContent } from '@/lib/page-content-schema';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email address'),
  phone:   z.string().optional(),
  subject: z.string().min(2, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

/* Icon is chosen by matching the row's label — keeps the CMS schema to plain
 * text fields instead of needing an icon-picker field type. */
function iconFor(label: string) {
  const l = label.toLowerCase();
  if (l.includes('whatsapp')) return MessageCircle;
  if (l.includes('phone')) return Phone;
  if (l.includes('email') || l.includes('mail')) return Mail;
  return MapPin;
}

export default function ContactPage({ content }: { content: ContactContent }) {
  const [done, setDone] = useState(false);
  const [sending, setSend] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const waMsg = encodeURIComponent(content.whatsappMessage);
  const waHref = content.info.find((r) => r.label.toLowerCase().includes('whatsapp'))?.href || 'https://wa.me/254700864849';

  const onSubmit = async (data: FormData) => {
    setSend(true);
    try {
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...data, type: 'contact' }) });
      if (!res.ok) throw new Error('Failed');
      setDone(true);
      toast.success("Message sent! We'll respond within 24 hours.");
    } catch { toast.error('Something went wrong. Please try again.'); }
    finally { setSend(false); }
  };

  const inputCls = "input-light";
  const labelCls = "block text-[11px] font-display font-semibold tracking-widest uppercase text-[#0F0F0F]/50 mb-2";

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="pt-32 pb-16 border-b border-[#0F0F0F]/[0.06]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">{content.hero.label}</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-[#0F0F0F] leading-[0.92]">
            {content.hero.titleStart} <em className="text-[#E10600] not-italic italic">{content.hero.titleEm}</em>
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-20 grid lg:grid-cols-2 gap-16">
        {/* Info column */}
        <div>
          <p className="text-[15px] text-[#0F0F0F]/60 leading-[1.8] mb-10 max-w-md">
            {content.intro}
          </p>

          <div className="space-y-6 mb-12">
            {content.info.map(({ label, value, href }) => {
              const Icon = iconFor(label);
              return (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#E10600]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-display tracking-widest text-[#0F0F0F]/55 uppercase mb-0.5">{label}</div>
                    {href ? (
                      <a href={href.startsWith('https://wa.me') ? `${href}?text=${waMsg}` : href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-[15px] text-[#0F0F0F]/75 hover:text-[#E10600] transition-colors font-display">{value}</a>
                    ) : (
                      <span className="text-[15px] text-[#0F0F0F]/75 font-display">{value}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Google Maps — normal colours on light page */}
          <div className="relative h-64 overflow-hidden border border-[#0F0F0F]/[0.08]">
            <iframe
              src={content.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mejasan Media Location"
            />
          </div>
        </div>

        {/* Form column */}
        <div>
          {done ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 bg-[#E10600]/10 flex items-center justify-center mb-6">
                <Check size={28} className="text-[#E10600]" />
              </div>
              <h2 className="text-3xl font-heading font-light text-[#0F0F0F] mb-3">Message Sent!</h2>
              <p className="text-[#0F0F0F]/55 text-sm max-w-xs">We&apos;ve received your message and will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input type="text" autoComplete="name" {...register('name')} className={inputCls} />
                  {errors.name && <p className="text-[#E10600] text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input type="email" autoComplete="email" {...register('email')} className={inputCls} />
                  {errors.email && <p className="text-[#E10600] text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>Phone (optional)</label>
                <input type="tel" autoComplete="tel" {...register('phone')} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Subject *</label>
                <input {...register('subject')} className={inputCls} />
                {errors.subject && <p className="text-[#E10600] text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Message *</label>
                <textarea
                  {...register('message')}
                  rows={6}
                  placeholder="Tell us about your project, event date, location, and any specific requirements..."
                  className={`${inputCls} resize-none`}
                />
                {errors.message && <p className="text-[#E10600] text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button type="submit" disabled={sending} className="btn-primary w-full justify-center group disabled:opacity-50">
                {sending ? 'Sending…' : 'Send Message'}
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-[12px] text-[#0F0F0F]/55 font-display text-center">We respond to all enquiries within 24 hours.</p>

              <a
                href={`${waHref}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-dark w-full justify-center flex items-center gap-2"
              >
                <MessageCircle size={14} /> Prefer WhatsApp? Chat Now
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
