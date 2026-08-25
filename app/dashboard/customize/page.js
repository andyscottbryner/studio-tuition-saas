'use client';

import { useState, useEffect } from 'react';
import { useGym } from '../../../lib/GymContext';

export default function CustomizePage() {
  const { gym, config, saveConfig, saveGymInfo } = useGym();
  const [local, setLocal] = useState(config);
  const [gymFields, setGymFields] = useState({ name: '', phone: '', address: '', email: '' });
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => { setLocal(config); }, [config]);
  useEffect(() => {
    if (gym) setGymFields({ name: gym.name || '', phone: gym.phone || '', address: gym.address || '', email: gym.email || '' });
  }, [gym]);

  function flashSaved() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  function commit(next) {
    setLocal(next);
    saveConfig(next);
    flashSaved();
  }

  function updateClass(idx, field, value) {
    const classes = local.classes.map((c, i) => (i === idx ? { ...c, [field]: field === 'price' ? Number(value) : value } : c));
    commit({ ...local, classes });
  }
  function addClass() {
    commit({ ...local, classes: [...local.classes, { name: '', price: 0 }] });
  }
  function removeClass(idx) {
    commit({ ...local, classes: local.classes.filter((_, i) => i !== idx) });
  }
  function updateArrayField(field, idx, value) {
    const arr = [...local[field]];
    arr[idx] = Number(value);
    commit({ ...local, [field]: arr });
  }

  async function handleGymFieldBlur() {
    await saveGymInfo(gymFields);
    flashSaved();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: 'var(--teal-deep)', fontFamily: 'Roboto Mono, monospace', opacity: savedFlash ? 1 : 0, transition: 'opacity 0.3s' }}>
          ● Saved
        </div>
      </div>

      <div className="card">
        <div className="card-title"><h2>Gym / Club Details</h2></div>
        <div className="grid grid-2">
          <div>
            <label className="field-label">Gym / Club Name</label>
            <input type="text" value={gymFields.name} onChange={(e) => setGymFields({ ...gymFields, name: e.target.value })} onBlur={handleGymFieldBlur} />
          </div>
          <div>
            <label className="field-label">Phone</label>
            <input type="tel" value={gymFields.phone} onChange={(e) => setGymFields({ ...gymFields, phone: e.target.value })} onBlur={handleGymFieldBlur} />
          </div>
          <div>
            <label className="field-label">Address</label>
            <input type="text" value={gymFields.address} onChange={(e) => setGymFields({ ...gymFields, address: e.target.value })} onBlur={handleGymFieldBlur} />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" value={gymFields.email} onChange={(e) => setGymFields({ ...gymFields, email: e.target.value })} onBlur={handleGymFieldBlur} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><h2>Step 1 — Classes &amp; Pricing</h2></div>
        {local.classes.map((c, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 34px', gap: 10, marginBottom: 8 }}>
            <input type="text" value={c.name} placeholder="e.g. Tumbling" onChange={(e) => updateClass(idx, 'name', e.target.value)} />
            <input type="number" value={c.price} min="0" onChange={(e) => updateClass(idx, 'price', e.target.value)} />
            <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={() => removeClass(idx)}>✕</button>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={addClass}>+ Add Class</button>
      </div>

      <div className="card">
        <div className="card-title"><h2>Step 2 — Multi-Class Discount (% paid)</h2></div>
        <div className="grid grid-4">
          {['2nd', '3rd', '4th', '5th'].map((label, i) => (
            <div key={label}>
              <label className="field-label">{label} Class</label>
              <input type="number" min="0" max="100" value={local.multi[i]} onChange={(e) => updateArrayField('multi', i, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><h2>Step 3 — Sibling Discount (% paid)</h2></div>
        <div className="grid grid-4">
          {['2nd', '3rd', '4th', '5th'].map((label, i) => (
            <div key={label}>
              <label className="field-label">{label} Sibling</label>
              <input type="number" min="0" max="100" value={local.sibling[i]} onChange={(e) => updateArrayField('sibling', i, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><h2>Step 4 — Annual Registration Fee</h2></div>
        <div className="grid grid-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i}>
              <label className="field-label">Student {i + 1}</label>
              <input type="number" min="0" value={local.reg_fee[i]} onChange={(e) => updateArrayField('reg_fee', i, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
