// Lecture vocale avec les voix du téléphone (expo-speech).
import * as Speech from 'expo-speech';
import { LANGS } from './data';

let voices = [];
let loaded = false;
export async function loadVoices() {
  try { voices = (await Speech.getAvailableVoicesAsync()) || []; } catch (e) { voices = []; }
  loaded = true;
  return voices;
}
const vlang = (v) => String(v.language || '').replace('_', '-').toLowerCase();
export function voicesFor(lang) { return voices.filter((v) => vlang(v).split('-')[0] === lang); }
/** null = liste pas encore chargée (ou non fournie par l'appareil). */
export function hasVoice(lang) { if (!loaded || !voices.length) return null; return voicesFor(lang).length > 0; }

export function speak(text, lang, { slow = false, role = 'S', onDone } = {}) {
  Speech.stop();
  const vs = voicesFor(lang);
  const tag = LANGS[lang].tts.toLowerCase();
  const best = vs.find((v) => vlang(v) === tag) || vs[0];
  const alt = vs.find((v) => v !== best);
  const voice = role === 'C' && alt ? alt : best;
  Speech.speak(text, {
    language: LANGS[lang].tts,
    voice: voice ? voice.identifier : undefined,
    rate: slow ? 0.7 : 0.95,
    pitch: role === 'C' ? 1.08 : 1,
    onDone, onStopped: onDone, onError: onDone,
  });
}
export const stopSpeech = () => Speech.stop();
