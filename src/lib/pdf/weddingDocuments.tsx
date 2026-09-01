import fs from 'node:fs';
import path from 'node:path';
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import type { WeddingQuestionnaireData, WeddingContractData, WeddingContractSignatures } from '@/lib/wedding-form/types';

const LOGO_SRC = { data: fs.readFileSync(path.join(process.cwd(), 'public', 'mejasan-logo.png')), format: 'png' as const };
const RED = '#c0392b';
const MUTED = '#666666';

export type { WeddingQuestionnaireData, WeddingContractData, WeddingContractSignatures };

const styles = StyleSheet.create({
  page: { padding: 44, fontSize: 9, color: '#0a0a0a', fontFamily: 'Helvetica' },
  logo: { width: 90, height: 38, objectFit: 'contain', alignSelf: 'center', marginBottom: 8 },
  h1: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 3 },
  h2: { fontSize: 10, textAlign: 'center', marginBottom: 14 },
  intro: { fontSize: 9, fontFamily: 'Helvetica-Oblique', color: '#333', marginBottom: 18, lineHeight: 1.5 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  sectionRule: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 8 },
  qBlock: { marginBottom: 8 },
  q: { fontSize: 9, color: '#111' },
  a: { fontSize: 9, color: RED, marginTop: 2 },
  timelineRow: { flexDirection: 'row', marginBottom: 4 },
  timelineLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', width: 26 },
  timelineText: { fontSize: 9, flex: 1 },
  timelineTime: { fontSize: 9, color: RED, fontFamily: 'Helvetica-Bold' },
  thankYou: { fontSize: 10, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 20 },
});

function Field({ n, label, value }: { n: number; label: string; value: string }) {
  return (
    <View style={styles.qBlock}>
      <Text style={styles.q}>{n}. {label}:</Text>
      <Text style={styles.a}>{value || '—'}</Text>
    </View>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{n}. {title}</Text>
      <View style={styles.sectionRule} />
      {children}
    </View>
  );
}

