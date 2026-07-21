'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Upload, FileText, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'mejasan-event-docs';

export interface UploadedDoc { url: string; name: string; type: string }

export default function DocumentUploadField({
  value, onChange,
}: { value: UploadedDoc | null; onChange: (doc: UploadedDoc | null) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const sb = createClient();
    const path = `docs/${Date.now()}-${file.name}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, file, { upsert: false });
    setUploading(false);
    if (error) { toast.error('Upload failed'); return; }
    const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(path);
    onChange({ url: publicUrl, name: file.name, type: file.type });
    toast.success('File uploaded');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center justify-between gap-3 border border-white/[0.08] bg-[#0B0B0B] px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText size={16} className="text-[#E10600] shrink-0" />
            <span className="text-[12px] font-display text-white/70 truncate">{value.name}</span>
          </div>
          <button type="button" onClick={() => onChange(null)} className="text-white/30 hover:text-red-400 transition-colors shrink-0" aria-label="Remove file">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-[#E10600]/40 text-white/40 hover:text-white transition-colors px-4 py-6 text-[12px] font-display disabled:opacity-50"
        >
          <Upload size={14} /> {uploading ? 'Uploading…' : 'Click to upload PDF or document'}
        </button>
      )}
      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf,image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
