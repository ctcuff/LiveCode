import debounce from '@/util/debounce';

const editorContent = `
# LiveCode

Welcome to LiveCode! This is an online text editor that supports
multiple languages. To change the current syntax highlighting, 
open settings, language, than take your pick.

Once you sign in, you'll be given a workspace id. To share you workspace
with someone, click the _info_ icon to the right on the navbar and give 
them your workspace id.

Happy editing!`;

const editorDefaults = {
  selectedLanguage: 'markdown',
  fontSize: 16,
  showMinimap: false,
  theme: 'vs-dark',
  currentTheme: 'vs-dark',
  renderWhitespace: false,
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
  wordWrap: false,
  showLineNumbers: true,
  showIndentGuides: true
};

const editor = {
  namespaced: true,
  state: { ...editorDefaults },
  mutations: {
    setLanguage: (state, lang) => {
      state.selectedLanguage = lang;
    },
    setFontSize: (state, size) => {
      state.fontSize = size;
    },
    toggleMinimap: state => {
      state.showMinimap = !state.showMinimap;
    },
    setEditorTheme: (state, theme) => {
      state.currentTheme = theme;
    },
    toggleWhitespace: state => {
      state.renderWhitespace = !state.renderWhitespace;
    },
    setUseTabs: (state, useTabs) => {
      state.useTabs = useTabs;
    },
    setIndentSize: (state, indentSize) => {
      state.indentSize = indentSize;
    },
    setEditorContent: (state, content) => {
      state.content = content;
    },
    toggleWordWrap: state => {
      state.wordWrap = !state.wordWrap;
    },
    toggleLineNumbers: state => {
      state.showLineNumbers = !state.showLineNumbers;
    },
    setSelection: (state, payload) => {
      state.selection.lines = payload.lines;
      state.selection.chars = payload.chars;
    },
    setCursorPosition: (state, payload) => {
      state.cursorPosition.line = payload.line;
      state.cursorPosition.col = payload.col;
    },
    toggleIndentGuides: state => {
      state.showIndentGuides = !state.showIndentGuides;
    }
  },
  actions: {
    updateEditorContent: (context, content) => {
      const action = debounce(() => {
        context.commit('setEditorContent', content);
      }, 500);
      action();
    },
    updateSelection: (context, payload) =>{
      const action = debounce(() => {
        context.commit('setSelection', payload);
      }, 250);
      action();
    },
    updateCursorPosition: (context, payload) => {
      const action = debounce(() => {
        context.commit('setCursorPosition', payload);
      }, 100);
      action();
    }
  },
  getters: {
    contentSizeInBytes: state => state.content.split('').length
  }
};

export { editor as default, editorDefaults };