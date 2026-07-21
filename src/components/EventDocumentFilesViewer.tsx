'use client';

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import EventDocumentViewer from '@/components/EventDocumentViewer';

export interface EventDocFile { url: string; name: string; type: string | null }

export default function EventDocumentFilesViewer({ files, isIOS }: { files: EventDocFile[]; isIOS: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = files[activeIdx];

  const isImage = (active.type ?? '').startsWith('image/');
  const isPdf = (active.type ?? '') === 'application/pdf';

  return (
    <div className="h-full flex flex-col">
      {files.length > 1 && (
        <div className="flex items-center gap-1 px-3 sm:px-6 py-2 border-b border-white/[0.08] overflow-x-auto scrollbar-none shrink-0">
          {files.map((f, i) => (
            <button
              key={`${f.url}-${i}`}
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-display whitespace-nowrap transition-colors border ${i === activeIdx ? 'bg-[#E10600] text-white border-[#E10600]' : 'text-white/50 border-white/[0.1] hover:text-white'}`}
            >
              <FileText size={11} /> {f.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end px-3 sm:px-6 py-2 border-b border-white/[0.08] shrink-0">
        <a
          href={active.url}
          download={active.name}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-display tracking-widest uppercase text-white/60 hover:text-white border border-white/[0.12] px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0 transition-colors"
        >
          <Download size={11} className="shrink-0" /> <span className="hidden sm:inline">Download</span>
        </a>
      </div>

      <div className="flex-1 min-h-0">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.url} alt={active.name} className="w-full h-full object-contain bg-[#0B0B0B]" />
        ) : isPdf && isIOS ? (
          <iframe src={active.url} title={active.name} className="w-full h-full border-0 bg-white" />
        ) : isPdf ? (
          <EventDocumentViewer fileUrl={active.url} fileName={active.name} />
        ) : (
          <div className="flex items-center justify-center h-full px-4 text-center">
            <p className="text-white/60 text-sm font-display">
              This file type can&apos;t be previewed here.{' '}
              <a href={active.url} download={active.name} className="text-[#E10600] hover:underline">Download it instead</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
