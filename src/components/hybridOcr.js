/* ═════════════════════════════════════════════════════════════════════════════
   hybridOcr.js — Tiered OCR engine for FlowSuite Capture
   SynerGrowth Consulting

   TIER 1 (FREE, every document): Tesseract.js in-browser OCR
     → zero per-document cost, runs on the user's device
     → strengthened by binarisation preprocessing for low-quality scans
     → generic field parser (regex + positional heuristics)

   TIER 2 (PAID, escalation only): Claude Haiku via /api/claude proxy
     → triggers ONLY when Tier 1 confidence < threshold, math validation
       fails, or key fields are missing
     → ~US$0.005–0.01 per escalated document (Haiku, not Opus)
     → expected escalation rate 5–15% → thousands of docs/day for a few $

   All imports at top (Vite/Rollup requirement).
═════════════════════════════════════════════════════════════════════════════ */
import Tesseract from "tesseract.js";

export const OCR_CONFIG = {
  ESCALATION_THRESHOLD: 90,
  CLAUDE_ENDPOINT: "/api/claude",
  CLAUDE_MODEL: "claude-haiku-4-5-20251001",
  CLAUDE_MODEL_PREMIUM: "claude-opus-4-8",
};

/* ── Quality tiers — maps onto FlowSuite subscription gating (T-tiers) ────
   standard     Free OCR + Haiku only on failures.    ~US$0–3 /2k docs/day
   professional Free OCR + Haiku VERIFIES every doc.  ~US$10–20 /2k docs/day
   premium      Dual-pass Opus on every doc (extract  ~US$200–400 /2k docs/day
                + independent validation) — highest
                confidence; for compliance-grade or
                very poor archives.
   The active tier is a deployment setting (persisted), not user-facing
   per-document choice — making it a clean upsell lever.                   */
export const QUALITY_TIERS = {
  standard: {
    name: "Standard", icon: "🟢",
    blurb: "Free on-device OCR; AI assists only when confidence falls short.",
    cost: "≈ US$0–3 / 2,000 docs/day",
  },
  professional: {
    name: "Professional", icon: "🔵",
    blurb: "Every document AI-verified by Claude Haiku after the free pass.",
    cost: "≈ US$10–20 / 2,000 docs/day",
  },
  premium: {
    name: "Premium", icon: "🟣",
    blurb: "Dual-pass Claude Opus on every page — extraction plus independent validation. Compliance-grade.",
    cost: "≈ US$0.10–0.20 / document",
  },
};
const TIER_KEY = "finflow_capture_quality_tier";
export const getQualityTier = () => {
  try { const t = localStorage.getItem(TIER_KEY); return QUALITY_TIERS[t] ? t : "standard"; }
  catch { return "standard"; }
};
export const setQualityTier = (t) => { try { localStorage.setItem(TIER_KEY, t); } catch {} };

/* ── Preprocessing for low-quality scans ────────────────────────────────────
   greyscale → contrast → OTSU BINARISATION (the big win for poor scans:
   converts smudgy grey text to clean black/white that Tesseract reads well)
   → light sharpen. Returns both binarised (for Tesseract) and enhanced
   greyscale (for Claude escalation — LLMs prefer non-binarised).            */
