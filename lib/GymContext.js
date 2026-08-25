'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { defaultConfig } from './defaultConfig';
import { freshStudents } from './calc';

const GymContext = createContext(null);

export function useGym() {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error('useGym must be used inside <GymProvider>');
  return ctx;
}

export function GymProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  // Transient — the current quote being built. Not saved to the database,
  // same as "Reset" clearing it between families in the original tool.
  const [students, setStudents] = useState(freshStudents());
  const resetStudents = useCallback(() => setStudents(freshStudents()), []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (!user) {
      setGym(null);
      setLoading(false);
      return;
    }
    const { data: gymRow } = await supabase
      .from('gyms')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle();
    setGym(gymRow || null);

    if (gymRow) {
      const { data: cfgRow } = await supabase
        .from('gym_config')
        .select('*')
        .eq('gym_id', gymRow.id)
        .maybeSingle();
      if (cfgRow) {
        setConfig({
          classes: cfgRow.classes || [],
          multi: cfgRow.multi || [100, 100, 100, 100],
          sibling: cfgRow.sibling || [100, 100, 100, 100],
          reg_fee: cfgRow.reg_fee || [0, 0, 0, 0, 0],
          notes: cfgRow.notes || '',
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveConfig(nextConfig) {
    setConfig(nextConfig);
    if (!gym) return;
    await supabase
      .from('gym_config')
      .update({
        classes: nextConfig.classes,
        multi: nextConfig.multi,
        sibling: nextConfig.sibling,
        reg_fee: nextConfig.reg_fee,
        notes: nextConfig.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('gym_id', gym.id);
  }

  async function saveGymInfo(fields) {
    if (!gym) return;
    const { data } = await supabase
      .from('gyms')
      .update(fields)
      .eq('id', gym.id)
      .select()
      .single();
    if (data) setGym(data);
  }

  const value = { loading, user, gym, config, saveConfig, saveGymInfo, reload: load, students, setStudents, resetStudents };
  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}
