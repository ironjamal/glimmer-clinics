/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GLIMMER CLINICS — Premium Website
 *  Be Bright, Be Bold, Be Glimmer.
 *  Single-file React implementation (App.jsx). No external UI dependencies.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  RUN
 *    Any React 18+ environment (Vite / CRA / Next page / CodeSandbox).
 *    Vite:  npm create vite@latest glimmer -- --template react
 *           replace src/App.jsx with this file, then: npm i && npm run dev
 *    The component injects its own <style> block, fonts (fontsource CDN),
 *    SEO/OG meta tags and LocalBusiness JSON-LD at runtime.
 *
 *  CUSTOMIZE (everything lives in CONFIG below)
 *    • Clinic facts, nav, treatments, gallery, reviews, socials, booking mode.
 *    • IMAGES: every slot has { url: null, variant: '…' }. While `url` is null
 *      the site renders the built-in illustrated "editorial plate" (ArtScene).
 *      Drop in real licensed/clinic photography by setting `url` — no other
 *      code change needed. Alt text travels with each slot.
 *    • LOGO: CONFIG.brand.logoUrl = null renders the rebuilt SVG wordmark
 *      (preserves the original G-with-profile + sparkle cut-out). Set logoUrl
 *      to the official asset path (e.g. /glimmer-logo.svg) to swap it in.
 *
 *  CONTENT GOVERNANCE (per brief — do not publish unverified facts)
 *    • rating.verified = false  → the 4.9 / 184-review badge stays hidden until
 *      re-checked against the live Google listing, then flip to true.
 *    • experts = []             → "Our Experts" section + nav link auto-hide
 *      until the clinic confirms Dr. Nancy's full name, title & credentials
 *      (a ready-made entry template is commented inside CONFIG).
 *    • reviews are clearly marked layout placeholders until real,
 *      permission-approved patient quotes are collected.
 *    • openingHours = []        → no hours are claimed anywhere; the contact
 *      section invites a call instead. Replace when verified.
 *    • whatsapp is assumed = the published clinic mobile; confirm, or change
 *      CONFIG.booking.mode to 'tel' / 'link' (bookingUrl = real booking system).
 *
 *  DEPLOY
 *    Static build (npm run build) → any host (Netlify/Vercel/S3/cPanel).
 *    robots.txt:  User-agent: * \n Allow: / \n Sitemap: https://DOMAIN/sitemap.xml
 *    sitemap.xml: one <url> per anchor if you later split pages; for this
 *    single-page site a single <loc>https://DOMAIN/</loc> entry suffices.
 *
 *  TRACKING (ready, credential-free)
 *    track() pushes to window.dataLayer: appointment_cta_click,
 *    booking_form_start, booking_form_submit, whatsapp_click, phone_click.
 *    Add GA4/GTM later by loading your container snippet in index.html.
 *
 *  ARABIC / RTL READINESS
 *    Layout uses logical properties (padding-inline, inset-inline, margin-inline)
 *    and [dir="rtl"] flips directional icons. To localise: set document
 *    dir="rtl" lang="ar", swap --serif to an Arabic editorial face (e.g.
 *    "Amiri"/"Reem Kufi") and --sans to "IBM Plex Sans Arabic" via fontsource.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

/* ─────────────────────────────── CONFIG ─────────────────────────────── */

const CONFIG = {
  brand: {
    name: "Glimmer Clinics",
    tagline: "Be Bright, Be Bold, Be Glimmer.",
    logoUrl: null, // e.g. "/glimmer-logo.svg" — official asset replaces SVG wordmark
  },
  contact: {
    addressLine: "140 El-Nozha Street, El Nozha, Cairo, Egypt",
    addressShort: "140 El-Nozha St, El Nozha, Cairo",
    phoneDisplay: "010 69587480",
    phoneHref: "tel:+201069587480",
    whatsapp: "+201069587480", // VERIFY: assumed = clinic mobile. Set null to disable.
    mapsUrl: null, // verified Google Business profile URL, when provided
    openingHours: [], // e.g. [{ d: "Sat – Thu", h: "11:00 – 20:00" }] once verified
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/glimmer_clinics/" },
    { label: "Facebook", href: "https://www.facebook.com/p/Glimmer-Clinics-61574762085847/" },
  ],
  rating: { value: 4.9, count: 184, verified: false, source: "Google Reviews" },
  booking: { mode: "whatsapp" }, // 'whatsapp' | 'tel' | 'link'
  bookingUrl: null, // external booking system URL when mode = 'link'

  highlights: [
    { icon: "plan", title: "Personalized Treatment Plans", text: "Every plan begins with your skin, your history and your goals — never a template." },
    { icon: "consult", title: "Professional Consultation", text: "Unhurried, honest conversations before any treatment is ever suggested." },
    { icon: "care", title: "Patient-Focused Care", text: "You are cared for by a team that listens first and treats second." },
    { icon: "clean", title: "Clean, Welcoming Environment", text: "A calm, hygienic studio designed to feel like a pause from your day." },
  ],

  treatments: [
    { name: "Skin Rejuvenation", variant: "macro", alt: "Close-up of dewy, hydrated skin catching soft light", text: "Glow-focused protocols chosen around your skin type, texture and tone." },
    { name: "Botox & Aesthetic Treatments", variant: "aesthetic", alt: "Serene aesthetic treatment moment in a calm clinical setting", text: "Subtle, natural-looking aesthetic refinements, planned conservatively." },
    { name: "Facial Treatments", variant: "facial", alt: "Relaxing facial treatment on a cream-lined treatment bed", text: "Deep-cleansing, hydrating facials that leave skin calm and replenished." },
    { name: "Skin Health Consultations", variant: "consult", alt: "Practitioner talking with a patient in a warm consultation room", text: "A unhurried skin assessment and an honest plan — including “do nothing yet”." },
    { name: "Personalized Skincare", variant: "skincare", alt: "Minimal still life of personalized skincare bottles and cream textures", text: "Home routines and follow-up care built around what your skin actually needs." },
  ],

  featured: {
    label: "Featured Treatment",
    title: "The Signature Glow Facial.",
    lead: "Sixty unhurried minutes of deep cleansing, hydration and calm — our most-loved ritual, tailored on the day to whatever your skin is doing.",
    includes: [
      "Double cleanse, gentle exfoliation and a hydration mask chosen for your skin type.",
      "Sculpting facial massage to ease tension and restore circulation.",
      "A finishing layer of barrier care and SPF, with simple home-routine guidance.",
    ],
    note: "Not sure it’s right for you? Every plan starts with a consultation.",
    variant: "featured",
    alt: "Hydrating mask being brushed onto a cheek during the Signature Glow Facial",
  },

  about: {
    eyebrow: "About Glimmer",
    title: "Care That Understands Your Skin.",
    paragraphs: [
      "At Glimmer Clinics, every experience begins with understanding you. Our approach brings together personalized attention, thoughtful care, and treatments selected around your individual needs.",
      "We believe great skin is less about transformation and more about attention — consistent, considered care that adds up quietly over time. So we take the time to listen, explain and plan with you, at your pace.",
    ],
    signature: "— The Glimmer Care Team, Cairo",
    variantMain: "interior",
    altMain: "The Glimmer Clinics reception with arched sage-green walls and warm light",
    variantDetail: "detail",
    altDetail: "Folded cream towels and skincare bottles on a sage shelf",
  },

  /* Publish only after the clinic confirms name, title & credentials.
     Example entry:
     { name: "Dr. Nancy …", title: "…verified title…", specialty: "…",
       bio: "…", initials: "DN", portraitUrl: null }                      */
  experts: [],

  gallery: [
    { variant: "lounge", caption: "Reception & consultation lounge", alt: "Clinic lounge with arched sage wall and cream linen sofa", span: "g1" },
    { variant: "room", caption: "Treatment room, prepared for you", alt: "Calm treatment room with cream linen bed and soft light", span: "g2" },
    { variant: "texture", caption: "Texture study — hydration", alt: "Macro swirl of cream texture on sage stone", span: "g3" },
    { variant: "glow", caption: "The glow, up close", alt: "Close-up of dewy glowing skin with light droplets", span: "g4" },
    { variant: "shelf", caption: "Details from the studio", alt: "Minimal skincare bottles arranged on a floating sage shelf", span: "g5" },
  ],
  galleryNote: "Before-and-after photography is shared in clinic during consultation, with each patient’s written consent.",

  reviews: {
    placeholder: true, // clearly marked until real reviews are collected
    items: [
      { quote: "From the first consultation I felt listened to. The clinic is spotless, calm and never rushed.", name: "Mariam E." },
      { quote: "Honest advice — I was talked out of more than I was talked into. My skin thanks them.", name: "Salma H." },
      { quote: "A beautiful space and gentle hands. Booking again was the easiest decision.", name: "Nour A." },
    ],
  },

  images: {
    hero: { url: null, variant: "portrait", alt: "Editorial portrait of a woman with luminous natural skin in soft window light" },
  },
};

/* ─────────────────────────────── helpers ─────────────────────────────── */

const track = (event, payload = {}) => {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
  } catch (e) { /* tracking must never break the site */ }
};

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const smoothScrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
};

