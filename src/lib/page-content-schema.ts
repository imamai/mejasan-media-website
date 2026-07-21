/**
 * Declarative content model for the About + Services pages.
 *
 * Each page has a `defaults` object (today's real hardcoded copy — used both
 * as the fallback when a `mejasan_page_content` row is missing/incomplete,
 * and as the starting point when an admin opens the editor for the first
 * time) and a `schema` describing which fields the admin Pages editor should
 * render and how (text / textarea / image / imagePosition / boolean /
 * stringlist / group / list).
 *
 * Every image field has a sibling `imagePosition`/`imgPosition` field storing
 * a CSS `object-position` keyword (default `'center'`, which is the browser's
 * own default — so existing images render identically until an admin picks
 * a different focal point).
 */

export type PrimitiveFieldType = 'text' | 'textarea' | 'image' | 'imagePosition' | 'boolean' | 'stringlist';

export interface PrimitiveField {
  type: PrimitiveFieldType;
  key: string;
  label: string;
}

export interface GroupField {
  type: 'group';
  key: string;
  label: string;
  fields: SchemaField[];
}

export interface ListField {
  type: 'list';
  key: string;
  label: string;
  itemLabelKey: string;
  itemFields: SchemaField[];
  newItem: Record<string, unknown>;
}

export type SchemaField = PrimitiveField | GroupField | ListField;

export interface PageContentDef {
  slug: string;
  label: string;
  schema: SchemaField[];
  defaults: Record<string, unknown>;
}

/** Deep-merges a DB-stored `content` blob onto the page's defaults so missing
 *  fields never break rendering. Arrays are replaced wholesale (never
 *  element-merged) since list fields are always edited/saved as a whole. */
export function mergeContent<T>(defaults: T, override: unknown): T {
  if (override === null || override === undefined) return defaults;
  if (Array.isArray(defaults)) {
    return (Array.isArray(override) ? override : defaults) as unknown as T;
  }
  if (typeof defaults === 'object' && typeof override === 'object') {
    const base = defaults as Record<string, unknown>;
    const over = override as Record<string, unknown>;
    const result: Record<string, unknown> = { ...base };
    for (const key of Object.keys(base)) {
      result[key] = mergeContent(base[key], over[key]);
    }
    return result as T;
  }
  return (override as T) ?? defaults;
}

/* ── About ─────────────────────────────────────────────────────────── */

