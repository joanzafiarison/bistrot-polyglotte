import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../theme';
import { useStore, addToMenu, removeFromMenu } from '../store';
import { Chip, Btn, Title, useToast } from '../ui';
import { LANGS, ORDER, CATS, CAT_ORDER, DEFAULT_DISHES, allDishes, dishById, menuList, menuDish, inMenu, dishName, pron, cap } from '../logic';

export default function MenuScreen() {
  const t = useTheme();
  const toast = useToast();
  const { state, update } = useStore();
  const lang = state.lang;
  const scroll = useRef(null);
  const libY = useRef(0);
  const [form, setForm] = useState({ fr: '', cat: 'E', toMenu: true, ru: '', es: '', it: '', en: '', ro: '' });
  const [price, setPrice] = useState(String(state.menu.price));
  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const list = allDishes(state).filter((d) => state.libCat === 'all' || d.cat === state.libCat);
  const missingDefaults = DEFAULT_DISHES.filter((d) => !dishById(state, d.id));

  const toggleMenu = (d) => {
    const on = inMenu(state, d);
    update((st) => (on ? removeFromMenu(st, d) : addToMenu(st, d)));
    if (on) toast(`${cap(d.fr)} est retiré du menu. Il reste dans tes plats.`, () => update((st) => addToMenu(st, d)));
  };
  const del = (d) => {
    const idx = state.dishes.indexOf(d), wasOn = inMenu(state, d);
    update((st) => { st.dishes = st.dishes.filter((x) => x.id !== d.id); removeFromMenu(st, d); });
    toast(`${cap(d.fr)} a été supprimé de ta liste.`, () => update((st) => { st.dishes.splice(Math.max(0, idx), 0, d); if (wasOn) addToMenu(st, d); }));
  };
  const add = () => {
    const fr = form.fr.trim();
    if (!fr) { toast('Donne au moins le nom du plat en français.'); return; }
    const d = { id: 'c-' + Date.now().toString(36), cat: form.cat, fr };
    ORDER.forEach((l) => { if (form[l].trim()) d[l] = form[l].trim(); });
    update((st) => { st.dishes.push(d); if (form.toMenu) addToMenu(st, d); });
    setForm({ ...form, fr: '', ru: '', es: '', it: '', en: '', ro: '' });
    toast(`${cap(fr)} a été ajouté à tes plats.`);
  };
  const savePrice = () => {
    const v = parseFloat(price.replace(',', '.'));
    if (v > 0) update((st) => { st.menu.price = Math.round(v * 100) / 100; });
    else { setPrice(String(state.menu.price)); toast('Indique un prix supérieur à 0 €.'); }
  };

  return (
    <ScrollView ref={scroll} contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
      {/* Ardoise */}
      <View style={[s.slate, { backgroundColor: t.slate, borderColor: t.wood }]}>
        <Text style={[s.kicker, { color: t.chalkDim }]}>BISTROT POLYGLOTTE</Text>
        <Text style={[s.slateTitle, { color: t.chalk }]}>Menu du jour</Text>
        <Text style={{ color: t.chalkDim, textAlign: 'center', fontSize: 13 }}>{date}</Text>
        {CAT_ORDER.map((c) => {
          const ds = menuList(state, c), cur = menuDish(state, c);
          return (
            <View key={c} style={[s.row, { borderColor: 'rgba(238,241,234,0.25)' }]}>
              <View style={s.rowHead}>
                <Text style={{ color: t.chalkDim, fontSize: 15, fontFamily: 'serif' }}>{CATS[c]}</Text>
                <Text style={{ color: t.chalkDim, fontSize: 10, letterSpacing: 1 }}>{ds.length ? `${ds.length} AU MENU` : 'AUCUN AU MENU'}</Text>
              </View>
              {ds.length ? (
                <>
                  <View style={s.picks}>
                    {ds.map((d) => {
                      const on = cur && cur.id === d.id;
                      return (
                        <Pressable key={d.id} onPress={() => update((st) => { st.pick[c] = d.id; })}
                          style={[s.pick, { borderColor: on ? t.chalk : 'rgba(238,241,234,0.35)', backgroundColor: on ? 'rgba(238,241,234,0.12)' : 'transparent' }]}>
                          <Text style={{ color: on ? t.chalk : t.chalkDim, fontSize: 13 }}>{cap(d.fr)}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View style={s.rowFoot}>
                    <Text style={{ color: t.chalkDim, fontSize: 12, flex: 1 }}>{dishName(cur, lang)}{pron(dishName(cur, lang), lang) ? ' · ' + pron(dishName(cur, lang), lang) : ''}</Text>
                    <Pressable onPress={() => toggleMenu(cur)} style={[s.x, { borderColor: 'rgba(238,241,234,0.35)' }]}>
                      <Text style={{ color: t.chalkDim, fontSize: 11 }}>Retirer</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <Pressable onPress={() => { update((st) => { st.libCat = c; }); scroll.current?.scrollTo({ y: libY.current, animated: true }); }}
                  style={[s.addPick, { borderColor: 'rgba(238,241,234,0.4)' }]}>
                  <Text style={{ color: t.chalkDim, fontSize: 12 }}>+ Choisir dans Mes plats</Text>
                </Pressable>
              )}
            </View>
          );
        })}
        <View style={s.price}>
          <Text style={{ color: t.chalk, fontFamily: 'serif', fontSize: 15, flex: 1 }}>Le menu complet</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <TextInput value={price} onChangeText={setPrice} onEndEditing={savePrice} keyboardType="decimal-pad"
              style={[s.priceInput, { color: t.chalk, borderColor: 'rgba(238,241,234,0.35)' }]} />
            <Text style={{ color: t.chalk }}>€</Text>
          </View>
        </View>
      </View>

      {/* Mes plats */}
      <View onLayout={(e) => { libY.current = e.nativeEvent.layout.y; }} style={{ marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Title>Mes plats</Title>
          <Text style={{ color: t.muted, fontSize: 12 }}>{allDishes(state).length} plats · sauvegardés sur ce téléphone</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 10 }}>
          <Chip small label="Tous" active={state.libCat === 'all'} onPress={() => update((st) => { st.libCat = 'all'; })} />
          {CAT_ORDER.map((c) => <Chip small key={c} label={CATS[c]} active={state.libCat === c} onPress={() => update((st) => { st.libCat = c; })} />)}
        </ScrollView>
        <View style={[s.list, { borderColor: t.line, backgroundColor: t.surface }]}>
          {list.length === 0 && <Text style={{ color: t.muted, padding: 14 }}>Aucun plat dans cette catégorie. Ajoute-en un ci-dessous.</Text>}
          {list.map((d, i) => {
            const on = inMenu(state, d);
            const tr = dishName(d, lang), p = pron(tr, lang);
            return (
              <View key={d.id} style={[s.dish, i > 0 && { borderTopWidth: 1, borderColor: t.line }, on && { backgroundColor: t.soft }]}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontSize: 9, letterSpacing: 1, color: t.brass, fontWeight: '600' }}>{CATS[d.cat].toUpperCase()}{on ? ' · AU MENU' : ''}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: t.ink }}>{cap(d.fr)}</Text>
                  <Text style={{ fontSize: 12, color: t.muted }}>{tr}{p ? ' · ' + p : ''}</Text>
                </View>
                <Pressable onPress={() => toggleMenu(d)} accessibilityRole="button" accessibilityState={{ selected: on }}
                  style={[s.sbtn, { borderColor: on ? t.accent : t.line, backgroundColor: on ? t.accent : t.surface }]}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: on ? t.accentInk : t.ink }}>{on ? '✓ Au menu' : '+ Menu'}</Text>
                </Pressable>
                <Pressable onPress={() => del(d)} hitSlop={8} accessibilityLabel={`Supprimer ${d.fr}`} style={{ paddingHorizontal: 6 }}>
                  <Text style={{ color: t.muted, fontSize: 15 }}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        {missingDefaults.length > 0 && (
          <Pressable onPress={() => { update((st) => { missingDefaults.forEach((d) => st.dishes.push({ ...d })); }); toast(`${missingDefaults.length} plat(s) remis dans ta liste.`); }} style={{ marginTop: 10 }}>
            <Text style={{ color: t.muted, fontSize: 13 }}>Remettre les plats supprimés de la liste de départ</Text>
          </Pressable>
        )}
      </View>

      {/* Ajouter un plat */}
      <View style={[s.form, { borderColor: t.line, backgroundColor: t.surface }]}>
        <Title style={{ fontSize: 18 }}>Ajouter un plat</Title>
        <Text style={{ color: t.muted, fontSize: 13, marginTop: 2, marginBottom: 10 }}>
          Seul le nom français est obligatoire. Les langues laissées vides affichent le nom français.
        </Text>
        <Field label="Nom en français" value={form.fr} onChange={(v) => setForm({ ...form, fr: v })} placeholder="ex. socca" t={t} />
        <Text style={[s.label, { color: t.muted }]}>Catégorie</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {CAT_ORDER.map((c) => <Chip small key={c} label={CATS[c]} active={form.cat === c} onPress={() => setForm({ ...form, cat: c })} />)}
        </View>
        <View style={s.fgrid}>
          {ORDER.map((l) => (
            <View key={l} style={{ flexGrow: 1, flexBasis: 140 }}>
              <Field label={cap(LANGS[l].name)} value={form[l]} onChange={(v) => setForm({ ...form, [l]: v })} t={t} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ color: t.muted, fontSize: 13 }}>Mettre directement au menu</Text>
          <Switch value={form.toMenu} onValueChange={(v) => setForm({ ...form, toMenu: v })} trackColor={{ true: t.accent }} />
        </View>
        <Btn primary label="Ajouter à mes plats" onPress={add} style={{ marginTop: 12 }} />
      </View>
    </ScrollView>
  );
}

function Field({ label, value, onChange, placeholder, t }) {
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={[s.label, { color: t.muted }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={t.muted}
        style={[s.input, { borderColor: t.line, backgroundColor: t.paper, color: t.ink }]} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 48 },
  slate: { borderWidth: 10, borderRadius: 6, paddingVertical: 16, paddingHorizontal: 14 },
  kicker: { fontSize: 10, letterSpacing: 3, textAlign: 'center' },
  slateTitle: { fontFamily: 'serif', fontSize: 28, textAlign: 'center', fontWeight: '700' },
  row: { borderBottomWidth: 1, borderStyle: 'dashed', paddingVertical: 9, gap: 6 },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  picks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pick: { borderWidth: 1, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  rowFoot: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  x: { borderWidth: 1, borderRadius: 999, paddingVertical: 2, paddingHorizontal: 9 },
  addPick: { alignSelf: 'flex-start', borderWidth: 1, borderStyle: 'dashed', borderRadius: 6, paddingVertical: 5, paddingHorizontal: 10 },
  price: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  priceInput: { borderWidth: 1, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8, width: 70, textAlign: 'right', fontSize: 15 },
  list: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  dish: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 10 },
  sbtn: { borderWidth: 1, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  form: { borderWidth: 1, borderRadius: 12, padding: 16, marginTop: 22 },
  label: { fontSize: 12, fontWeight: '500', marginTop: 6, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, fontSize: 15 },
  fgrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 10 },
});
