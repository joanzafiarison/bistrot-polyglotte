// Petits composants partagés.
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet, Animated } from 'react-native';
import { useTheme } from './theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Chip({ label, active, onPress, small }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }}
      style={[s.chip, small && s.chipSmall, { borderColor: active ? t.accent : t.line, backgroundColor: active ? t.soft : t.surface }]}>
      <Text style={[s.chipTxt, small && { fontSize: 12 }, { color: active ? t.accent : t.ink, fontWeight: active ? '600' : '400' }]}>{label}</Text>
    </Pressable>
  );
}

export function Btn({ label, onPress, primary, small, disabled, style }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button"
      style={({ pressed }) => [s.btn, small && s.btnSmall,
        { backgroundColor: primary ? t.accent : t.surface, borderColor: primary ? t.accent : t.line, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      <Text style={[s.btnTxt, small && { fontSize: 12 }, { color: primary ? t.accentInk : t.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function Title({ children, style }) {
  const t = useTheme();
  return <Text style={[s.title, { color: t.ink }, style]}>{children}</Text>;
}
export function Lede({ children }) {
  const t = useTheme();
  return <Text style={[s.lede, { color: t.muted }]}>{children}</Text>;
}

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [msg, setMsg] = useState(null);
  const timer = useRef(null);
  const show = useCallback((text, undo) => {
    clearTimeout(timer.current);
    setMsg({ text, undo });
    timer.current = setTimeout(() => setMsg(null), undo ? 6000 : 3500);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && (
        <View pointerEvents="box-none" style={[s.toastWrap, { bottom: insets.bottom + 72 }]}>
          <View style={[s.toast, { backgroundColor: t.ink }]}>
            <Text style={{ color: t.paper, flexShrink: 1, fontSize: 14 }}>{msg.text}</Text>
            {msg.undo && (
              <Pressable onPress={() => { setMsg(null); msg.undo(); }} hitSlop={8}>
                <Text style={{ color: t.paper, fontWeight: '700', textDecorationLine: 'underline', marginLeft: 12 }}>Annuler</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </ToastCtx.Provider>
  );
}

const s = StyleSheet.create({
  chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  chipSmall: { paddingVertical: 4, paddingHorizontal: 10 },
  chipTxt: { fontSize: 14 },
  btn: { borderWidth: 1, borderRadius: 8, paddingVertical: 9, paddingHorizontal: 14, alignItems: 'center' },
  btnSmall: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 6 },
  btnTxt: { fontSize: 14, fontWeight: '500' },
  title: { fontFamily: 'serif', fontSize: 22 },
  lede: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  toastWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, maxWidth: 520 },
});
