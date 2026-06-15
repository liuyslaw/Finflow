// BalanceSheet.jsx — Consolidated Balance Sheet with collapsible sections
// Drop into src/modules/ in the FinFlow repo
// Matches screenshot: two-panel layout (Assets | Equity & Liabilities),
// collapsible sections, Net Current Assets callout, balance check warning.

import { useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────
// In production, replace with real data from the store / API.
// Multi-entity rows share the same label (e.g. 3× "Property Plant and Equipment")
// Entity names could be added as a sub-label once data model supports it.

const BS_DATA = {
  year: "FY 2025",
  assets: {
    sections: [
      {
        id: "non_current_assets",
        label: "Non-Current Assets",
        total: 84564000,
        collapsible: true,
        children: [
          { label: "Property Plant and Equipment", value: 3675000 },
          { label: "Property Plant and Equipment", value: 6150000 },
          { label: "Property Plant and Equipment", value: 72000000 },
          { label: "Accumulated Depreciation",     value: 2550000 },
          { label: "Accumulated Depreciation",     value: 135000 },
          { label: "Accumulated Depreciation",     value: 54000 },
        ],
      },
      {
        id: "current_assets",
        label: "Current Assets",
        total: 634521000,
        collapsible: true,
        children: [
          { label: "Cash and Bank - SGD",              value: 12758000 },
          { label: "Cash and Bank - PHP",              value: 412100000 },
          { label: "Cash and Bank - MYR",              value: 24680000 },
          { label: "Cash and Bank - USD",              value: 0 },
          { label: "Cash and Bank - USD",              value: 0 },
          { label: "Cash and Bank - USD",              value: 0 },
          { label: "Accounts Receivable - Trade",      value: 8120000 },
          { label: "Accounts Receivable - Trade",      value: 162200000 },
          { label: "Accounts Receivable - Trade",      value: 12920000 },
          { label: "Accounts Receivable - Intercompany", value: 84000 },
          { label: "Accounts Receivable - Intercompany", value: 0 },
          { label: "Accounts Receivable - Intercompany", value: 1659000 },
          { label: "Prepaid Expenses",                 value: 0 },
          { label: "Prepaid Expenses",                 value: 0 },
          { label: "Prepaid Expenses",                 value: 0 },
        ],
      },
    ],
    total: 719085000,
    totalLabel: "Total Assets",
  },
  equity_liabilities: {
    sections: [
      {
        id: "current_liabilities",
        label: "Current Liabilities",
        total: 212972000,
        collapsible: true,
        children: [
          { label: "Accounts Payable - Trade",        value: 5430000 },
          { label: "Accounts Payable - Trade",        value: 133100000 },
          { label: "Accounts Payable - Trade",        value: 10560000 },
          { label: "Accounts Payable - Intercompany", value: 0 },
          { label: "Accounts Payable - Intercompany", value: 1400000 },
          { label: "Accounts Payable - Intercompany", value: 343000 },
          { label: "Accrued Expenses",                value: 2632000 },
          { label: "Accrued Expenses",                value: 3717000 },
          { label: "Accrued Expenses",                value: 55790000 },
          { label: "Tax Payable",                     value: 0 },
          { label: "Tax Payable",                     value: 0 },
          { label: "Tax Payable",                     value: 0 },
        ],
      },
      {
        id: "non_current_liabilities",
        label: "Non-Current Liabilities",
        total: 36345000,
        collapsible: true,
        children: [],
      },
    ],
    totalLiabilities: 249317000,
    totalLiabilitiesLabel: "Total Liabilities",
    netCurrentAssets: 421549000,
    equity: {
      id: "equity",
      label: "Equity",
      total: 185130000,
      collapsible: true,
      children: [
        { label: "Share Capital",    value: 11250000 },
        { label: "Share Capital",    value: 7350000 },
        { label: "Share Capital",    value: 166500000 },
        { label: "Retained Earnings", value: 0 },
        { label: "Retained Earnings", value: 0 },
        { label: "Retained Earnings", value: 0 },
      ],
    },
    total: 434447000,
    totalLabel: "Total Equity & Liabilities",
    balanced: false, // triggers WARNING badge
  },
};

// ─── Formatter ────────────────────────────────────────────────────────────────
function fmt(val) {
  if (val === 0) return "0";
  return val.toLocaleString("en-US");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionBlock({ section, expanded, onToggle, indent = false }) {
  const isOpen = expanded[section.id];
  return (
    <>
      {/* Section header row */}
      <div
        style={{
          ...styles.sectionRow,
          cursor: section.collapsible ? "pointer" : "default",
        }}
        onClick={section.collapsible ? () => onToggle(section.id) : undefined}
      >
        <div style={styles.sectionLabel}>
          {section.collapsible && (
            <span style={styles.chevron}>{isOpen ? "∨" : "›"}</span>
          )}
          <span style={{ fontWeight: 600 }}>{section.label}</span>
        </div>
        <div style={styles.sectionValue}>{fmt(section.total)}</div>
      </div>

      {/* Child rows */}
      {section.collapsible && isOpen && section.children.map((child, i) => (
        <div key={i} style={styles.childRow}>
          <div style={{ ...styles.childLabel, paddingLeft: indent ? "3rem" : "2.5rem" }}>
            {child.label}
          </div>
          <div style={styles.childValue}>{fmt(child.value)}</div>
        </div>
      ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BalanceSheet() {
  const initExpanded = {};
  BS_DATA.assets.sections.forEach((s) => { if (s.collapsible) initExpanded[s.id] = s.children.length > 0; });
  BS_DATA.equity_liabilities.sections.forEach((s) => { if (s.collapsible) initExpanded[s.id] = s.children.length > 0; });
  if (BS_DATA.equity_liabilities.equity?.collapsible) {
    initExpanded[BS_DATA.equity_liabilities.equity.id] = BS_DATA.equity_liabilities.equity.children.length > 0;
  }

  const [expanded, setExpanded] = useState(initExpanded);
  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const el = BS_DATA.equity_liabilities;
  const isBalanced = el.balanced;

  return (
    <div style={styles.wrapper}>
      {/* Page Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={styles.chartIcon}>↗</span>
          Balance Sheet — {BS_DATA.year}
        </div>
        <div style={styles.headerSub}>
          Consolidated Balance Sheet with collapsible Assets, Liabilities, and Equity sections.
        </div>
      </div>

      {/* Two-panel layout */}
      <div style={styles.panels}>

        {/* ── LEFT: Assets ── */}
        <div style={styles.panel}>
          <div style={styles.panelHeading}>Assets</div>

          <div style={styles.colHeader}>
            <span>DESCRIPTION</span>
            <span>AMOUNT</span>
          </div>

          {BS_DATA.assets.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              expanded={expanded}
              onToggle={toggle}
            />
          ))}

          {/* Total Assets */}
          <div style={styles.grandTotalRow}>
            <span style={{ fontWeight: 700 }}>{BS_DATA.assets.totalLabel}</span>
            <span style={{ fontWeight: 700 }}>{fmt(BS_DATA.assets.total)}</span>
          </div>
        </div>

        {/* ── RIGHT: Equity & Liabilities ── */}
        <div style={{ ...styles.panel, borderLeft: "1px solid #e8e8e8" }}>
          <div style={styles.panelHeading}>Equity &amp; Liabilities</div>

          <div style={styles.colHeader}>
            <span>DESCRIPTION</span>
            <span>AMOUNT</span>
          </div>

          {/* Liabilities sections */}
          {el.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              expanded={expanded}
              onToggle={toggle}
            />
          ))}

          {/* Total Liabilities */}
          <div style={styles.subtotalRow}>
            <span style={{ fontWeight: 700 }}>{el.totalLiabilitiesLabel}</span>
            <span style={{ fontWeight: 700 }}>{fmt(el.totalLiabilities)}</span>
          </div>

          {/* Net Current Assets callout */}
          <div style={styles.netCurrentRow}>
            <span>Net Current Assets</span>
            <span>{fmt(el.netCurrentAssets)}</span>
          </div>

          {/* Equity section */}
          <SectionBlock
            section={el.equity}
            expanded={expanded}
            onToggle={toggle}
          />

          {/* Total Equity & Liabilities */}
          <div style={styles.grandTotalRow}>
            <span style={{ fontWeight: 700 }}>{el.totalLabel}</span>
            <span style={{ fontWeight: 700 }}>{fmt(el.total)}</span>
          </div>

          {/* Balance check warning */}
          {!isBalanced && (
            <div style={styles.warningBadge}>
              ⚠ WARNING: Balance Sheet Not Balanced
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: "13px",
    color: "#1a1a1a",
    background: "#fff",
    minHeight: "100vh",
  },
  header: {
    padding: "1.5rem 1.5rem 0.75rem",
    borderBottom: "1px solid #e8e8e8",
  },
  headerTitle: {
    fontSize: "16px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.25rem",
  },
  chartIcon: {
    fontSize: "14px",
    color: "#B84480",
  },
  headerSub: {
    fontSize: "12px",
    color: "#888",
  },
  panels: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "start",
  },
  panel: {
    padding: "1rem 1.25rem 2rem",
  },
  panelHeading: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "0.75rem",
    paddingBottom: "0.4rem",
    borderBottom: "2px solid #e0e0e0",
  },
  colHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    fontWeight: 600,
    color: "#888",
    letterSpacing: "0.05em",
    padding: "0.4rem 0",
    borderBottom: "1px solid #eee",
    marginBottom: "0.25rem",
  },
  sectionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f0f0f0",
    userSelect: "none",
  },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  sectionValue: {
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  chevron: {
    display: "inline-block",
    width: "1rem",
    color: "#B84480",
    fontWeight: 700,
    fontSize: "14px",
    flexShrink: 0,
  },
  childRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.35rem 0",
    borderBottom: "1px solid #f8f8f8",
    background: "#fdfdfb",
  },
  childLabel: {
    color: "#333",
  },
  childValue: {
    color: "#444",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    paddingRight: "0",
  },
  subtotalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.6rem 0",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
    background: "#f7f7f5",
    marginTop: "0.25rem",
  },
  grandTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.65rem 0",
    borderTop: "2px solid #bbb",
    borderBottom: "2px solid #bbb",
    marginTop: "0.5rem",
    background: "#f0f0ee",
  },
  netCurrentRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    color: "#c47a00",
    fontWeight: 500,
    borderBottom: "1px solid #f0ead0",
    background: "#fffdf0",
    marginTop: "0.25rem",
    marginBottom: "0.25rem",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    borderRadius: "3px",
    fontStyle: "italic",
  },
  warningBadge: {
    marginTop: "1rem",
    display: "inline-block",
    padding: "0.3rem 0.75rem",
    background: "#fff0f0",
    border: "1px solid #f5c6c6",
    borderRadius: "4px",
    color: "#c0392b",
    fontSize: "12px",
    fontWeight: 500,
  },
};
