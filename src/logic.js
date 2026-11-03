// Logique partagée : prononciation, menu, remplissage des dialogues, exercices.
import { LANGS, ORDER, CATS, CAT_ORDER, SLOT_LABEL, PHRASE_CATS, DEFAULT_DISHES, DIALOGUES } from './data';

export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
export const rand = (n) => Math.floor(Math.random() * n);
export const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const nfd = (s) => { try { return s.normalize('NFD'); } catch (e) { return s; } };
export const norm = (s) => nfd(String(s).toLowerCase().replace(/ё/g, 'е')).replace(/[̀-ͯ]/g, '')
  .replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

const TR={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:"'",э:'e',ю:'yu',я:'ya'};
export function translit(s){let o='';for(const ch of s){const lo=ch.toLowerCase();if(TR[lo]!==undefined){const m=TR[lo];o+=(ch!==lo)?cap(m):m}else o+=ch}return o}
/* Prononciation du roumain écrite « à la française » */
const RO_V='aăâeiîou';
export function roPron(s){
  const t=s.toLowerCase().replace(/ş/g,'ș').replace(/ţ/g,'ț');let o='';
  const isL=c=>!!c&&/\p{L}/u.test(c);
  for(let i=0;i<t.length;i++){
    const c=t[i],p=t[i-1]||'',n=t[i+1]||'',n2=t[i+2]||'';
    if(c==='c'||c==='g'){const soft=c==='c'?'tch':'dj';
      if(n==='h'&&(n2==='e'||n2==='i')){o+=c==='c'?'k':'gu';i++}
      else if((n==='e'&&n2==='a')||(n==='i'&&'aou'.includes(n2)&&n2)){o+=soft;i++}
      else if(n==='e'||n==='i')o+=soft;else o+=c==='c'?'k':'g';continue}
    if(c==='ș'){o+='ch';continue}
    if(c==='ț'){o+='ts';continue}
    if(c==='ă'){o+='e';continue}
    if(c==='â'||c==='î'){o+='ı';continue}
    if(c==='u'){o+='ou';continue}
    if(c==='o'&&n==='a'){o+='oua';i++;continue}
    if(c==='e'){o+='é';continue}
    if(c==='s'&&p&&n&&RO_V.includes(p)&&RO_V.includes(n)){o+='ss';continue}
    if(c==='i'&&!isL(n)&&isL(p)&&!RO_V.includes(p)&&isL(t[i-2])){o+="'";continue}
    o+=c}
  return cap(o)}
export function pron(t,lang){return lang==='ru'?translit(t):lang==='ro'?roPron(t):''}

/* ---------- Plats et menu ---------- */
export const allDishes = (st) => st.dishes || DEFAULT_DISHES;
export const dishById = (st, id) => allDishes(st).find((d) => d.id === id);
export const dishName = (d, lang) => (d && d[lang] && String(d[lang]).trim()) || (d ? d.fr : '');
export const menuList = (st, cat) => (st.menu[cat] || []).map((id) => dishById(st, id)).filter(Boolean);
export const inMenu = (st, d) => (st.menu[d.cat] || []).includes(d.id);
export function menuDish(st, cat) { const l = menuList(st, cat); return l.find((d) => d.id === st.pick[cat]) || l[0] || null; }
export function slotDish(st, k) {
  if (k === 'H') { const l = menuList(st, 'G'), g = menuDish(st, 'G'); return l.find((d) => d !== g) || null; }
  return CATS[k] ? menuDish(st, k) : undefined;
}
export const missingSlots = (st, ln) => Object.keys(SLOT_LABEL).filter((k) => ln.fr.includes('{' + k + '}') && !slotDish(st, k));
export const lineVisible = (st, ln) => !missingSlots(st, ln).length;

export function money(n, lang) {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', lang === 'en' ? '.' : ',');
  if (lang === 'ru') return s + ' евро';
  if (lang === 'it') return s + ' euro';
  if (lang === 'ro') { const r = Math.round(n) % 100; return s + ((Number.isInteger(n) && (r >= 20 || (r === 0 && n > 0))) ? ' de euro' : ' euro'); }
  return s + ' euros';
}
function val(st, k, lang) {
  if (SLOT_LABEL[k]) return dishName(slotDish(st, k), lang);
  const p = Number(st.menu.price) || 0;
  if (k === 'PXE') return money(p, lang);
  if (k === 'TOTE') return money(Math.round((p * 2 + 5) * 100) / 100, lang);
  return k;
}
/** Découpe une réplique en segments : [{text, dish}] (dish = plat du menu à mettre en valeur). */
export function fillParts(st, tpl, lang) {
  return tpl.split(/(\{[A-Z]+\})/).filter((p) => p !== '').map((p) => {
    const m = p.match(/^\{([A-Z]+)\}$/);
    if (!m) return { text: p, dish: false };
    return { text: val(st, m[1], lang), dish: !!SLOT_LABEL[m[1]] };
  });
}
export const fill = (st, tpl, lang) => fillParts(st, tpl, lang).map((p) => p.text).join('');

/* ---------- Phrases & mots ---------- */
export function buildItems(st) {
  const items = [];
  PHRASE_CATS.forEach((c) => c.items.forEach((it, i) => items.push({ ...it, key: c.id + '-' + i, group: c.id })));
  allDishes(st).forEach((d) => { const o = { key: 'dish-' + d.id, group: 'dish-' + d.cat, fr: d.fr }; ORDER.forEach((l) => (o[l] = dishName(d, l))); items.push(o); });
  return items;
}
export const txt = (it, lang) => it[lang] || it.fr;
export const seenKey = (lang, key) => lang + '|' + key;

