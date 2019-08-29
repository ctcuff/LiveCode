import monokai from '@/assets/themes/monokai';
import chromeDevTools from '@/assets/themes/chromeDevTools';

const themeNames = [
  'vs-dark',
  'vs-light',
  'monokai',
  'chrome-devtools'
];

const allThemes = {
  'monokai': {
    themeData: monokai,
    isLight: false
  },
  'chrome-devtools': {
    themeData: chromeDevTools,
    isLight: true
  },
  'vs-dark': {
    themeData: null,
    isLight: false
  },
  'vs-light': {
    themeData: null,
    isLight: true
  }
};

export { themeNames, allThemes };