export const aboutDefaults = {
  hero: {
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80',
    imagePosition: 'center',
    label: 'Our Story',
    titleStart: 'About',
    titleEm: 'Mejasan',
  },
  stats: [
    { value: '500', suffix: '+', label: 'Projects' },
    { value: '200', suffix: '+', label: 'Weddings' },
    { value: '50', suffix: '+', label: 'Events' },
    { value: '8', suffix: '+', label: 'Years' },
  ],
  story: {
    label: 'Who We Are',
    heading: 'Built on a Passion for Visual Truth',
    paragraph1: 'Mejasan Media Production was born from a simple but powerful belief: that extraordinary visual stories transform brands, move audiences, and preserve memories that would otherwise fade.',
    paragraph2: "Founded in Nairobi, we've grown from a solo photographer's passion project into one of East Africa's most respected media production studios — serving intimate weddings, government ministries, international NGOs, and Fortune 500 companies.",
    paragraph3: 'Over eight years and hundreds of engagements, each project has sharpened our craft and deepened our commitment to excellence.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    imagePosition: 'center',
    badgeNumber: '8+',
    badgeLabel: 'Years Excellence',
  },
  vision: {
    title: 'Our Vision',
    text: "To be East Africa's most trusted visual storytelling partner — the studio brands turn to when they need imagery that moves people and stands the test of time.",
  },
  mission: {
    title: 'Our Mission',
    text: 'To deliver world-class photography, videography, and aerial media that transforms how our clients are seen — through technical mastery, creative vision, and relentless dedication to quality.',
  },
  values: [
    { title: 'Artistry', desc: 'Technical mastery married to creative vision in every frame.' },
    { title: 'Passion', desc: 'Driven by a deep love for visual storytelling and its power to move people.' },
    { title: 'Excellence', desc: 'The highest professional standards in every single deliverable.' },
    { title: 'Partnership', desc: 'Lasting relationships built on trust, transparency and shared vision.' },
  ],
  process: [
    { num: '01', title: 'Discovery Call', desc: 'We start with a conversation to understand your vision, goals, and creative expectations.' },
    { num: '02', title: 'Creative Brief', desc: 'A tailored brief is crafted — mood boards, shot lists, locations, and timelines.' },
    { num: '03', title: 'Pre-Production', desc: 'Locations, permits, styling, and logistics are handled before a single frame is captured.' },
    { num: '04', title: 'The Shoot', desc: 'Our team deploys with professional cinema-grade equipment to capture your story.' },
    { num: '05', title: 'Post-Production', desc: 'Expert editing, colour grading, and sound design to elevate every deliverable.' },
    { num: '06', title: 'Delivery & Review', desc: 'Files delivered securely via your private client portal with full revision rounds.' },
  ],
  team: [
    { name: 'Jason Mejia', role: 'Founder & Lead Photographer', spec: 'Weddings · Corporate', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', imgPosition: 'center' },
    { name: 'Sarah Njeri', role: 'Creative Director', spec: 'Film · Documentary', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', imgPosition: 'center' },
    { name: 'Brian Ochieng', role: 'Aerial Cinematographer', spec: 'Drone · Surveys', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', imgPosition: 'center' },
    { name: 'Grace Wanjiku', role: 'Events Photographer', spec: 'Events · Editing', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', imgPosition: 'center' },
  ],
  why: {
    label: 'Why Mejasan',
    heading: 'What Makes Us Different',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
    imagePosition: 'center',
    ctaHeading: 'Ready to work with us?',
    items: [
      { title: 'Kenya-First Perspective', desc: 'We understand the local market, culture, and visual language that resonates across East Africa.' },
      { title: 'Full-Service Studio', desc: 'Photography, video, drone, editing, and delivery under one roof. No outsourcing, no gaps.' },
      { title: 'Fast Turnaround', desc: 'Wedding galleries in 2 weeks. Corporate deliverables on agreed timelines. Always.' },
      { title: 'Cinema-Grade Equipment', desc: 'Sony Alpha professional cameras, cinema lenses, DJI drones, and broadcast-quality audio.' },
      { title: 'Licensed & Insured', desc: 'KCAA-licensed drone operations, professional liability insurance, and formal contracts.' },
    ],
  },
};

const aboutSchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: [
    { type: 'image', key: 'image', label: 'Background image' },
    { type: 'imagePosition', key: 'imagePosition', label: 'Focal point' },
    { type: 'text', key: 'label', label: 'Eyebrow label' },
    { type: 'text', key: 'titleStart', label: 'Title (plain part)' },
    { type: 'text', key: 'titleEm', label: 'Title (highlighted part)' },
  ] },
  { type: 'list', key: 'stats', label: 'Stats band', itemLabelKey: 'label',
    itemFields: [
      { type: 'text', key: 'value', label: 'Number' },
      { type: 'text', key: 'suffix', label: 'Suffix' },
      { type: 'text', key: 'label', label: 'Label' },
    ], newItem: { value: '0', suffix: '+', label: 'Label' } },
  { type: 'group', key: 'story', label: 'Story section', fields: [
    { type: 'text', key: 'label', label: 'Eyebrow label' },
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'paragraph1', label: 'Paragraph 1' },
    { type: 'textarea', key: 'paragraph2', label: 'Paragraph 2' },
    { type: 'textarea', key: 'paragraph3', label: 'Paragraph 3' },
    { type: 'image', key: 'image', label: 'Image' },
    { type: 'imagePosition', key: 'imagePosition', label: 'Focal point' },
    { type: 'text', key: 'badgeNumber', label: 'Badge number' },
    { type: 'text', key: 'badgeLabel', label: 'Badge label' },
  ] },
  { type: 'group', key: 'vision', label: 'Vision', fields: [
    { type: 'text', key: 'title', label: 'Title' },
    { type: 'textarea', key: 'text', label: 'Text' },
  ] },
  { type: 'group', key: 'mission', label: 'Mission', fields: [
    { type: 'text', key: 'title', label: 'Title' },
    { type: 'textarea', key: 'text', label: 'Text' },
  ] },
  { type: 'list', key: 'values', label: 'Core values', itemLabelKey: 'title',
    itemFields: [
      { type: 'text', key: 'title', label: 'Title' },
      { type: 'textarea', key: 'desc', label: 'Description' },
    ], newItem: { title: 'New Value', desc: '' } },
  { type: 'list', key: 'process', label: 'Creative process steps', itemLabelKey: 'title',
    itemFields: [
      { type: 'text', key: 'num', label: 'Step number' },
      { type: 'text', key: 'title', label: 'Title' },
      { type: 'textarea', key: 'desc', label: 'Description' },
    ], newItem: { num: '00', title: 'New Step', desc: '' } },
  { type: 'list', key: 'team', label: 'Team members', itemLabelKey: 'name',
    itemFields: [
      { type: 'text', key: 'name', label: 'Name' },
      { type: 'text', key: 'role', label: 'Role' },
      { type: 'text', key: 'spec', label: 'Specialisation' },
      { type: 'image', key: 'img', label: 'Photo' },
      { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
    ], newItem: { name: 'New Member', role: '', spec: '', img: '', imgPosition: 'center' } },
  { type: 'group', key: 'why', label: 'Why Mejasan section', fields: [
    { type: 'text', key: 'label', label: 'Eyebrow label' },
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'list', key: 'items', label: 'Bullet items', itemLabelKey: 'title',
      itemFields: [
        { type: 'text', key: 'title', label: 'Title' },
        { type: 'textarea', key: 'desc', label: 'Description' },
      ], newItem: { title: 'New Point', desc: '' } },
    { type: 'image', key: 'image', label: 'Image' },
    { type: 'imagePosition', key: 'imagePosition', label: 'Focal point' },
    { type: 'text', key: 'ctaHeading', label: 'CTA heading' },
  ] },
];

/* ── Services hub ──────────────────────────────────────────────────── */

export const servicesDefaults = {
  hero: {
    label: 'What We Do',
    titlePre: 'Full-Service',
    titleEm: 'Media Production',
    subtitle: 'From intimate wedding films to large-scale corporate productions — we bring the equipment, expertise, and artistic vision to tell every story with world-class quality.',
  },
  services: [
    { title: 'Photography', href: '/services/photography', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', imgPosition: 'center', desc: 'Wedding, corporate, product & studio photography that tells your story with technical mastery and artistic vision.', tags: ['Wedding', 'Corporate', 'Product', 'Studio'] },
    { title: 'Videography', href: '/services/videography', img: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=800&q=80', imgPosition: 'center', desc: 'Wedding films, corporate videos, documentaries & commercial production with cinematic precision.', tags: ['Wedding Films', 'Corporate', 'Documentary', 'Commercial'] },
    { title: 'Event Coverage', href: '/services/events', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', imgPosition: 'center', desc: 'Conferences, launches, awards & concerts — live documentation at the highest professional standard.', tags: ['Conferences', 'Launches', 'Awards', 'Concerts'] },
    { title: 'Drone Services', href: '/services/drone', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80', imgPosition: 'center', desc: 'KCAA-licensed aerial photography, videography, mapping & site documentation across East Africa.', tags: ['Aerial Photography', 'Video', 'Mapping', 'Survey'] },
    { title: 'Brand & Content', href: '/services/branding', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', imgPosition: 'center', desc: 'Social media content, brand storytelling & campaign production that builds lasting presence.', tags: ['Social Media', 'Branding', 'Campaigns', 'Strategy'] },
  ],
  cta: { heading: 'Need something custom?', text: "Every project is unique. Tell us what you need and we'll build the perfect package." },
};

const serviceCardFields: SchemaField[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'text', key: 'href', label: 'Link (e.g. /services/photography)' },
  { type: 'image', key: 'img', label: 'Image' },
  { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
  { type: 'textarea', key: 'desc', label: 'Description' },
  { type: 'stringlist', key: 'tags', label: 'Tags (one per line)' },
];

const servicesSchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: [
    { type: 'text', key: 'label', label: 'Eyebrow label' },
    { type: 'text', key: 'titlePre', label: 'Title (plain part)' },
    { type: 'text', key: 'titleEm', label: 'Title (highlighted part)' },
    { type: 'textarea', key: 'subtitle', label: 'Subtitle' },
  ] },
  { type: 'list', key: 'services', label: 'Service cards', itemLabelKey: 'title', itemFields: serviceCardFields,
    newItem: { title: 'New Service', href: '/services', img: '', imgPosition: 'center', desc: '', tags: [] } },
  { type: 'group', key: 'cta', label: 'Bottom CTA', fields: [
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'text', label: 'Text' },
  ] },
];

/* ── Shared helpers for the 5 service sub-pages ───────────────────── */

const plainHeroFields: SchemaField[] = [
  { type: 'image', key: 'image', label: 'Background image' },
  { type: 'imagePosition', key: 'imagePosition', label: 'Focal point' },
  { type: 'text', key: 'eyebrow', label: 'Eyebrow label' },
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'textarea', key: 'subtitle', label: 'Subtitle' },
];

const ctaFields: SchemaField[] = [
  { type: 'text', key: 'heading', label: 'Heading' },
  { type: 'textarea', key: 'text', label: 'Text' },
];

/* ── Services / Photography ────────────────────────────────────────── */

export const photographyDefaults = {
  hero: { image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80', imagePosition: 'center', eyebrow: 'Services', title: 'Photography', subtitle: 'Capturing emotion, light, and story — from intimate weddings to large-scale corporate productions.' },
  categories: [
    { title: 'Wedding Photography', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', imgPosition: 'center', desc: 'Timeless, emotive documentation of your most important day.' },
    { title: 'Corporate Photography', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', imgPosition: 'center', desc: 'Headshots, events, and brand imagery that builds authority.' },
    { title: 'Product Photography', img: 'https://images.unsplash.com/photo-1585297029439-2a5e8d0c0cfe?w=600&q=80', imgPosition: 'center', desc: 'E-commerce, packshots, and lifestyle imagery that sells.' },
    { title: 'Studio Photography', img: 'https://images.unsplash.com/photo-1574269907823-3c4b5c08e4e7?w=600&q=80', imgPosition: 'center', desc: 'Controlled studio sessions with premium lighting setups.' },
  ],
  packages: [
    { name: 'Essential', price: 'KES 45,000', hours: '4 hours', imgs: '200+ edited', coverage: '1 photographer', includes: ['Online gallery delivery', 'High-res digital files', '2-week turnaround', 'Print release'], featured: false },
    { name: 'Premium', price: 'KES 85,000', hours: '8 hours', imgs: '400+ edited', coverage: '2 photographers', includes: ['Everything in Essential', 'Engagement session', 'Album design', 'Drone coverage'], featured: true },
    { name: 'Luxury', price: 'KES 150,000+', hours: 'Full day', imgs: '600+ edited', coverage: '2 photographers + video', includes: ['Everything in Premium', 'Cinematic highlights', 'Hardcover album', 'Priority editing'], featured: false },
  ],
  studioCharges: {
    heading: 'Photo Studio Charges',
    description: 'Walk-in studio session pricing for single, group, express, and creative portrait photos.',
    items: [
      { label: 'Single Photo', price: 'Ksh. 350', note: 'Delivery within 48 hrs' },
      { label: 'Group Photo (2–3 people)', price: 'Ksh. 400', note: 'Delivery within 48 hrs' },
      { label: 'Group Photo (4–6 people)', price: 'Ksh. 500', note: 'Delivery within 48 hrs' },
      { label: 'Group Photo (7–10 people)', price: 'Ksh. 800', note: 'Delivery within 48 hrs' },
      { label: 'Express Photo', price: 'Ksh. 450', note: 'Delivery within 12 hrs' },
      { label: 'Creative Photo', price: 'Ksh. 500', note: 'Delivery within 72 hrs' },
    ],
  },
  photoMounting: {
    heading: 'Photo Mounting Charges',
    description: 'Standard paper photo mounts, priced by size.',
    items: [
      { size: 'A1', price: 'Ksh. 5,500' },
      { size: 'A2', price: 'Ksh. 3,500' },
      { size: 'A3', price: 'Ksh. 2,500' },
      { size: 'A4', price: 'Ksh. 1,500' },
      { size: 'A5', price: 'Ksh. 600' },
    ],
  },
  studioOffer: {
    heading: 'Studio Offer',
    description: 'Limited-time bulk print discount.',
    items: [
      { label: '10 pics', wasPrice: 'Ksh. 3,500', nowPrice: 'Ksh. 3,200' },
      { label: '20 pics', wasPrice: 'Ksh. 7,000', nowPrice: 'Ksh. 6,200' },
    ],
  },
  woodenMount: {
    heading: 'Wooden Photo Mount',
    description: "Display your cherished memories with Mejasan Media Production's handcrafted wooden photo mounts. Elegant, timeless, and perfect for any occasion.",
    items: [
      { size: 'A4', price: 'Ksh. 1,500' },
      { size: 'A3', price: 'Ksh. 2,500' },
      { size: 'A2', price: 'Ksh. 3,500' },
      { size: 'A1', price: 'Ksh. 5,500' },
      { size: 'A0', price: 'Ksh. 8,000' },
    ],
  },
  traditionalWeddingPackages: {
    heading: 'Traditional Wedding Packages',
    description: 'Our customised Traditional Wedding packages cater for all your needs, offering a blend of candid shots, posed portraits and artistic compositions.',
    note: 'Premium Cinematic Reels @ Ksh. 20,000, Phone Reel Videos @ Ksh. 10,000, Drone Cinematography @ Ksh. 15,000, Extended Party coverage @ Ksh. 20,000. Logistics and transport costs calculated separately per distance.',
    packages: [
      {
        label: '1st Package',
        photographyItems: ['Preliminary meeting & consultation', '1 Professional Photographer', '1 HD Photography Camera', 'Photography Lights', 'Unlimited edited soft copy photos', 'A day coverage'],
        photographyPrice: 'Ksh. 25,000',
        printsItems: ['Executive A4 Photo book — 150 Photos (8x12)', '2 A3 photo mounts'],
        printsPrice: 'Ksh. 15,000',
        videographyItems: ['1 Professional Videographer', '1 HD Video Camera', 'Well edited full event coverage HD video in a flash drive', 'Private YouTube link of the uploaded video'],
        videographyPrice: 'Ksh. 30,000',
        addOnsItems: [],
        total: 'Ksh. 70,000',
      },
      {
        label: '2nd Package',
        photographyItems: ['Preliminary meeting & consultation', '2 Professional Photographers', '2 HD Photography Cameras', 'Photography Lights', 'Unlimited edited soft copy photos', 'A day coverage'],
        photographyPrice: 'Ksh. 45,000',
        printsItems: ['Executive A4 Photo book — 200 Photos (12x12)', '2 A3, 2 A4 photo mounts'],
        printsPrice: 'Ksh. 20,000',
        videographyItems: ['2 Professional Videographers', '2 4K Video Cameras', 'Well edited full event coverage HD video in a flash drive', 'Private YouTube link of the uploaded video'],
        videographyPrice: 'Ksh. 60,000',
        addOnsItems: ['Drone coverage — Ksh. 15,000'],
        total: 'Ksh. 140,000',
      },
      {
        label: '3rd Package',
        photographyItems: ['Preliminary meeting & consultation', '3 Professional Photographers', '3 HD Photography Cameras', 'Photography Lights', 'Unlimited edited soft copy photos', 'A day coverage'],
        photographyPrice: 'Ksh. 60,000',
        printsItems: ['2 Executive A4 Photo books — 200 Photos (12x12)', '3 A3, 3 A4 photo mounts'],
        printsPrice: 'Ksh. 40,000',
        videographyItems: ['2 Professional Videographers', '2 4K Video Cameras', 'Well edited full event coverage HD video in a flash drive', 'Private YouTube link of the uploaded video', '5-minute event trailer'],
        videographyPrice: 'Ksh. 70,000',
        addOnsItems: ['Drone coverage — Ksh. 15,000', 'Reels — Ksh. 20,000'],
        total: 'Ksh. 205,000',
      },
    ],
  },
  weddingQuotation: {
    heading: 'Wedding Quotation',
    description: 'Full wedding-day photography & videography packages.',
    packages: [
      {
        label: '1st Package',
        items: ['2 Photographers, cameras & lights', '1 Videographer', 'Unlimited edited soft copy photos', 'Wedding Photobook (8 by 12)', '3 Mounted Photos (1 A3, 2 A4)'],
        price: 'Ksh. 100,000',
      },
      {
        label: '2nd Package',
        items: ['2 Photographers, cameras & lights', '2 Videographers, cameras & lights', 'Unlimited edited soft copy photos', 'Personalised Wedding Photobook (12 by 12)', '4 Mounted Photos (1 A2, 1 A3, 2 A4)', 'Well edited HD full event video in a flash disk and a private YouTube link'],
        price: 'Ksh. 150,000',
      },
      {
        label: '3rd Package',
        items: ['2 Photographers, cameras & lights', '2 Videographers, cameras & lights', 'Unlimited edited soft copy photos', 'Wedding signage book (8 by 12)', '3 wedding reels', 'Wedding Photobook (24 by 18), 40 pages', '6 Mounted Photos (2 A2, 2 A3, 2 A4)', 'Well edited 4K full event video in 2 flash disks and private YouTube link', 'Wedding trailer', 'Engagement shoot (photos and video)', 'Drone service'],
        price: 'Ksh. 230,000',
      },
      {
        label: '4th Package',
        items: ['2 Photographers, cameras & lights', '3 Videographers, cameras & lights', 'Unlimited edited soft copy photos', 'Wedding Signage Book (8 by 12)', '5 wedding reels', '1 Wedding Photobook (24 by 18), 40 pages & 2 mini Photobooks (for parents)', '8 Mounted Photos (1 A1, 2 A2, 3 A3, 2 A4)', 'Well edited 4K full event video in two flash disks and private YouTube link', 'Wedding trailer', 'Engagement shoot (photos and video)', 'Drone service', 'After-party / Evening Party coverage'],
        price: 'Ksh. 305,000',
      },
    ],
  },
  cta: { heading: 'Ready to tell your story?', text: "Every great image starts with a conversation. Let's discuss your vision." },
};

const categoryFields: SchemaField[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'image', key: 'img', label: 'Image' },
  { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
  { type: 'textarea', key: 'desc', label: 'Description' },
];

const photographyPackageFields: SchemaField[] = [
  { type: 'text', key: 'name', label: 'Package name' },
  { type: 'text', key: 'price', label: 'Price' },
  { type: 'text', key: 'hours', label: 'Duration' },
  { type: 'text', key: 'imgs', label: 'Deliverable count' },
  { type: 'text', key: 'coverage', label: 'Coverage' },
  { type: 'stringlist', key: 'includes', label: "What's included (one per line)" },
  { type: 'boolean', key: 'featured', label: 'Highlight as "Most Popular"' },
];

const studioChargeRowFields: SchemaField[] = [
  { type: 'text', key: 'label', label: 'Item' },
  { type: 'text', key: 'price', label: 'Price' },
  { type: 'text', key: 'note', label: 'Note (e.g. delivery time)' },
];

const sizeChargeFields: SchemaField[] = [
  { type: 'text', key: 'size', label: 'Size' },
  { type: 'text', key: 'price', label: 'Price' },
];

const studioOfferRowFields: SchemaField[] = [
  { type: 'text', key: 'label', label: 'Item' },
  { type: 'text', key: 'wasPrice', label: 'Was' },
  { type: 'text', key: 'nowPrice', label: 'Now' },
];

const traditionalWeddingPackageFields: SchemaField[] = [
  { type: 'text', key: 'label', label: 'Package name' },
  { type: 'stringlist', key: 'photographyItems', label: 'Photography — included (one per line)' },
  { type: 'text', key: 'photographyPrice', label: 'Photography — price' },
  { type: 'stringlist', key: 'printsItems', label: 'Prints — included (one per line)' },
  { type: 'text', key: 'printsPrice', label: 'Prints — price' },
  { type: 'stringlist', key: 'videographyItems', label: 'Videography — included (one per line)' },
  { type: 'text', key: 'videographyPrice', label: 'Videography — price' },
  { type: 'stringlist', key: 'addOnsItems', label: 'Add-ons (one per line)' },
  { type: 'text', key: 'total', label: 'Grand total' },
];

const quotationPackageFields: SchemaField[] = [
  { type: 'text', key: 'label', label: 'Package name' },
  { type: 'stringlist', key: 'items', label: 'Included (one per line)' },
  { type: 'text', key: 'price', label: 'Price' },
];

const photographySchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: plainHeroFields },
  { type: 'list', key: 'categories', label: 'Specialisations', itemLabelKey: 'title', itemFields: categoryFields,
    newItem: { title: 'New Category', img: '', imgPosition: 'center', desc: '' } },
  { type: 'list', key: 'packages', label: 'Packages', itemLabelKey: 'name', itemFields: photographyPackageFields,
    newItem: { name: 'New Package', price: '', hours: '', imgs: '', coverage: '', includes: [], featured: false } },
  { type: 'group', key: 'studioCharges', label: 'Photo Studio Charges', fields: [
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'description', label: 'Description' },
    { type: 'list', key: 'items', label: 'Pricing rows', itemLabelKey: 'label', itemFields: studioChargeRowFields,
      newItem: { label: 'New Item', price: '', note: '' } },
  ] },
  { type: 'group', key: 'photoMounting', label: 'Photo Mounting Charges', fields: [
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'description', label: 'Description' },
    { type: 'list', key: 'items', label: 'Sizes', itemLabelKey: 'size', itemFields: sizeChargeFields,
      newItem: { size: 'New Size', price: '' } },
  ] },
  { type: 'group', key: 'studioOffer', label: 'Studio Offer', fields: [
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'description', label: 'Description' },
    { type: 'list', key: 'items', label: 'Offers', itemLabelKey: 'label', itemFields: studioOfferRowFields,
      newItem: { label: 'New Offer', wasPrice: '', nowPrice: '' } },
  ] },
  { type: 'group', key: 'woodenMount', label: 'Wooden Photo Mount', fields: [
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'description', label: 'Description' },
    { type: 'list', key: 'items', label: 'Sizes', itemLabelKey: 'size', itemFields: sizeChargeFields,
      newItem: { size: 'New Size', price: '' } },
  ] },
  { type: 'group', key: 'traditionalWeddingPackages', label: 'Traditional Wedding Packages', fields: [
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'description', label: 'Description' },
    { type: 'textarea', key: 'note', label: 'Footnote' },
    { type: 'list', key: 'packages', label: 'Packages', itemLabelKey: 'label', itemFields: traditionalWeddingPackageFields,
      newItem: { label: 'New Package', photographyItems: [], photographyPrice: '', printsItems: [], printsPrice: '', videographyItems: [], videographyPrice: '', addOnsItems: [], total: '' } },
  ] },
  { type: 'group', key: 'weddingQuotation', label: 'Wedding Quotation', fields: [
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'textarea', key: 'description', label: 'Description' },
    { type: 'list', key: 'packages', label: 'Packages', itemLabelKey: 'label', itemFields: quotationPackageFields,
      newItem: { label: 'New Package', items: [], price: '' } },
  ] },
  { type: 'group', key: 'cta', label: 'Bottom CTA', fields: ctaFields },
];

