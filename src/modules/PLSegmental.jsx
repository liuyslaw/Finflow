// PLSegmental.jsx — P&L by Segmental Report with collapsible sections
// Drop into src/modules/ in the FinFlow repo
// Matches the UI in the screenshot: collapsible section headers, indented line items,
// multi-column (ALL / COMMUNICATION / OTHER), GP%, bold subtotals.

import { useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const PL_DATA = {
  year: "FY 2025",
  columns: ["ALL", "COMMUNICATION", "OTHER"],
  sections: [
    {
      id: "revenue",
      label: "Revenue",
      values: [523489000, 16234000, 0],
      collapsible: true,
      children: [
        { label: "Sales Revenue - Domestic",  values: [371910000, 9350000, 0] },
        { label: "Sales Revenue - Export",    values: [150970000, 6800000, 0] },
        { label: "Intercompany Revenue",      values: [609000,    84000,   0] },
      ],
    },
    {
      id: "cos",
      label: "Cost of Sales",
      values: [188260000, 6732000, 0],
      collapsible: true,
      children: [
        { label: "Direct Materials", values: [129860000, 4260000, 0] },
        { label: "Direct Labour",    values: [58400000,  2472000, 0] },
      ],
    },
    {
      id: "gp",
      label: "Gross Profit",
      values: [335229000, 9502000, 0],
      type: "subtotal",
    },
    {
      id: "gp_pct",
      label: "GP %",
      values: [0.64, 0.585, 0],
      type: "metric",
      format: "pct",
    },
    {
      id: "non_op",
      label: "Total Non Operating Income / (Expenses)",
      values: [0, 0, 0],
      collapsible: true,
      children: [],
    },
    {
      id: "dc",
      label: "Total Direct Cost (DC)",
      values: [39592000, 1739500, 0],
      collapsible: true,
      children: [
        { label: "Staff Cost - Direct",   values: [19495000, 847000,  0] },
        { label: "Staff Cost - Indirect", values: [11039000, 500500,  0] },
        { label: "Marketing & Selling",   values: [9058000,  392000,  0] },
        { label: "Travelling Expenses",   values: [0,        0,       0] },
      ],
    },
    {
      id: "sr",
      label: "Total Staff Reward",
      values: [0, 0, 0],
      collapsible: true,
      children: [
        { label: "Manning Cost-Bonus",        values: [0, 0, 0] },
        { label: "Manning Cost-Incentive",    values: [0, 0, 0] },
        { label: "Manning Cost-Staff Reward", values: [0, 0, 0] },
      ],
    },
    {
      id: "idc",
      label: "Total Indirect Cost (IDC)",
      values: [22943000, 1296500, 0],
      collapsible: true,
      children: [
        { label: "General & Admin",               values: [14882000, 1018500, 0] },
        { label: "Financing Expenses",            values: [0,        0,       0] },
        { label: "Share of Corp Manning costs",   values: [0,        0,       0] },
        { label: "Share of Corp Manning costs-Bonus", values: [0,   0,       0] },
        { label: "Depreciation Expense",          values: [8061000,  278000,  0] },
        { label: "Interest Expense",              values: [0,        0,       0] },
      ],
    },
    {
      id: "opex",
      label: "Total Operating Expenses",
      values: [62535000, 3036000, 0],
      type: "subtotal",
    },
    {
      id: "pbt",
      label: "Profit Before Tax",
      values: [272694000, 6466000, 0],
      type: "total",
    },
  ],
};

// ─── Formatters ───────────────────────────────────────────────────────────────
function fmt(val, format = "number") {
  if (format === "pct") {
    if (val === 0) return "0.0%";
    return (val * 100).toFixed(1) + "%";
  }
  if (val === 0) return "0";
  return val.toLocaleString("en-US");
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PLSegmental() {
  // Track which sections are expanded. Default: all expanded except empty ones.
  const initialExpanded = {};
  PL_DATA.sections.forEach((s) => {
    if (s.collapsible) {
      initialExpanded[s.id] = s.children && s.children.length > 0;
    }
  });
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const cols = PL_DATA.columns;

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={styles.chartIcon}>↗</span>
          P&amp;L by Segmental — {PL_DATA.year}
        </div>
        <div style={styles.headerSub}>
          P&L consolidated by business segments across all entities. Expand categories to view detail.
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{ ...styles.th, textAlign: "left", width: "55%" }}>DESCRIPTION</th>
              {cols.map((c) => (
                <th key={c} style={{ ...styles.th, textAlign: "right" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PL_DATA.sections.map((section) => {
              const isExpanded = expanded[section.id];
              const rowType = section.type || (section.collapsible ? "section" : "line");

              return (
                <>
                  {/* Section / subtotal / total / metric row */}
                  <tr
                    key={section.id}
                    style={{
                      ...styles.row,
                      ...(rowType === "subtotal" ? styles.rowSubtotal : {}),
                      ...(rowType === "total" ? styles.rowTotal : {}),
                      ...(rowType === "metric" ? styles.rowMetric : {}),
                      ...(rowType === "section" ? styles.rowSection : {}),
                      cursor: section.collapsible ? "pointer" : "default",
                    }}
                    onClick={section.collapsible ? () => toggle(section.id) : undefined}
                  >
                    <td style={styles.tdLabel}>
                      {section.collapsible && (
                        <span style={styles.chevron}>
                          {isExpanded ? "∨" : "›"}
                        </span>
                      )}
                      <span style={{
                        fontWeight: rowType === "subtotal" || rowType === "total" || rowType === "section" ? 700 : 400,
                        paddingLeft: section.collapsible ? 0 : "1.5rem",
                      }}>
                        {section.label}
                      </span>
                    </td>
                    {section.values.map((v, i) => (
                      <td key={i} style={{
                        ...styles.tdVal,
                        fontWeight: rowType === "subtotal" || rowType === "total" || rowType === "section" ? 700 : 400,
                        color: rowType === "metric" ? "#555" : "inherit",
                        background: rowType === "metric" ? "#fafaf7" : "inherit",
                      }}>
                        {fmt(v, section.format)}
                      </td>
                    ))}
                  </tr>

                  {/* Children rows */}
                  {section.collapsible && isExpanded && section.children.map((child, ci) => (
                    <tr key={`${section.id}-${ci}`} style={{ ...styles.row, ...styles.rowChild }}>
                      <td style={{ ...styles.tdLabel, paddingLeft: "2.5rem" }}>
                        {child.label}
                      </td>
                      {child.values.map((v, i) => (
                        <td key={i} style={{ ...styles.tdVal, color: "#444" }}>
                          {fmt(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
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
    padding: "0",
  },
  header: {
    padding: "1.5rem 1.5rem 0.75rem",
    borderBottom: "1px solid #e8e8e8",
    marginBottom: "0",
  },
  headerTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1a1a1a",
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
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  theadRow: {
    background: "#fafafa",
    borderBottom: "2px solid #e0e0e0",
  },
  th: {
    padding: "0.6rem 1rem",
    fontSize: "11px",
    fontWeight: 600,
    color: "#888",
    letterSpacing: "0.05em",
  },
  row: {
    borderBottom: "1px solid #f0f0f0",
    transition: "background 0.1s",
  },
  rowSection: {
    background: "#ffffff",
  },
  rowChild: {
    background: "#fdfdfb",
  },
  rowSubtotal: {
    background: "#f7f7f5",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
  },
  rowTotal: {
    background: "#f0f0ee",
    borderTop: "2px solid #ccc",
    borderBottom: "2px solid #ccc",
  },
  rowMetric: {
    background: "#fafaf7",
    borderBottom: "1px solid #ebebeb",
  },
  tdLabel: {
    padding: "0.55rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    whiteSpace: "nowrap",
  },
  tdVal: {
    padding: "0.55rem 1rem",
    textAlign: "right",
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
};