/* ---------- Exercices ---------- */
const WORD_RE = /^([^\p{L}\p{N}]*)([\p{L}\p{N}][\p{L}\p{N}'’\-]*)([^\p{L}\p{N}]*)$/u;
function wordBank(st, lang) { const set = new Map(); buildItems(st).forEach((it) => txt(it, lang).split(/\s+/).forEach((tok) => { const m = tok.match(WORD_RE); if (m && m[2].length >= 3) set.set(norm(m[2]), m[2]); })); return [...set.values()]; }
function matchCase(w, ref) { const up = ref.charAt(0) !== ref.charAt(0).toLowerCase(); return up ? cap(w) : w.charAt(0).toLowerCase() + w.slice(1); }
function distractWords(st, answer, lang) {
  const a = norm(answer);
  const bank = shuffle(wordBank(st, lang).filter((w) => norm(w) !== a));
  bank.sort((x, y) => Math.abs(x.length - answer.length) - Math.abs(y.length - answer.length) + (Math.random() - 0.5) * 4);
  const out = []; for (const w of bank) { const c = matchCase(w, answer); if (!out.some((o) => norm(o) === norm(c))) out.push(c); if (out.length === 3) break; }
  return out;
}
function gapQuestion(st, it, lang) {
  const t = txt(it, lang); const toks = t.split(/(\s+)/); const cands = [];
  toks.forEach((tok, i) => { const m = tok.match(WORD_RE); if (m && m[2].length >= 3) cands.push([i, m]); });
  if (!cands.length) return null;
  const [i, m] = cands[rand(cands.length)];
  const before = toks.slice(0, i).join('') + m[1], after = m[3] + toks.slice(i + 1).join(''), answer = m[2];
  return { key: it.key, before, after, answer, choices: shuffle([answer, ...distractWords(st, answer, lang)]), fr: it.fr, full: t, kind: 'gap' };
}
function wordQuestion(st, it, lang) {
  const answer = txt(it, lang), items = buildItems(st);
  let pool = items.filter((o) => o.group === it.group && norm(txt(o, lang)) !== norm(answer));
  if (pool.length < 3) pool = pool.concat(items.filter((o) => o.group !== it.group && txt(o, lang).split(/\s+/).length <= 3));
  const d = []; for (const o of shuffle(pool)) { const w = txt(o, lang); if (!d.some((x) => norm(x) === norm(w)) && norm(w) !== norm(answer)) d.push(w); if (d.length === 3) break; }
  const fr = it.n !== undefined && it.n !== null && it.n !== '€' ? `${it.fr} (${it.n})` : it.fr;
  return { key: it.key, before: '', after: '', answer, choices: shuffle([answer, ...d]), fr, full: answer, kind: 'word' };
}
function menuQuestion(st, lang) {
  const opts = [];
  DIALOGUES.forEach((dl) => dl.lines.forEach((ln) => { if (!lineVisible(st, ln)) return; const re = /\{([EPGCD])\}/g; let m; while ((m = re.exec(ln[lang]))) opts.push({ ln, idx: m.index, cat: m[1] }); }));
  if (!opts.length) return null;
  const o = opts[rand(opts.length)]; const tpl = o.ln[lang];
  const before = fill(st, tpl.slice(0, o.idx), lang), after = fill(st, tpl.slice(o.idx + 3), lang);
  const pool = menuList(st, o.cat); const ansDish = pool[rand(pool.length)]; const answer = dishName(ansDish, lang);
  const others = shuffle(allDishes(st).filter((d) => d.cat === o.cat && norm(dishName(d, lang)) !== norm(answer)));
  const d = []; for (const x of others) { const w = dishName(x, lang); if (!d.some((y) => norm(y) === norm(w))) d.push(w); if (d.length === 3) break; }
  const frTpl = o.ln.fr, fi = frTpl.indexOf('{' + o.cat + '}');
  const fr = fi < 0 ? fill(st, frTpl, 'fr') : fill(st, frTpl.slice(0, fi), 'fr') + ansDish.fr + fill(st, frTpl.slice(fi + 3), 'fr');
  return { key: 'menu-' + o.cat + o.idx + answer, before, after, answer, choices: shuffle([answer, ...d]), fr, full: before + answer + after, kind: 'menu', cat: o.cat };
}
export function newQuestion(st, source, seen, prevKey) {
  const lang = st.lang;
  if (source === 'menu') return menuQuestion(st, lang);
  const items = buildItems(st);
  const pool = source === 'all' ? items : items.filter((i) => seen.has(seenKey(lang, i.key)));
  if (pool.length < 3) return null;
  let it; for (let k = 0; k < 12; k++) { it = pool[rand(pool.length)]; if (it.key !== prevKey) break; }
  const words = txt(it, lang).split(/\s+/).length;
  const gap = words >= 2 && it.group !== 'num' && !it.group.startsWith('dish-') && it.group !== 'voc';
  return (gap ? gapQuestion(st, it, lang) : null) || wordQuestion(st, it, lang);
}

export { LANGS, ORDER, CATS, CAT_ORDER, SLOT_LABEL, PHRASE_CATS, DEFAULT_DISHES, DIALOGUES };