export function preprocessForOcr(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth, H = img.naturalHeight;
      const scale = Math.min(2, Math.max(1, 1800 / Math.max(W, H))); // upscale small scans
      const w = Math.round(W * scale), h = Math.round(H * scale);
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      const id = ctx.getImageData(0, 0, w, h);
      const d = id.data;

      // greyscale + contrast 1.35
      const cf = 1.35, ci = 128 * (1 - cf);
      const grey = new Uint8ClampedArray(w * h);
      for (let i = 0; i < w * h; i++) {
        const g = 0.299 * d[i*4] + 0.587 * d[i*4+1] + 0.114 * d[i*4+2];
        grey[i] = Math.min(255, Math.max(0, cf * g + ci));
      }

      // Enhanced greyscale version (for Claude escalation)
      for (let i = 0; i < w * h; i++) d[i*4] = d[i*4+1] = d[i*4+2] = grey[i];
      ctx.putImageData(id, 0, 0);
      const greyUrl = cv.toDataURL("image/png");

      // Otsu threshold → binarised version (for Tesseract)
      const hist = new Array(256).fill(0);
      for (let i = 0; i < w * h; i++) hist[grey[i]]++;
      const total = w * h;
      let sum = 0; for (let t = 0; t < 256; t++) sum += t * hist[t];
      let sumB = 0, wB = 0, maxVar = 0, thresh = 127;
      for (let t = 0; t < 256; t++) {
        wB += hist[t]; if (wB === 0) continue;
        const wF = total - wB; if (wF === 0) break;
        sumB += t * hist[t];
        const mB = sumB / wB, mF = (sum - sumB) / wF;
        const v = wB * wF * (mB - mF) * (mB - mF);
        if (v > maxVar) { maxVar = v; thresh = t; }
      }
      for (let i = 0; i < w * h; i++) {
        const v = grey[i] > thresh ? 255 : 0;
        d[i*4] = d[i*4+1] = d[i*4+2] = v;
      }
      ctx.putImageData(id, 0, 0);
      const binUrl = cv.toDataURL("image/png");

      resolve({ binUrl, greyUrl, greyB64: greyUrl.split(",")[1] });
    };
    img.src = dataUrl;
  });
}

/* ── Tier 1: Tesseract recognition ──────────────────────────────────────── */
let _worker = null;
async function getWorker(onProgress) {
  if (_worker) return _worker;
  _worker = await Tesseract.createWorker("eng", 1, {
    logger: m => { if (m.status === "recognizing text" && onProgress) onProgress(m.progress); },
  });
  return _worker;
}

export async function tesseractPass(binUrl, onProgress) {
  const worker = await getWorker(onProgress);
  const { data } = await worker.recognize(binUrl);
  // mean word confidence, ignoring junk single chars
  const words = (data.words || []).filter(w => w.text.trim().length > 1);
  const meanConf = words.length
    ? Math.round(words.reduce((s, w) => s + w.confidence, 0) / words.length)
    : 0;
  return { text: data.text || "", meanConf, wordCount: words.length };
}

