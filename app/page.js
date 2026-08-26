'use client';

import { useGym } from '../../lib/GymContext';
import { RotateCcw } from 'lucide-react';
import { computeStudent, grandTotals, fmt, NUM_STUDENTS, SLOTS_PER_STUDENT } from '../../lib/calc';

export default function CalculatorPage() {
  const { config, students, setStudents, resetStudents } = useGym();

  function updateRow(studentIndex, rowIndex, field, value) {
    setStudents((prev) => {
      const next = prev.map((s) => ({ rows: s.rows.map((r) => ({ ...r })) }));
      next[studentIndex].rows[rowIndex][field] = field === 'remaining' ? Number(value) : value;
      return next;
    });
  }

  function resetAll() {
    resetStudents();
  }

  const totals = grandTotals(config, students);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
          Quoting a new family? <strong>Reset</strong> clears every student back to default.
        </div>
        <button className="btn btn-danger" onClick={resetAll}><RotateCcw size={15} /> Reset All</button>
      </div>

      {Array.from({ length: NUM_STUDENTS }).map((_, s) => {
        const calc = computeStudent(config, students, s);
        return (
          <div className="student-card" key={s}>
            <div className="student-head">
              <h3>Student {s + 1}</h3>
              <span style={{ fontSize: 12, color: '#C8CDD2', fontFamily: 'Roboto Mono, monospace' }}>
                {s === 0 ? 'no sibling discount' : `sibling discount tier ${s}`}
              </span>
            </div>
            <div style={{ padding: '14px 16px 6px' }}>
              <table className="class-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Tuition / Mo.</th>
                    <th>Classes Left This Month</th>
                    <th>Prorated Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: SLOTS_PER_STUDENT }).map((_, r) => {
                    const row = students[s].rows[r];
                    const c = calc.rows[r];
                    return (
                      <tr key={r}>
                        <td style={{ minWidth: 170 }}>
                          <select value={row.className} onChange={(e) => updateRow(s, r, 'className', e.target.value)}>
                            <option value="">None</option>
                            {config.classes.filter((c) => c.name).map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="money-cell num">{fmt(c.tuition)}</td>
                        <td style={{ width: 150 }}>
                          <select value={row.remaining} onChange={(e) => updateRow(s, r, 'remaining', e.target.value)}>
                            {[0, 1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        <td className="money-cell num">{fmt(c.prorated)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="totals-row">
              <div className="t"><div className="lbl">Registration Fee</div><div className="val num">{fmt(calc.regFee)}</div></div>
              <div className="t"><div className="lbl">Recurring Monthly</div><div className="val num">{fmt(calc.recurring)}</div></div>
              <div className="t"><div className="lbl">First Month Total</div><div className="val num hi">{fmt(calc.firstMonthTotal)}</div></div>
            </div>
          </div>
        );
      })}

      <div className="grand-bar">
        <div className="gcol">
          <div className="glabel">Total First Month Due</div>
          <div className="gval num">{fmt(totals.firstMonth)}</div>
        </div>
        <div className="gcol">
          <div className="glabel">Total Recurring Monthly</div>
          <div className="gval num">{fmt(totals.recurring)}</div>
        </div>
      </div>
    </div>
  );
}
