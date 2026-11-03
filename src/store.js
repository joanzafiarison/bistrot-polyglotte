// État de l'app, sauvegardé sur le téléphone (AsyncStorage).
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_DISHES, CATS, CAT_ORDER, LANGS } from './data';

const KEY = 'bistrot-polyglotte-v1';

export const DEFAULT_STATE = {
  lang: 'ru',
  menu: {
    E: ['potage', 'taboule', 'oeuf-mayo'],
    P: ['quiche-lorraine', 'filet-merlu', 'boulettes-boeuf'],
    G: ['puree', 'riz-nature', 'haricots-verts'],
    C: ['camembert', 'yaourt-nature'],
    D: ['compote-pommes', 'flan', 'fruit'],
    price: 24,
  },
  pick: {},
  dishes: null,
  seen: [],
  slow: false,
  showFr: true,
  dlg: 0,
  exSource: 'seen',
  exMode: 'choice',
  libCat: 'all',
};

/** Nettoie un état sauvegardé (anciennes versions, plats supprimés…). */
export function migrate(raw) {
  const st = { ...DEFAULT_STATE, ...(raw || {}) };
  if (!Array.isArray(st.dishes)) st.dishes = DEFAULT_DISHES.map((d) => ({ ...d }));
  st.dishes = st.dishes.filter((d) => d && d.id && d.fr).map((d) => ({ ...d, cat: d.cat === 'F' || d.cat === 'L' ? 'G' : d.cat })).filter((d) => CATS[d.cat]);
  const ids = new Set(st.dishes.map((d) => d.id));
  const m = { ...(st.menu || {}) };
  const pick = { ...(st.pick || {}) };
  CAT_ORDER.forEach((c) => {
    const list = Array.isArray(m[c]) ? m[c] : m[c] ? [m[c]] : [];
    m[c] = [...new Set(list)].filter((id) => ids.has(id) && st.dishes.find((d) => d.id === id).cat === c);
    if (pick[c] && !m[c].includes(pick[c])) delete pick[c];
  });
  if (!(Number(m.price) > 0)) m.price = 24;
  st.menu = m; st.pick = pick;
  if (!LANGS[st.lang]) st.lang = 'ru';
  if (!Array.isArray(st.seen)) st.seen = [];
  return st;
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => migrate(null));
  const [ready, setReady] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((s) => { if (s) setState(migrate(JSON.parse(s))); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {}); }, 400);
  }, [state, ready]);

  /** update(fn) : fn reçoit une copie modifiable de l'état. */
  const update = useCallback((fn) => {
    setState((prev) => {
      const next = { ...prev, menu: { ...prev.menu }, pick: { ...prev.pick }, dishes: [...prev.dishes], seen: [...prev.seen] };
      CAT_ORDER.forEach((c) => { next.menu[c] = [...(prev.menu[c] || [])]; });
      fn(next);
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ state, update, ready }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

/* Actions sur le menu */
export function addToMenu(st, d) { const l = st.menu[d.cat]; if (!l.includes(d.id)) l.push(d.id); if (!st.pick[d.cat]) st.pick[d.cat] = d.id; }
export function removeFromMenu(st, d) { st.menu[d.cat] = st.menu[d.cat].filter((id) => id !== d.id); if (st.pick[d.cat] === d.id) delete st.pick[d.cat]; }
