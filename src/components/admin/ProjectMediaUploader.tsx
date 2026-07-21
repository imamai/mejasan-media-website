'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Upload, Trash2, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'mejasan-media';

export type ProjectFile = {
  id: string;
  project_id: string;
  name: string;
  url: string;
  type: string;
  size_bytes: number | null;
  created_at: string;
};

function fileType(mime: string): 'image' | 'video' | 'document' {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'document';
}

export default function ProjectMediaUploader({
  projectId, files, onFilesChange,
}: {
  projectId: string;
  files: ProjectFile[];
  onFilesChange: (files: ProjectFile[]) => void;
}) {
  const sb = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setUploading(true);

    let current = files;
    for (const file of selected) {
      const path = `projects/${projectId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await sb.storage.from(BUCKET).upload(path, file, { upsert: false });
      if (uploadError) {
        console.error('Project file upload failed:', uploadError);
        toast.error(`${file.name}: ${uploadError.message}`);
        continue;
      }
      const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(path);
      const { data: row, error: insertError } = await sb
        .from('mejasan_project_files')
        .insert({
          project_id: projectId,
          name: file.name,
          url: publicUrl,
          type: fileType(file.type),
          size_bytes: file.size,
        })
        .select()
        .single();
      if (insertError) {
        console.error('Project file record failed:', insertError);
        toast.error(`${file.name} uploaded but couldn't be saved: ${insertError.message}`);
        continue;
      }
      current = [row as ProjectFile, ...current];
      onFilesChange(current);
      toast.success(`${file.name} uploaded`);
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const deleteFile = async (f: ProjectFile) => {
    setBusyId(f.id);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const path = f.url.includes(marker) ? f.url.split(marker)[1] : null;
    if (path) await sb.storage.from(BUCKET).remove([path]);
    const { error } = await sb.from('mejasan_project_files').delete().eq('id', f.id);
    setBusyId(null);
    if (error) { console.error('Project file delete failed:', error); toast.error(`Delete failed: ${error.message}`); return; }
    onFilesChange(files.filter((x) => x.id !== f.id));
    toast.success('File removed');
  };

  return (
    <div className="space-y-4">
      <div
        className="bg-[#0B0B0B] border-2 border-dashed border-white/20 p-8 text-center hover:border-[#E10600]/40 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={22} className={`mx-auto mb-2 ${uploading ? 'text-[#E10600] animate-pulse' : 'text-white/20'}`} />
        <p className="text-[12px] text-white/40 font-display">{uploading ? 'Uploading…' : 'Click to select images or video'}</p>
        <p className="text-[10px] text-white/20 font-display mt-1">Images, MP4, MOV, WebM · Max 500MB per file</p>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((f) => (
            <div key={f.id} className="group relative aspect-square bg-[#0B0B0B] border border-white/[0.06] overflow-hidden">
              {f.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt={f.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : f.type === 'video' ? (
                <video src={f.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><FileText size={20} className="text-white/20" /></div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-[9px] text-white/70 font-display text-center break-all leading-tight">{f.name}</p>
                <a href={f.url} target="_blank" rel="noreferrer" className="text-[9px] font-display text-[#E10600] hover:underline">Open</a>
                <button onClick={() => deleteFile(f)} disabled={busyId === f.id} className="flex items-center gap-1 text-[9px] font-display text-red-400/70 hover:text-red-400 disabled:opacity-50">
                  <Trash2 size={10} /> {busyId === f.id ? 'Removing…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-white/25 font-display">No files uploaded yet for this project.</p>
      )}
    </div>
  );
}
