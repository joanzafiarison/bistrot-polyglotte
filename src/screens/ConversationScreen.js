import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { Btn, Title, Lede } from '../ui';
import VoiceNotice from '../VoiceNotice';
import { speak, stopSpeech } from '../speech';
import { LANGS, CATS, CAT_ORDER, SLOT_LABEL, DIALOGUES, fill, fillParts, lineVisible, missingSlots, menuDish, slotDish, dishName, pron } from '../logic';

export default function ConversationScreen({ goTo }) {
  const t = useTheme();
  const { state, update } = useStore();
  const lang = state.lang;
  const dl = DIALOGUES[state.dlg] || DIALOGUES[0];
  const [playing, setPlaying] = useState(null);
  const token = useRef(0);
  useEffect(() => () => { token.current++; stopSpeech(); }, []);

  const visible = dl.lines.map((ln, i) => ({ ln, i })).filter(({ ln }) => lineVisible(state, ln));
  const hidden = dl.lines.length - visible.length;
  const missing = [...new Set(dl.lines.flatMap((ln) => missingSlots(state, ln)))].map((k) => SLOT_LABEL[k]);

  const sayLine = (ln, i, then) => {
    setPlaying(i);
    speak(fill(state, ln[lang], lang), lang, { slow: state.slow, role: ln.r, onDone: () => { setPlaying((p) => (p === i ? null : p)); then && then(); } });
  };
  const playAll = () => {
    const tok = ++token.current;
    const step = (k) => { if (tok !== token.current || k >= visible.length) { setPlaying(null); return; } const { ln, i } = visible[k]; sayLine(ln, i, () => setTimeout(() => step(k + 1), 350)); };
    step(0);
  };
  const stop = () => { token.current++; stopSpeech(); setPlaying(null); };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Title>Conversations en {LANGS[lang].name}</Title>
      <Lede>Les plats cités viennent de ton menu du jour. Touche une réplique pour l'écouter.</Lede>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
        {DIALOGUES.map((d, i) => {
          const on = i === state.dlg;
          return (
            <Pressable key={i} onPress={() => { stop(); update((st) => { st.dlg = i; }); }}
              style={[s.dlg, { backgroundColor: t.surface, borderColor: on ? t.accent : t.line, borderWidth: on ? 2 : 1 }]}>
              <Text style={{ fontSize: 10, letterSpacing: 1.2, color: t.brass, fontWeight: '600' }}>DIALOGUE {i + 1}</Text>
              <Text style={{ fontFamily: 'serif', fontSize: 16, color: t.ink, marginVertical: 2 }}>{d.title}</Text>
              <Text style={{ fontSize: 12, color: t.muted }}>{d.desc}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={s.strip}>
        <Text style={{ fontSize: 12, color: t.muted }}>Ton menu :</Text>
        {CAT_ORDER.map((c) => {
          const g = menuDish(state, c);
          let v = g ? dishName(g, lang) : 'aucun';
          if (c === 'G' && slotDish(state, 'H')) v += ' / ' + dishName(slotDish(state, 'H'), lang);
          return (
            <View key={c} style={[s.pill, g ? { backgroundColor: t.soft } : { borderWidth: 1, borderStyle: 'dashed', borderColor: t.line }]}>
              <Text style={{ fontSize: 12, color: g ? t.accent : t.muted }}><Text style={{ color: t.muted }}>{CATS[c]} </Text>{v}</Text>
            </View>
          );
        })}
        <Pressable onPress={() => goTo('menu')}><Text style={{ color: t.accent, fontSize: 12, textDecorationLine: 'underline' }}>Modifier</Text></Pressable>
      </View>
      <VoiceNotice />
      <View style={s.bar}>
        <Btn primary label="🔈 Écouter tout" onPress={playAll} />
        <Btn label="Arrêter" onPress={stop} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: 4 }}>
          <Text style={{ color: t.muted, fontSize: 13 }}>Traduction</Text>
          <Switch value={!!state.showFr} onValueChange={(v) => update((st) => { st.showFr = v; })} trackColor={{ true: t.accent }} />
        </View>
      </View>
      {hidden > 0 && <Text style={{ color: t.muted, fontStyle: 'italic', fontSize: 13, marginTop: 10 }}>{hidden} réplique{hidden > 1 ? 's' : ''} masquée{hidden > 1 ? 's' : ''} : il manque au menu {missing.join(', ')}.</Text>}
      <View style={s.lines}>
        {visible.map(({ ln, i }) => {
          const client = ln.r === 'C';
          const plain = fill(state, ln[lang], lang);
          const p = pron(plain, lang);
          return (
            <View key={i} style={[s.line, client && { alignSelf: 'flex-end', alignItems: 'flex-end' }]}>
              <Text style={[s.who, { color: t.muted }]}>{client ? 'CLIENT' : 'SERVEUR'} · {LANGS[lang][ln.r].toUpperCase()}</Text>
              <Pressable onPress={() => { token.current++; sayLine(ln, i); }}
                style={[s.bubble, client ? s.bubbleC : s.bubbleS, { backgroundColor: client ? t.soft : t.surface, borderColor: playing === i ? t.accent : t.line, borderWidth: playing === i ? 2 : 1 }]}>
                <Text style={{ fontSize: 16, color: t.ink, fontWeight: '500' }}>
                  {fillParts(state, ln[lang], lang).map((part, k) => <Text key={k} style={part.dish ? { color: t.accent, fontWeight: '700' } : null}>{part.text}</Text>)}
                </Text>
                {!!p && <Text style={{ fontSize: 12, color: t.brass, fontStyle: 'italic', marginTop: 2 }}>{p}</Text>}
                {state.showFr && <Text style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{fill(state, ln.fr, 'fr')}</Text>}
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  dlg: { width: 200, borderRadius: 10, padding: 12 },
  strip: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  pill: { borderRadius: 999, paddingVertical: 3, paddingHorizontal: 9 },
  bar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, alignItems: 'center' },
  lines: { gap: 12, marginTop: 18 },
  line: { maxWidth: '88%', alignItems: 'flex-start' },
  who: { fontSize: 10, letterSpacing: 1.2, fontWeight: '600', marginBottom: 4, marginHorizontal: 4 },
  bubble: { paddingVertical: 10, paddingHorizontal: 14 },
  bubbleS: { borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomRightRadius: 14, borderBottomLeftRadius: 4 },
  bubbleC: { borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomLeftRadius: 14, borderBottomRightRadius: 4 },
});
