// Applies all fixes to src/App.jsx (v2). Safe to re-run.
// If a backup (App.original.jsx) exists, fixes are applied to that clean copy.
import fs from "node:fs";

const file = process.argv[2] || "src/App.jsx";
if (!fs.existsSync(file)) { console.error(`Not found: ${file}`); process.exit(1); }
const backup = file.replace(/\.jsx$/, ".original.jsx");
let src;
if (fs.existsSync(backup)) {
  src = fs.readFileSync(backup, "utf8");
  console.log("Using App.original.jsx as the clean base.\n");
} else {
  src = fs.readFileSync(file, "utf8");
  fs.writeFileSync(backup, src);
}

const FAB_COMPONENT = [
  "function WhatsAppFab() {",
  "  if (!CONFIG.contact.whatsapp) return null;",
  "  return (",
  '    <a className="wa-fab" href={waLink(`Hello ${CONFIG.brand.name}! I’d like to ask about your treatments.`)} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" onClick={() => track("whatsapp_click", { placement: "floating" })}>',
  "      {I.wa({ width: 26, height: 26 })}",
  "    </a>",
  "  );",
  "}",
  "",
  "export default function App() {",
].join("\n");

const FAB_CSS = [
  ".wa-fab{position:fixed;inset-inline-end:18px;bottom:22px;z-index:55;display:grid;place-items:center;width:54px;height:54px;border-radius:50%;background:#128C7E;color:#fff;box-shadow:0 14px 30px -12px rgba(37,42,39,.55);transition:transform .25s var(--ease)}",
  ".wa-fab:hover{transform:translateY(-3px)}",
  "@media (max-width:960px){.wa-fab{bottom:86px;inset-inline-end:14px}}",
  ".sticky-bar{position:fixed;",
].join("\n");

const SELECT_CSS = [
  ".field textarea{resize:vertical;min-height:88px}",
  `.field select{cursor:pointer;padding-inline-end:2.8rem;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234D6F63' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-size:18px;background-position:calc(100% - 1rem) center}`,
  `[dir="rtl"] .field select{background-position:1rem center}`,
  `.field input[type="date"]{min-height:50px}`,
].join("\n");

const FIRST_INVALID = [
  "if (Object.keys(er).length > 0) {",
  '      const ids = { name: "bk-name", phone: "bk-phone", treatment: "bk-treatment", date: "bk-date" };',
  "      const first = Object.keys(ids).find((k) => er[k]);",
  "      const el = first && document.getElementById(ids[first]);",
  "      if (el) el.focus();",
  "      return;",
  "    }",
].join("\n");