function QuestionnaireDocument({ d }: { d: WeddingQuestionnaireData }) {
  const familyGroups = (d.family_groupings || '').split('|').map(s => s.trim()).filter(Boolean);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={LOGO_SRC} style={styles.logo} />
        <Text style={styles.h1}>MEJASAN MEDIA PRODUCTION</Text>
        <Text style={styles.h2}>WEDDING MEDIA PLANNING QUESTIONNAIRE</Text>
        <Text style={styles.intro}>
          Kindly fill in the details below to help us plan and execute exceptional photography, videography, and drone coverage for your wedding day.
        </Text>

        <Section n={1} title="EVENT OVERVIEW & LOGISTICS">
          <Field n={1} label="Full Names of Bride and Groom" value={`${d.bride_name} & ${d.groom_name}`} />
          <Field n={2} label="Wedding Date(s)" value={d.wedding_date} />
          <Field n={3} label="Wedding Theme Color(s)" value={d.theme_colors} />
          <Field n={4} label="Overall Wedding Theme/Concept (e.g., rustic, royal, modern, garden, traditional)" value={d.wedding_theme} />
          <Field n={5} label="Bride Preparation Location (Include exact address or GPS pin)" value={d.bride_prep_location} />
          <Field n={6} label="Groom Preparation Location (Include exact address or GPS pin)" value={d.groom_prep_location} />
          <Field n={7} label="Ceremony Venue (Name & Location)" value={d.ceremony_venue} />
          <Field n={8} label="Reception Venue (Name & Location)" value={d.reception_venue} />
        </Section>

        <Section n={2} title="WEDDING DAY TIMELINE">
          {[
            ['1', 'Bride Prep Start Time', d.bride_prep_time],
            ['2', 'Groom Prep Start Time', d.groom_prep_time],
            ['3', 'Ceremony Start Time', d.ceremony_time],
            ['4', 'Reception Start Time', d.reception_time],
            ['5', 'Expected End Time', d.end_time],
          ].map(([n, label, val]) => (
            <View style={styles.timelineRow} key={n}>
              <Text style={styles.timelineLabel}>{n}.</Text>
              <Text style={styles.timelineText}>{label}:</Text>
              <Text style={styles.timelineTime}>{val || '—'}</Text>
            </View>
          ))}
        </Section>

        <Section n={3} title="CREATIVE DIRECTION & STYLE PREFERENCES">
          <Field n={1} label="Describe the photography style you prefer (e.g., documentary, editorial, traditional, luxury)" value={d.photo_style} />
          <Field n={2} label="Describe the video style you prefer (e.g., cinematic, fun, emotional, dramatic)" value={d.video_style} />
          <Field n={3} label="Are there specific reference photos or videos you like? (Attach separately if possible)" value={d.style_references} />
          <Field n={4} label="Are there styles or shots you DO NOT like?" value={d.style_avoid} />
        </Section>

        <Section n={4} title="KEY PEOPLE & PRIORITY COVERAGE">
          <View style={styles.qBlock}>
            <Text style={styles.q}>1. Parents&apos; Names (Bride & Groom):</Text>
            <Text style={styles.a}>{d.bride_parents || '—'}</Text>
            <Text style={styles.a}>{d.groom_parents || '—'}</Text>
          </View>
          <Field n={2} label="Best Man & Maid of Honor" value={`${d.best_man}${d.best_man && d.maid_of_honour ? ' | ' : ''}${d.maid_of_honour}`} />
          <Field n={3} label="VIP Guests or Special Dignitaries" value={d.vip_guests} />
        </Section>

        <Section n={5} title="FAMILY PHOTO GROUPINGS REQUIRED">
          <Text style={{ fontSize: 9, marginBottom: 4 }}>List specific family combinations you would like photographed:</Text>
          {familyGroups.length ? familyGroups.map((g, i) => (
            <Text style={styles.a} key={i}>{g}</Text>
          )) : <Text style={styles.a}>—</Text>}
        </Section>

        <Section n={6} title="DELIVERABLES & PACKAGE DETAILS">
          <Field n={1} label="Videography: Preferred highlight length?" value={d.highlight_length} />
          <Field n={2} label="Do you require a full documentary edit?" value={d.documentary_edit} />
        </Section>

        <Section n={7} title="AUDIO & TECHNICAL COORDINATION">
          <Field n={1} label="Will there be a PA system available?" value={d.pa_system} />
          <Field n={2} label="Who is in charge of the sound system? (Provide contact)" value={d.sound_contact} />
          <Field n={3} label="Are there live performances or surprise presentations?" value={d.live_performances} />
        </Section>

        <Section n={8} title="COORDINATION CONTACTS">
          <Field n={1} label="Wedding Planner (Name & Contact)" value={`${d.planner_name}${d.planner_name && d.planner_contact ? ' — ' : ''}${d.planner_contact}`} />
          <Field n={2} label="MC (Name & Contact)" value={`${d.mc_name}${d.mc_name && d.mc_contact ? ' — ' : ''}${d.mc_contact}`} />
          <Field n={3} label="Church Coordinator (Name & Contact)" value={`${d.church_coord_name}${d.church_coord_name && d.church_coord_contact ? ' — ' : ''}${d.church_coord_contact}`} />
          <Field n={4} label="Reception Venue Manager (Name & Contact)" value={`${d.venue_manager_name}${d.venue_manager_name && d.venue_manager_contact ? ' — ' : ''}${d.venue_manager_contact}`} />
        </Section>

        <Section n={9} title="YOUR LOVE STORY (FOR CINEMATIC HIGHLIGHT FILM)">
          <Field n={1} label="How did you meet?" value={d.how_you_met} />
          <Field n={2} label="Proposal story" value={d.proposal_story} />
          <Field n={3} label="Special songs or meaningful quotes" value={d.special_songs} />
          <Field n={4} label="Any surprises planned during the wedding?" value={d.surprises} />
        </Section>

        <Section n={10} title="AGREEMENT CONFIRMATION">
          <Field n={1} label="Selected Package" value={d.selected_package} />
          <Field n={2} label="Any additional services requested" value={d.additional_services} />
          <Field n={3} label="Preferred delivery timeline expectations" value={d.delivery_timeline} />
        </Section>

        <Text style={styles.thankYou}>Thank you for choosing Mejasan Media Production. We look forward to telling your story beautifully.</Text>
      </Page>
    </Document>
  );
}