/* ── Generic field parser over raw OCR text ─────────────────────────────── */
export function parseFields(text) {
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const joined = " " + text.replace(/\n/g, " \n ") + " ";

  const find = (re) => { const m = joined.match(re); return m ? m[1].trim() : null; };

  const docNumber =
    find(/(?:invoice|inv|bill|tax invoice)\s*(?:no|number|#)?\s*[:.#]?\s*([A-Z0-9][A-Z0-9\/\-]{3,20})/i) ||
    find(/(?:do|delivery order)\s*(?:no|number|#)?\s*[:.#]?\s*([A-Z0-9][A-Z0-9\/\-]{3,20})/i) ||
    find(/\b(INV[-\/ ]?[0-9]{3,12})\b/i);

  const dateRe = /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i;
  const dateM = joined.match(new RegExp(`(?:date|dated)\\s*[:.]?\\s*${dateRe.source}`, "i"));
  const date = dateM ? dateM[1] : (joined.match(dateRe)?.[1] ?? null);

  const dueM = joined.match(new RegExp(`(?:due date|payment due)\\s*[:.]?\\s*${dateRe.source}`, "i"));
  const dueDate = dueM ? dueM[1] : null;

  const poReference = find(/\b(?:po|p\.o\.|purchase order)\s*(?:no|number|#)?\s*[:.#]?\s*([A-Z0-9][A-Z0-9\/\-]{2,20})\b/i);
  const currency = find(/\b(MYR|RM|SGD|USD|S\$|US\$|PHP|EUR|IDR|THB|VND)\b/i);

  // amounts: number with optional thousands sep + 2dp
  const amtRe = /(?:RM|MYR|SGD|S\$|USD|US\$|PHP|\$)?\s*([0-9]{1,3}(?:[, ][0-9]{3})*(?:\.[0-9]{2}))\b/g;
  const labelled = (label) => {
    const re = new RegExp(`${label}[^0-9\\n]{0,24}([0-9]{1,3}(?:[, ][0-9]{3})*\\.[0-9]{2})`, "i");
    const m = joined.match(re);
    return m ? m[1].replace(/ /g, "") : null;
  };
  const total = labelled("(?:grand\\s+)?(?<![a-z])total(?:\\s+(?:due|amount|payable))?") || labelled("amount\\s+due");
  const subtotal = labelled("sub\\s*-?\\s*total");
  const tax = labelled("(?:gst|sst|vat|tax)(?:\\s*\\(?\\d+%?\\)?)?");

  // vendor: first non-numeric prominent line
  const vendorName = lines.find(l =>
    l.length > 3 && l.length < 60 &&
    !/invoice|delivery|receipt|page|date|total/i.test(l) &&
    /[A-Za-z]/.test(l) && !/^\d/.test(l)) || null;

  // line items: rows ending in qty/price/amount pattern
  const lineItems = [];
  for (const l of lines) {
    const m = l.match(/^(.{4,60}?)\s+(\d{1,5})\s+([0-9,]+\.\d{2})\s+([0-9,]+\.\d{2})\s*$/);
    if (m) lineItems.push({ description: m[1].trim(), qty: m[2], uom: null, unitPrice: m[3], amount: m[4] });
  }

  const unclearCount = (text.match(/[�]|\b[a-z]{1}\d[a-z]\b/gi) || []).length;

  return {
    docType: /delivery\s+order|d\.?o\.?\s*(?:no|number)/i.test(joined) ? "delivery_order"
      : /invoice/i.test(joined) ? "invoice"
      : /receipt/i.test(joined) ? "receipt"
      : /registration/i.test(joined) ? "business_registration"
      : "other",
    quality: null, hasHandwriting: false,
    vendor: { name: vendorName, address: null, regNo: find(/\b(?:reg(?:istration)?\.?\s*no\.?\s*[:.]?\s*)([0-9A-Z\-]{6,20})\b/i),
      taxId: find(/\b(?:tax\s*(?:id|no)|gst\s*no)\s*[:.]?\s*([0-9A-Z\-]{6,20})\b/i),
      bankAccount: find(/\b(?:a\/c|account)\s*(?:no)?\s*[:.]?\s*([0-9\-]{8,20})\b/i), contact: null },
    docFields: { docNumber, date, dueDate, poReference, currency, paymentTerms:
      find(/\b(?:terms?)\s*[:.]?\s*((?:net\s*)?\d{1,3}\s*days?|cod|cash)/i) },
    lineItems, subtotal, tax, total,
    rawText: text, unclearCount,
    layoutNotes: null,
  };
}

/* ── Tier 1 confidence score ────────────────────────────────────────────────
   Blend of: Tesseract mean word confidence (60%), key-field completeness
   (25%), math validation (15% — and a hard cap on failure, applied by
   caller). Tuned so clean scans of standard docs clear 90.                  */
export function scoreTier1(meanConf, fields, mathAllPass) {
  const keyFields = [fields.docFields?.docNumber, fields.docFields?.date,
    fields.total ?? fields.vendor?.name];
  const completeness = keyFields.filter(Boolean).length / keyFields.length;
  let s = 0.6 * meanConf + 25 * completeness +
    (mathAllPass === true ? 15 : mathAllPass === null ? 8 : 0);
  return Math.round(Math.min(99, s));
}

/* ── Tier 2: Claude Haiku escalation ────────────────────────────────────── */
export async function claudeEscalation(greyB64, tier1Fields, docHint, premium = false) {
  const prompt = `You are FlowSuite Capture's escalation engine. A free OCR pass on this LOW-QUALITY scanned document produced uncertain results. Extract all fields precisely from the image; the draft below may contain errors — trust the image.
${docHint ? `EXPECTED DOCUMENT: ${docHint}` : ""}
DRAFT (may be wrong): ${JSON.stringify({ ...tier1Fields, rawText: undefined })}
Use [UNCLEAR] only for genuinely illegible regions. Return ONLY valid JSON with the same schema as the draft, plus "rawText" and "unclearCount".`;

  const res = await fetch(OCR_CONFIG.CLAUDE_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: premium ? OCR_CONFIG.CLAUDE_MODEL_PREMIUM : OCR_CONFIG.CLAUDE_MODEL,
      max_tokens: 3000,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: "image/png", data: greyB64 } },
        { type: "text", text: prompt }
      ]}],
    }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${res.status}`); }
  const data = await res.json();
  const text = (data.content?.find(b => b.type === "text")?.text || "{}").replace(/```json\n?|```/g, "").trim();
  try { return JSON.parse(text); }
  catch { const m = text.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : null; }
}


/* ── Premium tier: full Opus extraction (independent of Tesseract draft) ── */
const PREMIUM_SCHEMA = `{
  "docType": "invoice|delivery_order|packing_list|business_registration|bank_letter|vendor_form|receipt|asset_tag|purchase_record|contract|letter|report|form|other",
  "quality": "good|fair|poor", "hasHandwriting": false,
  "vendor": { "name": null, "address": null, "regNo": null, "taxId": null, "bankAccount": null, "contact": null },
  "docFields": { "docNumber": null, "date": null, "dueDate": null, "poReference": null, "currency": null, "paymentTerms": null },
  "lineItems": [{ "description": "", "qty": "", "uom": null, "unitPrice": "", "amount": "" }],
  "subtotal": null, "tax": null, "total": null,
  "rawText": "", "unclearCount": 0, "layoutNotes": ""
}`;

async function callClaudeJson(model, content, maxTokens) {
  const res = await fetch(OCR_CONFIG.CLAUDE_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "user", content }] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${res.status}`); }
  const data = await res.json();
  const text = (data.content?.find(b => b.type === "text")?.text || "{}").replace(/```json\n?|```/g, "").trim();
  try { return JSON.parse(text); }
  catch { const m = text.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : null; }
}

