import type { Metadata } from 'next';
import HeroSection       from '@/components/sections/HeroSection';
import ServicesPreview   from '@/components/sections/ServicesPreview';
import FeaturedWork      from '@/components/sections/FeaturedWork';
import StatsSection      from '@/components/sections/StatsSection';
import TestimonialsSection, { type Testimonial } from '@/components/sections/TestimonialsSection';
import ContactCTA        from '@/components/sections/ContactCTA';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type HomeContent } from '@/lib/page-content-schema';

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

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Sarah Kamau', role: 'Bride, Karen Wedding 2024', text: "Mejasan captured every moment of our wedding day with such artistry. The photos are beyond anything we imagined — they're not just pictures, they're memories that will live forever.", rating: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { id: '2', name: 'James Mwangi', role: 'Marketing Director, Safaricom PLC', text: 'We hired Mejasan for our annual corporate summit and the results were phenomenal. The team was professional, the quality was world-class, and the deliverable exceeded every expectation.', rating: 5, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  { id: '3', name: 'Grace Njoroge', role: 'Executive Director, UN Environment Programme', text: 'The drone footage Mejasan produced for our climate summit documentation was absolutely breathtaking. Their KCAA licensing gave us complete confidence throughout the project.', rating: 5, img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80' },
  { id: '4', name: 'Michael Oloo', role: 'Brand Manager, Equity Bank Kenya', text: "Outstanding content production team. They understood our brand voice instantly and delivered a social media campaign that drove measurable results. We won't use anyone else.", rating: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
];

export default async function HomePage() {
  const sb = await createClient();
  const [pageRow, testimonialsRes] = await Promise.all([
    sb.from('mejasan_page_content').select('content').eq('page_slug', 'home').maybeSingle(),
    sb.from('mejasan_testimonials').select('*').eq('is_published', true).order('sort_order').order('created_at', { ascending: false }),
  ]);
  const content = getPageContent('home', pageRow.data?.content) as HomeContent;
  const testimonials: Testimonial[] = testimonialsRes.data?.length
    ? testimonialsRes.data.map((r) => ({
        id: r.id as string,
        name: r.client_name as string,
        role: r.client_role as string ?? '',
        text: r.content as string,
        rating: (r.rating as number) ?? 5,
        img: (r.client_avatar as string) || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
      }))
    : FALLBACK_TESTIMONIALS;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection content={content.hero} />
      <ServicesPreview content={content.servicesPreview} />
      <FeaturedWork content={content.featuredWork} />
      <StatsSection content={content.statsSection} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactCTA content={content.contactCta} />
    </>
  );
}
