import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { Chip, Title, Lede } from '../ui';
import VoiceNotice from '../VoiceNotice';
import { speak } from '../speech';
import { LANGS, PHRASE_CATS, CATS, CAT_ORDER, buildItems, txt, seenKey, pron, cap, allDishes } from '../logic';

export default function PhrasesScreen() {
  const t = useTheme();
  const { state, update } = useStore();
  const lang = state.lang;
  const [section, setSection] = useState('pol');
  const [speaking, setSpeaking] = useState(null);
  const seen = useMemo(() => new Set(state.seen), [state.seen]);
  const items = useMemo(() => buildItems(state), [state.dishes]);
  const byKey = useMemo(() => Object.fromEntries(items.map((i) => [i.key, i])), [items]);
  const menuIds = new Set(CAT_ORDER.flatMap((c) => state.menu[c] || []));

  const sections = [
    ...PHRASE_CATS.filter((c) => c.id !== 'voc').map((c) => ({ id: c.id, label: c.label, groups: [{ keys: c.items.map((_, i) => c.id + '-' + i) }] })),
    { id: 'plats', label: 'Noms de plats', groups: [
      { title: 'Vocabulaire de la carte', keys: PHRASE_CATS.find((c) => c.id === 'voc').items.map((_, i) => 'voc-' + i) },
      ...CAT_ORDER.map((c) => ({ title: CATS[c], keys: allDishes(state).filter((d) => d.cat === c).map((d) => 'dish-' + d.id) })).filter((g) => g.keys.length),
    ] },
  ];
  const sec = sections.find((x) => x.id === section) || sections[0];
  const allKeys = sec.groups.flatMap((g) => g.keys);
  const nSeen = allKeys.filter((k) => seen.has(seenKey(lang, k))).length;

  const say = (it) => {
    setSpeaking(it.key);
    speak(txt(it, lang), lang, { slow: state.slow, onDone: () => setSpeaking((k) => (k === it.key ? null : k)) });
    const k = seenKey(lang, it.key);
    if (!seen.has(k)) update((st) => { st.seen.push(k); });
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Title>Phrases & mots en {LANGS[lang].name}</Title>
      <Lede>Touche une phrase pour l'écouter. Elle est alors marquée comme vue (point vert) et rejoint ta banque d'exercices.</Lede>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {sections.map((x) => <Chip key={x.id} label={x.label} active={x.id === sec.id} onPress={() => setSection(x.id)} />)}
      </ScrollView>
      <VoiceNotice />
      <View style={[s.head, { borderColor: t.line }]}>
        <Title style={{ fontSize: 19 }}>{sec.label}</Title>
        <Text style={{ color: t.muted, fontSize: 12 }}>{nSeen} / {allKeys.length} vus</Text>
        <Pressable onPress={() => update((st) => { allKeys.forEach((k) => { const sk = seenKey(lang, k); if (!st.seen.includes(sk)) st.seen.push(sk); }); })} hitSlop={6} style={{ flexBasis: '100%' }}>
          <Text style={{ color: t.accent, fontSize: 12 }}>Tout marquer comme vu</Text>
        </Pressable>
      </View>
      {sec.groups.map((g, gi) => (
        <View key={gi}>
          {g.title && <Text style={[s.sub, { color: t.muted }]}>{g.title.toUpperCase()}</Text>}
          <View style={s.grid}>
            {g.keys.map((k) => {
              const it = byKey[k]; if (!it) return null;
              const tx = txt(it, lang), p = pron(tx, lang), isSeen = seen.has(seenKey(lang, k));
              const isNum = it.n !== undefined && it.n !== null;
              return (
                <Pressable key={k} onPress={() => say(it)} accessibilityRole="button"
                  style={[s.item, isNum && s.itemNum, { backgroundColor: t.surface, borderColor: speaking === k ? t.accent : t.line, borderWidth: speaking === k ? 2 : 1 }]}>
                  <View style={[s.dot, { borderColor: isSeen ? t.good : t.line, backgroundColor: isSeen ? t.good : 'transparent' }]} />
                  {isNum && <Text style={[s.num, { color: t.brass }]}>{it.n}</Text>}
                  <Text style={[s.t, { color: t.ink }]}>🔈 {tx}</Text>
                  {!!p && <Text style={[s.tr, { color: t.brass }]}>{p}</Text>}
                  <Text style={[s.fr, { color: t.muted }]}>
                    {it.group.startsWith('dish-') ? cap(it.fr) : it.fr}
                    {it.group.startsWith('dish-') && menuIds.has(k.slice(5)) ? <Text style={{ color: t.brass, fontWeight: '700' }}>  · au menu</Text> : null}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  chips: { gap: 6, paddingVertical: 12 },
  head: { flexDirection: 'row', alignItems: 'baseline', gap: 10, borderBottomWidth: 1, paddingBottom: 6, marginTop: 16, marginBottom: 8, flexWrap: 'wrap' },
  sub: { fontSize: 11, letterSpacing: 1.2, fontWeight: '600', marginTop: 14, marginBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { flexGrow: 1, flexBasis: 260, borderRadius: 10, paddingVertical: 10, paddingLeft: 12, paddingRight: 24 },
  itemNum: { flexBasis: 140 },
  dot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, borderWidth: 1 },
  num: { fontFamily: 'serif', fontSize: 20 },
  t: { fontSize: 16, fontWeight: '600' },
  tr: { fontSize: 12, fontStyle: 'italic', marginTop: 1 },
  fr: { fontSize: 13, marginTop: 2 },
});
