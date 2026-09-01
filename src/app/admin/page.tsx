'use client';

import { useState, useEffect, useRef, type ReactNode, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  BarChart3, Users, Calendar, Camera, FileText, MessageSquare, Settings, LogOut,
  ChevronDown, Check, Upload, RefreshCw, Eye, Trash2, Edit3, Plus, TrendingUp,
  DollarSign, Star, X, Image as ImageIcon, Save, AlertTriangle, Layout,
  QrCode, Copy, Download as DownloadIcon, MessageCircle, Send, Heart,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { PAGE_CONTENT, PAGE_SLUGS, getPageContent } from '@/lib/page-content-schema';
import PageContentEditor from '@/components/admin/PageContentEditor';
import ImageUploadField from '@/components/admin/ImageUploadField';
import FocalPointPicker from '@/components/admin/FocalPointPicker';
import DocumentUploadField, { type UploadedDoc } from '@/components/admin/DocumentUploadField';
import ProjectMediaUploader, { type ProjectFile } from '@/components/admin/ProjectMediaUploader';
import { PROJECT_STAGES, PROJECT_STATUSES } from '@/lib/project-stages';
import QRCode from 'qrcode';

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
  cover_image: string;
  description: string;
  is_published: boolean;
  metadata: Record<string, unknown>;
};

