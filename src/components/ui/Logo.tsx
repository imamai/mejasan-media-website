import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
  logoUrl?: string | null;
  dark?: boolean;
}

export default function Logo({ className = '', href = '/', logoUrl, dark = false }: LogoProps) {
  const src = logoUrl ?? '/mejasan-logo.png';

  const img = (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative w-26 h-26 shrink-0 overflow-hidden">
        <Image src={src} alt="Mejasan Media Production" fill className={`object-contain${dark ? ' brightness-0' : ''}`} />
      </div>
    </div>
  );

  return href ? <Link href={href}>{img}</Link> : img;
}