const waLink = (text) =>
  `https://wa.me/${(CONFIG.contact.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

const mapsSearchUrl =
  CONFIG.contact.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${CONFIG.brand.name}, ${CONFIG.contact.addressLine}`
  )}`;

const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${CONFIG.brand.name}, ${CONFIG.contact.addressLine}`
)}&output=embed`;

const starPath = (cx, cy, r) =>
  `M${cx},${cy - r} Q${cx + r * 0.18},${cy - r * 0.18} ${cx + r},${cy} Q${cx + r * 0.18},${cy + r * 0.18} ${cx},${cy + r} Q${cx - r * 0.18},${cy + r * 0.18} ${cx - r},${cy} Q${cx - r * 0.18},${cy - r * 0.18} ${cx},${cy - r} Z`;

/* Face-profile line art (left facing), authored in a 100×100 box */
const FACE_LINE =
  "M62,4 C50,8 44,20 43,30 C42.4,35 40,40 36,46 C33.5,49.5 34.5,53 38,54.5 C35.5,58.5 36,62.5 39.5,64.5 C37.5,68.5 38.5,72.5 42.5,74.5 C41.5,80 45,86 52,88.5 C58,90.6 64,91 70,90.5";
const FACE_FILL =
  "M70,2 C52,2 44,16 43,28 C42,34 39,40 35,46 C32.5,49.5 33.5,53 37,54.5 C34.5,58.5 35,62.5 38.5,64.5 C36.5,68.5 37.5,72.5 41.5,74.5 C40.5,80 44,86 51,88.5 C57,90.6 63,91 69,90.5 L80,90.5 L80,2 Z";

/* ─────────────────────────────── icons ─────────────────────────────── */

const I = {
  arrow: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip" aria-hidden="true" {...p}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  ),
  sparkle: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2c.7 4.9 4.4 8.6 9.3 9.3v1.4c-4.9.7-8.6 4.4-9.3 9.3h-1.4c-.7-4.9-4.4-8.6-9.3-9.3v-1.4C6.2 10.6 9.9 6.9 10.6 2z" transform="scale(.92) translate(1,1)" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2.6l2.8 6 6.6.7-4.9 4.4 1.4 6.5L12 16.9l-5.9 3.3 1.4-6.5L2.6 9.3l6.6-.7z" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  ),
  wa: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.25-.13-1.5-.74-1.73-.82-.23-.09-.4-.13-.57.12-.17.25-.65.82-.8 1-.15.17-.3.2-.55.07a6.7 6.7 0 0 1-3.35-2.93c-.25-.44.25-.4.72-1.34.08-.17.04-.31-.02-.44-.06-.13-.57-1.38-.78-1.89-.2-.5-.41-.42-.57-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.13.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.5-.61 1.71-1.2.21-.6.21-1.1.15-1.2-.06-.11-.23-.17-.48-.3z" />
    </svg>
  ),
  menu: (p) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...p}>
      <path d="M3 7h18M3 12h18M3 17h12" />
    </svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...p}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  chevL: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip" aria-hidden="true" {...p}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  chevR: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip" aria-hidden="true" {...p}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  quote: (p) => (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H6.5A1.5 1.5 0 0 1 8 8.5h2zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-3.5A1.5 1.5 0 0 1 19 8.5h2z" opacity=".9" />
    </svg>
  ),
};

const HighlightIcon = ({ kind }) => {
  const common = { width: 22, height: 22, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (kind === "plan") return (<svg viewBox="0 0 24 24" {...common}><path d="M9 3h6a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-3 2V5a2 2 0 0 1 2-2z" /><path d="M9 9h6M9 13h4" /></svg>);
  if (kind === "consult") return (<svg viewBox="0 0 24 24" {...common}><path d="M8 10h8M8 14h5" /><path d="M21 12a9 9 0 1 1-4-7.5L21 3l-1 4.5A8.9 8.9 0 0 1 21 12z" /></svg>);
  if (kind === "care") return (<svg viewBox="0 0 24 24" {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>);
  return (<svg viewBox="0 0 24 24" {...common}><path d="M3 21h18M5 21V8l7-5 7 5v13" /><path d="M10 21v-6h4v6" /></svg>);
};

/* ─────────────────────────── brand logo (SVG) ─────────────────────────── */

function Logo({ className = "", height = 34 }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (CONFIG.brand.logoUrl) {
    return <img src={CONFIG.brand.logoUrl} alt={`${CONFIG.brand.name} logo`} className={className} style={{ height }} />;
  }
  return (
    <svg viewBox="0 0 440 150" className={className} style={{ height, width: "auto", overflow: "visible", display: "block" }} role="img" aria-label={CONFIG.brand.name}>
      <defs>
        <mask id={`lm${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="440" height="150">
          <rect x="0" y="0" width="440" height="150" fill="#fff" />
          <path d={FACE_FILL} transform="translate(15,49) scale(0.52)" fill="#000" />
          <path d={starPath(79, 41, 12)} fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#lm${uid})`}>
        <text x="0" y="112" fontSize="116" fill="currentColor" style={{ fontFamily: "var(--serif)", fontWeight: 500, letterSpacing: "0.01em" }}>
          Glimmer
        </text>
      </g>
    </svg>
  );
}

/* ─────────────── illustrated editorial plates (image fallback) ─────────────── */

