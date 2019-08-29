import { createSetter, createToggler } from '@/util/creator';

const mutationTypes = {
  setLanguage: 'setLanguage',
  setFontSize: 'setFontSize',
  toggleMinimap: 'toggleMinimap',
  setEditorTheme: 'setEditorTheme',
  toggleWhitespace: 'toggleWhitespace',
  setUseTabs: 'setUseTabs',
  setIndentSize: 'setIndentSize'
};

const editorDefaults = {
  selectedLanguage: 'python',
  fontSize: 14,
  showMinimap: true,
  theme: 'vs-dark',
  currentTheme: 'vs-dark',
  renderWhitespace: true,
  indentSize: 4,
  useTabs: true
};

const editor = {
  namespaced: true,
  state: { ...editorDefaults },
  mutations: {
    [mutationTypes.setLanguage]: createSetter('selectedLanguage'),
    [mutationTypes.setFontSize]: createSetter('fontSize'),
    [mutationTypes.toggleMinimap]: createToggler('showMinimap'),
    [mutationTypes.setEditorTheme]: createSetter('currentTheme'),
    [mutationTypes.toggleWhitespace]: createToggler('renderWhitespace'),
    [mutationTypes.setUseTabs]: createSetter('useTabs'),
    [mutationTypes.setIndentSize]: createSetter('indentSize')
  }
};

export { editor as default, mutationTypes, editorDefaults };