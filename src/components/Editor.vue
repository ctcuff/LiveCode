<template>
  <div id="editor" ref="editor"></div>
</template>

<script>
  import { editor as monacoEditor } from 'monaco-editor';
  import { allThemes } from '@/util/editorThemes';
  import { mapState, mapActions } from 'vuex';
  import { editorDefaults } from '@/store/modules/editor';

  let editor;
  const model = monacoEditor.createModel(
    editorDefaults.content,
    editorDefaults.selectedLanguage,
  );

  export default {
    computed: mapState('editor', [
      'selectedLanguage',
      'fontSize',
      'showMinimap',
      'currentTheme',
      'renderWhitespace',
      'indentSize',
      'useTabs',
      'wordWrap',
      'showLineNumbers'
    ]),
    methods: {
      ...mapActions('editor', [
        'updateEditorContent',
        'updateSelection',
        'updateCursorPosition'
      ]),
      handleConfigChange(mutation) {
        const { payload, type } = mutation;

        // editor settings don't have a payload so we have
        // to look for changes in the state instead
        const { showMinimap, renderWhitespace, wordWrap, showLineNumbers } = this;

        if (type.includes('editor')) {
          switch (type) {
            case 'editor/setFontSize':
              editor.updateOptions({ fontSize: payload });
              break;
            case 'editor/setLanguage':
              monacoEditor.setModelLanguage(editor.getModel(model.uri), payload);
              break;
            case 'editor/toggleMinimap':
              editor.updateOptions({ minimap: { enabled: showMinimap } });
              break;
            case 'editor/setEditorTheme':
              monacoEditor.setTheme(payload);
              break;
            case 'editor/toggleWhitespace':
              editor.updateOptions({ renderWhitespace: renderWhitespace ? 'boundary' : 'none' });
              break;
            case 'editor/setIndentSize':
              editor.getModel(model.uri).updateOptions({ tabSize: payload });
              break;
            case 'editor/setUseTabs':
              editor.getModel(model.uri).updateOptions({ insertSpaces: !payload });
              break;
            case 'editor/toggleWordWrap':
              editor.updateOptions({ wordWrap: wordWrap ? 'on' : 'off' });
              break;
            case 'editor/toggleLineNumbers':
              editor.updateOptions({ lineNumbers: showLineNumbers ? 'on' : 'off' });
              break;
          }
        }
      }
    },
    mounted() {
      this.$store.subscribe(this.handleConfigChange);

      Object.keys(allThemes).forEach(themeName => {
        // If the theme data is null, that means it's a default
        // theme that came with monaco
        const themeData = allThemes[themeName].themeData;
        if (themeData) {
          monacoEditor.defineTheme(themeName, themeData);
        }
      });

      model.updateOptions({
        tabSize: this.tabSize,
        insertSpaces: !this.useTabs,
      });

      editor = monacoEditor.create(document.getElementById('editor'), {
        model,
        theme: this.currentTheme,
        fontSize: this.fontSize,
        automaticLayout: true,
        renderWhitespace: this.renderWhitespace ? 'boundary' : 'none',
        autoClosingBrackets: 'always',
        wordWrap: this.wordWrap ? 'on' : 'off',
        lineNumbers: this.showLineNumbers ? 'on' : 'off'
      });

      // Used to give a line of space before the
      // 1st line of the editor
      editor.changeViewZones(changeAccessor => {
        changeAccessor.addZone({
          afterLineNumber: 0,
          heightInLines: 1,
          domNode: document.createElement('div'),
        });
      });

      editor.onDidChangeCursorPosition(({ position: { lineNumber, column } }) => {
        this.updateCursorPosition({
          line: lineNumber,
          col: column
        });
      });

      editor.onDidChangeCursorSelection(({ selection }) => {
        const lines = selection.endLineNumber - selection.startLineNumber;
        const chars = model
          .getValueInRange(editor.getSelection())
          .split('')
          .length;

        this.updateSelection({ lines, chars });
      });

      editor.onKeyUp(() => {
        this.updateEditorContent(editor.getValue());
      });
    }
  };
</script>

<style lang="scss" scoped>
  @import "../assets/scss/navbar";
  @import "../assets/scss/gutter";

  #editor {
    width: 100%;
    height: calc(100vh - #{$navbar-height} - #{$gutter-height});
  }
</style>