const fixes = [
  // ── Fonts / base ──
  { name: "Fonts: remove broken @import (fonts load from index.html)", find: /@import url\([^)]*\);\s*/g, replace: "" },
  { name: "Layout: stop accidental horizontal scroll on phones", find: "body{margin:0;background:var(--ivory);", replace: "body{margin:0;overflow-x:clip;background:var(--ivory);" },
  { name: "Performance: drop the invisible (5%) SVG grain filter that re-renders on every scroll/hover", find: `const Grain = <rect width="100%" height="100%" filter="url(#global-grain)" style={{ pointerEvents: 'none' }} />;`, replace: "const Grain = null;" },
  { name: "Reveal animation: show content if IntersectionObserver is unavailable", find: 'if (prefersReduced()) { el.classList.add("is-in"); return; }', replace: 'if (prefersReduced() || !("IntersectionObserver" in window)) { el.classList.add("is-in"); return; }' },

  // ── Header / menu ──
  { name: "Menu: Escape closes the mobile menu",
    find: /document\.body\.style\.overflow = open \? "hidden" : "";\s*return \(\) => \{ document\.body\.style\.overflow = ""; \};/,
    replace: 'document.body.style.overflow = open ? "hidden" : "";\n    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };\n    if (open) window.addEventListener("keydown", onKey);\n    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };' },
  { name: "A11y: skip link can receive focus", find: '<main id="main">', replace: '<main id="main" tabIndex={-1}>' },

  // ── Treatments ──
  { name: "A11y: aria-controls only points at an element that exists", find: "aria-controls={safeId}", replace: "aria-controls={isExpanded ? safeId : undefined}" },

  // ── Gallery / lightbox ──
  { name: "Lightbox: focus returns to the thumbnail you opened (was lost after using next/prev)", find: "}, [idx]);", replace: "}, [idx === null]); // eslint-disable-line react-hooks/exhaustive-deps" },
  { name: "Lightbox: mobile arrows overlay the image instead of overflowing",
    find: /\.lb-nav \{ width: 40px; height: 40px; \}\s*\.lb-prev \{ left: 8px; \}\s*\.lb-next \{ right: 8px; \}/,
    replace: ".lightbox{padding:16px}.lb-figure{width:100%}.lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;background:rgba(37,42,39,.55);z-index:2}.lb-prev{inset-inline-start:8px}.lb-next{inset-inline-end:8px}" },
  { name: "Gallery: wide last photo is no longer a thin strip on phones", find: ".gitem.g2 .gbtn,.gitem.g3 .gbtn,.gitem.g4 .gbtn{aspect-ratio:16/10}", replace: ".gitem.g2 .gbtn,.gitem.g3 .gbtn,.gitem.g4 .gbtn,.gitem.g5 .gbtn{aspect-ratio:16/10}" },

  // ── Booking form ──
  { name: "Booking: accept Arabic-Indic digits in the phone field (helper)", find: "const prefersReduced = () =>", replace: 'const toEnglishDigits = (s) => String(s).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));\n\nconst prefersReduced = () =>' },
  { name: "Booking: accept Arabic-Indic digits in the phone field (validation)", find: "/^\\+?[0-9\\s()-]{9,20}$/.test(form.phone.trim())", replace: "/^\\+?[0-9\\s()-]{9,20}$/.test(toEnglishDigits(form.phone.trim()))" },
  { name: "Booking: error banner no longer stays stuck after you fix the fields", find: "const hasErrors = Object.keys(errors).length > 0;", replace: "const hasErrors = Object.values(errors).some(Boolean);" },
  { name: "Booking: focus jumps to the first invalid field", find: "if (Object.keys(er).length > 0) return;", replace: FIRST_INVALID },
  { name: "Booking: scroll back to the confirmation panel after sending", find: 'setStatus("sent");', replace: 'setStatus("sent");\n    setTimeout(() => smoothScrollTo("book"), 60);' },
  { name: "Booking: “Book This Treatment” works even after a request was sent", find: "setForm((f) => ({ ...f, treatment: chosen }));", replace: 'setForm((f) => ({ ...f, treatment: chosen }));\n      setStatus("idle");' },
  { name: "Booking: WhatsApp message includes phone and notes", find: 'Name: ${form.name}\\nTreatment: ${form.treatment}` + (form.date', replace: 'Name: ${form.name}\\nPhone: ${toEnglishDigits(form.phone)}\\nTreatment: ${form.treatment}` + (form.notes.trim() ? `\\nNotes: ${form.notes.trim()}` : "") + (form.date' },
  { name: "Booking: remove dead 'sending' state check", find: ' disabled={status === "sending"}', replace: "" },
  { name: "Booking: dropdown arrow + iOS date field height (CSS)", find: ".field textarea{resize:vertical;min-height:88px}", replace: SELECT_CSS },

  // ── Privacy modal ──
  { name: "Privacy modal: remember the opener (1/2)", find: /document\.body\.style\.overflow = "hidden";\s*ref\.current && ref\.current\.focus\(\);/, replace: 'const prev = document.activeElement;\n    document.body.style.overflow = "hidden";\n    ref.current && ref.current.focus();' },
  { name: "Privacy modal: return focus to the opener on close (2/2)", find: 'return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };', replace: 'return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; if (prev && prev.focus) prev.focus(); };' },

  // ── New: floating WhatsApp button ──
  { name: "Added: floating WhatsApp button (component)", find: "export default function App() {", replace: FAB_COMPONENT },
  { name: "Added: floating WhatsApp button (render)", find: "<StickyBar onBook={goToBooking} />", replace: "<StickyBar onBook={goToBooking} />\n      <WhatsAppFab />" },
  { name: "Added: floating WhatsApp button (CSS)", find: ".sticky-bar{position:fixed;", replace: FAB_CSS },
];

for (const f of fixes) {
  const found = typeof f.find === "string" ? src.includes(f.find) : src.search(f.find) !== -1;
  if (!found) { console.log(`– NOT FOUND (check manually): ${f.name}`); continue; }
  src = typeof f.find === "string" ? src.split(f.find).join(f.replace) : src.replace(f.find, () => f.replace);
  console.log(`✓ ${f.name}`);
}
fs.writeFileSync(file, src);
console.log("\nDone. Clean original kept as App.original.jsx");
