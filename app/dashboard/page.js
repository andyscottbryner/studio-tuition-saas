'use client';

import { useState } from 'react';
import { useGym } from '../../../lib/GymContext';
import { computeStudent, fmt, NUM_STUDENTS } from '../../../lib/calc';

function studentClassSummary(rows) {
  const names = rows.filter((r) => r.className).map((r) => r.className);
  return names.length ? names.join(', ') : '—';
}

export default function InvoicePage() {
  const { gym, config, students } = useGym();
  const [addlFee, setAddlFee] = useState(0);
  const [promo, setPromo] = useState(0);

  const rows = [];
  let subtotal = 0, regTotal = 0, recurringTotal = 0;
  let anyStudent = false;

  for (let s = 0; s < NUM_STUDENTS; s++) {
    const calc = computeStudent(config, students, s);
    if (!calc.active) continue;
    anyStudent = true;
    const proratedNoReg = calc.firstMonthTotal - calc.regFee * calc.sib;
    subtotal += proratedNoReg;
    regTotal += calc.regFee;
    recurringTotal += calc.recurring;
    rows.push({ index: s, summary: studentClassSummary(calc.rows), prorated: proratedNoReg, recurring: calc.recurring });
  }

  const balance = subtotal + regTotal + Number(addlFee || 0) - Number(promo || 0);

  return (
    <div>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn btn-amber" onClick={() => window.print()}>🖨 Print Invoice</button>
      </div>

      <div className="card" style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 28, margin: '0 0 4px' }}>{gym?.name || 'Your Gym Name'}</h2>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              {[gym?.phone, gym?.address, gym?.email].filter(Boolean).join(' · ') || 'Add your details in Customize'}
            </div>
          </div>
          <span className="mark" style={{ background: 'var(--amber)', color: 'var(--ink)', padding: '6px 14px', borderRadius: 3, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, letterSpacing: '0.08em' }}>QUOTE</span>
        </div>

        <div className="grid grid-2 no-print" style={{ marginBottom: 12 }}>
          <div>
            <label className="field-label">Additional Fee</label>
            <input type="number" min="0" value={addlFee} onChange={(e) => setAddlFee(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Other Discounts / Promos</label>
            <input type="number" min="0" value={promo} onChange={(e) => setPromo(e.target.value)} />
          </div>
        </div>

        <h3 style={{ fontSize: 18, margin: '26px 0 4px', paddingBottom: 6, borderBottom: '1px solid var(--line)' }}>Current / First Month's Payment</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 6 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '2px solid var(--ink)', padding: '6px 8px', fontSize: 11 }}>Student</th>
              <th style={{ textAlign: 'left', borderBottom: '2px solid var(--ink)', padding: '6px 8px', fontSize: 11 }}>Class(es)</th>
              <th style={{ textAlign: 'right', borderBottom: '2px solid var(--ink)', padding: '6px 8px', fontSize: 11 }}>Prorated Tuition</th>
            </tr>
          </thead>
          <tbody>
            {!anyStudent && <tr><td colSpan={3} style={{ padding: 8, color: 'var(--ink-soft)' }}>No students selected yet — add classes on the Calculator tab.</td></tr>}
            {rows.map((r) => (
              <tr key={r.index}>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--line)' }}>Student {r.index + 1}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--line)' }}>{r.summary}</td>
                <td className="money-cell num" style={{ borderBottom: '1px solid var(--line)' }}>{fmt(r.prorated)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ padding: '6px 8px', fontWeight: 700, borderTop: '2px solid var(--ink)' }}>Subtotal</td>
              <td className="money-cell num" style={{ fontWeight: 700, borderTop: '2px solid var(--ink)' }}>{fmt(subtotal)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: '6px 8px' }}>Annual Registration Fee (all students)</td>
              <td className="money-cell num">{fmt(regTotal)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: '6px 8px' }}>Additional Fee</td>
              <td className="money-cell num">{fmt(Number(addlFee || 0))}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: '6px 8px' }}>Other Discounts / Promos</td>
              <td className="money-cell num">-{fmt(Number(promo || 0)).replace('-', '')}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: 'var(--paper-dim)', border: '1px solid var(--line)', borderRadius: 6, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 19, textTransform: 'uppercase' }}>Balance Due Today</div>
          <div className="num" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal-deep)' }}>{fmt(balance)}</div>
        </div>

        <h3 style={{ fontSize: 18, margin: '26px 0 4px', paddingBottom: 6, borderBottom: '1px solid var(--line)' }}>Recurring / Typical Monthly Payment</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '2px solid var(--ink)', padding: '6px 8px', fontSize: 11 }}>Student</th>
              <th style={{ textAlign: 'left', borderBottom: '2px solid var(--ink)', padding: '6px 8px', fontSize: 11 }}>Class(es)</th>
              <th style={{ textAlign: 'right', borderBottom: '2px solid var(--ink)', padding: '6px 8px', fontSize: 11 }}>Monthly Tuition</th>
            </tr>
          </thead>
          <tbody>
            {!anyStudent && <tr><td colSpan={3} style={{ padding: 8, color: 'var(--ink-soft)' }}>No students selected yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.index}>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--line)' }}>Student {r.index + 1}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--line)' }}>{r.summary}</td>
                <td className="money-cell num" style={{ borderBottom: '1px solid var(--line)' }}>{fmt(r.recurring)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ padding: '6px 8px', fontWeight: 700, borderTop: '2px solid var(--ink)' }}>Typical Monthly Tuition</td>
              <td className="money-cell num" style={{ fontWeight: 700, borderTop: '2px solid var(--ink)' }}>{fmt(recurringTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
