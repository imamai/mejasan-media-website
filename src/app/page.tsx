import type { Metadata } from 'next';
import HeroSection       from '@/components/sections/HeroSection';
import ServicesPreview   from '@/components/sections/ServicesPreview';
import FeaturedWork      from '@/components/sections/FeaturedWork';
import StatsSection      from '@/components/sections/StatsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactCTA        from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Mejasan Media Production | Photography & Videography Kenya',
  description: "Stories That Move People. Kenya's premier photography, videography, wedding films & drone studio serving Nairobi and East Africa.",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://mejasanmedia.com',
  name: 'Mejasan Media Production',
  description: "Kenya's premier photography, videography & drone media production studio.",
  url: 'https://mejasanmedia.com',
  logo: 'https://mejasanmedia.com/mejasan-logo.jpg',
  image: 'https://mejasanmedia.com/og-image.jpg',
  telephone: '+254700864849',
  email: 'info@mejasanmedia.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Kisumu', addressCountry: 'KE' },
  geo: { '@type': 'GeoCoordinates', latitude: -0.1022, longitude: 34.7617 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '16:00' },
  ],
  priceRange: '$$',
  sameAs: [
    'https://www.instagram.com/mejasanmedia',
    'https://www.facebook.com/mejasanmedia',
    'https://www.youtube.com/@mejasanmedia',
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <ServicesPreview />
      <FeaturedWork />
      <StatsSection />
      <TestimonialsSection />
      <ContactCTA />
    </>
  );
}
