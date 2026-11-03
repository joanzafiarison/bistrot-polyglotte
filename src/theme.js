// Couleurs claires et sombres, reprises de la version web.
import { useColorScheme } from 'react-native';

const light = {
  paper: '#f3f5f1', surface: '#ffffff', ink: '#1b2420', muted: '#5b6862', line: '#d7ddd7',
  accent: '#1f5b45', accentInk: '#ffffff', soft: '#e5eee8', brass: '#9a6f1c',
  good: '#2b7a4b', goodSoft: '#dff0e5', bad: '#b0413a', badSoft: '#f7e1de',
  slate: '#262f2b', chalk: '#eef1ea', chalkDim: '#a9b4ad', wood: '#6a4a2c',
};
const dark = {
  paper: '#101513', surface: '#171f1b', ink: '#e5ebe7', muted: '#97a49d', line: '#2b3530',
  accent: '#6dbb94', accentInk: '#0b1711', soft: '#1e2a24', brass: '#d6a64e',
  good: '#6cc28f', goodSoft: '#1b3326', bad: '#e8786d', badSoft: '#3a1f1c',
  slate: '#1d2622', chalk: '#eef1ea', chalkDim: '#9eaaa3', wood: '#5a3d24',
};
export const useTheme = () => (useColorScheme() === 'dark' ? dark : light);
export const SERIF = 'serif';
