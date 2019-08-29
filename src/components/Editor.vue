<template>
  <div id="editor" ref="editor"></div>
</template>

<script>
  import * as monaco from 'monaco-editor';
  import { allThemes } from '@/util/editorThemes';
  import { EventBus, Events } from '@/util/eventBus';
  import { mapState } from 'vuex';
  import { editorDefaults } from '@/store/modules/editor';

  let editor;
  const placeholderFunc = [
    "def say_hello():",
    "\tprint('Hello, World!')",
    "\n",
    "if __name__ == '__main__':",
    "\tsay_hello()"
  ];

  const model = monaco.editor.createModel(
    placeholderFunc.join('\n'),
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
      'useTabs'
    ]),
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
      }
    },
    mounted() {
      Object.keys(allThemes).forEach(themeName => {
        // If the theme data is null, that means it's a default
        // theme that came with the editor
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
        autoClosingBrackets: 'always'
      });

      EventBus.$emit(
        Events.ON_TEXT_CONTENT_CHANGE,
        editor.getValue().split('').length
      );

      // Used to give a line of space before the
      // 1st line of the editor
      editor.changeViewZones(changeAccessor => {
        changeAccessor.addZone({
          afterLineNumber: 0,
          heightInLines: 1,
          domNode: document.createElement('div'),
        });
      });

      // Updates the line/col position in the Gutter component
      editor.onDidChangeCursorPosition(({ position: { lineNumber, column } }) => {
        EventBus.$emit(Events.UPDATE_CURSOR_POSITION, { lineNumber, column });
      });

      // Updates the text selection in the Gutter component
      editor.onDidChangeCursorSelection(({ selection }) => {
        const linesSelected = selection.endLineNumber - selection.startLineNumber;
        const charactersSelected = model
          .getValueInRange(editor.getSelection())
          .split('')
          .length;

        EventBus.$emit(Events.CHARACTER_SELECTION_CHANGE, {
          linesSelected,
          charactersSelected
        });
      });

      // Update the editor content byte size in the Gutter component
      editor.onKeyUp(() => {
        EventBus.$emit(
          Events.ON_TEXT_CONTENT_CHANGE,
          editor.getValue().split('').length
        );
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