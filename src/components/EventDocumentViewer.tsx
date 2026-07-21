'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function EventDocumentViewer({ fileUrl, fileName }: { fileUrl: string; fileName: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (failed) {
    return (
      <div className="flex items-center justify-center h-full px-4 text-center">
        <p className="text-white/60 text-sm font-display">
          This document couldn&apos;t be previewed on your device.{' '}
          <a href={fileUrl} download={fileName ?? undefined} className="text-[#E10600] hover:underline">Download it instead</a>.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-[#525659] flex flex-col items-center py-4 gap-4">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        onLoadError={() => setFailed(true)}
        loading={<p className="text-white/50 text-sm font-display py-10">Loading document…</p>}
        error={<p className="text-white/50 text-sm font-display py-10">Couldn&apos;t load this document.</p>}
      >
        {width > 0 && Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={Math.min(width - 16, 900)}
            className="shadow-lg mb-4"
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
