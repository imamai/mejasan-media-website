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
      <div className="relative w-24 h-24 shrink-0 overflow-hidden">
        <Image src={src} alt="Mejasan Media Production" fill className="object-contain" />
      </div>
    </div>
  );

  return href ? <Link href={href}>{img}</Link> : img;
}
