'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Camera, Image, FileText, MessageCircle, Settings, Download, X, ChevronRight, Eye, Send, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

/* ── Schemas ──────────────────────────────────────────────────────── */
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const signupSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), confirm: z.string() }).refine(d=>d.password===d.confirm,{message:'Passwords do not match',path:['confirm']});
type LoginData  = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

/* ── Auth form ─────────────────────────────────────────────────────── */
function AuthForm({ onAuth }: { onAuth: (u: User, s: Session) => void }) {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [busy, setBusy] = useState(false);

  const loginForm  = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  const onLogin = async (d: LoginData) => {
    setBusy(true);
    try {
      const sb = createClient();
      const { data, error } = await sb.auth.signInWithPassword(d);
      if (error) throw error;
      if (data.user && data.session) onAuth(data.user, data.session);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Login failed'); }
    finally { setBusy(false); }
  };

  const onSignup = async (d: SignupData) => {
    setBusy(true);
    try {
      const res = await fetch('/api/auth/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name:d.name, email:d.email, password:d.password }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Signup failed');
      toast.success('Account created! Please sign in.');
      setMode('login');
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Signup failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Client Portal</span><div className="w-8 h-px bg-[#E10600]" /></div>
          <h1 className="text-4xl font-heading font-light text-white mb-2">Welcome Back</h1>
          <p className="text-white/35 text-sm font-display">Access your projects, galleries, and files</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border border-white/[0.08]">
          {(['login','signup'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3 text-[10px] font-display font-semibold tracking-widest uppercase transition-colors ${mode===m?'bg-[#E10600] text-white':'text-white/30 hover:text-white'}`}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form key="login" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              {([{f:'email',label:'Email',type:'email'},{f:'password',label:'Password',type:'password'}] as const).map(({f,label,type}) => (
                <div key={f}>
                  <label className="block text-[10px] font-display font-semibold tracking-widest uppercase text-white/40 mb-2">{label}</label>
                  <input type={type} {...loginForm.register(f)} className="w-full bg-[#141414] border border-white/[0.08] text-white/70 font-display text-sm px-4 py-3 focus:outline-none focus:border-[#E10600]/40" />
                  {loginForm.formState.errors[f] && <p className="text-[#E10600] text-xs mt-1">{loginForm.formState.errors[f]!.message as string}</p>}
                </div>
              ))}
              <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">{busy?'Signing in…':'Sign In'}</button>
            </motion.form>
          ) : (
            <motion.form key="signup" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
              {([{f:'name',label:'Full Name',type:'text'},{f:'email',label:'Email',type:'email'},{f:'password',label:'Password',type:'password'},{f:'confirm',label:'Confirm Password',type:'password'}] as const).map(({f,label,type}) => (
                <div key={f}>
                  <label className="block text-[10px] font-display font-semibold tracking-widest uppercase text-white/40 mb-2">{label}</label>
                  <input type={type} {...signupForm.register(f)} className="w-full bg-[#141414] border border-white/[0.08] text-white/70 font-display text-sm px-4 py-3 focus:outline-none focus:border-[#E10600]/40" />
                  {signupForm.formState.errors[f] && <p className="text-[#E10600] text-xs mt-1">{signupForm.formState.errors[f]!.message as string}</p>}
                </div>
              ))}
              <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">{busy?'Creating account…':'Create Account'}</button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Status badge ─────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string,string> = { completed:'bg-green-500/15 text-green-400', active:'bg-[#E10600]/15 text-[#E10600]', pending:'bg-yellow-500/15 text-yellow-400', cancelled:'bg-white/5 text-white/30', paid:'bg-green-500/15 text-green-400', overdue:'bg-red-500/15 text-red-400', draft:'bg-white/5 text-white/30' };
  return <span className={`px-2.5 py-1 text-[9px] font-display font-semibold tracking-widest uppercase rounded-sm ${map[status]??'bg-white/5 text-white/30'}`}>{status}</span>;
}

/* ── Dashboard ─────────────────────────────────────────────────────── */
function Dashboard({ user, session, onSignOut }: { user: User; session: Session; onSignOut: () => void }) {
  const [tab, setTab] = useState<'overview'|'projects'|'galleries'|'invoices'|'messages'|'settings'>('overview');
  const [bookings, setBookings]   = useState<Record<string,unknown>[]>([]);
  const [galleries, setGalleries] = useState<Record<string,unknown>[]>([]);
  const [lightbox, setLightbox]   = useState<string|null>(null);
  const [msgText, setMsgText]     = useState('');
  const [messages, setMessages]   = useState<{id:string;text:string;from:'client'|'team';ts:string}[]>([
    { id:'1', text:'Welcome to your Mejasan client portal! Your project files will appear here as we progress.', from:'team', ts:'2024-12-01T09:00:00' },
  ]);

  const h: Record<string,string> = session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};

  useEffect(() => {
    (async () => {
      try {
        const [bRes, gRes] = await Promise.all([
          fetch('/api/client/bookings', { headers: h }),
          fetch('/api/client/galleries', { headers: h }),
        ]);
        if (bRes.ok) setBookings(await bRes.json());
        if (gRes.ok) setGalleries(await gRes.json());
      } catch { /* silent */ }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    if (!msgText.trim()) return;
    setMessages(m => [...m, { id: Date.now().toString(), text: msgText, from:'client', ts: new Date().toISOString() }]);
    setMsgText('');
    setTimeout(() => {
      setMessages(m => [...m, { id: (Date.now()+1).toString(), text: 'Thank you for your message! Our team will respond within 2 hours.', from:'team', ts: new Date().toISOString() }]);
    }, 1500);
  };

  const MILESTONES = ['Booking Confirmed','Contract Signed','Pre-Production','Production Day','Post-Production','Files Delivered'];
  const projectStage = 3; // demo: in post-production

  const TABS = [
    { id:'overview',  label:'Overview',  icon:Eye },
    { id:'projects',  label:'Projects',  icon:Calendar },
    { id:'galleries', label:'Galleries', icon:Image },
    { id:'invoices',  label:'Invoices',  icon:DollarSign },
    { id:'messages',  label:'Messages',  icon:MessageCircle },
    { id:'settings',  label:'Settings',  icon:Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20">
      {/* Top bar */}
      <div className="bg-[#141414] border-b border-white/[0.06] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-0.5">Client Portal</div>
          <div className="text-sm font-display text-white">{user.email}</div>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-2 text-[10px] font-display text-white/30 hover:text-white transition-colors tracking-widest uppercase">
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <nav className="space-y-1 sticky top-24">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-display tracking-widest uppercase transition-colors text-left ${tab===id?'text-white bg-white/[0.04]':'text-white/30 hover:text-white'}`}>
                <Icon size={14} className={tab===id?'text-[#E10600]':'text-white/20'} />{label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="lg:hidden w-full mb-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[9px] font-display tracking-widest uppercase whitespace-nowrap transition-colors border ${tab===id?'bg-[#E10600] text-white border-[#E10600]':'text-white/30 border-white/[0.08] hover:text-white'}`}>
                <Icon size={11} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-light text-white">Welcome back</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label:'Active Projects', value: bookings.length || '1', icon:Camera, color:'text-[#E10600]' },
                  { label:'Galleries Ready', value: galleries.length || '0', icon:Image, color:'text-blue-400' },
                  { label:'Unread Messages', value:'1', icon:MessageCircle, color:'text-green-400' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-[#141414] border border-white/[0.06] p-5">
                    <Icon size={18} className={`${color} mb-3`} />
                    <div className="text-2xl font-heading font-light text-white mb-1">{value}</div>
                    <div className="text-[11px] font-display text-white/35 tracking-widest uppercase">{label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#141414] border border-white/[0.06] p-5">
                <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Quick Actions</div>
                <div className="flex flex-wrap gap-2">
                  {[{l:'View Projects',t:'projects'},{l:'My Galleries',t:'galleries'},{l:'Invoices',t:'invoices'},{l:'Send Message',t:'messages'}].map(({l,t}) => (
                    <button key={t} onClick={()=>setTab(t as typeof tab)} className="flex items-center gap-1.5 px-4 py-2 border border-white/[0.08] text-[10px] font-display text-white/50 hover:text-white hover:border-white/20 transition-colors">
                      {l} <ChevronRight size={10} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {tab === 'projects' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-light text-white">My Projects</h2>

              {/* Timeline demo */}
              <div className="bg-[#141414] border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-1">Active Project</div>
                    <h3 className="text-lg font-heading font-light text-white">Wedding Photography Package</h3>
                    <div className="text-[12px] text-white/35 font-display mt-0.5">Ref: MJB-ABC123 · Saturday, March 15, 2025</div>
                  </div>
                  <StatusBadge status="active" />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-white/[0.06]" />
                  <div className="space-y-4">
                    {MILESTONES.map((m, i) => (
                      <div key={m} className="flex items-center gap-4 pl-2">
                        <div className={`w-8 h-8 flex items-center justify-center shrink-0 z-10 relative transition-colors ${i<projectStage?'bg-[#E10600]':i===projectStage?'bg-[#E10600]':'bg-[#141414] border border-white/[0.08]'}`}>
                          {i < projectStage ? <CheckCircle size={14} className="text-white" /> : i === projectStage ? <Clock size={14} className="text-white" /> : <span className="text-[10px] text-white/30 font-display">{i+1}</span>}
                        </div>
                        <div>
                          <div className={`text-[12px] font-display font-semibold ${i<=projectStage?'text-white':'text-white/25'}`}>{m}</div>
                          {i === projectStage && <div className="text-[10px] text-[#E10600] font-display">In Progress</div>}
                          {i < projectStage && <div className="text-[10px] text-white/20 font-display">Completed</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booked sessions */}
              {bookings.length > 0 ? (
                bookings.map((b: Record<string,unknown>) => (
                  <div key={b.id as string} className="bg-[#141414] border border-white/[0.06] p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-display text-[#E10600] uppercase tracking-widest mb-1">{b.service_type as string}</div>
                      <div className="text-sm font-display text-white">{b.booking_ref as string} · {b.event_date ? new Date(b.event_date as string).toLocaleDateString('en-KE') : 'TBD'}</div>
                      <div className="text-[11px] text-white/30 font-display mt-0.5">{b.event_location as string}</div>
                    </div>
                    <StatusBadge status={b.status as string} />
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-white/25 font-display">No additional bookings found.</p>
              )}
            </div>
          )}

          {/* GALLERIES */}
          {tab === 'galleries' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-light text-white">My Galleries</h2>
              {galleries.length > 0 ? (
                galleries.map((g: Record<string,unknown>) => {
                  const imgs = (g.gallery_images as {url:string}[]) ?? [];
                  return (
                    <div key={g.id as string} className="bg-[#141414] border border-white/[0.06] p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-display font-semibold text-white">{g.gallery_name as string}</h3>
                          <div className="text-[11px] text-white/30 font-display mt-0.5">{imgs.length} images</div>
                        </div>
                        <a href={`/api/client/galleries/download?id=${g.id}`} className="btn-outline flex items-center gap-1.5 text-[10px]">
                          <Download size={12} /> Download All
                        </a>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                        {imgs.slice(0,8).map(({ url }, j) => (
                          <button key={j} onClick={() => setLightbox(url)} className="relative aspect-square overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-[#141414] border border-white/[0.06] p-10 text-center">
                  <Image className="w-8 h-8 text-white/15 mx-auto mb-3" />
                  <p className="text-[13px] text-white/30 font-display">Your galleries will appear here once your project is delivered.</p>
                </div>
              )}
              {lightbox && (
                <div className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center p-4" onClick={()=>setLightbox(null)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lightbox} alt="" className="max-h-[88vh] max-w-full object-contain" onClick={e=>e.stopPropagation()} />
                  <button onClick={()=>setLightbox(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/60 flex items-center justify-center text-white hover:bg-[#E10600] transition-colors"><X size={16} /></button>
                </div>
              )}
            </div>
          )}

          {/* INVOICES */}
          {tab === 'invoices' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-light text-white">Invoices</h2>
              <div className="space-y-2">
                {[
                  { id:'INV-001', desc:'Wedding Photography Package', amount:'KES 85,000', due:'2025-01-15', status:'paid' },
                  { id:'INV-002', desc:'Additional Drone Coverage',   amount:'KES 25,000', due:'2025-02-01', status:'pending' },
                ].map((inv) => (
                  <div key={inv.id} className="bg-[#141414] border border-white/[0.06] p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-display text-white/40 tracking-widest">{inv.id}</span>
                        <StatusBadge status={inv.status} />
                      </div>
                      <div className="text-sm font-display text-white">{inv.desc}</div>
                      <div className="text-[11px] text-white/30 font-display mt-0.5">Due: {new Date(inv.due).toLocaleDateString('en-KE')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-heading text-white mb-2">{inv.amount}</div>
                      {inv.status === 'pending' && (
                        <button className="px-3 py-1.5 bg-[#E10600] text-white text-[9px] font-display tracking-widest uppercase hover:bg-[#c00500] transition-colors">Pay Now</button>
                      )}
                      {inv.status === 'paid' && (
                        <button className="flex items-center gap-1 text-[10px] font-display text-white/30 hover:text-white transition-colors">
                          <Download size={11} /> Receipt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#141414] border border-white/[0.06] p-5">
                <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Contracts</div>
                <div className="space-y-2">
                  {[{ name:'Wedding Photography Agreement', date:'2024-12-01', signed:true },{ name:'Additional Services Addendum', date:'2025-01-10', signed:false }].map(cnt => (
                    <div key={cnt.name} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                      <div className="flex items-center gap-3">
                        <FileText size={14} className="text-white/20" />
                        <div>
                          <div className="text-[12px] font-display text-white">{cnt.name}</div>
                          <div className="text-[10px] text-white/25 font-display">{new Date(cnt.date).toLocaleDateString('en-KE')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={cnt.signed?'completed':'pending'} />
                        {!cnt.signed && <button className="text-[9px] font-display tracking-widest uppercase text-[#E10600] hover:underline">Sign Now</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {tab === 'messages' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-light text-white">Messages</h2>
              <div className="bg-[#141414] border border-white/[0.06] flex flex-col h-[480px]">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from==='client'?'justify-end':''}`}>
                      <div className={`max-w-[75%] px-4 py-3 text-[13px] font-display ${m.from==='team'?'bg-[#1C1C1C] text-white/70':'bg-[#E10600] text-white'}`}>
                        {m.from==='team' && <div className="text-[9px] text-[#E10600] tracking-widest uppercase mb-1.5">Mejasan Team</div>}
                        <p>{m.text}</p>
                        <div className="text-[9px] opacity-40 mt-1.5">{new Date(m.ts).toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'})}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.06] p-4 flex gap-3">
                  <input
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    onKeyDown={(e) => { if (e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMessage(); } }}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#0B0B0B] border border-white/[0.08] text-white/70 font-display text-sm px-4 py-2.5 focus:outline-none focus:border-[#E10600]/40 placeholder:text-white/20"
                  />
                  <button onClick={sendMessage} className="w-10 h-10 bg-[#E10600] flex items-center justify-center hover:bg-[#c00500] transition-colors">
                    <Send size={15} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-light text-white">Account Settings</h2>
              <div className="bg-[#141414] border border-white/[0.06] p-6 space-y-5">
                <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-2">Profile</div>
                <div>
                  <label className="block text-[10px] font-display font-semibold tracking-widest uppercase text-white/40 mb-2">Email Address</label>
                  <input value={user.email ?? ''} readOnly className="w-full bg-[#0B0B0B] border border-white/[0.08] text-white/40 font-display text-sm px-4 py-3 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-display font-semibold tracking-widest uppercase text-white/40 mb-2">Notification Preferences</label>
                  <div className="space-y-2">
                    {['Email notifications for project updates','WhatsApp updates','Invoice reminders'].map((n) => (
                      <label key={n} className="flex items-center gap-3 text-[13px] text-white/55 font-display cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-[#E10600]" />{n}
                      </label>
                    ))}
                  </div>
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
              <div className="bg-[#141414] border border-white/[0.06] p-6">
                <div className="text-[10px] font-display tracking-widest text-red-400 uppercase mb-4">Danger Zone</div>
                <button onClick={onSignOut} className="flex items-center gap-2 text-[12px] font-display text-red-400/60 hover:text-red-400 transition-colors">
                  <AlertCircle size={14} /> Sign out of all devices
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Inner (handles auth state) ───────────────────────────────────── */
function ClientPortalInner() {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    setUser(null);
    setSession(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || !session) return <AuthForm onAuth={(u, s) => { setUser(u); setSession(s); }} />;
  return <Dashboard user={user} session={session} onSignOut={signOut} />;
}

export default function ClientPortalPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#0B0B0B]" />}><ClientPortalInner /></Suspense>;
}