function ArtScene({ variant, alt, className = "", eager = false }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = (n) => `${variant}${n}${uid}`;

  const Grain = (
    <>
      <filter id={g("gr")}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.055 0" />
      </filter>
      <rect width="900" height="1100" filter={`url(#${g("gr")})`} />
    </>
  );

  const FaceLine = ({ x, y, s, stroke = "#252A27", o = 0.55, w = 2.6 }) => (
    <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={stroke} strokeWidth={w / s} strokeLinecap="round" opacity={o}>
      <path d={FACE_LINE} />
      <path d="M52,38 q8,5 15,1" />
      <path d="M50,29 q9,-4 17,-1" />
    </g>
  );

  const Sprig = ({ x, y, s = 1, r = 0, stroke = "#3E5A50", o = 0.4 }) => (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity={o}>
      <path d="M0,0 C40,60 60,140 62,220" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${8 + i * 10},${28 + i * 34})`}>
          <ellipse cx="-16" cy="0" rx="17" ry="7" transform="rotate(-28)" fill={stroke} stroke="none" />
          <ellipse cx="18" cy="6" rx="17" ry="7" transform="rotate(24)" fill={stroke} stroke="none" />
        </g>
      ))}
    </g>
  );

  let scene = null;

  if (variant === "portrait") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#F1EDE5" />
        <radialGradient id={g("a")} cx="50%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".9" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <rect width="900" height="1100" fill={`url(#${g("a")})`} />
        <path d="M150,1100 L150,470 A300,300 0 0 1 750,470 L750,1100 Z" fill="#4D6F63" />
        <path d="M186,1100 L186,486 A264,264 0 0 1 714,486 L714,1100" fill="none" stroke="#F8F6F0" strokeOpacity=".28" strokeWidth="2" />
        <circle cx="450" cy="470" r="150" fill="#F8F6F0" opacity=".12" />
        <path d="M262,1100 C282,830 360,742 450,736 C540,742 618,830 638,1100 Z" fill="#F8F6F0" />
        <path d="M392,760 C420,782 480,782 508,760 L500,736 C470,752 430,752 400,736 Z" fill="#E4D8C4" />
        <circle cx="450" cy="560" r="118" fill="#D9C6B2" />
        <path d="M336,540 C340,436 402,392 452,392 C512,392 566,442 566,540 C566,506 540,470 512,462 C470,450 402,452 372,478 C350,496 340,516 336,540 Z" fill="#252A27" opacity=".88" />
        <FaceLine x={392} y={472} s={1.72} o={0.5} />
        <path d={starPath(520, 606, 15)} fill="#F8F6F0" />
        <Sprig x={640} y={180} s={1.05} r={24} o={0.35} />
        <ellipse cx="450" cy="1076" rx="290" ry="26" fill="#252A27" opacity=".14" />
        {Grain}
      </>
    );
  } else if (variant === "macro") {
    scene = (
      <>
        <linearGradient id={g("a")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EBDCC8" /><stop offset="100%" stopColor="#F8F6F0" />
        </linearGradient>
        <rect width="900" height="1100" fill={`url(#${g("a")})`} />
        <path d="M0,640 C260,560 560,620 900,500 L900,1100 L0,1100 Z" fill="#DCC0A8" />
        <path d="M0,760 C300,690 620,740 900,640 L900,1100 L0,1100 Z" fill="#CBA98C" opacity=".75" />
        <ellipse cx="360" cy="620" rx="250" ry="96" fill="#FFFFFF" opacity=".34" transform="rotate(-10 360 620)" />
        {[[300, 596, 26], [430, 640, 16], [560, 590, 21], [660, 660, 12], [220, 680, 14]].map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity=".5" />
            <circle cx={cx - r * 0.3} cy={cy - r * 0.35} r={r * 0.28} fill="#FFFFFF" opacity=".95" />
          </g>
        ))}
        <path d="M60,880 C300,820 620,860 860,780" fill="none" stroke="#252A27" strokeWidth="2.4" opacity=".22" strokeLinecap="round" />
        <path d={starPath(740, 300, 20)} fill="#4D6F63" opacity=".5" />
        {Grain}
      </>
    );
  } else if (variant === "aesthetic") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#DCE5DD" />
        <path d="M0,0 L300,0 C240,300 240,800 300,1100 L0,1100 Z" fill="#4D6F63" opacity=".16" />
        <circle cx="470" cy="520" r="250" fill="#F8F6F0" opacity=".55" />
        <FaceLine x={330} y={300} s={4.4} stroke="#252A27" o={0.75} w={2.2} />
        <ellipse cx="640" cy="700" rx="120" ry="62" fill="#D9C6B2" transform="rotate(-24 640 700)" />
        <ellipse cx="700" cy="620" rx="96" ry="46" fill="#E4CDB7" transform="rotate(-38 700 620)" />
        <path d={starPath(620, 330, 26)} fill="#4D6F63" />
        <path d={starPath(250, 820, 16)} fill="#4D6F63" opacity=".55" />
        {Grain}
      </>
    );
  } else if (variant === "facial") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#F1EDE5" />
        <rect y="700" width="900" height="400" fill="#4D6F63" />
        <rect y="780" width="900" height="120" fill="#3E5A50" />
        <rect x="90" y="600" width="300" height="150" rx="75" fill="#F8F6F0" />
        <circle cx="265" cy="620" r="102" fill="#D9C6B2" />
        <path d="M163,600 C168,510 220,470 268,470 C322,470 366,516 368,600 C340,560 300,548 262,548 C220,548 186,566 163,600 Z" fill="#F8F6F0" />
        <path d="M238,624 q10,7 20,1" fill="none" stroke="#252A27" strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <path d="M236,600 q11,-5 21,-1" fill="none" stroke="#252A27" strokeWidth="3" strokeLinecap="round" opacity=".4" />
        <path d="M226,662 q10,6 18,2" fill="none" stroke="#C99F8C" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="452" cy="560" rx="86" ry="40" fill="#E4CDB7" transform="rotate(28 452 560)" />
        <ellipse cx="520" cy="480" rx="110" ry="44" fill="#D9C6B2" transform="rotate(40 520 480)" />
        <path d={starPath(620, 330, 18)} fill="#4D6F63" opacity=".6" />
        <path d={starPath(700, 420, 12)} fill="#4D6F63" opacity=".45" />
        <ellipse cx="265" cy="742" rx="150" ry="18" fill="#252A27" opacity=".12" />
        {Grain}
      </>
    );
  } else if (variant === "consult") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#F8F6F0" />
        <path d="M560,0 L760,0 L620,1100 L470,1100 Z" fill="#FFFFFF" opacity=".5" />
        <rect x="150" y="700" width="600" height="30" rx="15" fill="#C8A98B" />
        <rect x="200" y="730" width="18" height="220" fill="#C8A98B" opacity=".8" />
        <rect x="680" y="730" width="18" height="220" fill="#C8A98B" opacity=".8" />
        <circle cx="280" cy="520" r="72" fill="#4D6F63" />
        <path d="M180,700 C190,600 230,566 280,562 C330,566 370,600 380,700 Z" fill="#4D6F63" />
        <circle cx="620" cy="530" r="66" fill="#C99F8C" />
        <path d="M528,700 C538,610 574,576 620,572 C666,576 702,610 712,700 Z" fill="#C99F8C" />
        <rect x="410" y="640" width="90" height="60" rx="8" fill="#F1EDE5" stroke="#252A27" strokeOpacity=".15" />
        <path d="M806,950 L806,820" stroke="#3E5A50" strokeWidth="6" />
        <rect x="770" y="950" width="72" height="60" rx="10" fill="#4D6F63" />
        <Sprig x={760} y={620} s={0.8} r={8} o={0.5} />
        {Grain}
      </>
    );
  } else if (variant === "skincare") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#4D6F63" />
        <rect y="800" width="900" height="300" fill="#E9DFD0" />
        <ellipse cx="450" cy="806" rx="420" ry="26" fill="#252A27" opacity=".12" />
        <rect x="190" y="520" width="130" height="290" rx="26" fill="#A9793F" />
        <rect x="232" y="452" width="46" height="76" rx="10" fill="#252A27" />
        <circle cx="255" cy="440" r="26" fill="#252A27" />
        <rect x="212" y="600" width="86" height="120" rx="10" fill="#F8F6F0" opacity=".9" />
        <ellipse cx="540" cy="780" rx="130" ry="40" fill="#F8F6F0" />
        <path d="M460,772 C490,742 590,742 620,772 C590,792 490,792 460,772 Z" fill="#EFE6D8" />
        <rect x="640" y="640" width="110" height="170" rx="18" fill="#F1EDE5" />
        <rect x="668" y="600" width="54" height="46" rx="8" fill="#3E5A50" />
        <g transform="translate(120,880)">
          <rect width="220" height="34" rx="16" fill="#F8F6F0" />
          <rect y="40" width="220" height="34" rx="16" fill="#EFE6D8" />
          <rect y="80" width="220" height="34" rx="16" fill="#F8F6F0" />
        </g>
        <Sprig x={420} y={300} s={1.1} r={64} o={0.5} stroke="#DCE5DD" />
        {Grain}
      </>
    );
  } else if (variant === "featured") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#F1EDE5" />
        <radialGradient id={g("a")} cx="42%" cy="36%" r="58%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".85" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <rect width="900" height="1100" fill={`url(#${g("a")})`} />
        <circle cx="430" cy="520" r="250" fill="#D9C6B2" />
        <path d="M212,470 C260,540 340,586 430,592 C520,586 600,540 648,470 C620,610 540,676 430,680 C320,676 240,610 212,470 Z" fill="#F8F6F0" opacity=".95" />
        <path d="M330,470 q26,18 52,2" fill="none" stroke="#252A27" strokeWidth="4" strokeLinecap="round" opacity=".5" />
        <path d="M326,436 q28,-10 54,-2" fill="none" stroke="#252A27" strokeWidth="4" strokeLinecap="round" opacity=".35" />
        <path d="M352,586 q26,14 48,4" fill="none" stroke="#C99F8C" strokeWidth="7" strokeLinecap="round" />
        <g transform="rotate(34 640 420)">
          <rect x="620" y="240" width="34" height="220" rx="14" fill="#252A27" />
          <rect x="612" y="452" width="50" height="34" rx="8" fill="#C8A98B" />
          <path d="M616,486 C616,540 660,540 660,486 Z" fill="#F8F6F0" />
        </g>
        <rect y="900" width="900" height="200" fill="#F8F6F0" />
        <rect y="900" width="900" height="10" fill="#252A27" opacity=".08" />
        <path d={starPath(700, 760, 22)} fill="#4D6F63" />
        <path d={starPath(180, 260, 14)} fill="#4D6F63" opacity=".5" />
        {Grain}
      </>
    );
  } else if (variant === "interior") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#F1EDE5" />
        <rect y="840" width="900" height="260" fill="#E4D8C4" />
        <rect x="70" y="110" width="760" height="730" rx="10" fill="#4D6F63" />
        <path d="M330,840 L330,470 A120,120 0 0 1 570,470 L570,840 Z" fill="#F6E7C9" />
        <path d="M368,840 L368,486 A82,82 0 0 1 532,486 L532,840" fill="none" stroke="#4D6F63" strokeOpacity=".35" strokeWidth="3" />
        <path d="M150,840 C170,700 260,660 340,668 L340,840 Z" fill="#F8F6F0" />
        <path d="M750,840 C730,700 640,660 560,668 L560,840 Z" fill="#F8F6F0" />
        <ellipse cx="250" cy="640" rx="86" ry="40" fill="#EFE8DA" />
        <ellipse cx="650" cy="640" rx="86" ry="40" fill="#EFE8DA" />
        <rect x="700" y="700" width="52" height="140" rx="10" fill="#3E5A50" />
        <path d="M726,700 C720,620 730,560 726,510" stroke="#3E5A50" strokeWidth="7" fill="none" />
        {[[700, 500], [748, 470], [712, 430], [760, 540], [688, 560]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={26 - i * 2} fill={i % 2 ? "#557A6D" : "#3E5A50"} />
        ))}
        <ellipse cx="450" cy="960" rx="330" ry="34" fill="#FFFFFF" opacity=".45" />
        {Grain}
      </>
    );
  } else if (variant === "detail") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#DCE5DD" />
        <Sprig x={760} y={-40} s={1.7} r={140} o={0.24} />
        <rect x="110" y="640" width="680" height="26" rx="6" fill="#3E5A50" />
        <g transform="translate(160,470)">
          <rect width="190" height="44" rx="20" fill="#F8F6F0" />
          <rect y="50" width="190" height="44" rx="20" fill="#EFE6D8" />
          <rect y="100" width="190" height="44" rx="20" fill="#F8F6F0" />
          <rect y="150" width="190" height="20" rx="10" fill="#E4D8C4" />
        </g>
        <path d="M430,640 C430,586 520,586 520,640 Z" fill="#F8F6F0" />
        <rect x="580" y="500" width="70" height="140" rx="14" fill="#A9793F" />
        <rect x="598" y="466" width="34" height="40" rx="8" fill="#252A27" />
        <rect x="672" y="530" width="60" height="110" rx="12" fill="#F1EDE5" />
        <rect x="688" y="502" width="28" height="32" rx="6" fill="#4D6F63" />
        <ellipse cx="450" cy="676" rx="330" ry="16" fill="#252A27" opacity=".12" />
        {Grain}
      </>
    );
  } else if (variant === "lounge") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#4D6F63" />
        <path d="M180,1100 L180,420 A270,270 0 0 1 720,420 L720,1100" fill="none" stroke="#F8F6F0" strokeOpacity=".35" strokeWidth="3" />
        <rect y="900" width="900" height="200" fill="#3E5A50" />
        <rect x="190" y="660" width="400" height="150" rx="44" fill="#F1EDE5" />
        <rect x="210" y="580" width="170" height="110" rx="30" fill="#F8F6F0" />
        <rect x="400" y="580" width="170" height="110" rx="30" fill="#EFE6D8" />
        <rect x="220" y="810" width="16" height="60" fill="#252A27" opacity=".5" />
        <rect x="544" y="810" width="16" height="60" fill="#252A27" opacity=".5" />
        <ellipse cx="690" cy="800" rx="90" ry="24" fill="#E4D8C4" />
        <rect x="676" y="820" width="28" height="90" fill="#D9C6B2" />
        <path d="M690,780 C686,720 694,680 690,650" stroke="#3E5A50" strokeWidth="5" fill="none" />
        <circle cx="688" cy="640" r="16" fill="#DCE5DD" />
        <circle cx="700" cy="676" r="12" fill="#DCE5DD" opacity=".8" />
        <path d="M0,1100 L340,760 L420,760 L80,1100 Z" fill="#252A27" opacity=".14" />
        <path d={starPath(760, 300, 18)} fill="#F8F6F0" opacity=".8" />
        {Grain}
      </>
    );
  } else if (variant === "room") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#F8F6F0" />
        <path d="M60,0 C120,300 120,800 60,1100 L0,1100 L0,0 Z" fill="#F1EDE5" />
        <path d="M150,0 C200,300 200,800 150,1100" fill="none" stroke="#252A27" strokeOpacity=".1" strokeWidth="3" />
        <circle cx="700" cy="300" r="90" fill="#F6E7C9" />
        <path d="M660,300 A40,40 0 0 1 740,300 Z" fill="#C8A98B" />
        <radialGradient id={g("a")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6E7C9" stopOpacity=".9" /><stop offset="100%" stopColor="#F6E7C9" stopOpacity="0" />
        </radialGradient>
        <circle cx="700" cy="330" r="180" fill={`url(#${g("a")})`} />
        <rect x="240" y="660" width="520" height="180" rx="34" fill="#F1EDE5" stroke="#252A27" strokeOpacity=".12" />
        <rect x="240" y="740" width="520" height="100" rx="30" fill="#DCE5DD" />
        <rect x="280" y="600" width="180" height="80" rx="36" fill="#F8F6F0" stroke="#252A27" strokeOpacity=".1" />
        <rect x="430" y="700" width="240" height="34" rx="17" fill="#4D6F63" opacity=".85" />
        <rect x="280" y="840" width="20" height="90" fill="#252A27" opacity=".4" />
        <rect x="700" y="840" width="20" height="90" fill="#252A27" opacity=".4" />
        <rect x="790" y="700" width="70" height="130" rx="10" fill="#C8A98B" />
        <g transform="translate(800,660)">
          <rect width="50" height="40" rx="10" fill="#F8F6F0" />
        </g>
        <ellipse cx="500" cy="960" rx="300" ry="22" fill="#252A27" opacity=".1" />
        {Grain}
      </>
    );
  } else if (variant === "texture") {
    scene = (
      <>
        <rect width="900" height="1100" fill="#4D6F63" />
        <circle cx="180" cy="220" r="150" fill="#3E5A50" opacity=".6" />
        <circle cx="760" cy="880" r="190" fill="#3E5A50" opacity=".5" />
        <path d="M220,640 C220,440 680,440 680,620 C680,780 340,780 340,640 C340,540 560,540 560,620" fill="none" stroke="#F8F6F0" strokeWidth="96" strokeLinecap="round" />
        <path d="M220,640 C220,440 680,440 680,620 C680,780 340,780 340,640 C340,540 560,540 560,620" fill="none" stroke="#E4D8C4" strokeWidth="58" strokeLinecap="round" opacity=".55" />
        <circle cx="700" cy="330" r="34" fill="#F8F6F0" opacity=".85" />
        <circle cx="690" cy="320" r="10" fill="#FFFFFF" />
        <path d={starPath(220, 300, 18)} fill="#DCE5DD" opacity=".8" />
        {Grain}
      </>
    );
  } else if (variant === "glow") {
    scene = (
      <>
        <linearGradient id={g("a")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EBDCC8" /><stop offset="100%" stopColor="#DCE5DD" />
        </linearGradient>
        <rect width="900" height="1100" fill={`url(#${g("a")})`} />
        <circle cx="450" cy="500" r="270" fill="#D9C6B2" />
        <path d="M212,430 C250,560 330,640 450,648 C570,640 650,560 688,430 C680,610 580,700 450,706 C320,700 220,610 212,430 Z" fill="#CBA98C" opacity=".5" />
        <FaceLine x={330} y={300} s={3.4} o={0.5} />
        <ellipse cx="560" cy="760" rx="130" ry="66" fill="#E4CDB7" transform="rotate(24 560 760)" />
        <ellipse cx="480" cy="820" rx="110" ry="52" fill="#D9C6B2" transform="rotate(12 480 820)" />
        {[[360, 420, 12], [470, 380, 9], [540, 470, 14], [420, 520, 8], [560, 560, 10], [330, 540, 9]].map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity=".55" />
            <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.3} fill="#FFFFFF" opacity=".95" />
          </g>
        ))}
        <path d="M300,300 C360,240 540,240 600,300" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity=".4" />
        {Grain}
      </>
    );
  } else {
    /* shelf */
    scene = (
      <>
        <rect width="900" height="1100" fill="#F1EDE5" />
        <radialGradient id={g("a")} cx="24%" cy="16%" r="70%">
          <stop offset="0%" stopColor="#F6E7C9" stopOpacity=".9" /><stop offset="100%" stopColor="#F6E7C9" stopOpacity="0" />
        </radialGradient>
        <rect width="900" height="1100" fill={`url(#${g("a")})`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${120 + i * 40},0 C${200 + i * 60},180 ${80 + i * 70},320 ${180 + i * 66},470`} fill="none" stroke="#C9B08E" strokeWidth="3" opacity=".4" />
        ))}
        <rect x="130" y="640" width="640" height="24" rx="6" fill="#4D6F63" />
        <rect x="180" y="470" width="80" height="170" rx="14" fill="#F8F6F0" />
        <rect x="200" y="436" width="40" height="40" rx="8" fill="#3E5A50" />
        <rect x="290" y="500" width="66" height="140" rx="12" fill="#A9793F" />
        <rect x="306" y="470" width="34" height="36" rx="7" fill="#252A27" />
        <rect x="390" y="440" width="96" height="200" rx="16" fill="#EFE6D8" />
        <rect x="414" y="408" width="48" height="38" rx="8" fill="#4D6F63" />
        <rect x="520" y="520" width="60" height="120" rx="12" fill="#F8F6F0" />
        <rect x="536" y="492" width="28" height="32" rx="6" fill="#C8A98B" />
        <path d="M620,640 C620,560 700,560 700,640 Z" fill="#DCE5DD" />
        <Sprig x={640} y={470} s={0.7} r={-14} o={0.6} />
        <ellipse cx="450" cy="676" rx="330" ry="14" fill="#252A27" opacity=".12" />
        {Grain}
      </>
    );
  }

  return (
    <svg viewBox="0 0 900 1100" preserveAspectRatio="xMidYMid slice" className={`art ${className}`} role="img" aria-label={alt} style={{ width: "100%", height: "100%", display: "block" }}>
      {scene}
    </svg>
  );
}

function SmartImage({ img, className = "", eager = false }) {
  if (img && img.url) {
    return <img src={img.url} alt={img.alt || ""} className={className} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  }
  return <ArtScene variant={img ? img.variant : "texture"} alt={img ? img.alt : ""} className={className} eager={eager} />;
}

/* ─────────────────────────── motion primitives ─────────────────────────── */

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) { el.classList.add("is-in"); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }),
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}

/* ─────────────────────────── shared UI ─────────────────────────── */

function SectionHead({ eyebrow, title, lead, tone = "dark", align = "start", className = "" }) {
  return (
    <Reveal className={`shead ${align === "center" ? "shead-center" : ""} ${tone === "light" ? "shead-light" : ""} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h-serif">{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </Reveal>
  );
}

function Btn({ as = "a", variant = "primary", href, onClick, children, className = "", type, disabled }) {
  const cls = `btn btn-${variant} ${className}`;
  if (as === "button") {
    return <button type={type || "button"} className={cls} onClick={onClick} disabled={disabled}>{children}</button>;
  }
  return <a className={cls} href={href} onClick={onClick} target={href && href.startsWith("http") ? "_blank" : undefined} rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}>{children}</a>;
}

