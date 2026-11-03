import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { Btn, Title, Lede } from '../ui';
import { speak } from '../speech';
import { LANGS, CATS, newQuestion, norm, pron, seenKey, buildItems } from '../logic';

export default function ExerciseScreen({ goTo }) {
  const t = useTheme();
  const { state, update } = useStore();
  const lang = state.lang;
  const seen = useMemo(() => new Set(state.seen), [state.seen]);
  const nSeen = useMemo(() => buildItems(state).filter((i) => seen.has(seenKey(lang, i.key))).length, [state.dishes, seen, lang]);
  const [q, setQ] = useState(null);
  const [pick, setPick] = useState(null);
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState({ ok: 0, total: 0 });

  const next = (prevKey) => { setPick(null); setTyped(''); setQ(newQuestion(state, state.exSource, seen, prevKey)); };
  useEffect(() => { next(); }, [lang, state.exSource]);

  const answer = (given) => {
    if (pick !== null || !q) return;
    setPick(given);
    const ok = norm(given) === norm(q.answer);
    setScore((sc) => ({ ok: sc.ok + (ok ? 1 : 0), total: sc.total + 1 }));
    speak(q.full, lang, { slow: state.slow });
  };
  const answered = pick !== null;
  const ok = answered && norm(pick) === norm(q.answer);

  const Seg = ({ items, value, onChange }) => (
    <View style={[s.seg, { borderColor: t.line, backgroundColor: t.surface }]}>
      {items.map(([v, label], i) => (
        <Pressable key={v} onPress={() => onChange(v)} style={[s.segBtn, i > 0 && { borderLeftWidth: 1, borderColor: t.line }, value === v && { backgroundColor: t.soft }]}>
          <Text style={{ fontSize: 13, color: value === v ? t.accent : t.muted, fontWeight: value === v ? '600' : '400' }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
      <View style={s.top}>
        <View style={{ flex: 1 }}>
          <Title>Texte à trous</Title>
          <Lede>Complète la phrase en {LANGS[lang].name}. L'indice en français t'aide à retrouver le mot.</Lede>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: 'serif', fontSize: 26, color: t.ink }}>{score.ok} / {score.total}</Text>
          <Text style={{ fontSize: 11, color: t.muted }}>bonnes réponses</Text>
        </View>
      </View>
      <View style={s.bar}>
        <Seg value={state.exSource} onChange={(v) => update((st) => { st.exSource = v; })}
          items={[['seen', `Mots vus (${nSeen})`], ['menu', 'Mon menu'], ['all', 'Tout']]} />
        <Seg value={state.exMode} onChange={(v) => update((st) => { st.exMode = v; })} items={[['choice', 'Choix'], ['write', 'Écrire']]} />
      </View>

      <View style={[s.card, { backgroundColor: t.surface, borderColor: t.line }]}>
        {!q && state.exSource === 'menu' && (
          <View style={s.empty}>
            <Title style={{ fontSize: 19, textAlign: 'center' }}>Ton menu du jour est vide</Title>
            <Text style={{ color: t.muted, textAlign: 'center' }}>Mets au moins un plat au menu pour t'exercer dessus.</Text>
            <Btn primary label="Composer le menu" onPress={() => goTo('menu')} />
          </View>
        )}
        {!q && state.exSource !== 'menu' && (
          <View style={s.empty}>
            <Title style={{ fontSize: 19, textAlign: 'center' }}>Écoute d'abord quelques phrases</Title>
            <Text style={{ color: t.muted, textAlign: 'center' }}>Tu as vu {nSeen} élément{nSeen > 1 ? 's' : ''} en {LANGS[lang].name}. Il en faut au moins 3 pour l'exercice sur les mots vus.</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Btn primary label="Aller aux phrases" onPress={() => goTo('phrases')} />
              <Btn label="S'exercer sur mon menu" onPress={() => update((st) => { st.exSource = 'menu'; })} />
            </View>
          </View>
        )}
        {q && (
          <>
            <Text style={[s.hint, { color: t.muted }]}>
              {q.kind === 'menu' ? `Plat du menu (${CATS[q.cat].toLowerCase()}) — ` : ''}Indice : <Text style={{ color: t.ink, fontWeight: '500' }}>{q.fr}</Text>
            </Text>
            <Text style={[s.sentence, { color: t.ink }]}>
              {q.before}
              <Text style={{ color: answered ? (ok ? t.good : t.bad) : t.accent, textDecorationLine: 'underline', fontWeight: '700' }}>
                {answered ? q.answer : '        '}
              </Text>
              {q.after}
            </Text>
            {answered && !!pron(q.full, lang) && <Text style={{ color: t.brass, fontStyle: 'italic', marginTop: 6 }}>{pron(q.full, lang)}</Text>}

            {state.exMode === 'choice' ? (
              <View style={s.choices}>
                {q.choices.map((c, i) => {
                  const isAns = norm(c) === norm(q.answer);
                  const bg = answered && isAns ? t.goodSoft : answered && c === pick ? t.badSoft : t.paper;
                  const bc = answered && isAns ? t.good : answered && c === pick ? t.bad : t.line;
                  return (
                    <Pressable key={i} disabled={answered} onPress={() => answer(c)} style={[s.choice, { backgroundColor: bg, borderColor: bc }]}>
                      <Text style={{ fontSize: 16, color: answered && isAns ? t.good : answered && c === pick ? t.bad : t.ink, fontWeight: answered && isAns ? '700' : '400' }}>{c}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={s.write}>
                <TextInput value={typed} onChangeText={setTyped} editable={!answered} placeholder="Tape le mot manquant" placeholderTextColor={t.muted}
                  autoCapitalize="none" autoCorrect={false} onSubmitEditing={() => typed.trim() && answer(typed.trim())}
                  style={[s.input, { borderColor: t.line, backgroundColor: t.paper, color: t.ink }]} />
                {!answered && <Btn primary label="Vérifier" onPress={() => typed.trim() && answer(typed.trim())} />}
              </View>
            )}

            {answered && (
              <View style={s.feedback}>
                <Text style={{ fontWeight: '700', color: ok ? t.good : t.bad, flexBasis: '100%' }}>{ok ? 'Bonne réponse !' : `La bonne réponse : ${q.answer}`}</Text>
                <Btn label="🔈 Réécouter" onPress={() => speak(q.full, lang, { slow: state.slow })} />
                <Btn primary label="Question suivante" onPress={() => next(q.key)} />
              </View>
            )}
          </>
        )}
      </View>
      {score.total > 0 && (
        <Pressable onPress={() => setScore({ ok: 0, total: 0 })} style={{ alignSelf: 'center', marginTop: 14 }}>
          <Text style={{ color: t.muted, fontSize: 13 }}>Remettre le score à zéro</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  top: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  bar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  seg: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  segBtn: { paddingVertical: 7, paddingHorizontal: 11 },
  card: { borderWidth: 1, borderRadius: 14, padding: 18, marginTop: 14 },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  hint: { fontSize: 14, marginBottom: 12 },
  sentence: { fontSize: 22, lineHeight: 32, fontWeight: '500' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  choice: { flexGrow: 1, flexBasis: '45%', borderWidth: 1, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 },
  write: { flexDirection: 'row', gap: 8, marginTop: 18, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16 },
  feedback: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16, alignItems: 'center' },
});
