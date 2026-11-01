import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { ToastProvider } from './src/ui';
import { useTheme } from './src/theme';
import { LANGS, ORDER } from './src/data';
import { stopSpeech } from './src/speech';
import PhrasesScreen from './src/screens/PhrasesScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ConversationScreen from './src/screens/ConversationScreen';
import MenuScreen from './src/screens/MenuScreen';

const TABS = [['phrases', 'Phrases & mots'], ['exercice', 'Exercice'], ['conversation', 'Conversation'], ['menu', 'Menu']];

function Main() {
  const t = useTheme();
  const { state, update, ready } = useStore();
  const [tab, setTab] = useState('phrases');
  const goTo = (id) => { stopSpeech(); setTab(id); };
  const Screen = { phrases: PhrasesScreen, exercice: ExerciseScreen, conversation: ConversationScreen, menu: MenuScreen }[tab];

  return (
    <SafeAreaView style={[s.root, { backgroundColor: t.paper }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={[s.header, { borderColor: t.line }]}>
        <View style={{ flexShrink: 1 }}>
          <Text style={[s.brand, { color: t.ink }]}>Bistrot Polyglotte</Text>
          <Text style={{ color: t.muted, fontSize: 12 }}>Prendre une commande dans 5 langues</Text>
        </View>
        <View style={[s.langs, { borderColor: t.line, backgroundColor: t.surface }]}>
          {ORDER.map((l) => {
            const on = state.lang === l;
            return (
              <Pressable key={l} onPress={() => { stopSpeech(); update((st) => { st.lang = l; }); }} accessibilityLabel={LANGS[l].name}
                style={[s.lang, on && { backgroundColor: t.accent }]}>
                <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: on ? t.accentInk : t.muted }}>{LANGS[l].code}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ flex: 1 }}>{ready ? <Screen key={tab} goTo={goTo} /> : null}</View>
      <View style={[s.tabs, { borderColor: t.line, backgroundColor: t.surface }]}>
        {TABS.map(([id, label]) => {
          const on = tab === id;
          return (
            <Pressable key={id} onPress={() => goTo(id)} style={[s.tab, on && { borderTopColor: t.accent }]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
              <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: on ? '700' : '500', color: on ? t.ink : t.muted }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ToastProvider>
          <Main />
        </ToastProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, flexWrap: 'wrap' },
  brand: { fontFamily: 'serif', fontSize: 20 },
  langs: { flexDirection: 'row', borderWidth: 1, borderRadius: 999, padding: 3 },
  lang: { paddingVertical: 5, paddingHorizontal: 8, borderRadius: 999 },
  tabs: { flexDirection: 'row', borderTopWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderTopWidth: 2, borderTopColor: 'transparent' },
});