const cstyles = StyleSheet.create({
  page: { padding: 44, fontSize: 9, color: '#0a0a0a', fontFamily: 'Helvetica' },
  logo: { width: 90, height: 38, objectFit: 'contain', alignSelf: 'center', marginBottom: 6 },
  tagline: { fontSize: 9, fontFamily: 'Helvetica-Oblique', color: MUTED, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 17, textAlign: 'center', marginBottom: 8 },
  titleRule: { borderBottomWidth: 1, borderBottomColor: RED, width: 220, alignSelf: 'center', marginBottom: 16 },
  table: { borderWidth: 1, borderColor: '#ccc', marginBottom: 14 },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  tRowLast: { flexDirection: 'row' },
  tCell: { flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: '#ccc' },
  tCellLast: { flex: 1, padding: 8 },
  tLabel: { fontSize: 8, color: MUTED },
  tValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 2 },
  intro: { fontSize: 9, fontFamily: 'Helvetica-Oblique', color: '#333', marginBottom: 16, lineHeight: 1.5 },
  termsHeading: { fontSize: 13, color: RED, marginBottom: 10 },
  clause: { marginBottom: 9 },
  clauseTitle: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  clauseText: { fontSize: 9, lineHeight: 1.4, color: '#222' },
  consentRow: { flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' },
  consentBox: { fontSize: 9, marginRight: 6 },
  consentLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  refLine: { fontSize: 9, fontFamily: 'Helvetica-Oblique', marginTop: 14, marginBottom: 4 },
  signingLine: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 10, marginBottom: 4 },
  hr: { borderBottomWidth: 1, borderBottomColor: RED, marginBottom: 16 },
  sigGrid: { flexDirection: 'row', borderWidth: 1, borderColor: '#ccc' },
  sigCol: { flex: 1, padding: 14, borderRightWidth: 1, borderRightColor: '#ccc' },
  sigColLast: { flex: 1, padding: 14 },
  sigAccepted: { fontSize: 9.5, fontFamily: 'Helvetica-BoldOblique', color: RED, marginBottom: 8 },
  sigRow: { marginBottom: 10 },
  sigRowLabel: { fontSize: 9, fontFamily: 'Helvetica-BoldOblique', color: RED },
  sigImage: { width: 130, height: 36, objectFit: 'contain', marginTop: 4, marginBottom: 4 },
  sigBlank: { borderBottomWidth: 1, borderBottomColor: '#999', width: 150, marginTop: 14, marginBottom: 4 },
  footer: { position: 'absolute', bottom: 24, left: 44, right: 44, textAlign: 'center' },
  footerRule: { borderBottomWidth: 1, borderBottomColor: RED, marginBottom: 6 },
  footerText: { fontSize: 7.5, fontFamily: 'Helvetica-Oblique', color: '#888' },
});

function SigCell({ heading, name, dateLabel, date, sig }: { heading: string; name: string; dateLabel: string; date: string; sig?: string | null }) {
  return (
    <View>
      <Text style={cstyles.sigAccepted}>ACCEPTED</Text>
      <View style={cstyles.sigRow}>
        <Text style={cstyles.sigRowLabel}>{heading}:</Text>
        <Text style={{ fontSize: 9, marginTop: 2 }}>{name || '—'}</Text>
      </View>
      <Text style={cstyles.sigRowLabel}>Sign:</Text>
      {sig ? <Image src={sig} style={cstyles.sigImage} /> : <View style={cstyles.sigBlank} />}
      <Text style={{ fontSize: 9, marginTop: 4 }}><Text style={cstyles.sigRowLabel}>{dateLabel}: </Text>{date || '—'}</Text>
    </View>
  );
}

