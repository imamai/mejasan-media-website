'use client';

import { useEffect, useRef, useState } from 'react';
import './wedding-form.css';
import type { WeddingQuestionnaireData, WeddingContractData } from '@/lib/wedding-form/types';

const THEME_OPTIONS = ['Rustic', 'Royal', 'Modern', 'Garden', 'Traditional', 'Other'];
const PHOTO_STYLE_OPTIONS = ['Documentary', 'Editorial', 'Traditional', 'Luxury', 'Mix'];
const VIDEO_STYLE_OPTIONS = ['Cinematic', 'Fun & Upbeat', 'Emotional', 'Dramatic', 'Mix'];
const DOCU_OPTIONS = ['Yes', 'No', 'Discuss later'];
const PA_OPTIONS = ['Yes', 'No', 'Not sure'];
const DELIVERY_OPTIONS = ['Within 4 weeks', 'Within 6 weeks', 'Within 8 weeks', 'Flexible'];

type SigKey = 'client' | 'witness' | 'company' | 'compwit';

function getVal(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  return el?.value.trim() || '';
}
function getRawVal(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el?.value || '';
}
function getRadio(name: string): string {
  const checked = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  return checked ? checked.value : '';
}

function RadioGroup({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="radio-group">
      {options.map(opt => (
        <label key={opt} className={`radio-opt${value === opt ? ' selected' : ''}`}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} /> {opt}
        </label>
      ))}
    </div>
  );
}