/* ─────────────────────────── header / nav ─────────────────────────── */

function useNavLinks() {
  return useMemo(() => {
    const links = [
      { id: "home", label: "Home" },
      { id: "treatments", label: "Treatments" },
      { id: "about", label: "About Us" },
    ];
    if (CONFIG.experts.length) links.push({ id: "experts", label: "Our Experts" });
    links.push({ id: "gallery", label: "Gallery" }, { id: "contact", label: "Contact" });
    return links;
  }, []);
}

function Header({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = useNavLinks();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => smoothScrollTo(id), open ? 120 : 0);
  };

  return (
    <>
      <header className={`site-head ${scrolled ? "is-scrolled" : ""}`}>
        <div className="head-in">
          <a href="#home" className="brand-link" onClick={go("home")} aria-label={`${CONFIG.brand.name} — home`}>
            <Logo className="logo" height={scrolled ? 30 : 34} />
          </a>
          <nav className="main-nav" aria-label="Primary">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a>
            ))}
          </nav>
          <div className="head-actions">
            <Btn as="button" variant="primary" className="btn-sm head-cta" onClick={() => { track("appointment_cta_click", { placement: "nav" }); onBook(); }}>
              Book an Appointment
            </Btn>
            <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
              {I.menu()}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="mm-top">
          <Logo height={30} className="logo" />
          <button className="burger" aria-label="Close menu" onClick={() => setOpen(false)}>{I.close()}</button>
        </div>
        <nav className="mm-nav" aria-label="Mobile">
          {links.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} style={{ transitionDelay: `${80 + i * 45}ms` }}>{l.label}</a>
          ))}
        </nav>
        <div className="mm-foot">
          <Btn as="button" variant="primary" className="btn-block" onClick={() => { track("appointment_cta_click", { placement: "mobile_menu" }); setOpen(false); setTimeout(onBook, 120); }}>
            Book an Appointment
          </Btn>
          <a className="mm-phone" href={CONFIG.contact.phoneHref} onClick={() => track("phone_click", { placement: "mobile_menu" })}>
            {I.phone()} {CONFIG.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── hero ─────────────────────────── */

function Hero({ onBook }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="hero-copy">
        <div className="hero-copy-in">
          <p className="eyebrow fx" style={{ animationDelay: ".1s" }}>Your Skin, Your Glow</p>
          <h1 className="h-serif fx" style={{ animationDelay: ".2s" }}>
            Reveal the Beauty<br />That’s Already <em>Yours.</em>
          </h1>
          <p className="lead fx" style={{ animationDelay: ".34s" }}>
            Personalized skincare and aesthetic treatments designed around you, your skin, and your confidence.
          </p>
          <div className="hero-ctas fx" style={{ animationDelay: ".46s" }}>
            <Btn as="button" variant="primary" onClick={() => { track("appointment_cta_click", { placement: "hero" }); onBook(); }}>
              Book Your Visit {I.arrow()}
            </Btn>
            <Btn as="a" variant="outline" href="#treatments" onClick={(e) => { e.preventDefault(); smoothScrollTo("treatments"); }}>
              Explore Treatments
            </Btn>
          </div>
          <div className="hero-tag fx" style={{ animationDelay: ".58s" }}>
            <span className="tag-line" aria-hidden="true" />
            <p className="tagline">{I.sparkle()} {CONFIG.brand.tagline}</p>
          </div>
          <div className="scroll-cue fx" style={{ animationDelay: ".72s" }} aria-hidden="true">
            <span className="cue-line" /> Scroll
          </div>
        </div>
      </div>

      <div className="hero-media" aria-hidden="false">
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-img fx-img">
          <SmartImage img={CONFIG.images.hero} eager />
        </div>
        <div className="hero-badge" aria-hidden="true">
          <svg viewBox="0 0 128 128" className="badge-ring">
            <defs><path id={`bp${uid}`} d="M64,64 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
            <text fontSize="10.5" letterSpacing="2.6" style={{ fontFamily: "var(--sans)", fontWeight: 700, fill: "#F8F6F0" }}>
              <textPath href={`#bp${uid}`}>BE BRIGHT · BE BOLD · BE GLIMMER ·</textPath>
            </text>
          </svg>
          <span className="badge-star">{I.sparkle({ width: 20, height: 20 })}</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── trust ─────────────────────────── */

function Trust() {
  const r = CONFIG.rating;
  return (
    <section className="trust" aria-label="Why patients choose Glimmer">
      <div className="container">
        {r.verified && (
          <Reveal className="rating-row">
            <span className="rating-pill">
              <span className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <span key={i}>{I.star()}</span>)}</span>
              <strong>{r.value} / 5</strong> · {r.count} {r.source}
            </span>
          </Reveal>
        )}
        <div className="trust-grid">
          {CONFIG.highlights.map((h, i) => (
            <Reveal key={h.title} className="trust-item" delay={i * 90}>
              <span className="t-ico"><HighlightIcon kind={h.icon} /></span>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── treatments ─────────────────────────── */

function Treatments({ onExplore }) {
  const spans = ["span7", "span5", "span5", "span7", "wide"];
  return (
    <section id="treatments" className="section treatments">
      <div className="container">
        <SectionHead
          eyebrow="Our Treatments"
          title="Considered care, chosen for your skin."
          lead="Each visit is built around a small menu of treatments we perform with care and precision — nothing more than your skin needs."
        />
        <div className="tgrid">
          {CONFIG.treatments.map((t, i) => (
            <Reveal key={t.name} as="article" className={`tcard ${spans[i] || "span6"}`} delay={(i % 2) * 90}>
              <div className="tcard-media">
                <SmartImage img={{ url: null, variant: t.variant, alt: t.alt }} />
              </div>
              <div className="tcard-body">
                <div>
                  <h3 className="h-serif">{t.name}</h3>
                  <p>{t.text}</p>
                </div>
                <button
                  className="tlink"
                  onClick={() => { track("appointment_cta_click", { placement: "treatment_card", treatment: t.name }); onExplore(t.name); }}
                >
                  <span>Explore Treatment</span>
                  <span className="dot-arrow">{I.arrow()}</span>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── featured ─────────────────────────── */

function Featured({ onBook }) {
  const f = CONFIG.featured;
  return (
    <section className="featured" aria-label={f.title}>
      <div className="container featured-grid">
        <Reveal className="featured-media">
          <div className="featured-frame" aria-hidden="true" />
          <div className="featured-img arch">
            <SmartImage img={{ url: null, variant: f.variant, alt: f.alt }} />
          </div>
        </Reveal>
        <Reveal className="featured-copy" delay={120}>
          <p className="eyebrow eyebrow-light">{f.label}</p>
          <h2 className="h-serif">{f.title}</h2>
          <p className="lead lead-light">{f.lead}</p>
          <ul className="incl">
            {f.includes.map((li) => (
              <li key={li}><span className="incl-ico">{I.check()}</span>{li}</li>
            ))}
          </ul>
          <p className="featured-note">{f.note}</p>
          <div className="hero-ctas">
            <Btn as="button" variant="light" onClick={() => { track("appointment_cta_click", { placement: "featured" }); onBook(); }}>
              Book a Consultation {I.arrow()}
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── about ─────────────────────────── */

function About() {
  const a = CONFIG.about;
  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <Reveal className="about-copy">
          <p className="eyebrow">{a.eyebrow}</p>
          <h2 className="h-serif">{a.title}</h2>
          {a.paragraphs.map((p) => <p className="lead" key={p.slice(0, 24)}>{p}</p>)}
          <p className="signature h-serif">{a.signature}</p>
          <p className="tagline tagline-sm">{I.sparkle()} {CONFIG.brand.tagline}</p>
        </Reveal>
        <Reveal className="about-media" delay={120}>
          <div className="about-main arch">
            <SmartImage img={{ url: null, variant: a.variantMain, alt: a.altMain }} />
          </div>
          <div className="about-detail">
            <SmartImage img={{ url: null, variant: a.variantDetail, alt: a.altDetail }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── experts ─────────────────────────── */

function Experts() {
  if (!CONFIG.experts.length) return null;
  return (
    <section id="experts" className="section experts">
      <div className="container">
        <SectionHead align="center" eyebrow="Our Experts" title="The hands behind the glow." lead="The specialists who lead your care at Glimmer — verified credentials, honest advice." />
        <div className="experts-grid">
          {CONFIG.experts.map((e, i) => (
            <Reveal key={e.name} as="article" className="expert-card" delay={i * 100}>
              <div className="expert-photo">
                {e.portraitUrl
                  ? <img src={e.portraitUrl} alt={`Portrait of ${e.name}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span className="monogram h-serif" aria-hidden="true">{e.initials || e.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}{I.sparkle({ className: "mono-star", width: 14, height: 14 })}</span>}
              </div>
              <div className="expert-body">
                <h3 className="h-serif">{e.name}</h3>
                <p className="expert-title">{e.title}</p>
                <span className="chip">{e.specialty}</span>
                <p className="expert-bio">{e.bio}</p>
                <p className="expert-note">Full credentials available in clinic on request.</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── gallery + lightbox ─────────────────────────── */

function Gallery() {
  const [idx, setIdx] = useState(null);
  const closeRef = useRef(null);
  const lastActive = useRef(null);

  useEffect(() => {
    if (idx === null) return;
    lastActive.current = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((v) => (v + 1) % CONFIG.gallery.length);
      if (e.key === "ArrowLeft") setIdx((v) => (v - 1 + CONFIG.gallery.length) % CONFIG.gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastActive.current && lastActive.current.focus();
    };
  }, [idx]);

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <SectionHead
          eyebrow="Results & Gallery"
          title="A studio designed to calm."
          lead="Step inside Glimmer — soft light, clean lines and rooms made for unhurried care."
        />
        <div className="ggrid">
          {CONFIG.gallery.map((gitem, i) => (
            <Reveal key={gitem.caption} as="figure" className={`gitem ${gitem.span}`} delay={(i % 2) * 80}>
              <button className="gbtn" onClick={() => setIdx(i)} aria-label={`Open image: ${gitem.caption}`}>
                <SmartImage img={{ url: null, variant: gitem.variant, alt: gitem.alt }} />
                <span className="gcap">
                  <span className="gnum h-serif">{String(i + 1).padStart(2, "0")}</span>
                  {gitem.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal className="gallery-note"><p>{CONFIG.galleryNote}</p></Reveal>
      </div>

      {idx !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={(e) => { if (e.target.className === "lightbox") setIdx(null); }}>
          <button className="lb-close" ref={closeRef} onClick={() => setIdx(null)} aria-label="Close image viewer">{I.close()}</button>
          <button className="lb-nav lb-prev" onClick={() => setIdx((v) => (v - 1 + CONFIG.gallery.length) % CONFIG.gallery.length)} aria-label="Previous image">{I.chevL()}</button>
          <figure className="lb-figure">
            <div className="lb-art">
              <SmartImage img={{ url: null, variant: CONFIG.gallery[idx].variant, alt: CONFIG.gallery[idx].alt }} />
            </div>
            <figcaption>{CONFIG.gallery[idx].caption} <span className="lb-count">· {idx + 1} / {CONFIG.gallery.length}</span></figcaption>
          </figure>
          <button className="lb-nav lb-next" onClick={() => setIdx((v) => (v + 1) % CONFIG.gallery.length)} aria-label="Next image">{I.chevR()}</button>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────── reviews ─────────────────────────── */

function Reviews() {
  const r = CONFIG.rating;
  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <SectionHead align="center" eyebrow="Kind Words" title="What our patients say." lead="Honest words from the people we care for — the only proof we ever promise to chase." />
        {r.verified && (
          <Reveal className="rating-row rating-row-center">
            <span className="rating-pill">
              <span className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <span key={i}>{I.star()}</span>)}</span>
              <strong>{r.value} / 5</strong> · {r.count} {r.source}
            </span>
          </Reveal>
        )}
        <div className="rev-grid">
          {CONFIG.reviews.items.map((rev, i) => (
            <Reveal key={rev.name} as="blockquote" className="rev-card" delay={i * 100}>
              <span className="rev-quote" aria-hidden="true">{I.quote()}</span>
              <p className="rev-text h-serif">{rev.quote}</p>
              <footer className="rev-foot">
                <strong>{rev.name}</strong>
                <span>Patient review</span>
              </footer>
            </Reveal>
          ))}
        </div>
        <Reveal className="rev-actions">
          {CONFIG.reviews.placeholder && (
            <p className="rev-note">Layout previews only — verified patient reviews are published here before launch.</p>
          )}
          <Btn as="a" variant="outline" href={mapsSearchUrl}>Read reviews on Google {I.arrow()}</Btn>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── booking ─────────────────────────── */

function Booking({ formRef, chosen, onChosenConsumed }) {
  const [form, setForm] = useState({ name: "", phone: "", treatment: "", date: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const started = useRef(false);
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    if (chosen) {
      setForm((f) => ({ ...f, treatment: chosen }));
      onChosenConsumed && onChosenConsumed();
    }
  }, [chosen, onChosenConsumed]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const set = (k) => (e) => {
    if (!started.current) { started.current = true; track("booking_form_start"); }
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = "Please tell us your name.";
    if (!/^\+?[0-9\s()-]{9,20}$/.test(form.phone.trim())) er.phone = "Please enter a reachable phone number.";
    if (!form.treatment) er.treatment = "Choose a treatment, or “Not sure yet”.";
    if (form.date && form.date < today) er.date = "Please choose today or a later date.";
    return er;
  };

  const submit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus("sending");
    track("booking_form_submit", { treatment: form.treatment });
    const msg =
      `Hello ${CONFIG.brand.name}! I’d like to book an appointment.\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nTreatment: ${form.treatment}` +
      (form.date ? `\nPreferred date: ${form.date}` : "") +
      (form.notes ? `\nNotes: ${form.notes}` : "");
    const url = waLink(msg);
    setWaUrl(url);
    setTimeout(() => {
      if (CONFIG.booking.mode === "whatsapp" && CONFIG.contact.whatsapp) {
        const w = window.open(url, "_blank", "noopener");
        if (!w) track("whatsapp_click", { placement: "booking_form_popup_blocked" });
      }
      setStatus("sent");
    }, 700);
  };

  return (
    <section id="book" className="section booking" ref={formRef}>
      <div className="container booking-grid">
        <Reveal className="booking-panel">
          <p className="eyebrow eyebrow-light">Book an Appointment</p>
          <h2 className="h-serif">Your Glow Starts With a Conversation.</h2>
          <p className="lead lead-light">Tell us what you’d like to achieve, and our team will help you explore the next step.</p>
          <ul className="assure">
            <li>{I.check()} We reply within one working day.</li>
            <li>{I.check()} No payment is taken online.</li>
            <li>{I.check()} Your details stay with our clinic team.</li>
          </ul>
          <div className="panel-alt">
            <p>Prefer to talk?</p>
            <div className="panel-alt-row">
              <a href={CONFIG.contact.phoneHref} onClick={() => track("phone_click", { placement: "booking_panel" })}>{I.phone()} {CONFIG.contact.phoneDisplay}</a>
              {CONFIG.contact.whatsapp && (
                <a href={waLink(`Hello ${CONFIG.brand.name}! I’d like to book an appointment.`)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { placement: "booking_panel" })}>
                  {I.wa()} WhatsApp
                </a>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal className="booking-card" delay={110}>
          {status === "sent" ? (
            <div className="sent-panel" role="status">
              <span className="sent-ico">{I.check()}</span>
              <h3 className="h-serif">Thank you, {form.name.split(" ")[0]}.</h3>
              <p>
                {CONFIG.booking.mode === "whatsapp" && CONFIG.contact.whatsapp
                  ? "We’ve prepared your request in WhatsApp — press send there and our team will confirm your time. Nothing is booked until we confirm together."
                  : "Your request is ready. Call us or message us on Instagram and we’ll confirm your time together."}
              </p>
              <div className="sent-actions">
                {CONFIG.booking.mode === "whatsapp" && CONFIG.contact.whatsapp && (
                  <Btn as="a" variant="primary" href={waUrl} onClick={() => track("whatsapp_click", { placement: "booking_success" })}>{I.wa()} Open WhatsApp</Btn>
                )}
                <Btn as="a" variant="outline" href={CONFIG.contact.phoneHref} onClick={() => track("phone_click", { placement: "booking_success" })}>{I.phone()} Call the clinic</Btn>
              </div>
              <button className="tlink" onClick={() => { setStatus("idle"); setForm({ name: "", phone: "", treatment: "", date: "", notes: "" }); }}>
                <span>Send another request</span>
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="frow">
                <div className="field">
                  <label htmlFor="bk-name">Full name *</label>
                  <input id="bk-name" name="name" type="text" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "bk-name-err" : undefined} placeholder="Your name" />
                  {errors.name && <p className="ferr" id="bk-name-err">{errors.name}</p>}
                </div>
                <div className="field">
                  <label htmlFor="bk-phone">Phone number *</label>
                  <input id="bk-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "bk-phone-err" : undefined} placeholder="01x xxxx xxxx" />
                  {errors.phone && <p className="ferr" id="bk-phone-err">{errors.phone}</p>}
                </div>
              </div>
              <div className="frow">
                <div className="field">
                  <label htmlFor="bk-treatment">Preferred treatment *</label>
                  <select id="bk-treatment" name="treatment" value={form.treatment} onChange={set("treatment")} aria-invalid={!!errors.treatment} aria-describedby={errors.treatment ? "bk-tr-err" : undefined}>
                    <option value="">Select…</option>
                    {CONFIG.treatments.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
                    <option value="Not sure yet — guide me">Not sure yet — guide me</option>
                  </select>
                  {errors.treatment && <p className="ferr" id="bk-tr-err">{errors.treatment}</p>}
                </div>
                <div className="field">
                  <label htmlFor="bk-date">Preferred date (optional)</label>
                  <input id="bk-date" name="date" type="date" min={today} value={form.date} onChange={set("date")} aria-invalid={!!errors.date} aria-describedby={errors.date ? "bk-date-err" : undefined} />
                  {errors.date && <p className="ferr" id="bk-date-err">{errors.date}</p>}
                </div>
              </div>
              <div className="field">
                <label htmlFor="bk-notes">Anything you’d like us to know? (optional)</label>
                <textarea id="bk-notes" name="notes" rows="3" value={form.notes} onChange={set("notes")} placeholder="Skin concerns, questions, preferred times…" />
              </div>
              <Btn as="button" type="submit" variant="primary" className="btn-block" disabled={status === "sending"}>
                {status === "sending" ? "Preparing your request…" : <>Request My Appointment {I.arrow()}</>}
              </Btn>
              <p className="fmicro">By sending, you agree to be contacted about your appointment. No marketing lists, ever.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── contact ─────────────────────────── */

function Contact() {
  const c = CONFIG.contact;
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHead eyebrow="Visit Us" title="Find us on El-Nozha." lead="A quiet street in El Nozha, Cairo — with care worth the trip." />
        <div className="contact-grid">
          <div className="contact-cards">
            <Reveal className="ccard">
              <span className="cc-ico">{I.pin()}</span>
              <div>
                <h3>{CONFIG.brand.name}</h3>
                <p>{c.addressLine}</p>
                <a className="tlink tlink-sm" href={mapsSearchUrl} target="_blank" rel="noopener noreferrer"><span>Get directions</span> {I.arrow()}</a>
              </div>
            </Reveal>
            <Reveal className="ccard" delay={80}>
              <span className="cc-ico">{I.phone()}</span>
              <div>
                <h3>Call us</h3>
                <p><a href={c.phoneHref} onClick={() => track("phone_click", { placement: "contact" })}>{c.phoneDisplay}</a></p>
                {c.whatsapp && (
                  <a className="tlink tlink-sm" href={waLink(`Hello ${CONFIG.brand.name}!`)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { placement: "contact" })}>
                    <span>Message on WhatsApp</span> {I.arrow()}
                  </a>
                )}
              </div>
            </Reveal>
            <Reveal className="ccard" delay={160}>
              <span className="cc-ico">{I.clock()}</span>
              <div>
                <h3>Opening hours</h3>
                {c.openingHours.length ? (
                  <ul className="hours">{c.openingHours.map((h) => <li key={h.d}><span>{h.d}</span><span>{h.h}</span></li>)}</ul>
                ) : (
                  <p>Hours are confirmed when you book — call or message us and we’ll find a time that suits you.</p>
                )}
              </div>
            </Reveal>
          </div>
          <Reveal className="contact-map" delay={120}>
            <iframe title={`Map — ${CONFIG.brand.name}, ${c.addressShort}`} src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── footer + privacy ─────────────────────────── */

function PrivacyModal({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    ref.current && ref.current.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Privacy notice" onClick={(e) => { if (e.target.className === "modal") onClose(); }}>
      <div className="modal-card">
        <button className="lb-close modal-close" ref={ref} onClick={onClose} aria-label="Close privacy notice">{I.close()}</button>
        <h3 className="h-serif">Privacy at Glimmer</h3>
        <p>When you send a booking request we collect only your name, phone number and the preferences you share (treatment, preferred date, notes). These are used solely to arrange and deliver your care.</p>
        <p>Your details are never sold or added to marketing lists. If you choose the WhatsApp option, your message travels through WhatsApp’s service to the clinic’s business phone.</p>
        <p>This site sets no advertising cookies. Analytics are added only once configured by the clinic, and never before. To access, correct or delete your information, call us on {CONFIG.contact.phoneDisplay}.</p>
      </div>
    </div>
  );
}

function Footer({ onBook, onPrivacy }) {
  const links = useNavLinks();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="f-brand">
          <Logo height={36} className="logo-light" />
          <p className="tagline tagline-sm footer-tag">{I.sparkle()} {CONFIG.brand.tagline}</p>
          <p className="f-blurb">A beauty, skincare and aesthetic clinic in Cairo — built around your skin, your pace and your confidence.</p>
        </div>
        <nav className="f-col" aria-label="Footer — explore">
          <h4>Explore</h4>
          {links.map((l) => <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); smoothScrollTo(l.id); }}>{l.label}</a>)}
          <a href="#book" onClick={(e) => { e.preventDefault(); onBook(); }}>Book an Appointment</a>
        </nav>
        <nav className="f-col" aria-label="Footer — treatments">
          <h4>Treatments</h4>
          {CONFIG.treatments.map((t) => <a key={t.name} href="#treatments" onClick={(e) => { e.preventDefault(); smoothScrollTo("treatments"); }}>{t.name}</a>)}
        </nav>
        <div className="f-col">
          <h4>Contact</h4>
          <p>{CONFIG.contact.addressLine}</p>
          <p><a href={CONFIG.contact.phoneHref} onClick={() => track("phone_click", { placement: "footer" })}>{CONFIG.contact.phoneDisplay}</a></p>
          <div className="f-social">
            {CONFIG.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
          </div>
        </div>
      </div>
      <div className="container footer-bar">
        <p>© {new Date().getFullYear()} {CONFIG.brand.name}. All rights reserved.</p>
        <button className="flink" onClick={onPrivacy}>Privacy Policy</button>
        <p className="footer-tagline h-serif">Be Bright, Be Bold, Be Glimmer.</p>
      </div>
    </footer>
  );
}

/* ─────────────────────────── sticky mobile CTA ─────────────────────────── */

function StickyBar({ onBook }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`sticky-bar ${show ? "is-show" : ""}`} role="region" aria-label="Quick booking">
      <a className="sb-call" href={CONFIG.contact.phoneHref} aria-label={`Call ${CONFIG.contact.phoneDisplay}`} onClick={() => track("phone_click", { placement: "sticky_bar" })}>
        {I.phone()}
      </a>
      <Btn as="button" variant="primary" className="sb-book" onClick={() => { track("appointment_cta_click", { placement: "sticky_bar" }); onBook(); }}>
        Book an Appointment
      </Btn>
    </div>
  );
}

/* ─────────────────────────── app ─────────────────────────── */

export default function App() {
  const [chosen, setChosen] = useState("");
  const [privacy, setPrivacy] = useState(false);

  const goToBooking = () => smoothScrollTo("book");
  const explore = (name) => { setChosen(name); smoothScrollTo("book"); };

  /* SEO / OG / JSON-LD */
  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "Glimmer Clinics — Skincare & Aesthetic Clinic in Cairo | Be Bright, Be Bold, Be Glimmer";
    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const desc = "Glimmer Clinics is a beauty, skincare and aesthetic clinic at 140 El-Nozha Street, El Nozha, Cairo. Personalized treatment plans, professional consultations and patient-focused care. Book your visit.";
    setMeta("name", "description", desc);
    setMeta("name", "robots", "index, follow");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", CONFIG.brand.name);
    setMeta("property", "og:title", "Glimmer Clinics — Skincare & Aesthetic Clinic in Cairo");
    setMeta("property", "og:description", desc);
    setMeta("property", "og:locale", "en_US");
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", "Glimmer Clinics — Cairo");
    setMeta("name", "twitter:description", desc);

    const c = CONFIG.contact;
    const ld = {
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      name: CONFIG.brand.name,
      slogan: CONFIG.brand.tagline,
      telephone: "+20 10 69587480",
      address: {
        "@type": "PostalAddress",
        streetAddress: "140 El-Nozha Street, El Nozha",
        addressLocality: "Cairo",
        addressCountry: "EG",
      },
      sameAs: CONFIG.socials.map((s) => s.href),
    };
    if (CONFIG.rating.verified) {
      ld.aggregateRating = { "@type": "AggregateRating", ratingValue: CONFIG.rating.value, reviewCount: CONFIG.rating.count };
    }
    let sc = document.getElementById("glimmer-jsonld");
    if (!sc) { sc = document.createElement("script"); sc.id = "glimmer-jsonld"; sc.type = "application/ld+json"; document.head.appendChild(sc); }
    sc.textContent = JSON.stringify(ld);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <a className="skip" href="#main">Skip to content</a>
      <Header onBook={goToBooking} />
      <main id="main">
        <Hero onBook={goToBooking} />
        <Trust />
        <Treatments onExplore={explore} />
        <Featured onBook={goToBooking} />
        <About />
        <Experts />
        <Gallery />
        <Reviews />
        <Booking chosen={chosen} onChosenConsumed={() => setChosen("")} />
        <Contact />
      </main>
      <Footer onBook={goToBooking} onPrivacy={() => setPrivacy(true)} />
      <StickyBar onBook={goToBooking} />
      {privacy && <PrivacyModal onClose={() => setPrivacy(false)} />}
    </>
  );
}

/* ─────────────────────────── styles ─────────────────────────── */

const CSS = `
@import url('https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-400-normal.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-500-normal.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-600-normal.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-500-italic.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-400-normal.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-500-normal.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-600-normal.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-700-normal.css');

:root{
  --sage:#4D6F63; --sage-deep:#3E5A50; --ivory:#F8F6F0; --cream:#F1EDE5;
  --char:#252A27; --msage:#DCE5DD; --white:#FFFFFF;
  --ink-70:rgba(37,42,39,.7); --ink-60:rgba(37,42,39,.6); --ink-50:rgba(37,42,39,.5);
  --line:rgba(37,42,39,.12); --line-light:rgba(248,246,240,.28);
  --serif:'Cormorant Garamond',Georgia,'Times New Roman',serif;
  --sans:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --shadow:0 24px 60px -28px rgba(37,42,39,.28);
  --ease:cubic-bezier(.22,.61,.36,1);
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:92px}
body{margin:0;background:var(--ivory);color:var(--char);font:400 16px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
img,svg{max-width:100%}
::selection{background:var(--sage);color:var(--ivory)}
:focus-visible{outline:2px solid var(--sage);outline-offset:3px;border-radius:4px}
[dir="rtl"] .rtl-flip{transform:scaleX(-1)}
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.001s !important;animation-iteration-count:1 !important;transition-duration:.001s !important}
}

.container{max-width:1240px;margin-inline:auto;padding-inline:32px}
.section{padding:112px 0}
.h-serif{font-family:var(--serif);font-weight:500;line-height:1.06;letter-spacing:.002em;margin:0}
h1.h-serif{font-size:clamp(2.9rem,5.4vw,4.75rem)}
h2.h-serif{font-size:clamp(2.1rem,3.6vw,3.15rem)}
h3.h-serif{font-size:1.55rem;line-height:1.15}
.h-serif em{font-style:italic}
.lead{color:var(--ink-60);font-size:1.02rem;line-height:1.78;max-width:56ch;margin:18px 0 0}
.lead-light{color:rgba(248,246,240,.82)}
.eyebrow{display:inline-flex;align-items:center;gap:12px;margin:0 0 18px;font:700 .72rem/1 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--sage)}
.eyebrow::before{content:"";width:30px;height:1px;background:currentColor;opacity:.65}
.eyebrow-light{color:var(--msage)}
.shead{margin-bottom:56px}
.shead-center{display:flex;flex-direction:column;align-items:center;text-align:center}
.shead-center .lead{margin-inline:auto}
.tagline{display:inline-flex;align-items:center;gap:10px;margin:0;font-family:var(--serif);font-style:italic;font-size:1.2rem;color:var(--sage)}
.tagline-sm{font-size:1.05rem}
.skip{position:absolute;inset-inline-start:-9999px;top:0;background:var(--sage);color:var(--ivory);padding:12px 20px;z-index:200;border-radius:0 0 10px 0}
.skip:focus{inset-inline-start:0}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:1px solid transparent;border-radius:999px;cursor:pointer;text-decoration:none;font:700 .8rem/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;padding:1.05rem 1.7rem;transition:transform .25s var(--ease),background .25s,color .25s,border-color .25s,box-shadow .25s}
.btn-primary{background:var(--sage);color:var(--ivory)}
.btn-primary:hover{background:var(--sage-deep);transform:translateY(-2px);box-shadow:0 16px 30px -16px rgba(62,90,80,.55)}
.btn-outline{border-color:rgba(37,42,39,.28);color:var(--char);background:transparent}
.btn-outline:hover{border-color:var(--char);background:rgba(255,255,255,.6);transform:translateY(-2px)}
.btn-light{background:var(--ivory);color:var(--sage-deep)}
.btn-light:hover{background:var(--white);transform:translateY(-2px)}
.btn-sm{padding:.85rem 1.25rem;font-size:.72rem}
.btn-block{width:100%}
.btn:disabled{opacity:.65;cursor:wait;transform:none}

/* reveal + load fx */
.reveal{opacity:0;transform:translateY(26px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.reveal.is-in{opacity:1;transform:none}
.fx{opacity:0;transform:translateY(24px);animation:fxUp .9s var(--ease) forwards}
.fx-img{animation:fxZoom 1.5s var(--ease) both}
@keyframes fxUp{to{opacity:1;transform:none}}
@keyframes fxZoom{from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.reveal,.fx{opacity:1;transform:none;animation:none;transition:none}.fx-img{animation:none}}

/* header */
.site-head{position:fixed;inset-inline:0;top:0;z-index:50;transition:background .35s,box-shadow .35s,border-color .35s;border-bottom:1px solid transparent}
.site-head.is-scrolled{background:rgba(248,246,240,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom-color:var(--line)}
.head-in{max-width:1240px;margin-inline:auto;padding-inline:32px;height:80px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.brand-link{color:var(--char);display:inline-flex}
.logo{color:var(--char)}
.main-nav{display:flex;gap:30px}
.main-nav a{position:relative;color:var(--ink-70);text-decoration:none;font:600 .78rem/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;padding:8px 0;transition:color .25s}
.main-nav a::after{content:"";position:absolute;inset-inline:0;bottom:0;height:1px;background:var(--sage);transform:scaleX(0);transform-origin:left;transition:transform .3s var(--ease)}
.main-nav a:hover{color:var(--char)}
.main-nav a:hover::after{transform:scaleX(1)}
.head-actions{display:flex;align-items:center;gap:14px}
.burger{display:none;background:none;border:0;color:var(--char);padding:6px;cursor:pointer}

/* mobile menu */
.mobile-menu{position:fixed;inset:0;z-index:80;background:var(--ivory);padding:24px 24px 36px;display:flex;flex-direction:column;transform:translateY(-12px);opacity:0;visibility:hidden;transition:opacity .35s var(--ease),transform .35s var(--ease),visibility .35s}
.mobile-menu.is-open{opacity:1;visibility:visible;transform:none}
.mm-top{display:flex;align-items:center;justify-content:space-between}
.mm-top .burger{display:inline-flex}
.mm-nav{display:flex;flex-direction:column;gap:6px;margin-top:34px}
.mm-nav a{font-family:var(--serif);font-size:2.1rem;color:var(--char);text-decoration:none;padding:8px 0;border-bottom:1px solid var(--line);opacity:0;transform:translateY(14px);transition:opacity .45s var(--ease),transform .45s var(--ease)}
.mobile-menu.is-open .mm-nav a{opacity:1;transform:none}
.mm-foot{margin-top:auto;display:flex;flex-direction:column;gap:16px}
.mm-phone{display:inline-flex;align-items:center;justify-content:center;gap:10px;color:var(--sage);text-decoration:none;font:700 .9rem/1 var(--sans)}

/* hero */
.hero{display:grid;grid-template-columns:1.02fr .98fr;min-height:92vh;min-height:92svh;padding-top:80px;background:var(--ivory)}
.hero-copy{display:flex;align-items:center}
.hero-copy-in{padding:56px 64px 72px 32px;max-width:660px;margin-inline-start:auto;width:100%}
.hero-copy-in .lead{margin-top:26px}
.hero-ctas{display:flex;flex-wrap:wrap;gap:14px;margin-top:36px}
.hero-tag{display:flex;align-items:center;gap:18px;margin-top:44px}
.tag-line{width:56px;height:1px;background:var(--sage);opacity:.5}
.scroll-cue{display:flex;align-items:center;gap:12px;margin-top:52px;color:var(--ink-50);font:700 .66rem/1 var(--sans);letter-spacing:.22em;text-transform:uppercase}
.cue-line{position:relative;width:56px;height:1px;background:var(--line);overflow:hidden}
.cue-line::after{content:"";position:absolute;inset:0;background:var(--sage);transform:translateX(-100%);animation:cue 2.4s var(--ease) infinite}
@keyframes cue{45%{transform:translateX(0)}100%{transform:translateX(100%)}}
.hero-media{position:relative;padding:32px 40px 40px 0}
.hero-frame{position:absolute;top:64px;bottom:72px;left:-26px;width:56%;border:1px solid rgba(77,111,99,.4);border-radius:999px 999px 20px 20px}
.hero-img{position:relative;height:100%;min-height:560px;border-radius:999px 999px 22px 22px;overflow:hidden;box-shadow:var(--shadow)}
.hero-img .art{position:absolute;inset:0}
.hero-badge{position:absolute;left:-40px;bottom:76px;width:128px;height:128px;border-radius:50%;background:var(--sage);display:grid;place-items:center;box-shadow:0 18px 40px -18px rgba(37,42,39,.5)}
.badge-ring{position:absolute;inset:0;animation:spin 28s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.badge-star{color:var(--ivory);display:grid;place-items:center}

/* trust */
.trust{background:var(--cream);padding:84px 0;border-block:1px solid var(--line)}
.rating-row{margin-bottom:40px}
.rating-row-center{justify-content:center;display:flex}
.rating-pill{display:inline-flex;align-items:center;gap:12px;background:var(--white);border:1px solid var(--line);border-radius:999px;padding:.8rem 1.3rem;font:600 .85rem/1 var(--sans);color:var(--ink-70)}
.rating-pill .stars{display:inline-flex;gap:3px;color:var(--sage)}
.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.trust-item{border-top:1px solid var(--line);padding-top:26px}
.t-ico{display:grid;place-items:center;width:48px;height:48px;border:1px solid rgba(77,111,99,.45);border-radius:50%;color:var(--sage);margin-bottom:18px}
.trust-item h3{margin:0 0 8px;font:700 1rem/1.3 var(--sans)}
.trust-item p{margin:0;color:var(--ink-60);font-size:.92rem;line-height:1.7}

/* treatments */
.tgrid{display:grid;grid-template-columns:repeat(12,1fr);gap:28px}
.tcard{grid-column:span 6;display:flex;flex-direction:column}
.tcard.span7{grid-column:span 7}
.tcard.span5{grid-column:span 5}
.tcard.wide{grid-column:span 12;flex-direction:row;align-items:stretch;background:var(--white);border:1px solid var(--line);border-radius:22px;overflow:hidden}
.tcard-media{border-radius:20px;overflow:hidden;aspect-ratio:4/3.1;position:relative}
.tcard.wide .tcard-media{border-radius:0;aspect-ratio:auto;width:44%;flex:none}
.tcard-media .art{transition:transform .9s var(--ease)}
.tcard:hover .tcard-media .art{transform:scale(1.045)}
.tcard-body{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;padding-top:20px}
.tcard.wide .tcard-body{flex-direction:column;align-items:flex-start;justify-content:center;padding:38px 42px}
.tcard-body h3{margin-bottom:8px}
.tcard-body p{margin:0;color:var(--ink-60);font-size:.95rem;line-height:1.7;max-width:46ch}
.tlink{display:inline-flex;align-items:center;gap:12px;background:none;border:0;padding:0;cursor:pointer;color:var(--sage);font:700 .76rem/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
.tlink-sm{font-size:.7rem;margin-top:10px}
.dot-arrow{display:grid;place-items:center;width:42px;height:42px;border:1px solid rgba(77,111,99,.4);border-radius:50%;color:var(--sage);transition:background .3s,color .3s,transform .3s var(--ease)}
.tlink:hover .dot-arrow{background:var(--sage);color:var(--ivory);transform:translateX(4px)}
[dir="rtl"] .tlink:hover .dot-arrow{transform:translateX(-4px)}

/* featured */
.featured{background:var(--sage);color:var(--ivory);padding:120px 0}
.featured-grid{display:grid;grid-template-columns:.92fr 1.08fr;gap:76px;align-items:center}
.featured-media{position:relative}
.featured-frame{position:absolute;inset:26px -22px -22px 26px;border:1px solid var(--line-light);border-radius:999px 999px 20px 20px}
.featured-img{position:relative;aspect-ratio:4/4.6;border-radius:999px 999px 20px 20px;overflow:hidden;box-shadow:0 30px 70px -30px rgba(0,0,0,.45)}
.arch{border-radius:999px 999px 20px 20px}
.featured-copy h2{color:var(--ivory)}
.incl{list-style:none;margin:30px 0 0;padding:0;display:flex;flex-direction:column;gap:14px}
.incl li{display:flex;gap:14px;align-items:flex-start;color:rgba(248,246,240,.88);font-size:.97rem;line-height:1.65}
.incl-ico{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:rgba(248,246,240,.16);color:var(--msage);margin-top:2px}
.featured-note{margin:26px 0 0;font-family:var(--serif);font-style:italic;font-size:1.08rem;color:var(--msage)}
.featured .hero-ctas{margin-top:34px}

/* about */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.about-copy .lead{margin-top:22px}
.signature{margin:34px 0 0;font-style:italic;font-size:1.15rem;color:var(--ink-60)}
.about-copy .tagline{margin-top:26px}
.about-media{position:relative;padding-bottom:90px}
.about-main{position:relative;aspect-ratio:4/4.4;overflow:hidden;box-shadow:var(--shadow)}
.about-detail{position:absolute;left:-46px;bottom:0;width:52%;aspect-ratio:1/1;border:10px solid var(--ivory);border-radius:18px;overflow:hidden;box-shadow:var(--shadow)}

/* experts */
.experts{background:var(--cream)}
.experts-grid{display:flex;justify-content:center;gap:32px;flex-wrap:wrap}
.expert-card{display:grid;grid-template-columns:300px 1fr;max-width:880px;width:100%;background:var(--white);border:1px solid var(--line);border-radius:24px;overflow:hidden}
.expert-photo{position:relative;min-height:340px}
.monogram{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(160deg,var(--msage),var(--sage));color:var(--ivory);font-size:4.4rem;letter-spacing:.02em}
.mono-star{position:absolute;margin:70px 0 0 60px}
.expert-body{padding:42px 44px}
.expert-title{margin:6px 0 14px;font:700 .76rem/1.4 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--sage)}
.chip{display:inline-block;border:1px solid rgba(77,111,99,.4);color:var(--sage);border-radius:999px;padding:.45rem .9rem;font:600 .72rem/1 var(--sans);letter-spacing:.08em}
.expert-bio{margin:18px 0 0;color:var(--ink-60);font-size:.96rem;line-height:1.75}
.expert-note{margin:18px 0 0;font-size:.8rem;font-style:italic;color:var(--ink-50)}

/* gallery */
.ggrid{display:grid;grid-template-columns:repeat(12,1fr);gap:22px}
.gitem{margin:0}
.gitem.g1{grid-column:span 7}.gitem.g2{grid-column:span 5}
.gitem.g3{grid-column:span 5}.gitem.g4{grid-column:span 7}
.gitem.g5{grid-column:span 12}
.gbtn{position:relative;display:block;width:100%;padding:0;border:0;background:none;cursor:pointer;border-radius:18px;overflow:hidden}
.gbtn .art{transition:transform .9s var(--ease)}
.gbtn:hover .art{transform:scale(1.04)}
.gitem.g1 .gbtn,.item.g2 .gbtn{aspect-ratio:16/10}
.gitem.g1 .gbtn{aspect-ratio:16/10}
.gitem.g2 .gbtn{aspect-ratio:4/3.05}
.gitem.g3 .gbtn{aspect-ratio:4/3.2}
.gitem.g4 .gbtn{aspect-ratio:16/9.6}
.gitem.g5 .gbtn{aspect-ratio:21/7.5}
.gcap{position:absolute;inset-inline:0;bottom:0;display:flex;align-items:center;gap:12px;padding:18px 22px;color:var(--ivory);font:600 .8rem/1 var(--sans);letter-spacing:.06em;background:linear-gradient(to top,rgba(37,42,39,.62),rgba(37,42,39,0))}
.gnum{font-family:var(--serif);font-size:1.1rem;opacity:.85}
.gallery-note{margin-top:34px}
.gallery-note p{margin:0;color:var(--ink-50);font-size:.85rem;font-style:italic}

/* lightbox */
.lightbox{position:fixed;inset:0;z-index:90;background:rgba(37,42,39,.94);display:flex;align-items:center;justify-content:center;gap:18px;padding:32px}
.lb-figure{margin:0;width:min(920px,86vw)}
.lb-art{aspect-ratio:16/10;border-radius:16px;overflow:hidden}
.lb-figure figcaption{margin-top:16px;color:var(--ivory);font:600 .9rem/1.4 var(--sans);text-align:center}
.lb-count{color:rgba(248,246,240,.6)}
.lb-close{position:absolute;top:22px;inset-inline-end:26px;background:none;border:0;color:var(--ivory);cursor:pointer;padding:8px}
.lb-nav{background:none;border:1px solid var(--line-light);color:var(--ivory);width:52px;height:52px;border-radius:50%;cursor:pointer;display:grid;place-items:center;flex:none;transition:background .25s}
.lb-nav:hover{background:rgba(248,246,240,.14)}

/* reviews */
.reviews{background:var(--msage)}
.rev-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.rev-card{margin:0;background:var(--white);border-radius:20px;padding:34px 32px;display:flex;flex-direction:column;box-shadow:0 18px 44px -30px rgba(37,42,39,.35)}
.rev-quote{color:var(--sage);opacity:.5;margin-bottom:14px}
.rev-text{font-size:1.22rem;line-height:1.5;font-style:italic;margin:0;flex:1}
.rev-foot{margin-top:24px;display:flex;flex-direction:column;gap:2px}
.rev-foot strong{font:700 .9rem/1.2 var(--sans)}
.rev-foot span{color:var(--ink-50);font-size:.78rem}
.rev-actions{margin-top:40px;display:flex;flex-direction:column;align-items:center;gap:18px}
.rev-note{margin:0;font-size:.82rem;font-style:italic;color:var(--ink-50)}

/* booking */
.booking{background:var(--ivory)}
.booking-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:34px;align-items:stretch}
.booking-panel{background:var(--sage);color:var(--ivory);border-radius:26px;padding:52px 48px;display:flex;flex-direction:column}
.booking-panel h2{color:var(--ivory);margin-top:2px}
.assure{list-style:none;margin:30px 0 0;padding:0;display:flex;flex-direction:column;gap:13px;color:rgba(248,246,240,.88);font-size:.95rem}
.assure li{display:flex;gap:12px;align-items:flex-start}
.assure svg{flex:none;margin-top:3px;color:var(--msage)}
.panel-alt{margin-top:auto;padding-top:38px}
.panel-alt p{margin:0 0 12px;font:700 .72rem/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--msage)}
.panel-alt-row{display:flex;flex-wrap:wrap;gap:22px}
.panel-alt-row a{display:inline-flex;align-items:center;gap:9px;color:var(--ivory);text-decoration:none;font:600 .92rem/1 var(--sans);border-bottom:1px solid var(--line-light);padding-bottom:5px;transition:border-color .25s}
.panel-alt-row a:hover{border-color:var(--ivory)}
.booking-card{background:var(--white);border:1px solid var(--line);border-radius:26px;padding:46px 46px;box-shadow:var(--shadow)}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.field{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
.field label{font:700 .72rem/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60)}
.field input,.field select,.field textarea{width:100%;border:1px solid var(--line);border-radius:12px;background:var(--ivory);padding:.95rem 1.05rem;font:500 .95rem/1.4 var(--sans);color:var(--char);transition:border-color .2s,box-shadow .2s;appearance:none}
.field textarea{resize:vertical;min-height:88px}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--sage);box-shadow:0 0 0 4px rgba(77,111,99,.14)}
.field [aria-invalid="true"]{border-color:#A4553F}
.ferr{margin:0;color:#A4553F;font-size:.8rem;font-weight:600}
.fmicro{margin:14px 0 0;text-align:center;color:var(--ink-50);font-size:.78rem}
.sent-panel{display:flex;flex-direction:column;gap:16px;align-items:flex-start;padding:12px 4px}
.sent-ico{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:var(--msage);color:var(--sage-deep)}
.sent-panel h3{font-size:1.9rem}
.sent-panel p{margin:0;color:var(--ink-60);line-height:1.7}
.sent-actions{display:flex;flex-wrap:wrap;gap:12px}

/* contact */
.contact{background:var(--cream);border-top:1px solid var(--line)}
.contact-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:34px;align-items:stretch}
.contact-cards{display:flex;flex-direction:column;gap:18px}
.ccard{display:flex;gap:18px;background:var(--white);border:1px solid var(--line);border-radius:20px;padding:26px 26px}
.cc-ico{flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--msage);color:var(--sage-deep)}
.ccard h3{margin:0 0 6px;font:700 .95rem/1.3 var(--sans)}
.ccard p{margin:0;color:var(--ink-60);font-size:.94rem;line-height:1.65}
.ccard a{color:var(--sage);text-decoration:none;font-weight:700}
.hours{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;color:var(--ink-60);font-size:.92rem}
.hours li{display:flex;justify-content:space-between;gap:20px}
.contact-map{border-radius:22px;overflow:hidden;border:1px solid var(--line);min-height:380px}
.contact-map iframe{width:100%;height:100%;min-height:380px;border:0;display:block}

/* footer */
.footer{background:var(--char);color:rgba(248,246,240,.78);padding:84px 0 0}
.footer-grid{display:grid;grid-template-columns:1.4fr .8fr .9fr .9fr;gap:48px;padding-bottom:64px}
.logo-light{color:var(--ivory)}
.footer-tag{color:var(--msage);margin-top:18px}
.f-blurb{margin:18px 0 0;font-size:.92rem;line-height:1.75;max-width:34ch}
.f-col h4{margin:0 0 18px;font:700 .72rem/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--msage)}
.f-col{display:flex;flex-direction:column;gap:11px}
.f-col a{color:rgba(248,246,240,.78);text-decoration:none;font-size:.92rem;transition:color .2s}
.f-col a:hover{color:var(--ivory)}
.f-col p{margin:0;font-size:.92rem;line-height:1.7}
.f-social{display:flex;gap:16px;margin-top:6px}
.footer-bar{border-top:1px solid rgba(248,246,240,.14);padding:26px 32px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
.footer-bar p{margin:0;font-size:.82rem;color:rgba(248,246,240,.55)}
.flink{background:none;border:0;padding:0;color:rgba(248,246,240,.7);cursor:pointer;font:600 .82rem/1 var(--sans);text-decoration:underline;text-underline-offset:4px}
.flink:hover{color:var(--ivory)}
.footer-tagline{font-style:italic;font-size:1.05rem;color:var(--msage)}

/* modal */
.modal{position:fixed;inset:0;z-index:95;background:rgba(37,42,39,.55);display:flex;align-items:center;justify-content:center;padding:24px}
.modal-card{position:relative;background:var(--white);border-radius:22px;max-width:580px;width:100%;max-height:82vh;overflow:auto;padding:44px 42px}
.modal-card h3{font-size:1.9rem;margin-bottom:16px}
.modal-card p{color:var(--ink-60);line-height:1.75;font-size:.95rem;margin:0 0 14px}
.modal-close{position:absolute;top:16px;inset-inline-end:16px;color:var(--char);background:none;border:0;cursor:pointer;padding:6px}

/* sticky bar */
.sticky-bar{position:fixed;inset-inline:0;bottom:0;z-index:60;display:none;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(248,246,240,.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid var(--line);transform:translateY(100%);transition:transform .4s var(--ease)}
.sticky-bar.is-show{transform:none}
.sb-call{flex:none;display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid rgba(77,111,99,.4);color:var(--sage);text-decoration:none}
.sb-book{flex:1}

/* responsive */
@media (max-width:1080px){
  .trust-grid{grid-template-columns:repeat(2,1fr)}
  .featured-grid{gap:48px}
  .rev-grid{grid-template-columns:1fr 1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:960px){
  .main-nav{display:none}
  .head-cta{display:none}
  .burger{display:inline-flex}
  .hero{grid-template-columns:1fr;min-height:auto;padding-top:96px}
  .hero-copy-in{padding:24px 24px 8px;margin-inline:auto}
  .hero-media{padding:8px 24px 48px}
  .hero-img{min-height:60vh}
  .hero-frame{left:6px;right:6px;width:auto;top:32px;bottom:64px}
  .hero-badge{left:2px;bottom:64px;width:110px;height:110px}
  .tcard.span7,.tcard.span5{grid-column:span 12}
  .tcard.wide{flex-direction:column}
  .tcard.wide .tcard-media{width:100%;aspect-ratio:16/9}
  .featured-grid,.about-grid,.booking-grid,.contact-grid{grid-template-columns:1fr}
  .about-detail{left:auto;right:-8px}
  .featured-frame{inset:20px -12px -12px 20px}
  .gitem.g1,.gitem.g2,.gitem.g3,.gitem.g4{grid-column:span 12}
  .gitem.g2 .gbtn,.gitem.g3 .gbtn,.gitem.g4 .gbtn{aspect-ratio:16/10}
  .expert-card{grid-template-columns:1fr}
  .expert-photo{min-height:280px}
  .sticky-bar{display:flex}
  .section{padding:80px 0}
  .footer{padding-bottom:76px}
}
@media (max-width:640px){
  .container{padding-inline:20px}
  .trust-grid{grid-template-columns:1fr}
  .rev-grid{grid-template-columns:1fr}
  .frow{grid-template-columns:1fr}
  .booking-panel,.booking-card{padding:34px 26px}
  .footer-grid{grid-template-columns:1fr;gap:36px}
  .footer-bar{flex-direction:column;align-items:flex-start}
  .lb-nav{display:none}
  .hero-copy-in h1 br{display:none}
}
`;
