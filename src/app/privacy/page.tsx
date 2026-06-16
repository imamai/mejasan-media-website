import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'Mejasan Media Production privacy policy.' };

export default function PrivacyPage() {
  return (
    <div className="bg-[#0B0B0B] pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Legal</span></div>
        <h1 className="text-5xl font-heading font-light text-white mb-4">Privacy Policy</h1>
        <p className="text-white/30 font-display text-sm mb-12">Last updated: January 2025</p>
        <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-light prose-p:text-white/50 prose-p:leading-relaxed prose-h2:text-3xl prose-h3:text-xl">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you make a booking enquiry, contact us through our website, or create a client portal account. This includes your name, email address, phone number, and project details.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide and improve our services, communicate with you about your projects, send booking confirmations and project updates, and comply with legal obligations.</p>
          <h2>3. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. Your data is stored securely on Supabase infrastructure with row-level security policies.</p>
          <h2>4. Data Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to provide our services (e.g., cloud storage providers).</p>
          <h2>5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at info@mejasanmedia.com.</p>
          <h2>6. Cookies</h2>
          <p>Our website uses essential cookies required for authentication and session management. We do not use tracking or advertising cookies.</p>
          <h2>7. Contact Us</h2>
          <p>For privacy-related questions, contact us at: info@mejasanmedia.com or +254 700 864 849.</p>
        </div>
      </div>
    </div>
  );
}