export async function premiumExtraction(greyB64, docHint, tplHint) {
  const prompt = `You are FlowSuite Capture Premium — an expert finance-document digitisation engine. Analyse this document image with maximum precision (may be a low-quality scan; perspective-corrected).
${docHint ? `EXPECTED DOCUMENT: ${docHint}` : ""}
${tplHint ? `VENDOR LAYOUT HINT: ${tplHint}` : ""}
Extract EVERY visible element exactly. Use [UNCLEAR] only for genuinely illegible regions; never guess.
Return ONLY valid JSON in this schema:
${PREMIUM_SCHEMA}`;
  return callClaudeJson(OCR_CONFIG.CLAUDE_MODEL_PREMIUM, [
    { type: "image", source: { type: "base64", media_type: "image/png", data: greyB64 } },
    { type: "text", text: prompt },
  ], 4096);
}

export async function premiumValidation(greyB64, extraction) {
  const prompt = `Strict QA validator: compare this extraction against the original image. Score 0-100 per group; penalise [UNCLEAR], wrong digits, transposed numbers, missing items. 90+ means you are highly confident the extraction matches the image exactly.
EXTRACTION:
${JSON.stringify({ ...extraction, rawText: (extraction.rawText || "").slice(0, 1500) })}
Return ONLY valid JSON:
{"overallConfidence":0,"fieldScores":{"vendor":0,"docFields":0,"lineItems":0,"totals":0},"issues":[{"field":"","issue":"","severity":"critical|warning|info"}],"validatorNotes":""}`;
  return callClaudeJson(OCR_CONFIG.CLAUDE_MODEL_PREMIUM, [
    { type: "image", source: { type: "base64", media_type: "image/png", data: greyB64 } },
    { type: "text", text: prompt },
  ], 1500);
}
