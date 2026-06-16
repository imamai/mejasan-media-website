import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service', description: 'Mejasan Media Production terms of service.' };

export default function TermsPage() {
  return (
    <div className="bg-[#0B0B0B] pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Legal</span></div>
        <h1 className="text-5xl font-heading font-light text-white mb-4">Terms of Service</h1>
        <p className="text-white/30 font-display text-sm mb-12">Last updated: January 2025</p>
        <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-light prose-p:text-white/50 prose-p:leading-relaxed prose-h2:text-3xl prose-h3:text-xl">
          <h2>1. Services</h2>
          <p>Mejasan Media Production provides professional photography, videography, event coverage, drone footage, and branding services. By engaging our services, you agree to these terms.</p>
          <h2>2. Bookings and Deposits</h2>
          <p>A non-refundable deposit of 50% is required to secure your booking date. This deposit confirms our mutual commitment and covers preparatory work. The remaining balance is due 7 days before the event date.</p>
          <h2>3. Cancellation Policy</h2>
          <p>Cancellations made more than 30 days before the event date will result in forfeiture of the deposit. Cancellations within 30 days of the event date require full payment. We reserve the right to reschedule due to unforeseen circumstances.</p>
          <h2>4. Intellectual Property</h2>
          <p>Mejasan Media Production retains copyright of all work produced. Upon full payment, clients receive a non-exclusive licence to use the final deliverables for personal and commercial purposes. Portfolio use rights are retained by Mejasan Media.</p>
          <h2>5. Deliverables and Timeline</h2>
          <p>Estimated delivery timelines are provided at the time of booking. Standard delivery is 4–6 weeks for photography and 6–8 weeks for video productions. Rush delivery options are available at additional cost.</p>
          <h2>6. Client Responsibilities</h2>
          <p>Clients are responsible for providing accurate event details, obtaining necessary permissions for filming locations, and ensuring reasonable access and safety for our team.</p>
          <h2>7. Limitation of Liability</h2>
          <p>Our liability is limited to the amount paid for the specific service. We are not responsible for circumstances beyond our control, including equipment failure due to extreme conditions or event access restrictions.</p>
          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of Kenya. Any disputes shall be resolved through mediation before pursuing legal action.</p>
          <h2>9. Contact</h2>
          <p>For questions about these terms, contact us at info@mejasanmedia.com or +254 700 864 849.</p>
        </div>
      </div>
    </div>
  );
}
