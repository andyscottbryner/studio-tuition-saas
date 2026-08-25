export const NUM_STUDENTS = 5;
export const SLOTS_PER_STUDENT = 5;
export const PRORATE = { 0: 0, 1: 0.25, 2: 0.5, 3: 0.75, 4: 1, 5: 1 };

export function freshStudents() {
  const arr = [];
  for (let s = 0; s < NUM_STUDENTS; s++) {
    const rows = [];
    for (let r = 0; r < SLOTS_PER_STUDENT; r++) rows.push({ className: '', remaining: 0 });
    arr.push({ rows });
  }
  return arr;
}

export function fmt(n) {
  if (!isFinite(n)) n = 0;
  const neg = n < -0.004;
  n = Math.abs(n);
  const s = n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (neg ? '-$' : '$') + s;
}

function classPrice(config, name) {
  const c = config.classes.find((c) => c.name === name);
  return c ? Number(c.price) || 0 : 0;
}

function multiMultiplier(config, slotIndex) {
  if (slotIndex === 0) return 1;
  const v = Number(config.multi[slotIndex - 1]);
  return (isFinite(v) ? v : 100) / 100;
}

function siblingMultiplier(config, studentIndex) {
  if (studentIndex === 0) return 1;
  const v = Number(config.sibling[studentIndex - 1]);
  return (isFinite(v) ? v : 100) / 100;
}

export function computeStudent(config, students, studentIndex) {
  const st = students[studentIndex];
  const rows = st.rows.map((row, slotIndex) => {
    const price = row.className ? classPrice(config, row.className) : 0;
    const tuition = price * multiMultiplier(config, slotIndex);
    const factor = PRORATE[row.remaining] ?? 0;
    const prorated = tuition * factor;
    return { className: row.className, remaining: row.remaining, tuition, prorated };
  });
  const sib = siblingMultiplier(config, studentIndex);
  const rawRecurringSum = rows.reduce((a, r) => a + r.tuition, 0);
  const recurring = rawRecurringSum * sib;
  const hasFirstClass = !!rows[0].className && rows[0].tuition > 0;
  const regFee = hasFirstClass ? Number(config.reg_fee[studentIndex]) || 0 : 0;
  const proratedSum = rows.reduce((a, r) => a + r.prorated, 0);
  const firstMonthTotal = (proratedSum + regFee) * sib;
  const active = rows.some((r) => r.className);
  return { rows, recurring, regFee, firstMonthTotal, sib, active };
}

export function grandTotals(config, students) {
  let firstMonth = 0;
  let recurring = 0;
  for (let s = 0; s < NUM_STUDENTS; s++) {
    const c = computeStudent(config, students, s);
    firstMonth += c.firstMonthTotal;
    recurring += c.recurring;
  }
  return { firstMonth, recurring };
}