/* ── Services / Videography ───────────────────────────────────────── */

export const videographyDefaults = {
  hero: { image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=1920&q=80', imagePosition: 'center', eyebrow: 'Services', title: 'Videography', subtitle: 'Moving images that tell stories, build brands, and create lasting emotional connections.' },
  types: [
    { title: 'Wedding Films', img: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&q=80', imgPosition: 'center', desc: 'Cinematic wedding films that capture emotion, atmosphere, and every precious moment.', videoSrc: 'https://www.youtube.com/embed/lsWndfzuOc4?autoplay=1&rel=0' },
    { title: 'Corporate Videos', img: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600&q=80', imgPosition: 'center', desc: 'Brand videos, annual reports, product demos, and executive interviews.', videoSrc: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0' },
    { title: 'Documentaries', img: 'https://images.unsplash.com/photo-1574269907823-3c4b5c08e4e7?w=600&q=80', imgPosition: 'center', desc: 'Narrative-driven storytelling for NGOs, brands, and impact projects.', videoSrc: 'https://www.youtube.com/embed/EngW7tLk6R8?autoplay=1&rel=0' },
    { title: 'Commercial Production', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80', imgPosition: 'center', desc: 'TV commercials, social media ads, and branded content campaigns.', videoSrc: 'https://www.youtube.com/embed/XSGBVzeBUbk?autoplay=1&rel=0' },
  ],
  packages: [
    { name: 'Highlights', price: 'KES 60,000', duration: '3–5 min film', includes: ['One camera operator', 'Colour graded edit', '2-week delivery', 'Digital download'], featured: false },
    { name: 'Cinematic', price: 'KES 120,000', duration: '8–12 min film', includes: ['Two camera operators', 'Professional audio', 'Drone footage', 'Highlight + full edit', 'Priority delivery'], featured: true },
    { name: 'Production', price: 'KES 250,000+', duration: 'Full production', includes: ['Full production crew', 'Multiple camera angles', 'Professional audio rig', 'Colour grade + grade', 'Music licensing'], featured: false },
  ],
  cta: { heading: 'Bring your vision to life', text: 'Award-winning video production from pre-production to final delivery.' },
};

const videoTypeFields: SchemaField[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'image', key: 'img', label: 'Thumbnail image' },
  { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
  { type: 'textarea', key: 'desc', label: 'Description' },
  { type: 'text', key: 'videoSrc', label: 'Sample reel embed URL' },
];

const videographyPackageFields: SchemaField[] = [
  { type: 'text', key: 'name', label: 'Package name' },
  { type: 'text', key: 'price', label: 'Price' },
  { type: 'text', key: 'duration', label: 'Duration' },
  { type: 'stringlist', key: 'includes', label: "What's included (one per line)" },
  { type: 'boolean', key: 'featured', label: 'Highlight as "Most Popular"' },
];

const videographySchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: plainHeroFields },
  { type: 'list', key: 'types', label: 'Video types', itemLabelKey: 'title', itemFields: videoTypeFields,
    newItem: { title: 'New Type', img: '', imgPosition: 'center', desc: '', videoSrc: '' } },
  { type: 'list', key: 'packages', label: 'Packages', itemLabelKey: 'name', itemFields: videographyPackageFields,
    newItem: { name: 'New Package', price: '', duration: '', includes: [], featured: false } },
  { type: 'group', key: 'cta', label: 'Bottom CTA', fields: ctaFields },
];

/* ── Services / Events ─────────────────────────────────────────────── */

export const eventsDefaults = {
  hero: { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80', imagePosition: 'center', eyebrow: 'Services', title: 'Event Coverage', subtitle: 'From international summits to intimate product launches — comprehensive event documentation at world-class standard.' },
  types: [
    { title: 'Conferences & Summits', desc: 'Multi-day documentation for international conferences, panel discussions, and keynote sessions.', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', imgPosition: 'center' },
    { title: 'Product Launches', desc: 'Brand launches, press releases, and product reveal events with cinematic coverage.', img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80', imgPosition: 'center' },
    { title: 'Award Ceremonies', desc: 'Gala dinners, awards nights, and recognition events documented with elegance.', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', imgPosition: 'center' },
    { title: 'Concerts & Performances', desc: 'Live music, theatre, and performance arts captured with high-ISO precision.', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80', imgPosition: 'center' },
    { title: 'Livestreaming', desc: 'Professional multi-camera livestreaming for hybrid and virtual events.', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', imgPosition: 'center' },
  ],
  highlights: [
    { title: 'Fast Delivery', desc: 'Same-day previews for press. Full gallery within 5 business days.' },
    { title: 'Multi-Camera', desc: 'Up to 4 simultaneous camera operators for comprehensive coverage.' },
    { title: 'Discreet', desc: 'Unobtrusive coverage that never interrupts the flow of your event.' },
  ],
  cta: { heading: 'Planning an event?', text: 'Let us discuss your event and build a custom coverage plan.' },
};

const eventTypeFields: SchemaField[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'textarea', key: 'desc', label: 'Description' },
  { type: 'image', key: 'img', label: 'Image' },
  { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
];

const highlightFields: SchemaField[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'textarea', key: 'desc', label: 'Description' },
];

const eventsSchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: plainHeroFields },
  { type: 'list', key: 'types', label: 'Event types', itemLabelKey: 'title', itemFields: eventTypeFields,
    newItem: { title: 'New Event Type', desc: '', img: '', imgPosition: 'center' } },
  { type: 'list', key: 'highlights', label: 'Highlights band', itemLabelKey: 'title', itemFields: highlightFields,
    newItem: { title: 'New Highlight', desc: '' } },
  { type: 'group', key: 'cta', label: 'Bottom CTA', fields: ctaFields },
];

/* ── Services / Drone ──────────────────────────────────────────────── */

export const droneDefaults = {
  hero: { image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1920&q=80', imagePosition: 'center', eyebrow: 'Services', title: 'Drone Services', badgeText: 'KCAA Licensed Operator', subtitle: 'Aerial perspectives that transform how the world sees your project — safely, legally, and beautifully.' },
  services: [
    { title: 'Aerial Photography', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80', imgPosition: 'center', desc: 'High-resolution stills from above — for real estate, tourism, events, and campaigns.' },
    { title: 'Aerial Videography', img: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80', imgPosition: 'center', desc: 'Cinematic drone footage with stable 4K/6K capture and smooth orbital movements.' },
    { title: 'Mapping & Survey', img: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&q=80', imgPosition: 'center', desc: 'Photogrammetric mapping, orthomosaics, and 3D models for construction and engineering.' },
    { title: 'Site Documentation', img: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=80', imgPosition: 'center', desc: 'Progress documentation for construction sites, infrastructure, and land development.' },
  ],
  fleet: [
    { name: 'DJI Mavic 3 Pro', specs: '5.1K · 28x zoom · 46-min flight time' },
    { name: 'DJI Air 3', specs: '4K · Dual camera · 46-min flight time' },
    { name: 'DJI Phantom 4 RTK', specs: 'Survey grade · PPK/RTK GPS · Mapping' },
  ],
  guaranteeHeading: 'Safe, Legal & Insured',
  guaranteeItems: [
    'KCAA-certified remote pilot licence',
    'Professional liability insurance',
    'NOTAM permits handled on your behalf',
    'No-fly zone awareness & compliance',
    'Full pre-flight safety briefings',
    'Post-flight geo-tagged data delivery',
  ],
  cta: { heading: 'See the world from above', text: 'KCAA-licensed aerial services across Kenya and East Africa.' },
};

const droneServiceFields: SchemaField[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'image', key: 'img', label: 'Image' },
  { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
  { type: 'textarea', key: 'desc', label: 'Description' },
];

const fleetFields: SchemaField[] = [
  { type: 'text', key: 'name', label: 'Aircraft name' },
  { type: 'text', key: 'specs', label: 'Specs' },
];

const droneSchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: [...plainHeroFields, { type: 'text', key: 'badgeText', label: 'Licence badge text' }] },
  { type: 'list', key: 'services', label: 'Service cards', itemLabelKey: 'title', itemFields: droneServiceFields,
    newItem: { title: 'New Service', img: '', imgPosition: 'center', desc: '' } },
  { type: 'list', key: 'fleet', label: 'Fleet', itemLabelKey: 'name', itemFields: fleetFields,
    newItem: { name: 'New Aircraft', specs: '' } },
  { type: 'text', key: 'guaranteeHeading', label: 'Guarantee section heading' },
  { type: 'stringlist', key: 'guaranteeItems', label: 'Guarantee bullet points (one per line)' },
  { type: 'group', key: 'cta', label: 'Bottom CTA', fields: ctaFields },
];

/* ── Services / Branding ───────────────────────────────────────────── */

export const brandingDefaults = {
  hero: { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80', imagePosition: 'center', eyebrow: 'Services', title: 'Brand & Content', subtitle: 'Strategic visual content that builds brands, grows audiences, and drives business results.' },
  services: [
    { title: 'Content Strategy', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', imgPosition: 'center', desc: 'Data-driven content planning that aligns your visual identity with business goals and audience insight.' },
    { title: 'Social Media Content', img: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80', imgPosition: 'center', desc: 'Consistent, high-production social media photography and video for Instagram, LinkedIn, and TikTok.' },
    { title: 'Brand Storytelling', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', imgPosition: 'center', desc: "Narrative-driven content that communicates your brand's values, mission, and unique story." },
    { title: 'Campaign Production', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', imgPosition: 'center', desc: 'Full-scale campaign production — concept to delivery — for product launches and seasonal campaigns.' },
  ],
  process: [
    { num: '01', title: 'Brand Audit', desc: 'We review your existing visual identity and identify gaps and opportunities.' },
    { num: '02', title: 'Strategy', desc: 'A content strategy aligned to your target audience, platforms, and business goals.' },
    { num: '03', title: 'Production', desc: 'Monthly or quarterly shoots that produce a consistent, premium visual library.' },
    { num: '04', title: 'Optimise & Grow', desc: 'Analytics-backed refinements to maximise reach, engagement, and conversion.' },
  ],
  cta: { heading: "Build a brand that's remembered", text: 'Strategic content production that grows your business — month after month.' },
};

const brandingSchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: plainHeroFields },
  { type: 'list', key: 'services', label: 'Service cards', itemLabelKey: 'title', itemFields: droneServiceFields,
    newItem: { title: 'New Service', img: '', imgPosition: 'center', desc: '' } },
  { type: 'list', key: 'process', label: 'Process steps', itemLabelKey: 'title', itemFields: [
      { type: 'text', key: 'num', label: 'Step number' },
      { type: 'text', key: 'title', label: 'Title' },
      { type: 'textarea', key: 'desc', label: 'Description' },
    ], newItem: { num: '00', title: 'New Step', desc: '' } },
  { type: 'group', key: 'cta', label: 'Bottom CTA', fields: ctaFields },
];

/* ── Home ──────────────────────────────────────────────────────────── */

export const homeDefaults = {
  hero: {
    eyebrow: 'Mejasan Media Production',
    headlineLine1: 'Stories That',
    headlineLine2Plain: 'Move ',
    headlineLine2Em: 'People.',
    subLines: ['Photography.', 'Videography.', 'Weddings.', 'Corporate Productions.'],
    posterImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80',
    posterImagePosition: 'center',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    ctaPrimaryLabel: 'Book a Consultation',
    ctaSecondaryLabel: 'View Our Work',
    stats: [
      { num: '500+', label: 'Projects' },
      { num: '200+', label: 'Weddings' },
      { num: '8+', label: 'Years' },
      { num: '50+', label: 'Corporate Clients' },
    ],
  },
  servicesPreview: {
    eyebrow: 'What We Do',
    headingLine1: 'Full-Service',
    headingLine2: 'Media Production',
    items: [
      { label: 'Photography', href: '/services/photography', desc: 'Wedding, corporate, product & studio photography that tells your story with technical mastery.', img: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80', imgPosition: 'center' },
      { label: 'Videography', href: '/services/videography', desc: 'Wedding films, corporate videos, documentaries & commercial production with cinematic precision.', img: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&q=80', imgPosition: 'center' },
      { label: 'Event Coverage', href: '/services/events', desc: 'Conferences, launches, awards & concerts — live documentation at the highest professional standard.', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', imgPosition: 'center' },
      { label: 'Drone Services', href: '/services/drone', desc: 'KCAA-licensed aerial photography, videography, mapping & site documentation across East Africa.', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80', imgPosition: 'center' },
      { label: 'Brand & Content', href: '/services/branding', desc: 'Social media content, brand storytelling & campaign production that builds lasting presence.', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', imgPosition: 'center' },
    ],
  },
  featuredWork: {
    eyebrow: 'Selected Work',
    heading: "Stories We've Told",
    items: [
      { category: 'Weddings', title: 'Sarah & James', location: 'Nairobi', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', imgPosition: 'center', slug: 'sarah-james-wedding' },
      { category: 'Corporate', title: 'Safaricom Summit', location: 'Nairobi', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', imgPosition: 'center', slug: 'safaricom-summit-2024' },
      { category: 'Drone', title: 'Nairobi Skyline', location: 'Nairobi', img: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80', imgPosition: 'center', slug: 'nairobi-skyline-aerial' },
      { category: 'Events', title: 'UN Climate Summit', location: 'Nairobi', img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80', imgPosition: 'center', slug: 'un-climate-summit' },
      { category: 'Branding', title: 'Equity Bank', location: 'Nairobi', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', imgPosition: 'center', slug: 'equity-bank-gala' },
    ],
  },
  statsSection: {
    items: [
      { value: '500', suffix: '+', label: 'Projects Completed', desc: 'Delivered across Kenya and East Africa' },
      { value: '200', suffix: '+', label: 'Weddings Documented', desc: 'Love stories told with cinematic artistry' },
      { value: '50', suffix: '+', label: 'Corporate Clients', desc: 'From startups to multinationals' },
      { value: '8', suffix: '+', label: 'Years of Excellence', desc: 'Continually pushing creative boundaries' },
    ],
  },
  contactCta: {
    eyebrow: "Let's Create Together",
    headingPlain: 'Your Story Deserves to Be ',
    headingEm: 'Told.',
    text: "Every great project starts with a conversation. Tell us your vision — we'll bring the expertise, equipment, and artistry to make it real.",
    ctaPrimaryLabel: 'Book a Consultation',
    whatsappLabel: 'WhatsApp Us',
    whatsappMessage: 'Hi, I would like to enquire about your media production services.',
  },
};

const homeStatFields: SchemaField[] = [
  { type: 'text', key: 'num', label: 'Number' },
  { type: 'text', key: 'label', label: 'Label' },
];

const servicesPreviewItemFields: SchemaField[] = [
  { type: 'text', key: 'label', label: 'Title' },
  { type: 'text', key: 'href', label: 'Link (e.g. /services/photography)' },
  { type: 'textarea', key: 'desc', label: 'Description' },
  { type: 'image', key: 'img', label: 'Image' },
  { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
];

const featuredWorkItemFields: SchemaField[] = [
  { type: 'text', key: 'category', label: 'Category' },
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'text', key: 'location', label: 'Location' },
  { type: 'image', key: 'img', label: 'Image' },
  { type: 'imagePosition', key: 'imgPosition', label: 'Focal point' },
  { type: 'text', key: 'slug', label: 'Portfolio slug (links to /portfolio/[slug])' },
];

const homeStatsSectionItemFields: SchemaField[] = [
  { type: 'text', key: 'value', label: 'Number' },
  { type: 'text', key: 'suffix', label: 'Suffix' },
  { type: 'text', key: 'label', label: 'Label' },
  { type: 'textarea', key: 'desc', label: 'Description' },
];

const homeSchema: SchemaField[] = [
  { type: 'group', key: 'hero', label: 'Hero', fields: [
    { type: 'text', key: 'eyebrow', label: 'Eyebrow label' },
    { type: 'text', key: 'headlineLine1', label: 'Headline — line 1' },
    { type: 'text', key: 'headlineLine2Plain', label: 'Headline — line 2 (plain part)' },
    { type: 'text', key: 'headlineLine2Em', label: 'Headline — line 2 (highlighted part)' },
    { type: 'stringlist', key: 'subLines', label: 'Rotating taglines (one per line)' },
    { type: 'image', key: 'posterImage', label: 'Background / video poster image' },
    { type: 'imagePosition', key: 'posterImagePosition', label: 'Focal point' },
    { type: 'text', key: 'videoUrl', label: 'Background showreel video URL' },
    { type: 'text', key: 'ctaPrimaryLabel', label: 'Primary button label' },
    { type: 'text', key: 'ctaSecondaryLabel', label: 'Secondary button label' },
    { type: 'list', key: 'stats', label: 'Stats bar', itemLabelKey: 'label', itemFields: homeStatFields,
      newItem: { num: '0+', label: 'New Stat' } },
  ] },
  { type: 'group', key: 'servicesPreview', label: 'Services Preview section', fields: [
    { type: 'text', key: 'eyebrow', label: 'Eyebrow label' },
    { type: 'text', key: 'headingLine1', label: 'Heading — line 1' },
    { type: 'text', key: 'headingLine2', label: 'Heading — line 2' },
    { type: 'list', key: 'items', label: 'Service cards', itemLabelKey: 'label', itemFields: servicesPreviewItemFields,
      newItem: { label: 'New Service', href: '/services', desc: '', img: '', imgPosition: 'center' } },
  ] },
  { type: 'group', key: 'featuredWork', label: 'Featured Work section', fields: [
    { type: 'text', key: 'eyebrow', label: 'Eyebrow label' },
    { type: 'text', key: 'heading', label: 'Heading' },
    { type: 'list', key: 'items', label: 'Work items', itemLabelKey: 'title', itemFields: featuredWorkItemFields,
      newItem: { category: 'New Category', title: 'New Project', location: '', img: '', imgPosition: 'center', slug: '' } },
  ] },
  { type: 'group', key: 'statsSection', label: 'Stats Band section', fields: [
    { type: 'list', key: 'items', label: 'Stats', itemLabelKey: 'label', itemFields: homeStatsSectionItemFields,
      newItem: { value: '0', suffix: '+', label: 'New Stat', desc: '' } },
  ] },
  { type: 'group', key: 'contactCta', label: 'Bottom Contact CTA', fields: [
    { type: 'text', key: 'eyebrow', label: 'Eyebrow label' },
    { type: 'text', key: 'headingPlain', label: 'Heading (plain part)' },
    { type: 'text', key: 'headingEm', label: 'Heading (highlighted part)' },
    { type: 'textarea', key: 'text', label: 'Text' },
    { type: 'text', key: 'ctaPrimaryLabel', label: 'Primary button label' },
    { type: 'text', key: 'whatsappLabel', label: 'WhatsApp button label' },
    { type: 'textarea', key: 'whatsappMessage', label: 'Pre-filled WhatsApp message' },
  ] },
];

/* ── Registry ──────────────────────────────────────────────────────── */

export const PAGE_CONTENT: Record<string, PageContentDef> = {
  'home': { slug: 'home', label: 'Home', schema: homeSchema, defaults: homeDefaults },
  'about': { slug: 'about', label: 'About', schema: aboutSchema, defaults: aboutDefaults },
  'services': { slug: 'services', label: 'Services (hub)', schema: servicesSchema, defaults: servicesDefaults },
  'services-photography': { slug: 'services-photography', label: 'Services — Photography', schema: photographySchema, defaults: photographyDefaults },
  'services-videography': { slug: 'services-videography', label: 'Services — Videography', schema: videographySchema, defaults: videographyDefaults },
  'services-events': { slug: 'services-events', label: 'Services — Events', schema: eventsSchema, defaults: eventsDefaults },
  'services-drone': { slug: 'services-drone', label: 'Services — Drone', schema: droneSchema, defaults: droneDefaults },
  'services-branding': { slug: 'services-branding', label: 'Services — Branding', schema: brandingSchema, defaults: brandingDefaults },
};

export const PAGE_SLUGS = Object.keys(PAGE_CONTENT);

export function getPageContent(slug: string, dbContent: unknown): Record<string, unknown> {
  const def = PAGE_CONTENT[slug];
  if (!def) return {};
  return mergeContent(def.defaults, dbContent);
}

/* ── Typed shapes for frontend rendering ──────────────────────────── */

export type HomeContent = typeof homeDefaults;
export type AboutContent = typeof aboutDefaults;
export type ServicesContent = typeof servicesDefaults;
export type PhotographyContent = typeof photographyDefaults;
export type VideographyContent = typeof videographyDefaults;
export type EventsContent = typeof eventsDefaults;
export type DroneContent = typeof droneDefaults;
export type BrandingContent = typeof brandingDefaults;
