<template>
  <div id="editor" ref="editor"></div>
</template>

<script>
  import * as monaco from 'monaco-editor';
  import { allThemes } from '@/util/editorThemes';
  import { mapState, mapActions } from 'vuex';
  import { editorDefaults } from '@/store/modules/editor';
  import { editor as editorNamespace } from '@/store/modules/moduleNames';

  let editor;
  const model = monaco.editor.createModel(
    editorDefaults.content,
    editorDefaults.selectedLanguage,
  );

  export default {
    computed: mapState(editorNamespace, [
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
      ...mapActions(editorNamespace, [
        'updateEditorContent',
        'updateSelection',
        'updateCursorPosition'
      ])
    },
    watch: {
      selectedLanguage(language) {
        monaco.editor.setModelLanguage(editor.getModel(model.uri), language);
      },
      fontSize(fontSize) {
        editor.updateOptions({ fontSize });
      },
      showMinimap(show) {
        editor.updateOptions({
          minimap: {
            enabled: show
          }
        });
      },
      currentTheme(theme) {
        monaco.editor.setTheme(theme);
      },
      renderWhitespace(render) {
        editor.updateOptions({ renderWhitespace: render ? 'boundary' : 'none' });
      },
      indentSize(tabSize) {
        editor.getModel(model.uri).updateOptions({ tabSize });
      },
      useTabs(tabs) {
        editor.getModel(model.uri).updateOptions({ insertSpaces: !tabs });
      },
      wordWrap(wrap) {
        editor.updateOptions({ wordWrap: wrap ? 'on' : 'off' });
      },
      showLineNumbers(show) {
        editor.updateOptions({ lineNumbers: show ? 'on' : 'off' });
      }
    },
    mounted() {
      Object.keys(allThemes).forEach(themeName => {
        // If the theme data is null, that means it's a default
        // theme that came with monaco
        const themeData = allThemes[themeName].themeData;
        if (themeData) {
          monaco.editor.defineTheme(themeName, themeData);
        }
      });

      model.updateOptions({
        tabSize: this.tabSize,
        insertSpaces: !this.useTabs,
      });

      editor = monaco.editor.create(document.getElementById('editor'), {
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
        const linesSelected = selection.endLineNumber - selection.startLineNumber;
        const charactersSelected = model
          .getValueInRange(editor.getSelection())
          .split('')
          .length;

        this.updateSelection({
          lines: linesSelected,
          chars: charactersSelected
        });
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