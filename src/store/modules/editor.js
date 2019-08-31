import { createSetter, createToggler } from '@/util/creator';
import debounce from '@/util/debounce';

const debounceDelay = 100;

const mutationTypes = {
  setLanguage: 'setLanguage',
  setFontSize: 'setFontSize',
  toggleMinimap: 'toggleMinimap',
  setEditorTheme: 'setEditorTheme',
  toggleWhitespace: 'toggleWhitespace',
  setUseTabs: 'setUseTabs',
  setIndentSize: 'setIndentSize',
  setEditorContent: 'setEditorContent',
  setSelection: 'setSelection',
  setCursorPosition: 'setCursorPosition',
  toggleWordWrap: 'toggleWordWrap',
  toggleLineNumbers: 'toggleLineNumbers'
};

const editorContent = `
# LiveCode

Welcome to LiveCode! This is an online text editor that supports
multiple languages. To change the current syntax highlighting, 
open settings, language, than take your pick.

To share you workspace with someone, click the _info_ icon to the
right on the navbar and give them your workspace id.

Happy editing!`;

const editorDefaults = {
  selectedLanguage: 'markdown',
  fontSize: 14,
  showMinimap: true,
  theme: 'vs-dark',
  currentTheme: 'vs-dark',
  renderWhitespace: true,
  indentSize: 4,
  useTabs: true,
  content: editorContent.trim(),
  selection: {
    lines: 0,
    chars: 0
  },
  cursorPosition: {
    line: 1,
    col: 1,
  },
  wordWrap: true,
  showLineNumbers: true
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
    [mutationTypes.setIndentSize]: createSetter('indentSize'),
    [mutationTypes.setEditorContent]: createSetter('content'),
    [mutationTypes.setSelection](state, payload) {
      state.selection.lines = payload.lines;
      state.selection.chars = payload.chars;
    },
    [mutationTypes.setCursorPosition](state, payload) {
      state.cursorPosition.line = payload.line;
      state.cursorPosition.col = payload.col;
    },
    [mutationTypes.toggleWordWrap]: createToggler('wordWrap'),
    [mutationTypes.toggleLineNumbers]: createToggler('showLineNumbers')
  },
  actions: {
    updateEditorContent(context, content) {
      const action = debounce(() => {
        context.commit(mutationTypes.setEditorContent, content);
      }, debounceDelay);
      action();
    },
    updateSelection(context, payload) {
      const action = debounce(() => {
        context.commit(mutationTypes.setSelection, {
          lines: payload.lines,
          chars: payload.chars
        });
      }, debounceDelay);
      action();
    },
    updateCursorPosition(context, payload) {
      const action = debounce(() => {
        context.commit(mutationTypes.setCursorPosition, {
          line: payload.line,
          col: payload.col
        });
      }, debounceDelay);
      action();
    }
  },
  getters: {
    contentSizeInBytes: state => state.content.split('').length
  }
};

export { editor as default, mutationTypes, editorDefaults };