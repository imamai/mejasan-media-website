import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mejasan Media Production';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B0B0B',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Red accent bar */}
        <div style={{ width: 60, height: 3, background: '#E10600', marginBottom: 32 }} />

        {/* Brand name */}
        <div style={{ fontSize: 72, fontWeight: 300, color: '#FAFAFA', lineHeight: 1, marginBottom: 16 }}>
          Mejasan Media
        </div>
        <div style={{ fontSize: 72, fontWeight: 300, color: '#E10600', fontStyle: 'italic', lineHeight: 1, marginBottom: 40 }}>
          Production
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 24, color: 'rgba(250,250,250,0.55)', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
          Stories That Move People
        </div>

        {/* Bottom right location */}
        <div style={{
          position: 'absolute',
          bottom: 80,
          right: 80,
          fontSize: 14,
          color: 'rgba(250,250,250,0.3)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: 'sans-serif',
        }}>
          Nairobi · Kenya
        </div>
      </div>
    ),
    { ...size },
  );
}
