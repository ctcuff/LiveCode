import Vue from 'vue';
import { themeNames } from '@/util/editorThemes';

function createStore({ state, mutations }) {
  return new Vue({
    data() {
      return { state };
    },
    methods: {
      commit(mutationName, ...args) {
        mutations[mutationName](this.state, ...args);
        if (state.debug) {
          console.log('[Mutation]', mutationName, args);
          // console.log('New state:', JSON.stringify(state, null, 2));
        }
      }
    }
  });
}

const defaultState = {
  selectedLanguage: 'python',
  fontSize: 16,
  showMinimap: true,
  theme: 'vs-dark',
  currentTheme: 'vs-dark',
  themes: themeNames,
  renderWhitespace: true,
  debug: true,
  indentSize: 4,
  useTabs: true
};

const editorStore = createStore({
  state: {
    defaults: defaultState,
    ...defaultState,
  },
  mutations: {
    setLanguage(state, language) {
      state.selectedLanguage = language;
    },
    setFontSize(state, fontSize) {
      state.fontSize = fontSize;
    },
    toggleMinimap(state) {
      state.showMinimap = !state.showMinimap;
    },
    setEditorTheme(state, theme) {
      state.currentTheme = theme;
    },
    toggleWhitespace(state) {
      state.renderWhitespace = !state.renderWhitespace;
    },
    setUseTabs(state, useTabs) {
      state.useTabs = useTabs;
    },
    setIndentSize(state, indentSize) {
      state.indentSize = indentSize;
    }
  }
});

export default editorStore;