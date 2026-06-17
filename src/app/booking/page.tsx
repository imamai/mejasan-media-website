'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowRight, ArrowLeft, Check, Calendar, Clock } from 'lucide-react';

const SERVICES = ['Wedding Photography', 'Wedding Film', 'Corporate Photography', 'Corporate Video', 'Event Coverage', 'Drone Services', 'Brand Content', 'Product Photography', 'Documentary', 'Other'];
const BUDGETS  = ['Under KES 50,000', 'KES 50,000 – 100,000', 'KES 100,000 – 250,000', 'KES 250,000+', 'To be discussed'];
const HEAR     = ['Google Search', 'Instagram', 'Facebook', 'Referral from Friend', 'Previous Client', 'LinkedIn', 'Other'];

const schema = z.object({
  service:    z.string().min(1, 'Select a service'),
  event_date: z.string().min(1, 'Select a date'),
  event_time: z.string().optional(),
  duration:   z.string().optional(),
  location:   z.string().min(2, 'Enter the event location'),
  first_name: z.string().min(1, 'First name required'),
  last_name:  z.string().min(1, 'Last name required'),
  email:      z.string().email('Enter a valid email address'),
  phone:      z.string().min(7, 'Phone number required'),
  budget:     z.string().min(1, 'Select a budget range'),
  hear:       z.string().optional(),
  message:    z.string().min(10, 'Tell us more about your project (min 10 chars)'),
});

type FormData = z.infer<typeof schema>;

const STEPS = ['Your Event', 'Your Details', 'Your Vision'];

const TODAY = new Date().toISOString().split('T')[0];

const inputCls = "input-light";
const labelCls = "block text-[11px] font-display font-semibold tracking-widest uppercase text-[#0F0F0F]/50 mb-2";