function ContractDocument({ d, weddingCoupleLabel, sigs, generatedDate }: {
  d: WeddingContractData;
  weddingCoupleLabel: string;
  sigs: WeddingContractSignatures;
  generatedDate: string;
}) {
  const isYes = /^yes/i.test(d.media_consent || '');
  const isNo = /^no/i.test(d.media_consent || '');
  return (
    <Document>
      <Page size="A4" style={cstyles.page}>
        <Image src={LOGO_SRC} style={cstyles.logo} />
        <Text style={cstyles.tagline}>&quot;We Deliver Quality&quot; · Photography &amp; Videography Services · Kisumu, Kenya</Text>

        <Text style={cstyles.title}>WEDDING VIDEOGRAPHY AND{'\n'}PHOTOGRAPHY CONTRACT</Text>
        <View style={cstyles.titleRule} />

        <View style={cstyles.table}>
          <View style={cstyles.tRow}>
            <View style={cstyles.tCell}><Text style={cstyles.tLabel}>Event</Text><Text style={cstyles.tValue}>{d.event_type || 'Wedding'}</Text></View>
            <View style={cstyles.tCell}><Text style={cstyles.tLabel}>Event Date</Text><Text style={cstyles.tValue}>{d.event_date}</Text></View>
            <View style={cstyles.tCellLast}><Text style={cstyles.tLabel}>Location</Text><Text style={cstyles.tValue}>{d.location}</Text></View>
          </View>
          <View style={cstyles.tRowLast}>
            <View style={cstyles.tCell}><Text style={cstyles.tLabel}>Client Name</Text><Text style={cstyles.tValue}>{d.client_name}</Text></View>
            <View style={cstyles.tCell}><Text style={cstyles.tLabel}>Contact</Text><Text style={cstyles.tValue}>{d.client_phone}</Text></View>
            <View style={cstyles.tCellLast}><Text style={cstyles.tLabel}>Total Cost</Text><Text style={cstyles.tValue}>KES {d.cost}</Text></View>
          </View>
        </View>

        <Text style={cstyles.intro}>
          This Agreement is made between Mejasan Media Production (hereafter referred to as &apos;the COMPANY&apos;) and {d.client_name} (hereafter referred to as &apos;the CLIENT&apos;) for photography and videography services for the wedding of {weddingCoupleLabel} on {d.event_date}.
        </Text>

        <Text style={cstyles.termsHeading}>TERMS & CONDITIONS</Text>

        {[
          ['1. Entire Agreement', 'This contract represents the full understanding between the COMPANY and CLIENT. Any changes must be made in writing and signed by both parties.'],
          ['2. Booking & Payments', 'A 75% deposit secures your booking. The remaining 25% is due before delivery of the final products. In case of cancellation, 15% of the deposit is non-refundable. Any other costs already incurred must also be covered.'],
          ['3. Schedule & Timing', 'The CLIENT agrees to confirm the event schedule at least one week in advance. Shooting starts and ends at the agreed times. If there is a delay, coverage ends as scheduled unless extended — extra charges may apply.'],
          ['4. Travel & Logistics', 'Travel, accommodation, or transport costs may apply based on the event location. These will be communicated in advance.'],
          ['5. Responsibilities & Limitations', 'The COMPANY is not liable for issues beyond its control (e.g. guest interference, weather, venue restrictions, or delays). The CLIENT is responsible for acquiring any necessary permits or permissions.'],
          ['6. Safety', 'The COMPANY reserves the right to stop coverage if its crew experiences inappropriate or unsafe behaviour. This is to ensure safety for all involved.'],
          ['7. Image Editing & Delivery', 'The COMPANY will select and edit the best images. Delivery will be completed within two months after the event, assuming full payment. Physical items should be collected within this period. A 1% monthly charge will apply for uncollected items after two months.'],
          ['8. Unforeseen Circumstances', 'If the COMPANY is unable to perform due to illness, equipment failure, or unforeseen events, efforts will be made to find a replacement. If not possible, liability is limited to a refund of payments made.'],
        ].map(([title, text]) => (
          <View style={cstyles.clause} key={title} wrap={false}>
            <Text style={cstyles.clauseTitle}>{title}</Text>
            <Text style={cstyles.clauseText}>{text}</Text>
          </View>
        ))}

        <View style={cstyles.clause} wrap={false}>
          <Text style={cstyles.clauseTitle}>9. Copyright & Usage (Including Consent to Share):</Text>
          <Text style={cstyles.clauseText}>Upon final delivery, the CLIENT holds full usage rights. The COMPANY may share select content for promotional purposes. Please indicate your preference:</Text>
          <View style={{ marginTop: 6 }}>
            <View style={cstyles.consentRow}>
              <Text style={cstyles.consentBox}>{isYes ? '☑' : '☐'}</Text>
              <Text style={cstyles.consentLabel}>YES — I give Mejasan Media Production permission to use selected content from my event for promotional purposes.</Text>
            </View>
            <View style={cstyles.consentRow}>
              <Text style={cstyles.consentBox}>{isNo ? '☑' : '☐'}</Text>
              <Text style={cstyles.consentLabel}>NO — I prefer my content to remain private and not be shared publicly.</Text>
            </View>
          </View>
        </View>

        <Text style={cstyles.refLine}>REFERENCE: This agreement refers to Quote/Invoice No: {d.quote_ref || '____________________________'}</Text>

        <Text style={cstyles.signingLine}>By signing this contract, Mejasan Media Production and the CLIENT agree to all terms and conditions stated above and in the related invoice.</Text>
        <View style={cstyles.hr} />

        <View style={cstyles.sigGrid} wrap={false}>
          <View style={cstyles.sigCol}>
            <SigCell heading="Client" name={d.sig_client_name} dateLabel="Date" date={d.sig_client_date} sig={sigs.client} />
            <View style={{ marginTop: 10 }}>
              <Text style={cstyles.sigRowLabel}>Witness:</Text>
              <Text style={{ fontSize: 9, marginTop: 2, marginBottom: 4 }}>{d.sig_witness_name || '—'}</Text>
              <Text style={cstyles.sigRowLabel}>Sign:</Text>
              {sigs.witness ? <Image src={sigs.witness} style={cstyles.sigImage} /> : <View style={cstyles.sigBlank} />}
            </View>
          </View>
          <View style={cstyles.sigColLast}>
            <SigCell heading="Company Rep" name="Mejasan Media Production" dateLabel="Date" date={d.sig_company_date} sig={sigs.company} />
            <View style={{ marginTop: 10 }}>
              <Text style={cstyles.sigRowLabel}>Witness:</Text>
              <Text style={{ fontSize: 9, marginTop: 2, marginBottom: 4 }}>{d.sig_compwit_name || '—'}</Text>
              <Text style={cstyles.sigRowLabel}>Sign:</Text>
              {sigs.companyWitness ? <Image src={sigs.companyWitness} style={cstyles.sigImage} /> : <View style={cstyles.sigBlank} />}
            </View>
          </View>
        </View>

        <View style={cstyles.footer} fixed>
          <View style={cstyles.footerRule} />
          <Text style={cstyles.footerText}>Mejasan Media Production · We Deliver Quality · Kisumu, Kenya · Contract generated {generatedDate}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderQuestionnairePdf(data: WeddingQuestionnaireData): Promise<Buffer> {
  return renderToBuffer(<QuestionnaireDocument d={data} />);
}

export async function renderContractPdf(
  data: WeddingContractData,
  weddingCoupleLabel: string,
  sigs: WeddingContractSignatures,
  generatedDate: string
): Promise<Buffer> {
  return renderToBuffer(<ContractDocument d={data} weddingCoupleLabel={weddingCoupleLabel} sigs={sigs} generatedDate={generatedDate} />);
}
