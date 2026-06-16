import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUpRight, Instagram, Youtube, Globe } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const LINKS = {
  Services: [
    { label: 'Photography',    href: '/services/photography' },
    { label: 'Videography',    href: '/services/videography' },
    { label: 'Event Coverage', href: '/services/events' },
    { label: 'Drone Services', href: '/services/drone' },
    { label: 'Branding',       href: '/services/branding' },
  ],
  Company: [
    { label: 'About Us',     href: '/about' },
    { label: 'Portfolio',    href: '/portfolio' },
    { label: 'Blog',         href: '/blog' },
    { label: 'Contact',      href: '/contact' },
    { label: 'Client Portal', href: '/client-portal' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/mejasanmedia' },
  { icon: Youtube,   label: 'YouTube',   href: 'https://youtube.com/@mejasanmedia' },
  { icon: Globe,     label: 'Website',   href: 'https://mejasanmedia.com' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] border-t border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pt-16 pb-8">

        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo className="mb-6" />
            <p className="text-[14px] text-white/55 leading-relaxed mb-6 max-w-xs">
              Kenya&apos;s premier media production studio — photography, videography, drone, and brand storytelling that moves people.
            </p>
            <div className="space-y-3">
              <a href="tel:+254700864849" className="flex items-center gap-2.5 text-[13px] text-white/55 hover:text-white transition-colors">
                <Phone size={13} className="text-[#E10600]" /> +254 700 864 849
              </a>
              <a href="mailto:info@mejasanmedia.com" className="flex items-center gap-2.5 text-[13px] text-white/55 hover:text-white transition-colors">
                <Mail size={13} className="text-[#E10600]" /> info@mejasanmedia.com
              </a>
              <span className="flex items-center gap-2.5 text-[13px] text-white/55">
                <MapPin size={13} className="text-[#E10600]" /> Kisumu, Kenya
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-[11px] font-display font-semibold tracking-[0.3em] uppercase text-[#E10600] mb-5">{group}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[13px] text-white/50 hover:text-white transition-colors flex items-center gap-1 group">
                      {item.label}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-[12px] text-white/40 font-display">
            © {new Date().getFullYear()} Mejasan Media Production. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${label}`}
                className="w-8 h-8 border border-white/[0.1] flex items-center justify-center text-white/40 hover:text-white hover:border-[#E10600] transition-all"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