export default function BookingPage() {
  const [step, setStep]    = useState(0);
  const [done, setDone]    = useState(false);
  const [sending, setSend] = useState(false);
  const [ref, setRef]      = useState('');

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const STEP_FIELDS: (keyof FormData)[][] = [
    ['service', 'event_date', 'location'],
    ['first_name', 'last_name', 'email', 'phone', 'budget'],
    ['message'],
  ];

  const nextStep = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = async (data: FormData) => {
    setSend(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'booking' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Submission failed');
      setRef(json.booking_ref ?? 'MJB-NEW');
      setDone(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSend(false);
    }
  };

  if (done) return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 bg-[#E10600]/10 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-[#E10600]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-light text-[#0F0F0F] mb-4">Enquiry Received</h1>
        <p className="text-[#0F0F0F]/60 mb-3 leading-relaxed">Thank you! We&apos;ve received your booking enquiry and will respond within 24 hours.</p>
        {ref && <div className="text-[12px] font-display text-[#E10600] tracking-widest uppercase mb-8">Reference: {ref}</div>}
        <a href="/" className="btn-primary inline-flex">Back to Home</a>
      </div>
    </div>
  );

  const rawDate = watch('event_date');
  const parsedDate = rawDate ? new Date(`${rawDate}T12:00:00`) : null;

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#E10600]" />
          <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Let&apos;s Work Together</span>
          <div className="w-8 h-px bg-[#E10600]" />
        </div>
        <h1 className="text-[clamp(2.5rem,6vw,6rem)] font-heading font-light text-[#0F0F0F] mb-4">Book a Session</h1>
        <p className="text-[#0F0F0F]/55 max-w-md mx-auto leading-relaxed">Tell us about your project and we&apos;ll craft a tailored proposal within 24 hours.</p>
      </div>

      {/* Progress */}
      <div className="max-w-xl mx-auto px-4 mb-10">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`flex flex-col items-center ${i <= step ? '' : 'opacity-35'}`}>
                <div className={`w-8 h-8 flex items-center justify-center text-xs font-display font-bold transition-colors ${i <= step ? 'bg-[#E10600] text-white' : 'border border-[#0F0F0F]/20 text-[#0F0F0F]/40'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-[11px] font-display text-[#0F0F0F]/50 mt-1.5 whitespace-nowrap">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 -mt-4 transition-colors ${i < step ? 'bg-[#E10600]' : 'bg-[#0F0F0F]/10'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-xl mx-auto px-4 space-y-5">

          {/* Step 0 — Event Details */}
          {step === 0 && (
            <>
              <div>
                <label className={labelCls}>Service Type *</label>
                <select {...register('service')} className={inputCls}>
                  <option value="">Select a service…</option>
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className="text-[#E10600] text-xs mt-1">{errors.service.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}><Calendar size={10} className="inline mr-1" />Event Date *</label>
                  <input type="date" min={TODAY} {...register('event_date')} className={inputCls} />
                  {errors.event_date && <p className="text-[#E10600] text-xs mt-1">{errors.event_date.message}</p>}
                </div>
                <div>
                  <label className={labelCls}><Clock size={10} className="inline mr-1" />Start Time</label>
                  <input type="time" {...register('event_time')} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Duration / Coverage Hours</label>
                <input {...register('duration')} placeholder="e.g. Full day, 6 hours, 2 days…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Event Location *</label>
                <input {...register('location')} placeholder="Venue name, city, or region…" className={inputCls} />
                {errors.location && <p className="text-[#E10600] text-xs mt-1">{errors.location.message}</p>}
              </div>

              {parsedDate && (
                <div className="p-4 bg-[#E10600]/[0.05] border border-[#E10600]/20 flex items-center gap-3">
                  <Calendar size={14} className="text-[#E10600]" />
                  <span className="text-[13px] text-[#0F0F0F]/65 font-display">
                    {parsedDate.toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                    {watch('event_time') && ` at ${watch('event_time')}`}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Step 1 — Personal Details */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['first_name', 'last_name'] as const).map((f) => (
                  <div key={f}>
                    <label className={labelCls}>{f === 'first_name' ? 'First Name' : 'Last Name'} *</label>
                    <input autoComplete={f === 'first_name' ? 'given-name' : 'family-name'} {...register(f)} className={inputCls} />
                    {errors[f] && <p className="text-[#E10600] text-xs mt-1">{errors[f]!.message}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label className={labelCls}>Email Address *</label>
                <input type="email" autoComplete="email" {...register('email')} className={inputCls} />
                {errors.email && <p className="text-[#E10600] text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone Number *</label>
                <input type="tel" autoComplete="tel" {...register('phone')} className={inputCls} />
                {errors.phone && <p className="text-[#E10600] text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Budget Range *</label>
                <select {...register('budget')} className={inputCls}>
                  <option value="">Select budget…</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.budget && <p className="text-[#E10600] text-xs mt-1">{errors.budget.message}</p>}
              </div>
              <div>
                <label className={labelCls}>How did you hear about us?</label>
                <select {...register('hear')} className={inputCls}>
                  <option value="">Select…</option>
                  {HEAR.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Step 2 — Vision */}
          {step === 2 && (
            <>
              <div>
                <label className={labelCls}>Tell Us About Your Vision *</label>
                <textarea
                  {...register('message')}
                  rows={6}
                  placeholder="Describe your project, the mood you want to capture, any specific requirements, inspiration references, or questions you have…"
                  className={`${inputCls} resize-none`}
                />
                {errors.message && <p className="text-[#E10600] text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* Booking summary */}
              <div className="p-5 bg-white border border-[#0F0F0F]/[0.08] space-y-2">
                <div className="text-[11px] font-display tracking-widest text-[#E10600] uppercase mb-3">Your Booking Summary</div>
                {([
                  ['Service',  watch('service')],
                  ['Date',     parsedDate ? parsedDate.toLocaleDateString('en-KE',{weekday:'short',year:'numeric',month:'short',day:'numeric'}) : ''],
                  ['Location', watch('location')],
                  ['Name',     `${watch('first_name')} ${watch('last_name')}`],
                  ['Budget',   watch('budget')],
                ] as [string, string][]).filter(([,v]) => v?.trim()).map(([k,v]) => (
                  <div key={k} className="flex justify-between text-[13px]">
                    <span className="text-[#0F0F0F]/55 font-display">{k}</span>
                    <span className="text-[#0F0F0F]/75 font-display text-right max-w-[200px] truncate">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-outline-dark flex items-center gap-2">
                <ArrowLeft size={13} /> Back
              </button>
            ) : <div />}
            {step < 2 ? (
              <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                Continue <ArrowRight size={13} />
              </button>
            ) : (
              <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {sending ? 'Sending…' : 'Submit Enquiry'} <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
