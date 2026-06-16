'use client';

import { useState, useEffect, useRef, type ReactNode, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  BarChart3, Users, Calendar, Camera, FileText, MessageSquare, Settings, LogOut,
  ChevronDown, Check, Upload, RefreshCw, Eye, Trash2, Edit3, Plus, TrendingUp,
  DollarSign, Star, X, Image as ImageIcon, Save, AlertTriangle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/* ── Login ─────────────────────────────────────────────────────────── */
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
type LoginData = z.infer<typeof loginSchema>;

function AdminLogin({ onLogin }: { onLogin: (u: User) => void }) {
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (d: LoginData) => {
    setBusy(true);
    try {
      const sb = createClient();
      const { data, error } = await sb.auth.signInWithPassword(d);
      if (error) throw error;
      const isAdmin = d.email.endsWith('@mejasanmedia.com') || data.user?.app_metadata?.role === 'admin';
      if (!isAdmin) { await sb.auth.signOut(); throw new Error('Not authorised. Admin accounts only.'); }
      onLogin(data.user!);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[10px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Admin</span>
            <div className="w-8 h-px bg-[#E10600]" />
          </div>
          <h1 className="text-4xl font-heading font-light text-white mb-1">Dashboard</h1>
          <p className="text-white/30 text-[12px] font-display">Authorised personnel only</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-display font-semibold tracking-widest uppercase text-white/40 mb-2">Email</label>
            <input type="email" {...register('email')} className="w-full bg-[#141414] border border-white/[0.08] text-white/70 font-display text-sm px-4 py-3 focus:outline-none focus:border-[#E10600]/40" />
            {errors.email && <p className="text-[#E10600] text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-display font-semibold tracking-widest uppercase text-white/40 mb-2">Password</label>
            <input type="password" {...register('password')} className="w-full bg-[#141414] border border-white/[0.08] text-white/70 font-display text-sm px-4 py-3 focus:outline-none focus:border-[#E10600]/40" />
            {errors.password && <p className="text-[#E10600] text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign In to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── UI helpers ─────────────────────────────────────────────────────── */
function Chip({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-blue-500/15 text-blue-400', confirmed: 'bg-green-500/15 text-green-400',
    pending: 'bg-yellow-500/15 text-yellow-400', completed: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-red-500/15 text-red-400', published: 'bg-green-500/15 text-green-400',
    draft: 'bg-white/[0.06] text-white/30', paid: 'bg-green-500/15 text-green-400',
    overdue: 'bg-red-500/15 text-red-400', active: 'bg-[#E10600]/15 text-[#E10600]',
  };
  return (
    <span className={`px-2.5 py-1 text-[9px] font-display font-bold tracking-widest uppercase ${map[status.toLowerCase()] ?? 'bg-white/[0.06] text-white/30'}`}>
      {status}
    </span>
  );
}

function AdminTable({ heads, children, onRefresh }: { heads: string[]; children: ReactNode; onRefresh?: () => void }) {
  return (
    <div className="bg-[#141414] border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
        <div className="text-[10px] font-display text-white/20 tracking-widest uppercase">{heads.length} columns</div>
        {onRefresh && <button onClick={onRefresh} className="text-white/20 hover:text-white transition-colors"><RefreshCw size={13} /></button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {heads.map((h) => <th key={h} className="px-5 py-3 text-[9px] font-display font-semibold tracking-widest uppercase text-white/25">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function TD({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 text-[12px] font-display text-white/60 ${className}`}>{children}</td>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-display tracking-widest uppercase text-white/30 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-[#0B0B0B] border border-white/[0.08] text-white/80 font-display text-sm px-4 py-2.5 focus:outline-none focus:border-[#E10600]/40 placeholder:text-white/20';
const selectCls = inputCls;
const textareaCls = `${inputCls} resize-none`;

/* ── Overlay modal ──────────────────────────────────────────────────── */
function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-[#141414] border border-white/[0.08] w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <span className="text-[11px] font-display tracking-widest uppercase text-white/60">{title}</span>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function DeleteConfirm({ label, onConfirm, onClose, busy }: { label: string; onConfirm: () => void; onClose: () => void; busy: boolean }) {
  return (
    <Modal title="Confirm Delete" onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <AlertTriangle size={28} className="text-red-400" />
        <p className="text-white/60 font-display text-sm">Delete <span className="text-white font-semibold">{label}</span>? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline-dark px-6 py-2 text-[11px]">Cancel</button>
          <button onClick={onConfirm} disabled={busy} className="bg-red-600 hover:bg-red-700 text-white font-display text-[11px] tracking-widest uppercase px-6 py-2 disabled:opacity-50 transition-colors">
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Portfolio Modal ────────────────────────────────────────────────── */
type PortfolioForm = {
  title: string;
  category: string;
  cover_image_url: string;
  description: string;
  is_published: boolean;
};

function PortfolioModal({
  item, onClose, onSave,
}: { item?: Record<string, unknown> | null; onClose: () => void; onSave: (data: PortfolioForm, id?: string) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<PortfolioForm>({
    title: (item?.title as string) ?? '',
    category: (item?.category as string) ?? 'photography',
    cover_image_url: (item?.cover_image_url as string) ?? '',
    description: (item?.description as string) ?? '',
    is_published: (item?.is_published as boolean) ?? false,
  });

  const set = (k: keyof PortfolioForm, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.cover_image_url) { toast.error('Title and image URL are required'); return; }
    setBusy(true);
    await onSave(form, item?.id as string | undefined);
    setBusy(false);
  };

  return (
    <Modal title={item ? 'Edit Portfolio Item' : 'Add Portfolio Item'} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="e.g. Sarah & James Wedding" />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className={selectCls}>
            {['photography', 'videography', 'events', 'drone', 'branding'].map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </Field>
        <Field label="Cover Image URL">
          <input value={form.cover_image_url} onChange={(e) => set('cover_image_url', e.target.value)} className={inputCls} placeholder="https://…" />
          {form.cover_image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={form.cover_image_url} alt="preview" className="mt-2 w-full h-32 object-cover opacity-60" />
          )}
        </Field>
        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={textareaCls} placeholder="Short description…" />
        </Field>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="accent-[#E10600]" />
          <span className="text-[12px] font-display text-white/50">Publish immediately</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-outline-dark flex-1 justify-center py-2.5 text-[11px]">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-primary flex-1 justify-center disabled:opacity-50">
            <Save size={12} /> {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Blog Modal ─────────────────────────────────────────────────────── */
type BlogForm = {
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  is_published: boolean;
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function BlogModal({
  post, onClose, onSave,
}: { post?: Record<string, unknown> | null; onClose: () => void; onSave: (data: BlogForm, id?: string) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<BlogForm>({
    title: (post?.title as string) ?? '',
    slug: (post?.slug as string) ?? '',
    category: (post?.category as string) ?? '',
    author: (post?.author as string) ?? '',
    excerpt: (post?.excerpt as string) ?? '',
    content: (post?.content as string) ?? '',
    cover_image_url: (post?.cover_image_url as string) ?? '',
    is_published: (post?.is_published as boolean) ?? false,
  });

  const set = (k: keyof BlogForm, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitle = (v: string) => setForm((f) => ({ ...f, title: v, slug: post ? f.slug : slugify(v) }));

  const submit = async () => {
    if (!form.title) { toast.error('Title is required'); return; }
    setBusy(true);
    await onSave({ ...form, slug: form.slug || slugify(form.title) }, post?.id as string | undefined);
    setBusy(false);
  };

  return (
    <Modal title={post ? 'Edit Post' : 'New Blog Post'} onClose={onClose} wide>
      <div className="space-y-4">
        <Field label="Title">
          <input value={form.title} onChange={(e) => handleTitle(e.target.value)} className={inputCls} placeholder="Post title" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="auto-generated" />
          </Field>
          <Field label="Category">
            <input value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls} placeholder="e.g. Wedding Tips" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Author">
            <input value={form.author} onChange={(e) => set('author', e.target.value)} className={inputCls} placeholder="Author name" />
          </Field>
          <Field label="Cover Image URL">
            <input value={form.cover_image_url} onChange={(e) => set('cover_image_url', e.target.value)} className={inputCls} placeholder="https://…" />
          </Field>
        </div>
        <Field label="Excerpt">
          <textarea rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} className={textareaCls} placeholder="Short summary shown in listing" />
        </Field>
        <Field label="Content">
          <textarea rows={8} value={form.content} onChange={(e) => set('content', e.target.value)} className={textareaCls} placeholder="Full post content (Markdown supported)" />
        </Field>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="accent-[#E10600]" />
          <span className="text-[12px] font-display text-white/50">Publish immediately</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-outline-dark flex-1 justify-center py-2.5 text-[11px]">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-primary flex-1 justify-center disabled:opacity-50">
            <Save size={12} /> {busy ? 'Saving…' : 'Save Post'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Testimonial Modal ──────────────────────────────────────────────── */
type TestimonialForm = { client_name: string; role: string; rating: number; content: string; is_published: boolean };

function TestimonialModal({
  item, onClose, onSave,
}: { item?: Record<string, unknown> | null; onClose: () => void; onSave: (data: TestimonialForm, id?: string) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<TestimonialForm>({
    client_name: (item?.client_name as string) ?? '',
    role: (item?.role as string) ?? '',
    rating: (item?.rating as number) ?? 5,
    content: (item?.content as string) ?? '',
    is_published: (item?.is_published as boolean) ?? true,
  });

  const set = <K extends keyof TestimonialForm>(k: K, v: TestimonialForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.client_name || !form.content) { toast.error('Name and review are required'); return; }
    setBusy(true);
    await onSave(form, item?.id as string | undefined);
    setBusy(false);
  };

  return (
    <Modal title={item ? 'Edit Testimonial' : 'Add Testimonial'} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Client Name">
          <input value={form.client_name} onChange={(e) => set('client_name', e.target.value)} className={inputCls} placeholder="Full name" />
        </Field>
        <Field label="Role / Title">
          <input value={form.role} onChange={(e) => set('role', e.target.value)} className={inputCls} placeholder="e.g. Bride, Marketing Director" />
        </Field>
        <Field label="Rating">
          <div className="flex gap-2 mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => set('rating', n)} className="transition-colors">
                <Star size={18} fill={n <= form.rating ? '#E10600' : 'none'} className={n <= form.rating ? 'text-[#E10600]' : 'text-white/20'} />
              </button>
            ))}
          </div>
        </Field>
        <Field label="Review">
          <textarea rows={4} value={form.content} onChange={(e) => set('content', e.target.value)} className={textareaCls} placeholder="Client review text…" />
        </Field>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="accent-[#E10600]" />
          <span className="text-[12px] font-display text-white/50">Published</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-outline-dark flex-1 justify-center py-2.5 text-[11px]">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-primary flex-1 justify-center disabled:opacity-50">
            <Save size={12} /> {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────── */
type TabId = 'overview' | 'leads' | 'bookings' | 'clients' | 'projects' | 'portfolio' | 'blog' | 'testimonials' | 'invoices' | 'gallery' | 'settings';

function AdminDashboard({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [tab, setTab] = useState<TabId>('overview');
  const [leads, setLeads] = useState<Record<string, unknown>[]>([]);
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [portfolio, setPortfolio] = useState<Record<string, unknown>[]>([]);
  const [blog, setBlog] = useState<Record<string, unknown>[]>([]);
  const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([]);
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);

  /* Modals */
  const [portfolioModal, setPortfolioModal] = useState<{ item?: Record<string, unknown> | null } | null>(null);
  const [blogModal, setBlogModal] = useState<{ post?: Record<string, unknown> | null } | null>(null);
  const [testimonialModal, setTestimonialModal] = useState<{ item?: Record<string, unknown> | null } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ label: string; onConfirm: () => Promise<void> } | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /* Gallery upload */
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  /* Settings */
  const [settings, setSettings] = useState({ name: 'Mejasan Media Production', email: 'info@mejasanmedia.com', phone: '+254 700 864 849', location: 'Kisumu, Kenya', whatsapp: '+254700864849' });
  const [savingSettings, setSavingSettings] = useState(false);

  const sb = createClient();

  const fetchAll = async () => {
    try {
      const [l, b, p, bl, t] = await Promise.all([
        sb.from('mejasan_contact_submissions').select('*').order('created_at', { ascending: false }).limit(30),
        sb.from('mejasan_bookings').select('*').order('created_at', { ascending: false }).limit(30),
        sb.from('mejasan_portfolio').select('*').order('sort_order').limit(50),
        sb.from('mejasan_blog_posts').select('*').order('created_at', { ascending: false }).limit(20),
        sb.from('mejasan_testimonials').select('*').order('created_at', { ascending: false }).limit(30),
      ]);
      if (l.data) setLeads(l.data as Record<string, unknown>[]);
      if (b.data) setBookings(b.data as Record<string, unknown>[]);
      if (p.data) setPortfolio(p.data as Record<string, unknown>[]);
      if (bl.data) setBlog(bl.data as Record<string, unknown>[]);
      if (t.data) setTestimonials(t.data as Record<string, unknown>[]);
    } catch { /* silent */ }
  };

  const fetchGallery = async () => {
    try {
      const { data } = await sb.storage.from('mejasan-media').list('gallery', { limit: 40, sortBy: { column: 'created_at', order: 'desc' } });
      if (data) {
        const urls = data.map((f) => ({
          name: f.name,
          url: sb.storage.from('mejasan-media').getPublicUrl(`gallery/${f.name}`).data.publicUrl,
        }));
        setUploads(urls);
      }
    } catch { /* bucket may not exist yet */ }
  };

  useEffect(() => { fetchAll(); fetchGallery(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateBookingStatus = async (id: string, status: string) => {
    await sb.from('mejasan_bookings').update({ status }).eq('id', id);
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success('Status updated');
  };

  const togglePublish = async (id: string, table: string, current: boolean) => {
    await sb.from(table).update({ is_published: !current }).eq('id', id);
    if (table === 'mejasan_portfolio') setPortfolio((p) => p.map((x) => (x.id === id ? { ...x, is_published: !current } : x)));
    if (table === 'mejasan_blog_posts') setBlog((p) => p.map((x) => (x.id === id ? { ...x, is_published: !current } : x)));
    if (table === 'mejasan_testimonials') setTestimonials((p) => p.map((x) => (x.id === id ? { ...x, is_published: !current } : x)));
    toast.success(!current ? 'Published' : 'Unpublished');
  };

  /* Portfolio CRUD */
  const savePortfolio = async (data: PortfolioForm, id?: string) => {
    if (id) {
      const { error } = await sb.from('mejasan_portfolio').update(data).eq('id', id);
      if (error) { toast.error('Update failed'); return; }
      setPortfolio((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
      toast.success('Portfolio item updated');
    } else {
      const { data: row, error } = await sb.from('mejasan_portfolio').insert(data).select().single();
      if (error) { toast.error('Insert failed'); return; }
      setPortfolio((p) => [row as Record<string, unknown>, ...p]);
      toast.success('Item added to portfolio');
    }
    setPortfolioModal(null);
  };

  const deletePortfolio = async (id: string, title: string) => {
    setDeleteModal({
      label: title,
      onConfirm: async () => {
        setDeleteBusy(true);
        const { error } = await sb.from('mejasan_portfolio').delete().eq('id', id);
        setDeleteBusy(false);
        if (error) { toast.error('Delete failed'); return; }
        setPortfolio((p) => p.filter((x) => x.id !== id));
        toast.success('Item deleted');
        setDeleteModal(null);
      },
    });
  };

  /* Blog CRUD */
  const saveBlog = async (data: BlogForm, id?: string) => {
    if (id) {
      const { error } = await sb.from('mejasan_blog_posts').update(data).eq('id', id);
      if (error) { toast.error('Update failed'); return; }
      setBlog((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
      toast.success('Post updated');
    } else {
      const { data: row, error } = await sb.from('mejasan_blog_posts').insert(data).select().single();
      if (error) { toast.error('Insert failed'); return; }
      setBlog((p) => [row as Record<string, unknown>, ...p]);
      toast.success('Post created');
    }
    setBlogModal(null);
  };

  const deleteBlog = async (id: string, title: string) => {
    setDeleteModal({
      label: title,
      onConfirm: async () => {
        setDeleteBusy(true);
        const { error } = await sb.from('mejasan_blog_posts').delete().eq('id', id);
        setDeleteBusy(false);
        if (error) { toast.error('Delete failed'); return; }
        setBlog((p) => p.filter((x) => x.id !== id));
        toast.success('Post deleted');
        setDeleteModal(null);
      },
    });
  };

  /* Testimonial CRUD */
  const saveTestimonial = async (data: TestimonialForm, id?: string) => {
    if (id) {
      const { error } = await sb.from('mejasan_testimonials').update(data).eq('id', id);
      if (error) { toast.error('Update failed'); return; }
      setTestimonials((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
      toast.success('Testimonial updated');
    } else {
      const { data: row, error } = await sb.from('mejasan_testimonials').insert(data).select().single();
      if (error) { toast.error('Insert failed'); return; }
      setTestimonials((p) => [row as Record<string, unknown>, ...p]);
      toast.success('Testimonial added');
    }
    setTestimonialModal(null);
  };

  const deleteTestimonial = async (id: string, name: string) => {
    setDeleteModal({
      label: name,
      onConfirm: async () => {
        setDeleteBusy(true);
        const { error } = await sb.from('mejasan_testimonials').delete().eq('id', id);
        setDeleteBusy(false);
        if (error) { toast.error('Delete failed'); return; }
        setTestimonials((p) => p.filter((x) => x.id !== id));
        toast.success('Testimonial deleted');
        setDeleteModal(null);
      },
    });
  };

  /* Gallery upload */
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const results = await Promise.all(
      files.map(async (file) => {
        const path = `gallery/${Date.now()}-${file.name}`;
        const { error } = await sb.storage.from('mejasan-media').upload(path, file, { upsert: false });
        if (error) { toast.error(`Failed: ${file.name}`); return null; }
        const { data: { publicUrl } } = sb.storage.from('mejasan-media').getPublicUrl(path);
        return { name: file.name, url: publicUrl };
      })
    );
    setUploads((u) => [...results.filter(Boolean) as { name: string; url: string }[], ...u]);
    toast.success(`${results.filter(Boolean).length} file(s) uploaded`);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const deleteGalleryFile = async (name: string) => {
    setDeleteModal({
      label: name,
      onConfirm: async () => {
        setDeleteBusy(true);
        const { error } = await sb.storage.from('mejasan-media').remove([`gallery/${name}`]);
        setDeleteBusy(false);
        if (error) { toast.error('Delete failed'); return; }
        setUploads((u) => u.filter((f) => f.name !== name));
        toast.success('File deleted');
        setDeleteModal(null);
      },
    });
  };

  /* Settings save */
  const saveSettings = async () => {
    setSavingSettings(true);
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await sb.from('mejasan_settings').upsert(upserts, { onConflict: 'key' });
    setSavingSettings(false);
    if (error) toast.error('Save failed — check mejasan_settings table exists');
    else toast.success('Settings saved');
  };

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: MessageSquare },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'projects', label: 'Projects', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: Camera },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'invoices', label: 'Invoices', icon: DollarSign },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

  const TAB_MAP: Record<TabId, ReactNode> = {
    overview: (
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-light text-white">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: leads.length, icon: MessageSquare, color: 'text-blue-400' },
            { label: 'Active Bookings', value: bookings.filter((b) => b.status === 'confirmed').length, icon: Calendar, color: 'text-[#E10600]' },
            { label: 'Portfolio Items', value: portfolio.length, icon: Camera, color: 'text-purple-400' },
            { label: 'Blog Posts', value: blog.filter((p) => p.is_published).length, icon: FileText, color: 'text-green-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#141414] border border-white/[0.06] p-5">
              <Icon size={16} className={`${color} mb-3`} />
              <div className="text-3xl font-heading font-light text-white mb-1">{value}</div>
              <div className="text-[10px] font-display text-white/30 tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-[#141414] border border-white/[0.06] p-5">
            <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Recent Leads</div>
            <div className="space-y-2">
              {leads.slice(0, 5).map((l) => (
                <div key={l.id as string} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-[12px] font-display text-white">{l.name as string}</div>
                    <div className="text-[10px] text-white/30">{l.email as string}</div>
                  </div>
                  <Chip status={(l.status as string) ?? 'new'} />
                </div>
              ))}
              {leads.length === 0 && <p className="text-[12px] text-white/25">No leads yet.</p>}
            </div>
          </div>
          <div className="bg-[#141414] border border-white/[0.06] p-5">
            <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Upcoming Bookings</div>
            <div className="space-y-2">
              {bookings.filter((b) => b.status !== 'cancelled').slice(0, 5).map((b) => (
                <div key={b.id as string} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-[12px] font-display text-white">{b.booking_ref as string}</div>
                    <div className="text-[10px] text-white/30">{b.service_type as string} · {b.event_date ? new Date(b.event_date as string).toLocaleDateString('en-KE') : 'TBD'}</div>
                  </div>
                  <Chip status={b.status as string} />
                </div>
              ))}
              {bookings.length === 0 && <p className="text-[12px] text-white/25">No bookings yet.</p>}
            </div>
          </div>
        </div>
      </div>
    ),

    leads: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Leads</h2>
          <span className="text-[11px] font-display text-white/30">{leads.length} total</span>
        </div>
        <AdminTable heads={['Name', 'Email', 'Service', 'Date', 'Status', 'Action']} onRefresh={fetchAll}>
          {leads.map((l) => (
            <tr key={l.id as string} className="hover:bg-white/[0.02] transition-colors">
              <TD className="font-semibold text-white">{l.name as string}</TD>
              <TD>{l.email as string}</TD>
              <TD>{(l.service_type as string) ?? (l.subject as string) ?? '—'}</TD>
              <TD>{l.event_date ? new Date(l.event_date as string).toLocaleDateString('en-KE') : '—'}</TD>
              <TD><Chip status={(l.status as string) ?? 'new'} /></TD>
              <TD><a href={`mailto:${l.email}`} className="text-[#E10600] hover:underline text-[10px] tracking-widest uppercase">Reply</a></TD>
            </tr>
          ))}
          {leads.length === 0 && <tr><TD className="text-center text-white/20 py-12">No leads yet.</TD></tr>}
        </AdminTable>
      </div>
    ),

    bookings: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Bookings</h2>
          <span className="text-[11px] font-display text-white/30">{bookings.length} total</span>
        </div>
        <AdminTable heads={['Ref', 'Client', 'Service', 'Date', 'Location', 'Status', 'Update']} onRefresh={fetchAll}>
          {bookings.map((b) => (
            <tr key={b.id as string} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold">{b.booking_ref as string}</TD>
              <TD>{(b.client_name as string) ?? (b.client_email as string) ?? '—'}</TD>
              <TD>{b.service_type as string}</TD>
              <TD>{b.event_date ? new Date(b.event_date as string).toLocaleDateString('en-KE') : '—'}</TD>
              <TD>{(b.event_location as string) ?? '—'}</TD>
              <TD><Chip status={b.status as string} /></TD>
              <TD>
                <div className="relative">
                  <button
                    onClick={() => setOpenStatusId(openStatusId === (b.id as string) ? null : (b.id as string))}
                    className="flex items-center gap-1 text-[10px] font-display text-white/30 hover:text-white border border-white/[0.08] px-2 py-1"
                  >
                    Update <ChevronDown size={10} />
                  </button>
                  {openStatusId === (b.id as string) && (
                    <div className="absolute top-full left-0 z-20 bg-[#1C1C1C] border border-white/[0.08] py-1 min-w-[130px] shadow-xl">
                      {STATUSES.map((s) => (
                        <button key={s} onClick={() => { updateBookingStatus(b.id as string, s); setOpenStatusId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-display text-white/50 hover:text-white hover:bg-white/[0.04]">
                          {b.status === s && <Check size={10} className="text-[#E10600]" />}
                          <span className="capitalize">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </TD>
            </tr>
          ))}
          {bookings.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-[12px] text-white/20">No bookings yet.</td></tr>}
        </AdminTable>
      </div>
    ),

    clients: (
      <div>
        <h2 className="text-2xl font-heading font-light text-white mb-6">Clients</h2>
        <AdminTable heads={['Name', 'Email', 'Phone', 'Projects', 'Joined']}>
          {[
            { name: 'Sarah Kamau', email: 'sarah@example.com', phone: '+254711000001', projects: 2, joined: '2024-09-01' },
            { name: 'James Mwangi', email: 'james@example.com', phone: '+254722000002', projects: 1, joined: '2024-10-15' },
            { name: 'Grace Njoroge', email: 'grace@example.com', phone: '+254733000003', projects: 3, joined: '2024-07-20' },
          ].map((c) => (
            <tr key={c.email} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold">{c.name}</TD>
              <TD>{c.email}</TD>
              <TD>{c.phone}</TD>
              <TD>{c.projects}</TD>
              <TD>{new Date(c.joined).toLocaleDateString('en-KE')}</TD>
            </tr>
          ))}
        </AdminTable>
      </div>
    ),

    projects: (
      <div>
        <h2 className="text-2xl font-heading font-light text-white mb-6">Projects</h2>
        <AdminTable heads={['Project', 'Client', 'Type', 'Start Date', 'Stage', 'Status']}>
          {[
            { project: 'Sarah & James Wedding', client: 'Sarah Kamau', type: 'Wedding', date: '2025-03-15', stage: 'Post-Production', status: 'active' },
            { project: 'Safaricom Summit 2025', client: 'Safaricom PLC', type: 'Corporate', date: '2025-02-10', stage: 'Delivered', status: 'completed' },
          ].map((p) => (
            <tr key={p.project} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold">{p.project}</TD>
              <TD>{p.client}</TD>
              <TD>{p.type}</TD>
              <TD>{new Date(p.date).toLocaleDateString('en-KE')}</TD>
              <TD>{p.stage}</TD>
              <TD><Chip status={p.status} /></TD>
            </tr>
          ))}
        </AdminTable>
      </div>
    ),

    portfolio: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Portfolio</h2>
          <button onClick={() => setPortfolioModal({ item: null })} className="btn-primary flex items-center gap-2 text-[10px]">
            <Plus size={12} /> Add Item
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((p) => (
            <div key={p.id as string} className="bg-[#141414] border border-white/[0.06] overflow-hidden">
              <div className="relative aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover_image_url as string} alt={p.title as string} className="w-full h-full object-cover opacity-70" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] font-display font-semibold text-white">{p.title as string}</div>
                  <Chip status={p.is_published ? 'published' : 'draft'} />
                </div>
                <div className="text-[10px] text-white/30 font-display mb-3">{p.category as string}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPortfolioModal({ item: p })}
                    className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-white transition-colors border border-white/[0.08] px-2 py-1"
                  >
                    <Edit3 size={10} /> Edit
                  </button>
                  <button
                    onClick={() => togglePublish(p.id as string, 'mejasan_portfolio', p.is_published as boolean)}
                    className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-white transition-colors border border-white/[0.08] px-2 py-1"
                  >
                    <Eye size={10} /> {p.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => deletePortfolio(p.id as string, p.title as string)}
                    className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-red-400 transition-colors border border-white/[0.08] px-2 py-1"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {portfolio.length === 0 && (
            <div className="col-span-3 py-16 text-center">
              <Camera size={24} className="text-white/15 mx-auto mb-3" />
              <p className="text-[12px] text-white/25">No portfolio items yet. Add your first one.</p>
            </div>
          )}
        </div>
      </div>
    ),

    blog: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Blog</h2>
          <button onClick={() => setBlogModal({ post: null })} className="btn-primary flex items-center gap-2 text-[10px]">
            <Plus size={12} /> New Post
          </button>
        </div>
        <AdminTable heads={['Title', 'Category', 'Author', 'Date', 'Status', 'Actions']} onRefresh={fetchAll}>
          {blog.map((b) => (
            <tr key={b.id as string} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold max-w-[200px] truncate">{b.title as string}</TD>
              <TD>{b.category as string}</TD>
              <TD>{(b.author as string) ?? '—'}</TD>
              <TD>{b.created_at ? new Date(b.created_at as string).toLocaleDateString('en-KE') : '—'}</TD>
              <TD><Chip status={b.is_published ? 'published' : 'draft'} /></TD>
              <TD>
                <div className="flex gap-2">
                  <button onClick={() => setBlogModal({ post: b })} className="text-white/30 hover:text-white transition-colors"><Edit3 size={13} /></button>
                  <button onClick={() => togglePublish(b.id as string, 'mejasan_blog_posts', b.is_published as boolean)} className="text-white/30 hover:text-white transition-colors"><Eye size={13} /></button>
                  <button onClick={() => deleteBlog(b.id as string, b.title as string)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </TD>
            </tr>
          ))}
          {blog.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-[12px] text-white/20">No posts yet.</td></tr>}
        </AdminTable>
      </div>
    ),

    testimonials: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Testimonials</h2>
          <button onClick={() => setTestimonialModal({ item: null })} className="btn-primary flex items-center gap-2 text-[10px]">
            <Plus size={12} /> Add Review
          </button>
        </div>
        <AdminTable heads={['Client', 'Role', 'Rating', 'Excerpt', 'Status', 'Actions']} onRefresh={fetchAll}>
          {testimonials.map((t) => (
            <tr key={t.id as string} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold">{t.client_name as string}</TD>
              <TD>{t.role as string}</TD>
              <TD>
                <div className="flex gap-0.5">
                  {[...Array(t.rating as number)].map((_, i) => <Star key={i} size={10} fill="#E10600" className="text-[#E10600]" />)}
                </div>
              </TD>
              <TD className="max-w-[200px] truncate">{t.content as string}</TD>
              <TD><Chip status={t.is_published ? 'published' : 'draft'} /></TD>
              <TD>
                <div className="flex gap-2">
                  <button onClick={() => setTestimonialModal({ item: t })} className="text-white/30 hover:text-white transition-colors"><Edit3 size={13} /></button>
                  <button onClick={() => togglePublish(t.id as string, 'mejasan_testimonials', t.is_published as boolean)} className="text-white/30 hover:text-white transition-colors"><Eye size={13} /></button>
                  <button onClick={() => deleteTestimonial(t.id as string, t.client_name as string)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </TD>
            </tr>
          ))}
          {testimonials.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-[12px] text-white/20">No testimonials yet.</td></tr>}
        </AdminTable>
      </div>
    ),

    invoices: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Invoices</h2>
          <button className="btn-primary flex items-center gap-2 text-[10px]"><Plus size={12} /> New Invoice</button>
        </div>
        <AdminTable heads={['Invoice', 'Client', 'Amount', 'Due Date', 'Status', 'Action']}>
          {[
            { id: 'INV-001', client: 'Sarah Kamau', amount: 'KES 85,000', due: '2025-01-15', status: 'paid' },
            { id: 'INV-002', client: 'James Mwangi', amount: 'KES 45,000', due: '2025-02-01', status: 'pending' },
            { id: 'INV-003', client: 'Grace Njoroge', amount: 'KES 120,000', due: '2025-01-20', status: 'overdue' },
          ].map((inv) => (
            <tr key={inv.id} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold">{inv.id}</TD>
              <TD>{inv.client}</TD>
              <TD>{inv.amount}</TD>
              <TD>{new Date(inv.due).toLocaleDateString('en-KE')}</TD>
              <TD><Chip status={inv.status} /></TD>
              <TD><button className="text-[10px] font-display text-[#E10600] hover:underline">Send Reminder</button></TD>
            </tr>
          ))}
        </AdminTable>
      </div>
    ),

    gallery: (
      <div>
        <h2 className="text-2xl font-heading font-light text-white mb-6">Gallery Manager</h2>
        <div
          className="bg-[#141414] border-2 border-dashed border-white/20 p-12 text-center mb-6 hover:border-[#E10600]/40 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={28} className={`mx-auto mb-3 ${uploading ? 'text-[#E10600] animate-pulse' : 'text-white/20'}`} />
          <p className="text-[13px] text-white/40 font-display mb-2">
            {uploading ? 'Uploading…' : 'Click to select images, or drag and drop here'}
          </p>
          <p className="text-[11px] text-white/20 font-display">JPEG, PNG, WebP · Max 20MB per file</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {uploads.length > 0 && (
          <div>
            <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Uploaded Media ({uploads.length})</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {uploads.map((f) => (
                <div key={f.name} className="group relative aspect-square bg-[#141414] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <p className="text-[9px] text-white/70 font-display text-center break-all leading-tight">{f.name}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(f.url).then(() => toast.success('URL copied'))}
                      className="text-[9px] font-display text-[#E10600] hover:underline"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => deleteGalleryFile(f.name)}
                      className="flex items-center gap-1 text-[9px] font-display text-red-400/70 hover:text-red-400"
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploads.length === 0 && !uploading && (
          <div className="bg-[#141414] border border-white/[0.06] p-5">
            <p className="text-[12px] text-white/25 font-display">No files uploaded yet. Use the area above to upload images.</p>
          </div>
        )}
      </div>
    ),

    settings: (
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-light text-white">Settings</h2>
        <div className="bg-[#141414] border border-white/[0.06] p-6 space-y-4">
          <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-2">Business Info</div>
          {(Object.keys(settings) as (keyof typeof settings)[]).map((k) => (
            <div key={k}>
              <label className="block text-[10px] font-display tracking-widest uppercase text-white/30 mb-1.5 capitalize">{k.replace('_', ' ')}</label>
              <input
                value={settings[k]}
                onChange={(e) => setSettings((s) => ({ ...s, [k]: e.target.value }))}
                className={inputCls}
              />
            </div>
          ))}
          <button onClick={saveSettings} disabled={savingSettings} className="btn-primary mt-2 disabled:opacity-50">
            <Save size={13} /> {savingSettings ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
        <div className="bg-[#141414] border border-white/[0.06] p-6">
          <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Account</div>
          <p className="text-[12px] text-white/35 font-display mb-4">Signed in as: {user.email}</p>
          <button onClick={onSignOut} className="flex items-center gap-2 text-[12px] font-display text-red-400/60 hover:text-red-400 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0B] pt-20">
        <div className="bg-[#141414] border-b border-white/[0.06] px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase">Admin Dashboard</div>
            <div className="text-[12px] font-display text-white/40">{user.email}</div>
          </div>
          <button onClick={onSignOut} className="flex items-center gap-1.5 text-[10px] font-display text-white/30 hover:text-white transition-colors uppercase tracking-widest">
            <LogOut size={13} /> Exit
          </button>
        </div>

        <div className="flex">
          <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-white/[0.05] min-h-[calc(100vh-120px)] sticky top-[120px]">
            <nav className="p-3 space-y-0.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-display tracking-widest uppercase text-left transition-colors ${tab === id ? 'bg-[#E10600]/10 text-white' : 'text-white/30 hover:text-white hover:bg-white/[0.03]'}`}>
                  <Icon size={13} className={tab === id ? 'text-[#E10600]' : 'text-white/20'} />{label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="lg:hidden w-full">
            <div className="overflow-x-auto scrollbar-none border-b border-white/[0.05]">
              <div className="flex min-w-max px-4 gap-0">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={`flex items-center gap-1.5 px-3 py-3 text-[9px] font-display tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors ${tab === id ? 'border-[#E10600] text-white' : 'border-transparent text-white/30 hover:text-white'}`}>
                    <Icon size={11} />{label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="flex-1 p-5 sm:p-8 min-w-0">
            {TAB_MAP[tab]}
          </main>
        </div>
      </div>

      {/* Modals */}
      {portfolioModal !== null && (
        <PortfolioModal item={portfolioModal.item} onClose={() => setPortfolioModal(null)} onSave={savePortfolio} />
      )}
      {blogModal !== null && (
        <BlogModal post={blogModal.post} onClose={() => setBlogModal(null)} onSave={saveBlog} />
      )}
      {testimonialModal !== null && (
        <TestimonialModal item={testimonialModal.item} onClose={() => setTestimonialModal(null)} onSave={saveTestimonial} />
      )}
      {deleteModal && (
        <DeleteConfirm label={deleteModal.label} onConfirm={deleteModal.onConfirm} onClose={() => setDeleteModal(null)} busy={deleteBusy} />
      )}
    </>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    createClient().auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  const signOut = async () => { await createClient().auth.signOut(); setUser(null); };

  if (!user) return <AdminLogin onLogin={setUser} />;
  return <AdminDashboard user={user} onSignOut={signOut} />;
}