function PortfolioModal({
  item, onClose, onSave,
}: { item?: Record<string, unknown> | null; onClose: () => void; onSave: (data: PortfolioForm, id?: string) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const existingMetadata = (item?.metadata as Record<string, unknown>) ?? {};
  const [form, setForm] = useState<PortfolioForm>({
    title: (item?.title as string) ?? '',
    category: (item?.category as string) ?? 'photography',
    cover_image: (item?.cover_image as string) ?? '',
    description: (item?.description as string) ?? '',
    is_published: (item?.is_published as boolean) ?? false,
    metadata: existingMetadata,
  });
  const [coverImagePosition, setCoverImagePosition] = useState<string>((existingMetadata.cover_image_position as string) ?? 'center');

  const set = (k: keyof PortfolioForm, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.cover_image) { toast.error('Title and cover image are required'); return; }
    setBusy(true);
    await onSave({ ...form, metadata: { ...existingMetadata, cover_image_position: coverImagePosition } }, item?.id as string | undefined);
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
        <Field label="Cover Image">
          <ImageUploadField value={form.cover_image} onChange={(v) => set('cover_image', v)} folder="portfolio" />
        </Field>
        <Field label="Focal Point">
          <p className="text-[10px] text-white/25 font-display mb-2">Which part of the photo should stay visible when it's cropped.</p>
          <FocalPointPicker value={coverImagePosition} onChange={setCoverImagePosition} />
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
  author_name: string;
  excerpt: string;
  content: string;
  cover_image: string;
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
    author_name: (post?.author_name as string) ?? '',
    excerpt: (post?.excerpt as string) ?? '',
    content: (post?.content as string) ?? '',
    cover_image: (post?.cover_image as string) ?? '',
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
            <input value={form.author_name} onChange={(e) => set('author_name', e.target.value)} className={inputCls} placeholder="Author name" />
          </Field>
        </div>
        <Field label="Cover Image">
          <ImageUploadField value={form.cover_image} onChange={(v) => set('cover_image', v)} folder="blog" />
        </Field>
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
type TestimonialForm = { client_name: string; client_role: string; client_avatar: string; rating: number; content: string; is_published: boolean };

function TestimonialModal({
  item, onClose, onSave,
}: { item?: Record<string, unknown> | null; onClose: () => void; onSave: (data: TestimonialForm, id?: string) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<TestimonialForm>({
    client_name: (item?.client_name as string) ?? '',
    client_role: (item?.client_role as string) ?? '',
    client_avatar: (item?.client_avatar as string) ?? '',
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
          <input value={form.client_role} onChange={(e) => set('client_role', e.target.value)} className={inputCls} placeholder="e.g. Bride, Marketing Director" />
        </Field>
        <Field label="Photo">
          <ImageUploadField value={form.client_avatar} onChange={(v) => set('client_avatar', v)} folder="testimonials" />
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

/* ── Project Modal ──────────────────────────────────────────────────── */
type ProjectForm = {
  title: string;
  description: string;
  service: string;
  client_user_id: string;
  stage: number;
  start_date: string;
  delivery_date: string;
  status: string;
  cover_image: string;
};

function ProjectModal({
  item, clients, onClose, onSave,
}: {
  item?: Record<string, unknown> | null;
  clients: Record<string, unknown>[];
  onClose: () => void;
  onSave: (data: ProjectForm, id?: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<ProjectForm>({
    title: (item?.title as string) ?? '',
    description: (item?.description as string) ?? '',
    service: (item?.service as string) ?? '',
    client_user_id: (item?.client_user_id as string) ?? '',
    stage: (item?.stage as number) ?? 0,
    start_date: (item?.start_date as string) ?? '',
    delivery_date: (item?.delivery_date as string) ?? '',
    status: (item?.status as string) ?? 'active',
    cover_image: (item?.cover_image as string) ?? '',
  });

  const set = <K extends keyof ProjectForm>(k: K, v: ProjectForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.client_user_id) { toast.error('Title and client are required'); return; }
    setBusy(true);
    await onSave(form, item?.id as string | undefined);
    setBusy(false);
  };

  return (
    <Modal title={item ? 'Edit Project' : 'Add Project'} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="e.g. Sarah & James Wedding" />
        </Field>
        <Field label="Client">
          <select value={form.client_user_id} onChange={(e) => set('client_user_id', e.target.value)} className={selectCls}>
            <option value="">— Select a client —</option>
            {clients.map((c) => (
              <option key={c.id as string} value={c.id as string}>{(c.name as string) ?? (c.email as string)} · {c.email as string}</option>
            ))}
          </select>
          {clients.length === 0 && <p className="text-[10px] text-white/25 font-display mt-1">No client accounts exist yet — they sign up via the client portal.</p>}
        </Field>
        <Field label="Service">
          <input value={form.service} onChange={(e) => set('service', e.target.value)} className={inputCls} placeholder="e.g. Wedding Photography" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stage">
            <select value={form.stage} onChange={(e) => set('stage', Number(e.target.value))} className={selectCls}>
              {PROJECT_STAGES.map((label, i) => <option key={label} value={i}>{label}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={selectCls}>
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date">
            <input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Delivery Date">
            <input type="date" value={form.delivery_date} onChange={(e) => set('delivery_date', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Cover Image">
          <ImageUploadField value={form.cover_image} onChange={(v) => set('cover_image', v)} folder="projects" />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={textareaCls} placeholder="Notes about this project…" />
        </Field>
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

/* ── Project Files Modal ────────────────────────────────────────────── */
function ProjectFilesModal({
  project, onClose,
}: { project: Record<string, unknown>; onClose: () => void }) {
  const sb = createClient();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await sb
        .from('mejasan_project_files')
        .select('*')
        .eq('project_id', project.id as string)
        .order('created_at', { ascending: false });
      if (error) { console.error('Failed to load project files:', error); toast.error(`Failed to load files: ${error.message}`); }
      setFiles((data as ProjectFile[]) ?? []);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title={`Files — ${project.title as string}`} onClose={onClose} wide>
      {loading ? (
        <p className="text-[12px] text-white/25 font-display">Loading…</p>
      ) : (
        <ProjectMediaUploader projectId={project.id as string} files={files} onFilesChange={setFiles} />
      )}
    </Modal>
  );
}

/* ── Event Document Modal ───────────────────────────────────────────── */
type DocumentForm = { event_name: string; description: string; booking_id: string; docs: UploadedDoc[] };

function DocumentModal({
  bookings, onClose, onSave,
}: { bookings: Record<string, unknown>[]; onClose: () => void; onSave: (data: DocumentForm) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<DocumentForm>({ event_name: '', description: '', booking_id: '', docs: [] });

  const set = <K extends keyof DocumentForm>(k: K, v: DocumentForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.event_name || form.docs.length === 0) { toast.error('Event name and at least one file are required'); return; }
    setBusy(true);
    await onSave(form);
    setBusy(false);
  };

  return (
    <Modal title="Share Document(s)" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Event Name">
          <input value={form.event_name} onChange={(e) => set('event_name', e.target.value)} className={inputCls} placeholder="e.g. Jane Doe Memorial Service" />
        </Field>
        <Field label="Linked Booking (optional)">
          <select value={form.booking_id} onChange={(e) => set('booking_id', e.target.value)} className={selectCls}>
            <option value="">— None —</option>
            {bookings.map((b) => (
              <option key={b.id as string} value={b.id as string}>{(b.client_name as string) ?? (b.client_email as string)} · {b.reference as string}</option>
            ))}
          </select>
        </Field>
        <Field label="Description (optional)">
          <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={textareaCls} placeholder="Shown to whoever opens the link" />
        </Field>
        <Field label="Document(s)">
          <p className="text-[10px] text-white/25 font-display mb-2">Add one or more files (e.g. the eulogy and the program) — they'll all share the same link and QR code.</p>
          <DocumentUploadField value={form.docs} onChange={(docs) => set('docs', docs)} />
        </Field>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-outline-dark flex-1 justify-center py-2.5 text-[11px]">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-primary flex-1 justify-center disabled:opacity-50">
            <Save size={12} /> {busy ? 'Saving…' : 'Save & Generate Link'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Wedding Form Modal ────────────────────────────────────────────── */
const WF_STATUSES = ['submitted', 'reviewed'];

const QUESTIONNAIRE_LABELS: [string, string][] = [
  ['theme_colors', 'Theme Colour(s)'], ['wedding_theme', 'Theme / Concept'],
  ['bride_prep_location', 'Bride Prep Location'], ['groom_prep_location', 'Groom Prep Location'],
  ['ceremony_venue', 'Ceremony Venue'], ['reception_venue', 'Reception Venue'],
  ['bride_prep_time', 'Bride Prep Time'], ['groom_prep_time', 'Groom Prep Time'],
  ['ceremony_time', 'Ceremony Time'], ['reception_time', 'Reception Time'], ['end_time', 'Expected End Time'],
  ['photo_style', 'Photography Style'], ['video_style', 'Video Style'],
  ['style_references', 'Reference Photos/Videos'], ['style_avoid', 'Styles/Shots to Avoid'],
  ['bride_parents', "Bride's Parents"], ['groom_parents', "Groom's Parents"],
  ['best_man', 'Best Man'], ['maid_of_honour', 'Maid of Honour'], ['vip_guests', 'VIP Guests'],
  ['family_groupings', 'Family Groupings'],
  ['highlight_length', 'Highlight Length'], ['documentary_edit', 'Documentary Edit'],
  ['pa_system', 'PA System'], ['sound_contact', 'Sound Contact'], ['live_performances', 'Live Performances'],
  ['planner_name', 'Planner'], ['planner_contact', 'Planner Contact'],
  ['mc_name', 'MC'], ['mc_contact', 'MC Contact'],
  ['church_coord_name', 'Church Coordinator'], ['church_coord_contact', 'Church Coordinator Contact'],
  ['venue_manager_name', 'Venue Manager'], ['venue_manager_contact', 'Venue Manager Contact'],
  ['how_you_met', 'How They Met'], ['proposal_story', 'Proposal Story'],
  ['special_songs', 'Special Songs/Quotes'], ['surprises', 'Surprises Planned'],
  ['selected_package', 'Selected Package'], ['additional_services', 'Additional Services'],
  ['delivery_timeline', 'Delivery Timeline'],
];

const CONTRACT_LABELS: [string, string][] = [
  ['event_type', 'Event Type'], ['event_date', 'Event Date'], ['location', 'Location'], ['cost', 'Total Cost (KES)'],
  ['client_name', 'Client Name'], ['client_phone', 'Client Phone'], ['media_consent', 'Media Consent'],
  ['sig_client_name', 'Client Signer'], ['sig_client_date', 'Client Signed'],
  ['sig_witness_name', 'Witness (Client)'], ['sig_witness_date', 'Witness Signed'],
  ['sig_company_name', 'Company Rep'], ['sig_company_date', 'Company Signed'],
  ['sig_compwit_name', 'Witness (Company)'], ['sig_compwit_date', 'Witness Signed'],
];

function DL({ pairs }: { pairs: [string, unknown][] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {pairs.map(([label, val]) => (
        <div key={label}>
          <div className="text-[9px] font-display tracking-widest uppercase text-white/25 mb-0.5">{label}</div>
          <div className="text-[12px] font-display text-white/70 whitespace-pre-wrap break-words">{(val as string) || '—'}</div>
        </div>
      ))}
    </div>
  );
}

function WeddingFormModal({
  item, onClose, onStatusChange,
}: { item: Record<string, unknown>; onClose: () => void; onStatusChange: (id: string, status: string) => Promise<void> }) {
  const q = (item.questionnaire as Record<string, unknown>) ?? {};
  const c = (item.contract as Record<string, unknown>) ?? {};
  const sigs = [
    ['Client', item.signature_client_url as string | null],
    ['Witness (Client)', item.signature_witness_url as string | null],
    ['Company Rep', item.signature_company_url as string | null],
    ['Witness (Company)', item.signature_company_witness_url as string | null],
  ] as [string, string | null][];

  return (
    <Modal title={`${item.bride_name as string} & ${item.groom_name as string}`} onClose={onClose} wide>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={item.status as string}
            onChange={(e) => onStatusChange(item.id as string, e.target.value)}
            className={`${selectCls} w-auto`}
          >
            {WF_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          {!!item.questionnaire_pdf_url && (
            <a href={item.questionnaire_pdf_url as string} target="_blank" rel="noreferrer" className="btn-outline-dark px-4 py-2 text-[10px] flex items-center gap-1.5">
              <DownloadIcon size={12} /> Questionnaire PDF
            </a>
          )}
          {!!item.contract_pdf_url && (
            <a href={item.contract_pdf_url as string} target="_blank" rel="noreferrer" className="btn-outline-dark px-4 py-2 text-[10px] flex items-center gap-1.5">
              <DownloadIcon size={12} /> Contract PDF
            </a>
          )}
          {item.is_correction ? <Chip status="corrected" /> : null}
        </div>

        <div>
          <h3 className="text-[11px] font-display tracking-widest uppercase text-white/40 mb-3 pb-2 border-b border-white/[0.06]">Questionnaire</h3>
          <DL pairs={[['Wedding Date', item.wedding_date], ['Client Email', item.client_email], ['Client Phone', item.client_phone],
            ...QUESTIONNAIRE_LABELS.map(([k, label]) => [label, q[k]] as [string, unknown])]} />
        </div>

        <div>
          <h3 className="text-[11px] font-display tracking-widest uppercase text-white/40 mb-3 pb-2 border-b border-white/[0.06]">Contract</h3>
          <DL pairs={CONTRACT_LABELS.map(([k, label]) => [label, c[k]] as [string, unknown])} />
        </div>

        <div>
          <h3 className="text-[11px] font-display tracking-widest uppercase text-white/40 mb-3 pb-2 border-b border-white/[0.06]">Signatures</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sigs.map(([label, url]) => (
              <div key={label}>
                <div className="text-[9px] font-display tracking-widest uppercase text-white/25 mb-1.5">{label}</div>
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={label} className="bg-white rounded p-1 w-full h-16 object-contain" />
                ) : (
                  <div className="h-16 border border-dashed border-white/10 rounded flex items-center justify-center text-white/15 text-[10px]">Not signed</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────── */
type TabId = 'overview' | 'leads' | 'bookings' | 'weddingForms' | 'clients' | 'projects' | 'messages' | 'portfolio' | 'blog' | 'testimonials' | 'pages' | 'documents' | 'invoices' | 'gallery' | 'settings';

function AdminDashboard({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [tab, setTab] = useState<TabId>('overview');
  const [leads, setLeads] = useState<Record<string, unknown>[]>([]);
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [weddingForms, setWeddingForms] = useState<Record<string, unknown>[]>([]);
  const [weddingFormModal, setWeddingFormModal] = useState<Record<string, unknown> | null>(null);
  const [portfolio, setPortfolio] = useState<Record<string, unknown>[]>([]);
  const [blog, setBlog] = useState<Record<string, unknown>[]>([]);
  const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([]);
  const [documents, setDocuments] = useState<Record<string, unknown>[]>([]);
  const [clients, setClients] = useState<Record<string, unknown>[]>([]);
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);

  /* Messages */
  const [messageProjectId, setMessageProjectId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Record<string, unknown>[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [adminMsgText, setAdminMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  /* Modals */
  const [portfolioModal, setPortfolioModal] = useState<{ item?: Record<string, unknown> | null } | null>(null);
  const [blogModal, setBlogModal] = useState<{ post?: Record<string, unknown> | null } | null>(null);
  const [testimonialModal, setTestimonialModal] = useState<{ item?: Record<string, unknown> | null } | null>(null);
  const [projectModal, setProjectModal] = useState<{ item?: Record<string, unknown> | null } | null>(null);
  const [projectFilesModal, setProjectFilesModal] = useState<Record<string, unknown> | null>(null);
  const [documentModal, setDocumentModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ label: string; onConfirm: () => Promise<void> } | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /* Gallery upload */
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  /* Settings */
  const [settings, setSettings] = useState({ name: 'Mejasan Media Production', email: 'info@mejasanmedia.com', phone: '+254 700 864 849', location: 'Kisumu, Kenya', whatsapp: '+254700864849' });
  const [savingSettings, setSavingSettings] = useState(false);

  /* Page content (About + Services) */
  const [pageSlug, setPageSlug] = useState<string>(PAGE_SLUGS[0]);
  const [pageContent, setPageContent] = useState<Record<string, unknown> | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);

  const sb = createClient();

  const fetchAll = async () => {
    try {
      const [l, b, p, bl, t, d, pr, wf] = await Promise.all([
        sb.from('mejasan_contact_submissions').select('*').order('created_at', { ascending: false }).limit(30),
        sb.from('mejasan_bookings').select('*').order('created_at', { ascending: false }).limit(30),
        sb.from('mejasan_portfolio').select('*').order('sort_order').limit(50),
        sb.from('mejasan_blog_posts').select('*').order('created_at', { ascending: false }).limit(20),
        sb.from('mejasan_testimonials').select('*').order('created_at', { ascending: false }).limit(30),
        sb.from('mejasan_event_documents').select('*, mejasan_event_document_files(count)').order('created_at', { ascending: false }).limit(50),
        sb.from('mejasan_projects').select('*').order('created_at', { ascending: false }).limit(100),
        sb.from('mejasan_wedding_intake').select('*').order('created_at', { ascending: false }).limit(50),
      ]);
      if (l.data) setLeads(l.data as Record<string, unknown>[]);
      if (b.data) setBookings(b.data as Record<string, unknown>[]);
      if (p.data) setPortfolio(p.data as Record<string, unknown>[]);
      if (bl.data) setBlog(bl.data as Record<string, unknown>[]);
      if (t.data) setTestimonials(t.data as Record<string, unknown>[]);
      if (d.data) setDocuments(d.data as Record<string, unknown>[]);
      if (pr.error) { console.error('Failed to load projects:', pr.error); toast.error(`Failed to load projects: ${pr.error.message}`); }
      if (pr.data) setProjects(pr.data as Record<string, unknown>[]);
      if (wf.error) { console.error('Failed to load wedding forms:', wf.error); toast.error(`Failed to load wedding forms: ${wf.error.message}`); }
      if (wf.data) setWeddingForms(wf.data as Record<string, unknown>[]);
    } catch { /* silent */ }
  };

  const fetchClients = async () => {
    try {
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch('/api/admin/clients', {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      const json = await res.json();
      if (!res.ok) { console.error('Failed to load clients:', json.error); toast.error(`Failed to load clients: ${json.error}`); return; }
      setClients(json as Record<string, unknown>[]);
    } catch (e: unknown) { console.error('Failed to load clients:', e); }
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

  const fetchPageContent = async (slug: string) => {
    setPageLoading(true);
    const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', slug).maybeSingle();
    setPageContent(getPageContent(slug, data?.content));
    setPageLoading(false);
  };

  const savePageContent = async () => {
    if (!pageContent) return;
    setPageSaving(true);
    const { error } = await sb.from('mejasan_page_content').upsert({ page_slug: pageSlug, content: pageContent }, { onConflict: 'page_slug' });
    setPageSaving(false);
    if (error) { console.error('Page content save failed:', error); toast.error(`Save failed: ${error.message}`); }
    else toast.success('Page content saved');
  };

  useEffect(() => { fetchAll(); fetchGallery(); fetchClients(); fetchPageContent(pageSlug); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateBookingStatus = async (id: string, status: string) => {
    await sb.from('mejasan_bookings').update({ status }).eq('id', id);
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success('Status updated');
  };

  const updateWeddingFormStatus = async (id: string, status: string) => {
    await sb.from('mejasan_wedding_intake').update({ status }).eq('id', id);
    setWeddingForms((f) => f.map((x) => (x.id === id ? { ...x, status } : x)));
    setWeddingFormModal((m) => (m && m.id === id ? { ...m, status } : m));
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

  /* Messages */
  const fetchThread = async (projectId: string) => {
    setMessagesLoading(true);
    try {
      const { data: { session } } = await sb.auth.getSession();
      const headers: Record<string, string> = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
      const res = await fetch(`/api/admin/messages?project_id=${projectId}`, { headers });
      if (res.ok) setThreadMessages(await res.json());
    } catch { /* silent */ }
    setMessagesLoading(false);
  };

  useEffect(() => {
    if (tab !== 'messages' || !messageProjectId) return;
    fetchThread(messageProjectId);
    const interval = setInterval(() => fetchThread(messageProjectId), 15000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, messageProjectId]);

  const sendAdminMessage = async () => {
    if (!adminMsgText.trim() || !messageProjectId || sendingMsg) return;
    setSendingMsg(true);
    try {
      const { data: { session } } = await sb.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) };
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({ project_id: messageProjectId, content: adminMsgText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to send message');
      setThreadMessages((m) => [...m, json]);
      setAdminMsgText('');
    } catch (e: unknown) { console.error('Send message failed:', e); toast.error(e instanceof Error ? e.message : 'Failed to send message'); }
    finally { setSendingMsg(false); }
  };

  /* Project CRUD */
  const saveProject = async (data: ProjectForm, id?: string) => {
    const payload = { ...data, stage_label: PROJECT_STAGES[data.stage] };
    if (id) {
      const { error } = await sb.from('mejasan_projects').update(payload).eq('id', id);
      if (error) { console.error('Project update failed:', error); toast.error(`Update failed: ${error.message}`); return; }
      setProjects((p) => p.map((x) => (x.id === id ? { ...x, ...payload } : x)));
      toast.success('Project updated');
    } else {
      const { data: row, error } = await sb.from('mejasan_projects').insert(payload).select().single();
      if (error) { console.error('Project insert failed:', error); toast.error(`Insert failed: ${error.message}`); return; }
      setProjects((p) => [row as Record<string, unknown>, ...p]);
      toast.success('Project created');
    }
    setProjectModal(null);
  };

  const deleteProject = async (id: string, title: string) => {
    setDeleteModal({
      label: title,
      onConfirm: async () => {
        setDeleteBusy(true);
        const { error } = await sb.from('mejasan_projects').delete().eq('id', id);
        setDeleteBusy(false);
        if (error) { console.error('Project delete failed:', error); toast.error(`Delete failed: ${error.message}`); return; }
        setProjects((p) => p.filter((x) => x.id !== id));
        toast.success('Project deleted');
        setDeleteModal(null);
      },
    });
  };

  /* Event document CRUD */
  const saveDocument = async (data: DocumentForm) => {
    if (data.docs.length === 0) return;
    const first = data.docs[0];
    const { data: row, error } = await sb.from('mejasan_event_documents').insert({
      event_name: data.event_name,
      description: data.description || null,
      booking_id: data.booking_id || null,
      file_url: first.url,
      file_name: first.name,
      file_type: first.type,
    }).select().single();
    if (error) { console.error('Document save failed:', error); toast.error(`Save failed: ${error.message}`); return; }

    const { error: filesError } = await sb.from('mejasan_event_document_files').insert(
      data.docs.map((d, i) => ({ event_document_id: row.id as string, url: d.url, name: d.name, type: d.type, sort_order: i }))
    );
    if (filesError) { console.error('Document files save failed:', filesError); toast.error(`Files failed to save: ${filesError.message} — has the 0005 migration been run?`); }

    setDocuments((d) => [{ ...row, mejasan_event_document_files: [{ count: data.docs.length }] } as Record<string, unknown>, ...d]);
    toast.success('Document(s) shared — link and QR code ready');
    setDocumentModal(false);
  };

  const toggleDocActive = async (id: string, current: boolean) => {
    const { error } = await sb.from('mejasan_event_documents').update({ is_active: !current }).eq('id', id);
    if (error) { toast.error('Update failed'); return; }
    setDocuments((d) => d.map((x) => (x.id === id ? { ...x, is_active: !current } : x)));
    toast.success(!current ? 'Link re-activated' : 'Link revoked');
  };

  const deleteDocument = async (id: string, name: string) => {
    setDeleteModal({
      label: name,
      onConfirm: async () => {
        setDeleteBusy(true);
        const { error } = await sb.from('mejasan_event_documents').delete().eq('id', id);
        setDeleteBusy(false);
        if (error) { toast.error('Delete failed'); return; }
        setDocuments((d) => d.filter((x) => x.id !== id));
        toast.success('Document removed');
        setDeleteModal(null);
      },
    });
  };

  const docLink = (token: string) => `${window.location.origin}/e/${token}`;

  const copyDocLink = (token: string) => {
    navigator.clipboard.writeText(docLink(token)).then(() => toast.success('Link copied'));
  };

  const downloadDocQr = async (token: string, label: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(docLink(token), { width: 512, margin: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${slugify(label) || 'event'}-qr.png`;
      a.click();
    } catch { toast.error('Could not generate QR code'); }
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
        if (error) { console.error('Gallery upload failed:', error); toast.error(`${file.name}: ${error.message}`); return null; }
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
    { id: 'weddingForms', label: 'Wedding Forms', icon: Heart },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'projects', label: 'Projects', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'portfolio', label: 'Portfolio', icon: Camera },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'pages', label: 'Pages', icon: Layout },
    { id: 'documents', label: 'Documents', icon: QrCode },
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

    weddingForms: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Wedding Forms</h2>
          <span className="text-[11px] font-display text-white/30">{weddingForms.length} total</span>
        </div>
        <AdminTable heads={['Couple', 'Wedding Date', 'Client Email', 'Status', 'Submitted', '']} onRefresh={fetchAll}>
          {weddingForms.map((f) => (
            <tr key={f.id as string} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold">{f.bride_name as string} &amp; {f.groom_name as string}</TD>
              <TD>{f.wedding_date ? new Date(f.wedding_date as string).toLocaleDateString('en-KE') : '—'}</TD>
              <TD>{f.client_email as string}</TD>
              <TD><Chip status={f.status as string} /></TD>
              <TD>{f.created_at ? new Date(f.created_at as string).toLocaleDateString('en-KE') : '—'}</TD>
              <TD>
                <button onClick={() => setWeddingFormModal(f)} className="flex items-center gap-1 text-[10px] font-display text-white/30 hover:text-white border border-white/[0.08] px-2 py-1">
                  <Eye size={11} /> View
                </button>
              </TD>
            </tr>
          ))}
          {weddingForms.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-[12px] text-white/20">No wedding intake submissions yet.</td></tr>}
        </AdminTable>
      </div>
    ),

    clients: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Clients</h2>
          <span className="text-[11px] font-display text-white/30">{clients.length} total</span>
        </div>
        <AdminTable heads={['Name', 'Email', 'Phone', 'Projects', 'Joined']} onRefresh={fetchClients}>
          {clients.map((c) => (
            <tr key={c.id as string} className="hover:bg-white/[0.02]">
              <TD className="text-white font-semibold">{c.name as string}</TD>
              <TD>{c.email as string}</TD>
              <TD>{(c.phone as string) || '—'}</TD>
              <TD>{c.projects as number}</TD>
              <TD>{c.joined ? new Date(c.joined as string).toLocaleDateString('en-KE') : '—'}</TD>
            </tr>
          ))}
          {clients.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-[12px] text-white/20">No clients have signed up via the client portal yet.</td></tr>}
        </AdminTable>
      </div>
    ),

    projects: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Projects</h2>
          <button onClick={() => setProjectModal({ item: null })} className="btn-primary flex items-center gap-2 text-[10px]">
            <Plus size={12} /> Add Project
          </button>
        </div>
        <AdminTable heads={['Project', 'Client', 'Service', 'Stage', 'Status', 'Actions']} onRefresh={fetchAll}>
          {projects.map((p) => {
            const client = clients.find((c) => c.id === p.client_user_id);
            return (
              <tr key={p.id as string} className="hover:bg-white/[0.02]">
                <TD className="text-white font-semibold">{p.title as string}</TD>
                <TD>{(client?.name as string) ?? '—'}</TD>
                <TD>{(p.service as string) || '—'}</TD>
                <TD>{PROJECT_STAGES[(p.stage as number) ?? 0]}</TD>
                <TD><Chip status={p.status as string} /></TD>
                <TD>
                  <div className="flex gap-2">
                    <button onClick={() => setProjectFilesModal(p)} className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-white transition-colors border border-white/[0.08] px-2 py-1">
                      <Upload size={10} /> Files
                    </button>
                    <button onClick={() => setProjectModal({ item: p })} className="text-white/30 hover:text-white transition-colors"><Edit3 size={13} /></button>
                    <button onClick={() => deleteProject(p.id as string, p.title as string)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </TD>
              </tr>
            );
          })}
          {projects.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-[12px] text-white/20">No projects yet. Add your first one.</td></tr>}
        </AdminTable>
      </div>
    ),

    messages: (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-heading font-light text-white">Messages</h2>
          <select
            value={messageProjectId ?? ''}
            onChange={(e) => setMessageProjectId(e.target.value || null)}
            className={`${selectCls} w-auto`}
          >
            <option value="">— Select a project —</option>
            {projects.map((p) => {
              const client = clients.find((c) => c.id === p.client_user_id);
              return <option key={p.id as string} value={p.id as string}>{p.title as string}{client ? ` — ${client.name as string}` : ''}</option>;
            })}
          </select>
        </div>
        {!messageProjectId ? (
          <div className="bg-[#141414] border border-white/[0.06] p-10 text-center">
            <MessageCircle className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-[12px] text-white/25 font-display">Select a project above to view or send messages.</p>
          </div>
        ) : (
          <div className="bg-[#141414] border border-white/[0.06] flex flex-col h-[480px]">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messagesLoading && threadMessages.length === 0 && <p className="text-[12px] text-white/25 font-display">Loading…</p>}
              {!messagesLoading && threadMessages.length === 0 && <p className="text-[12px] text-white/25 font-display">No messages yet.</p>}
              {threadMessages.map((m) => (
                <div key={m.id as string} className={`flex ${m.is_admin ? 'justify-end' : ''}`}>
                  <div className={`max-w-[75%] px-4 py-3 text-[13px] font-display ${!m.is_admin ? 'bg-[#1C1C1C] text-white/70' : 'bg-[#E10600] text-white'}`}>
                    {!m.is_admin && <div className="text-[9px] text-[#E10600] tracking-widest uppercase mb-1.5">{m.sender_name as string}</div>}
                    <p>{m.content as string}</p>
                    <div className="text-[9px] opacity-40 mt-1.5">{new Date(m.created_at as string).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] p-4 flex gap-3">
              <input
                value={adminMsgText}
                onChange={(e) => setAdminMsgText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAdminMessage(); } }}
                placeholder="Reply to client..."
                disabled={sendingMsg}
                className="flex-1 bg-[#0B0B0B] border border-white/[0.08] text-white/70 font-display text-sm px-4 py-2.5 focus:outline-none focus:border-[#E10600]/40 placeholder:text-white/20 disabled:opacity-50"
              />
              <button onClick={sendAdminMessage} disabled={sendingMsg} className="w-10 h-10 bg-[#E10600] flex items-center justify-center hover:bg-[#c00500] transition-colors disabled:opacity-50">
                <Send size={15} className="text-white" />
              </button>
            </div>
          </div>
        )}
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
                <img src={p.cover_image as string} alt={p.title as string} className="w-full h-full object-cover opacity-70" style={{ objectPosition: (p.metadata as Record<string, unknown> | undefined)?.cover_image_position as string }} />
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
              <TD>{(b.author_name as string) ?? '—'}</TD>
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
              <TD>{t.client_role as string}</TD>
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

    pages: (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-heading font-light text-white">Pages</h2>
          <div className="flex items-center gap-3">
            <select
              value={pageSlug}
              onChange={(e) => { setPageSlug(e.target.value); fetchPageContent(e.target.value); }}
              className={`${selectCls} w-auto`}
            >
              {PAGE_SLUGS.map((slug) => <option key={slug} value={slug}>{PAGE_CONTENT[slug].label}</option>)}
            </select>
            <button onClick={savePageContent} disabled={pageSaving || pageLoading || !pageContent} className="btn-primary disabled:opacity-50">
              <Save size={13} /> {pageSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
        <p className="text-[12px] text-white/25 font-display">
          Edit the images and text shown on this page. Changes go live as soon as you hit Save.
        </p>
        {pageLoading && <p className="text-[12px] text-white/25 font-display">Loading…</p>}
        {!pageLoading && pageContent && (
          <PageContentEditor schema={PAGE_CONTENT[pageSlug].schema} value={pageContent} onChange={setPageContent} />
        )}
      </div>
    ),

    documents: (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-light text-white">Shared Documents</h2>
          <button onClick={() => setDocumentModal(true)} className="btn-primary flex items-center gap-2 text-[10px]">
            <Plus size={12} /> Share a Document
          </button>
        </div>
        <p className="text-[12px] text-white/25 font-display mb-6">
          Upload a eulogy, program, or other document for a specific event. Each one gets a private link and a
          downloadable QR code that clients can use to view or download the file directly — no login required.
        </p>
        <div className="space-y-3">
          {documents.map((doc) => {
            const booking = bookings.find((b) => b.id === doc.booking_id);
            return (
              <div key={doc.id as string} className="bg-[#141414] border border-white/[0.06] p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-display font-semibold text-white truncate">{doc.event_name as string}</span>
                    <Chip status={doc.is_active ? 'published' : 'draft'} />
                  </div>
                  <div className="text-[11px] text-white/30 font-display truncate">
                    {(() => {
                      const fileCount = ((doc.mejasan_event_document_files as { count: number }[] | undefined)?.[0]?.count) ?? (doc.file_name ? 1 : 0);
                      return `${fileCount} file${fileCount === 1 ? '' : 's'}`;
                    })()}{booking ? ` · Linked to ${(booking.client_name as string) ?? (booking.reference as string)}` : ''} · {(doc.view_count as number) ?? 0} view(s)
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => copyDocLink(doc.access_token as string)} className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-white transition-colors border border-white/[0.08] px-2 py-1.5">
                    <Copy size={11} /> Copy Link
                  </button>
                  <button onClick={() => downloadDocQr(doc.access_token as string, doc.event_name as string)} className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-white transition-colors border border-white/[0.08] px-2 py-1.5">
                    <DownloadIcon size={11} /> QR Code
                  </button>
                  <button onClick={() => toggleDocActive(doc.id as string, doc.is_active as boolean)} className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-white transition-colors border border-white/[0.08] px-2 py-1.5">
                    <Eye size={11} /> {doc.is_active ? 'Revoke' : 'Reactivate'}
                  </button>
                  <button onClick={() => deleteDocument(doc.id as string, doc.event_name as string)} className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-red-400 transition-colors border border-white/[0.08] px-2 py-1.5">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
          {documents.length === 0 && (
            <div className="py-16 text-center bg-[#141414] border border-white/[0.06]">
              <QrCode size={24} className="text-white/15 mx-auto mb-3" />
              <p className="text-[12px] text-white/25">No documents shared yet.</p>
            </div>
          )}
        </div>
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
      {projectModal !== null && (
        <ProjectModal item={projectModal.item} clients={clients} onClose={() => setProjectModal(null)} onSave={saveProject} />
      )}
      {projectFilesModal !== null && (
        <ProjectFilesModal project={projectFilesModal} onClose={() => setProjectFilesModal(null)} />
      )}
      {documentModal && (
        <DocumentModal bookings={bookings} onClose={() => setDocumentModal(false)} onSave={saveDocument} />
      )}
      {weddingFormModal && (
        <WeddingFormModal item={weddingFormModal} onClose={() => setWeddingFormModal(null)} onStatusChange={updateWeddingFormStatus} />
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