export default function WeddingFormPage() {
  const [tab, setTab] = useState(0);
  const [familyRows, setFamilyRows] = useState<string[]>(['f1', 'f2', 'f3']);

  const [theme, setTheme] = useState('');
  const [photoStyle, setPhotoStyle] = useState('');
  const [videoStyle, setVideoStyle] = useState('');
  const [docu, setDocu] = useState('');
  const [pa, setPa] = useState('');
  const [delivery, setDelivery] = useState('');
  const [consent, setConsent] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrection, setIsCorrection] = useState(false);
  const [dupChoice, setDupChoice] = useState<{ resolve: (c: 'correction' | 'new' | 'cancel') => void } | null>(null);

  const canvasRefs = {
    client: useRef<HTMLCanvasElement>(null),
    witness: useRef<HTMLCanvasElement>(null),
    company: useRef<HTMLCanvasElement>(null),
    compwit: useRef<HTMLCanvasElement>(null),
  };
  const [signed, setSigned] = useState<Record<SigKey, boolean>>({ client: false, witness: false, company: false, compwit: false });

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    (Object.keys(canvasRefs) as SigKey[]).forEach(key => {
      const canvas = canvasRefs[key].current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      let drawing = false;

      function getPos(e: MouseEvent | TouchEvent) {
        const r = canvas!.getBoundingClientRect();
        const src = 'touches' in e ? e.touches[0] : e;
        return { x: (src.clientX - r.left) * (canvas!.width / r.width), y: (src.clientY - r.top) * (canvas!.height / r.height) };
      }
      const start = (e: MouseEvent | TouchEvent) => {
        drawing = true;
        const p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        setSigned(s => ({ ...s, [key]: true }));
        e.preventDefault();
      };
      const move = (e: MouseEvent | TouchEvent) => {
        if (!drawing) return;
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        e.preventDefault();
      };
      const end = () => { drawing = false; };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      canvas.addEventListener('mouseup', end);
      canvas.addEventListener('mouseleave', end);
      canvas.addEventListener('touchstart', start, { passive: false });
      canvas.addEventListener('touchmove', move, { passive: false });
      canvas.addEventListener('touchend', end);

      cleanups.push(() => {
        canvas.removeEventListener('mousedown', start);
        canvas.removeEventListener('mousemove', move);
        canvas.removeEventListener('mouseup', end);
        canvas.removeEventListener('mouseleave', end);
        canvas.removeEventListener('touchstart', start);
        canvas.removeEventListener('touchmove', move);
        canvas.removeEventListener('touchend', end);
      });
    });
    return () => cleanups.forEach(fn => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearSig(key: SigKey) {
    const canvas = canvasRefs[key].current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(s => ({ ...s, [key]: false }));
  }

  function sigDataUrl(key: SigKey): string | null {
    if (!signed[key]) return null;
    return canvasRefs[key].current?.toDataURL('image/png') ?? null;
  }

  function addFamilyRow() {
    setFamilyRows(rows => [...rows, `f${Date.now()}`]);
  }
  function removeFamilyRow(id: string) {
    setFamilyRows(rows => (rows.length > 1 ? rows.filter(r => r !== id) : rows));
  }

  function goTab(n: number) {
    setTab(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function collectQuestionnaire(): WeddingQuestionnaireData {
    const familyGroupings = Array.from(document.querySelectorAll<HTMLInputElement>('.family-group-input'))
      .map(i => i.value.trim()).filter(Boolean).join(' | ');
    return {
      bride_name: getVal('bride-name'),
      groom_name: getVal('groom-name'),
      wedding_date: getRawVal('wedding-date'),
      theme_colors: getVal('theme-colors'),
      wedding_theme: getRadio('theme'),
      bride_prep_location: getVal('bride-prep-location'),
      groom_prep_location: getVal('groom-prep-location'),
      ceremony_venue: getVal('ceremony-venue'),
      reception_venue: getVal('reception-venue'),
      bride_prep_time: getRawVal('bride-prep-time'),
      groom_prep_time: getRawVal('groom-prep-time'),
      ceremony_time: getRawVal('ceremony-time'),
      reception_time: getRawVal('reception-time'),
      end_time: getRawVal('end-time'),
      photo_style: getRadio('photo-style'),
      video_style: getRadio('video-style'),
      style_references: getVal('style-references'),
      style_avoid: getVal('style-avoid'),
      bride_parents: getVal('bride-parents'),
      groom_parents: getVal('groom-parents'),
      best_man: getVal('best-man'),
      maid_of_honour: getVal('maid-of-honour'),
      vip_guests: getVal('vip-guests'),
      family_groupings: familyGroupings,
      highlight_length: getVal('highlight-length'),
      documentary_edit: getRadio('docu'),
      pa_system: getRadio('pa'),
      sound_contact: getVal('sound-contact'),
      live_performances: getVal('live-performances'),
      planner_name: getVal('planner-name'),
      planner_contact: getVal('planner-contact'),
      mc_name: getVal('mc-name'),
      mc_contact: getVal('mc-contact'),
      church_coord_name: getVal('church-coord-name'),
      church_coord_contact: getVal('church-coord-contact'),
      venue_manager_name: getVal('venue-manager-name'),
      venue_manager_contact: getVal('venue-manager-contact'),
      how_you_met: getVal('how-you-met'),
      proposal_story: getVal('proposal-story'),
      special_songs: getVal('special-songs'),
      surprises: getVal('surprises'),
      selected_package: getVal('selected-package'),
      additional_services: getVal('additional-services'),
      delivery_timeline: getRadio('delivery'),
      client_email: getVal('client-email'),
    };
  }

  function collectContract(): WeddingContractData {
    return {
      event_type: getVal('contract-event-type') || 'Wedding',
      event_date: getRawVal('contract-date'),
      location: getVal('contract-location'),
      cost: getVal('contract-cost'),
      client_name: getVal('contract-client'),
      client_phone: getVal('contract-phone'),
      media_consent: getRadio('consent'),
      sig_client_name: getVal('sig-client-name'),
      sig_client_date: getRawVal('sig-client-date'),
      sig_witness_name: getVal('sig-witness-name'),
      sig_witness_date: getRawVal('sig-witness-date'),
      sig_company_name: getVal('sig-company-name') || 'Mejasan Media Production',
      sig_company_date: getRawVal('sig-company-date'),
      sig_compwit_name: getVal('sig-compwit-name'),
      sig_compwit_date: getRawVal('sig-compwit-date'),
    };
  }

  async function checkForDuplicate(email: string, date: string): Promise<{ duplicate: boolean; id: string | null }> {
    try {
      const res = await fetch(`/api/wedding-form/check-duplicate?email=${encodeURIComponent(email)}&date=${encodeURIComponent(date)}`);
      const json = await res.json();
      return { duplicate: json.duplicate === true, id: json.id ?? null };
    } catch {
      return { duplicate: false, id: null };
    }
  }

  async function submitAll() {
    setError('');

    const requiredFields = [
      { id: 'bride-name', label: "Bride's Full Name" },
      { id: 'groom-name', label: "Groom's Full Name" },
      { id: 'wedding-date', label: 'Wedding Date' },
      { id: 'client-email', label: 'Client Email' },
      { id: 'contract-client', label: 'Contract Client Name' },
      { id: 'contract-date', label: 'Contract Event Date' },
      { id: 'contract-location', label: 'Contract Location' },
      { id: 'contract-cost', label: 'Total Cost' },
      { id: 'contract-phone', label: 'Client Phone' },
    ];
    for (const f of requiredFields) {
      const el = document.getElementById(f.id) as HTMLInputElement | null;
      if (el && !el.value.trim()) {
        alert('Please fill in: ' + f.label);
        el.focus();
        return;
      }
    }

    const email = getVal('client-email').toLowerCase();
    const date = getRawVal('wedding-date');

    setLoadingText('Checking booking records…');
    setLoading(true);
    const dup = await checkForDuplicate(email, date);
    setLoading(false);

    let correction = false;
    let correctionOf: string | null = null;

    if (dup.duplicate) {
      const choice = await new Promise<'correction' | 'new' | 'cancel'>(resolve => setDupChoice({ resolve }));
      setDupChoice(null);
      if (choice === 'cancel') return;
      if (choice === 'correction') {
        correction = true;
        correctionOf = dup.id;
      }
    }

    setLoadingText('Submitting your booking…');
    setLoading(true);

    try {
      const payload = {
        questionnaire: collectQuestionnaire(),
        contract: collectContract(),
        signatures: {
          client: sigDataUrl('client'),
          witness: sigDataUrl('witness'),
          company: sigDataUrl('company'),
          companyWitness: sigDataUrl('compwit'),
        },
        is_correction: correction,
        correction_of: correctionOf,
      };
      const res = await fetch('/api/wedding-form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');

      setLoading(false);
      setIsCorrection(correction);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Submission failed. Please check your connection and try again.');
    }
  }

  return (
    <div className="wf-root">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {loading && (
        <div className="loading-overlay visible">
          <div className="loading-spinner" />
          <div className="loading-text">{loadingText}</div>
        </div>
      )}

      {dupChoice && (
        <div className="dup-overlay">
          <div className="dup-dialog">
            <div className="dup-dialog-body">
              <div className="dup-title">⚠️ Existing Booking Found</div>
              <p>A booking already exists for this email address and wedding date. What would you like to do?</p>
            </div>
            <div className="dup-dialog-actions">
              <button className="dup-btn dup-btn-correct" onClick={() => dupChoice.resolve('correction')}>
                ✏️ Correct / Update existing booking
                <span>Overwrites the previous submission. New PDFs will be sent.</span>
              </button>
              <button className="dup-btn dup-btn-new" onClick={() => dupChoice.resolve('new')}>
                ➕ Submit as a separate new booking
                <span>Keeps the original. Both bookings will exist in the system.</span>
              </button>
              <button className="dup-btn-cancel" onClick={() => dupChoice.resolve('cancel')}>Cancel — go back and check</button>
            </div>
          </div>
        </div>
      )}

      <header className="site-header">
        <div className="header-inner">
          <div className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mejasan-logo.png" alt="Mejasan Media Production" style={{ height: 48, width: 'auto', display: 'block', mixBlendMode: 'screen', filter: 'contrast(120%)' }} />
          </div>
          <div className="header-tagline">We Deliver Quality</div>
        </div>
      </header>

      <div className="hero">
        <h1>Your Wedding,<br /><em>Beautifully</em> Planned</h1>
        <p>Complete your wedding media planning questionnaire, review the morning interview guide, and sign your contract — all in one place.</p>
      </div>

      <div className="progress-nav">
        <button className="nav-step" onClick={() => goTab(0)}>
          <div className={`nav-pill${tab === 0 ? ' active' : ''}${tab > 0 ? ' done' : ''}`}><span className="nav-num">1</span>Questionnaire</div>
        </button>
        <div className="nav-sep" />
        <button className="nav-step" onClick={() => goTab(1)}>
          <div className={`nav-pill${tab === 1 ? ' active' : ''}${tab > 1 ? ' done' : ''}`}><span className="nav-num">2</span>Interview Guide</div>
        </button>
        <div className="nav-sep" />
        <button className="nav-step" onClick={() => goTab(2)}>
          <div className={`nav-pill${tab === 2 ? ' active' : ''}`}><span className="nav-num">3</span>Contract</div>
        </button>
      </div>

      <main className="main">
        {/* ======= TAB 1: QUESTIONNAIRE ======= */}
        <div className={`tab-panel${tab === 0 ? ' active' : ''}`}>

          <div className="section-card">
            <div className="section-header"><div className="section-num">1</div><div className="section-title">Event Overview &amp; Logistics</div></div>
            <div className="section-body">
              <div className="field-row">
                <div className="field"><label>Bride&apos;s Full Name <span className="req">*</span></label><input type="text" placeholder="e.g. Amina Wanjiku Kamau" id="bride-name" /></div>
                <div className="field"><label>Groom&apos;s Full Name <span className="req">*</span></label><input type="text" placeholder="e.g. David Otieno Mwangi" id="groom-name" /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Wedding Date(s) <span className="req">*</span></label><input type="date" id="wedding-date" /></div>
                <div className="field"><label>Wedding Theme Color(s)</label><input type="text" placeholder="e.g. Ivory, Gold, Dusty Rose" id="theme-colors" /></div>
              </div>
              <div className="field">
                <label>Overall Wedding Theme / Concept</label>
                <RadioGroup name="theme" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
              </div>
              <div className="field"><label>Bride Preparation Location <span className="req">*</span></label><input type="text" placeholder="Venue name, exact address or GPS link" id="bride-prep-location" /></div>
              <div className="field"><label>Groom Preparation Location <span className="req">*</span></label><input type="text" placeholder="Venue name, exact address or GPS link" id="groom-prep-location" /></div>
              <div className="field-row">
                <div className="field"><label>Ceremony Venue <span className="req">*</span></label><input type="text" placeholder="Name & Location" id="ceremony-venue" /></div>
                <div className="field"><label>Reception Venue <span className="req">*</span></label><input type="text" placeholder="Name & Location" id="reception-venue" /></div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">2</div><div className="section-title">Wedding Day Timeline</div></div>
            <div className="section-body">
              <div className="timeline-grid">
                <div className="field"><label>Bride Prep Start Time</label><input type="time" id="bride-prep-time" /></div>
                <div className="field"><label>Groom Prep Start Time</label><input type="time" id="groom-prep-time" /></div>
                <div className="field"><label>Ceremony Start Time</label><input type="time" id="ceremony-time" /></div>
                <div className="field"><label>Reception Start Time</label><input type="time" id="reception-time" /></div>
                <div className="field"><label>Expected End Time</label><input type="time" id="end-time" /></div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">3</div><div className="section-title">Creative Direction &amp; Style Preferences</div></div>
            <div className="section-body">
              <div className="field">
                <label>Photography Style <span className="req">*</span></label>
                <RadioGroup name="photo-style" options={PHOTO_STYLE_OPTIONS} value={photoStyle} onChange={setPhotoStyle} />
              </div>
              <div className="field">
                <label>Video Style <span className="req">*</span></label>
                <RadioGroup name="video-style" options={VIDEO_STYLE_OPTIONS} value={videoStyle} onChange={setVideoStyle} />
              </div>
              <div className="field"><label>Reference photos or videos you love?</label><textarea placeholder="Share links, describe looks, or mention photographers whose work you admire..." id="style-references" /><div className="hint">You can also email references to us separately.</div></div>
              <div className="field"><label>Styles or shots you DO NOT want?</label><textarea placeholder="e.g. No posed formal shots, avoid flash in church..." id="style-avoid" /></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">4</div><div className="section-title">Key People &amp; Priority Coverage</div></div>
            <div className="section-body">
              <div className="field-row">
                <div className="field"><label>Bride&apos;s Parents&apos; Names</label><input type="text" placeholder="Mother & Father full names" id="bride-parents" /></div>
                <div className="field"><label>Groom&apos;s Parents&apos; Names</label><input type="text" placeholder="Mother & Father full names" id="groom-parents" /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Best Man</label><input type="text" placeholder="Full name" id="best-man" /></div>
                <div className="field"><label>Maid of Honour</label><input type="text" placeholder="Full name" id="maid-of-honour" /></div>
              </div>
              <div className="field"><label>VIP Guests / Special Dignitaries</label><textarea placeholder="Names and titles of any dignitaries, high-profile guests who need priority coverage..." id="vip-guests" /></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">5</div><div className="section-title">Family Photo Groupings Required</div></div>
            <div className="section-body">
              <p style={{ fontSize: 13, color: 'var(--wf-muted)', marginBottom: 16 }}>List the specific family combinations you need photographed.</p>
              <div className="family-entries">
                {familyRows.map(id => (
                  <div className="family-entry" key={id}>
                    <input type="text" placeholder="Group combination..." className="family-group-input" />
                    <button className="btn-remove" onClick={() => removeFamilyRow(id)} title="Remove" type="button">×</button>
                  </div>
                ))}
              </div>
              <button className="btn-add-row" onClick={addFamilyRow} type="button">+ Add another grouping</button>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">6</div><div className="section-title">Deliverables &amp; Package Details</div></div>
            <div className="section-body">
              <div className="field-row">
                <div className="field">
                  <label>Preferred Highlight Video Length</label>
                  <select id="highlight-length" defaultValue="">
                    <option value="">Select length</option>
                    <option>3–5 minutes</option><option>5–8 minutes</option>
                    <option>8–12 minutes</option><option>12–20 minutes</option><option>No preference</option>
                  </select>
                </div>
                <div className="field">
                  <label>Full Documentary Edit Required?</label>
                  <div style={{ marginTop: 6 }}><RadioGroup name="docu" options={DOCU_OPTIONS} value={docu} onChange={setDocu} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">7</div><div className="section-title">Audio &amp; Technical Coordination</div></div>
            <div className="section-body">
              <div className="field-row">
                <div className="field">
                  <label>PA System Available?</label>
                  <div style={{ marginTop: 6 }}><RadioGroup name="pa" options={PA_OPTIONS} value={pa} onChange={setPa} /></div>
                </div>
                <div className="field"><label>Sound System Contact</label><input type="text" placeholder="Name & phone number" id="sound-contact" /></div>
              </div>
              <div className="field"><label>Live Performances or Surprise Presentations?</label><textarea placeholder="Describe any live performances, surprise speeches, flash mobs, etc..." id="live-performances" /></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">8</div><div className="section-title">Coordination Contacts</div></div>
            <div className="section-body">
              <div className="field-row">
                <div className="field"><label>Wedding Planner – Name</label><input type="text" placeholder="Full name" id="planner-name" /></div>
                <div className="field"><label>Wedding Planner – Contact</label><input type="tel" placeholder="+254 7XX XXX XXX" id="planner-contact" /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>MC – Name</label><input type="text" placeholder="Full name" id="mc-name" /></div>
                <div className="field"><label>MC – Contact</label><input type="tel" placeholder="+254 7XX XXX XXX" id="mc-contact" /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Church Coordinator – Name</label><input type="text" placeholder="Full name" id="church-coord-name" /></div>
                <div className="field"><label>Church Coordinator – Contact</label><input type="tel" placeholder="+254 7XX XXX XXX" id="church-coord-contact" /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Reception Venue Manager – Name</label><input type="text" placeholder="Full name" id="venue-manager-name" /></div>
                <div className="field"><label>Reception Venue Manager – Contact</label><input type="tel" placeholder="+254 7XX XXX XXX" id="venue-manager-contact" /></div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">9</div><div className="section-title">Your Love Story</div></div>
            <div className="section-body">
              <p style={{ fontSize: 13, color: 'var(--wf-muted)', marginBottom: 20, fontStyle: 'italic' }}>For your cinematic highlight film — share as much or as little as you&apos;re comfortable with.</p>
              <div className="field"><label>How did you meet?</label><textarea placeholder="Tell us your story..." style={{ minHeight: 100 }} id="how-you-met" /></div>
              <div className="field"><label>Proposal Story</label><textarea placeholder="How did it happen?" id="proposal-story" /></div>
              <div className="field"><label>Special Songs or Meaningful Quotes</label><input type="text" placeholder="Your song, a quote that means something to you both..." id="special-songs" /></div>
              <div className="field"><label>Any Surprises Planned During the Wedding?</label><textarea placeholder="Flash mob? Special guest? A gift reveal? (We'll keep it secret!)" id="surprises" /></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><div className="section-num">10</div><div className="section-title">Agreement Confirmation</div></div>
            <div className="section-body">
              <div className="field"><label>Selected Package</label><input type="text" placeholder="e.g. Premium Full-Day Coverage" id="selected-package" /></div>
              <div className="field"><label>Additional Services Requested</label><textarea placeholder="Any extras not in your package..." id="additional-services" /></div>
              <div className="field">
                <label>Preferred Delivery Timeline</label>
                <RadioGroup name="delivery" options={DELIVERY_OPTIONS} value={delivery} onChange={setDelivery} />
              </div>
              <div className="field">
                <label>Client Email Address <span className="req">*</span></label>
                <input type="email" placeholder="your@email.com" id="client-email" />
                <div className="hint">We&apos;ll send you a copy of your responses.</div>
              </div>
            </div>
          </div>

          <div className="form-nav">
            <span style={{ fontSize: 12, color: 'var(--wf-muted)' }}>Fields marked <span style={{ color: 'var(--wf-gold)' }}>*</span> are required</span>
            <button className="btn btn-primary" onClick={() => goTab(1)} type="button">Continue to Interview Guide →</button>
          </div>
        </div>

        {/* ======= TAB 2: INTERVIEW GUIDE ======= */}
        <div className={`tab-panel${tab === 1 ? ' active' : ''}`}>
          <div className="guide-note">
            <div className="icon">📋</div>
            <div>
              <strong style={{ display: 'block', marginBottom: 4 }}>For Mejasan&apos;s crew – Morning Interview Guide</strong>
              This guide is used on the morning of the wedding. Share this page with your client the evening before — they read and reflect on the questions privately, then speak from the heart during the filmed interview. No written answers needed.
            </div>
          </div>

          {[
            { title: 'Introduction', qs: ['Please introduce yourself — what is your full name?', "What is today's date?", 'What is happening today?'] },
            { title: 'About Your Partner', qs: ['Who are you marrying today?', 'In a few words, how would you describe them?', 'What is the best thing about them?', 'What quality made you certain they are the one?'] },
            { title: 'Expectations for the Day', qs: ['How are you feeling this morning?', 'What are your expectations for today?', 'What would make today perfect for you?'] },
            { title: 'The Moment You Are Waiting For', qs: ['What moment are you most looking forward to?', 'Why is that moment special to you?'] },
            { title: 'Direct Message to Your Lover', qs: ['If your partner was watching this right now, what would you say to them?', 'What promise are you making to them today?', 'Why do you choose them — today and always?'] },
            { title: 'Gratitude', qs: ['Who would you like to thank as you begin this new chapter?', 'What would you like to say to your parents?', 'What would you like to say to your friends and everyone who stood by you?', 'What does their support mean to you?'] },
          ].map(card => (
            <div className="interview-card" key={card.title}>
              <div className="interview-card-header"><h3>{card.title}</h3></div>
              <div className="interview-card-body">
                {card.qs.map((q, i) => (
                  <div className="interview-q" key={i}><span className="qnum">{String(i + 1).padStart(2, '0')}</span><span>{q}</span></div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: '#fffbee', border: '1px solid var(--wf-gold-light)', borderRadius: 4, padding: '20px 24px', marginBottom: 8, fontSize: 13, color: '#5a4a20', textAlign: 'center', lineHeight: 1.8 }}>
            <em>&quot;Kindly reflect deeply and speak from the heart during your interview.<br />There are no right or wrong answers — authenticity is what makes your story powerful.&quot;</em><br />
            <strong style={{ display: 'block', marginTop: 8, fontSize: 12, letterSpacing: '0.1em' }}>— Mejasan Media Production</strong>
          </div>

          <div className="form-nav">
            <button className="btn btn-ghost" onClick={() => goTab(0)} type="button">← Back to Questionnaire</button>
            <button className="btn btn-primary" onClick={() => goTab(2)} type="button">Continue to Contract →</button>
          </div>
        </div>

        {/* ======= TAB 3: CONTRACT ======= */}
        <div className={`tab-panel${tab === 2 ? ' active' : ''}`}>

          <div className="contract-header">
            <h2>Wedding Videography &amp; Photography Contract</h2>
            <p>Please fill in the event details below, read all terms carefully, and sign at the bottom to confirm your booking with Mejasan Media Production.</p>
          </div>

          <div className="contract-meta">
            <h3>Event Details</h3>
            <div className="field-row">
              <div className="field"><label>Event Name / Type</label><input type="text" placeholder="e.g. Wedding" defaultValue="Wedding" id="contract-event-type" /></div>
              <div className="field"><label>Event Date <span className="req">*</span></label><input type="date" id="contract-date" /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Location <span className="req">*</span></label><input type="text" placeholder="City / Venue name" id="contract-location" /></div>
              <div className="field"><label>Total Cost (KES) <span className="req">*</span></label><input type="text" placeholder="e.g. 150,000" id="contract-cost" /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Client Full Name <span className="req">*</span></label><input type="text" placeholder="As it should appear on the contract" id="contract-client" /></div>
              <div className="field"><label>Client Contact / Phone <span className="req">*</span></label><input type="tel" placeholder="+254 7XX XXX XXX" id="contract-phone" /></div>
            </div>
          </div>

          <div className="contract-body">
            <h3>Terms &amp; Conditions</h3>
            <div className="contract-clauses">
              {[
                ['Entire Agreement', 'This contract represents the full understanding between Mejasan Media Production (the Company) and the Client for photography and videography services. Any changes must be made in writing and signed by both parties.'],
                ['Booking & Payments', 'A 75% deposit secures your booking. The remaining 25% is due before delivery of the final products. In case of cancellation, 15% of the deposit is non-refundable. Any other costs already incurred must also be covered.'],
                ['Schedule & Timing', 'The Client agrees to confirm the event schedule at least one week in advance. Shooting starts and ends at the agreed times. If there is a delay, coverage ends as scheduled unless extended — extra charges may apply.'],
                ['Travel & Logistics', 'Travel, accommodation, or transport costs may apply based on the event location. These will be communicated in advance.'],
                ['Responsibilities & Limitations', 'The Company is not liable for issues beyond its control (e.g. guest interference, weather, venue restrictions, or delays). The Client is responsible for acquiring any necessary permits or permissions.'],
                ['Safety', 'The Company reserves the right to stop coverage if its crew experiences inappropriate or unsafe behaviour. This is to ensure safety for all involved.'],
                ['Image Editing & Delivery', 'The Company will select and edit the best images. Delivery will be completed within two months after the event, assuming full payment. Physical items should be collected within this period. A 1% monthly charge will apply for uncollected items after two months.'],
                ['Unforeseen Circumstances', 'If the Company is unable to perform due to illness, equipment failure, or unforeseen events, efforts will be made to find a replacement. If not possible, liability is limited to a refund of payments made.'],
              ].map(([title, text]) => (
                <div className="clause" key={title}><div className="clause-title">{title}</div><p>{text}</p></div>
              ))}
              <div className="clause">
                <div className="clause-title">Copyright &amp; Consent to Share</div>
                <p>Upon final delivery, the Client holds full usage rights. The Company may share select content for promotional purposes. Please indicate your preference below:</p>
                <div className="consent-block" style={{ marginTop: 14 }}>
                  <label className="consent-option">
                    <input type="radio" name="consent" value="Yes – I give permission" checked={consent === 'Yes – I give permission'} onChange={() => setConsent('Yes – I give permission')} />
                    <div className="consent-option-text">
                      <strong>✓ Yes — I give permission</strong>
                      <span>Mejasan Media Production may use selected content from my event for promotional purposes (website, social media, portfolio).</span>
                    </div>
                  </label>
                  <label className="consent-option">
                    <input type="radio" name="consent" value="No – Keep my content private" checked={consent === 'No – Keep my content private'} onChange={() => setConsent('No – Keep my content private')} />
                    <div className="consent-option-text">
                      <strong>✕ No — Keep my content private</strong>
                      <span>I prefer my content remain private and not be shared publicly.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="signature-block">
            <h3>Signatures — Agreement Confirmation</h3>
            <p style={{ fontSize: 13, color: 'var(--wf-muted)', marginBottom: 24 }}>By signing below, both parties agree to all terms and conditions stated in this contract.</p>
            <div className="sig-grid">
              <div className="sig-party">
                <h4>Client Signature</h4>
                <div className="sig-canvas-wrap">
                  <canvas ref={canvasRefs.client} width={400} height={100} />
                  <div className="sig-hint" style={{ opacity: signed.client ? 0 : 1 }}>Draw your signature here</div>
                </div>
                <div className="field" style={{ marginBottom: 8 }}><input type="text" placeholder="Print full name" style={{ fontSize: 13 }} id="sig-client-name" /></div>
                <div className="field" style={{ marginBottom: 8 }}><input type="date" style={{ fontSize: 13 }} id="sig-client-date" /></div>
                <button className="btn-clear-sig" onClick={() => clearSig('client')} type="button">Clear</button>
              </div>
              <div className="sig-party">
                <h4>Witness Signature (Client Side)</h4>
                <div className="sig-canvas-wrap">
                  <canvas ref={canvasRefs.witness} width={400} height={100} />
                  <div className="sig-hint" style={{ opacity: signed.witness ? 0 : 1 }}>Draw witness signature here</div>
                </div>
                <div className="field" style={{ marginBottom: 8 }}><input type="text" placeholder="Witness full name" style={{ fontSize: 13 }} id="sig-witness-name" /></div>
                <div className="field" style={{ marginBottom: 8 }}><input type="date" style={{ fontSize: 13 }} id="sig-witness-date" /></div>
                <button className="btn-clear-sig" onClick={() => clearSig('witness')} type="button">Clear</button>
              </div>
              <div className="sig-party">
                <h4>Company Representative</h4>
                <div className="sig-canvas-wrap">
                  <canvas ref={canvasRefs.company} width={400} height={100} />
                  <div className="sig-hint" style={{ opacity: signed.company ? 0 : 1 }}>Company rep signature</div>
                </div>
                <div className="field" style={{ marginBottom: 8 }}><input type="text" placeholder="Rep full name" defaultValue="Mejasan Media Production" style={{ fontSize: 13 }} id="sig-company-name" /></div>
                <div className="field" style={{ marginBottom: 8 }}><input type="date" style={{ fontSize: 13 }} id="sig-company-date" /></div>
                <button className="btn-clear-sig" onClick={() => clearSig('company')} type="button">Clear</button>
              </div>
              <div className="sig-party">
                <h4>Witness Signature (Company Side)</h4>
                <div className="sig-canvas-wrap">
                  <canvas ref={canvasRefs.compwit} width={400} height={100} />
                  <div className="sig-hint" style={{ opacity: signed.compwit ? 0 : 1 }}>Company witness signature</div>
                </div>
                <div className="field" style={{ marginBottom: 8 }}><input type="text" placeholder="Witness full name" style={{ fontSize: 13 }} id="sig-compwit-name" /></div>
                <div className="field" style={{ marginBottom: 8 }}><input type="date" style={{ fontSize: 13 }} id="sig-compwit-date" /></div>
                <button className="btn-clear-sig" onClick={() => clearSig('compwit')} type="button">Clear</button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-banner visible">⚠️ {error}</div>
          )}

          {!submitted && (
            <div className="submit-section">
              <h3>Ready to Submit</h3>
              <p>By clicking submit you confirm you have read and agreed to all terms above. A confirmation email will be sent to you and to Mejasan Media Production.</p>
              <button className="btn btn-primary" style={{ fontSize: 13, padding: '15px 48px' }} onClick={submitAll} type="button">Submit &amp; Confirm Booking</button>
            </div>
          )}

          {submitted && (
            <div className="success-screen visible">
              <div className="success-icon">✓</div>
              <h2>{isCorrection ? 'Booking Updated!' : 'Booking Confirmed!'}</h2>
              <p style={{ maxWidth: 440, margin: '0 auto 10px' }}>
                {isCorrection
                  ? 'Your booking has been corrected and updated. New PDFs have been generated and emailed to both parties.'
                  : 'Thank you for choosing Mejasan Media Production. Your questionnaire and signed contract have been received. We look forward to telling your love story beautifully.'}
              </p>
              <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--wf-gold)', marginTop: 16 }}>We Deliver Quality</p>
            </div>
          )}

          <div className="form-nav">
            <button className="btn btn-ghost" onClick={() => goTab(1)} type="button">← Back to Interview Guide</button>
          </div>
        </div>

      </main>

      <footer className="site-footer">
        <span>Mejasan Media Production</span> &nbsp;·&nbsp; We Deliver Quality &nbsp;·&nbsp; Nairobi, Kenya
      </footer>
    </div>
  );
}
