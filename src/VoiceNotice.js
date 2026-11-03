// Prévient quand le téléphone n'a pas de voix pour la langue choisie.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from './theme';
import { loadVoices, hasVoice } from './speech';
import { LANGS } from './data';
import { useStore } from './store';

const HOW = {
  android: 'Paramètres › Synthèse vocale › Moteur Google › Installer les données vocales',
  ios: 'Réglages › Accessibilité › Contenu énoncé › Voix',
};

export default function VoiceNotice() {
  const t = useTheme();
  const { state, update } = useStore();
  const [, setTick] = useState(0);
  useEffect(() => { loadVoices().then(() => setTick((x) => x + 1)); }, []);
  const ok = hasVoice(state.lang);
  const name = LANGS[state.lang].name;
  return (
    <View style={[s.box, { borderColor: ok === false ? t.brass : t.line, backgroundColor: t.surface }]}>
      {ok === false && (
        <Text style={[s.txt, { color: t.ink }]}>
          <Text style={{ fontWeight: '700', color: t.brass }}>Aucune voix {name} sur ce téléphone.</Text> La lecture risque d'être mal prononcée.
          {'\n'}Android : {HOW.android} › {name}.{'\n'}iPhone : {HOW.ios} › {name}.
        </Text>
      )}
      {state.lang === 'ro' && (
        <Text style={[s.small, { color: t.muted }]}>
          Prononciation affichée : ă = e de « le » · î / â = ı · ș = ch · ț = ts · ce, ci = tché, tchi · che, chi = ké, ki · ge, gi = djé, dji · i final presque muet (').
        </Text>
      )}
      <View style={s.row}>
        <Text style={[s.txt, { color: t.muted }]}>Lecture lente</Text>
        <Switch value={!!state.slow} onValueChange={(v) => update((st) => { st.slow = v; })} trackColor={{ true: t.accent }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 12, gap: 6 },
  txt: { fontSize: 13, lineHeight: 19 },
  small: { fontSize: 12, lineHeight: 17 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
