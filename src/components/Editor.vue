<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script>
  import { editor as monacoEditor } from 'monaco-editor';
  import themes from '@/util/editorThemes';
  import { socket } from '@/util/socket';
  import { mapState, mapActions, mapGetters } from 'vuex';
  import { editorDefaults } from '@/store/modules/editor';

  let editor;
  const model = monacoEditor.createModel(
    editorDefaults.content,
    editorDefaults.selectedLanguage,
  );

  export default {
    computed: {
      ...mapState('editor', [
        'selectedLanguage',
        'fontSize',
        'showMinimap',
        'currentTheme',
        'renderWhitespace',
        'indentSize',
        'useTabs',
        'wordWrap',
        'showLineNumbers',
        'showIndentGuides'
      ]),
      ...mapState('settingsDrawer', {
        isSettingsOpen: 'showDialog'
      }),
      ...mapState('user', [
        'workspaceId',
        'connectedWorkspaceId',
      ]),
      ...mapGetters('user', ['numUsersConnected'])
    },
    methods: {
      ...mapActions('editor', [
        'updateEditorContent',
        'updateSelection',
        'updateCursorPosition'
      ]),
      ...mapActions('settingsDrawer', {
        closeSettingsDrawer: 'hide'
      }),
      handleConfigChange(mutation) {
        const { payload, type } = mutation;

        // editor settings that are toggled don't
        // have a payload so we have to look for
        // changes in the state instead
        const {
          showMinimap,
          renderWhitespace,
          wordWrap,
          showLineNumbers,
          showIndentGuides
        } = this;

        if (type.includes('editor')) {
          switch (type) {
            case 'editor/setFontSize':
              editor.updateOptions({ fontSize: payload });
              break;
            case 'editor/setLanguage':
              monacoEditor.setModelLanguage(editor.getModel(model.uri), payload);
              break;
            case 'editor/toggleMinimap':
              editor.updateOptions({
                minimap: {
                  enabled: showMinimap
                }
              });
              break;
            case 'editor/setEditorTheme':
              monacoEditor.setTheme(payload);
              break;
            case 'editor/toggleWhitespace':
              editor.updateOptions({
                renderWhitespace: renderWhitespace ? 'boundary' : 'none'
              });
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
            case 'editor/toggleIndentGuides':
              editor.updateOptions({ renderIndentGuides: showIndentGuides });
              break;
          }
        }
      }
    },
    mounted() {
      this.$store.subscribe(this.handleConfigChange);

      Object.keys(themes).forEach(themeName => {
        // If the theme data is null, that means it's a default
        // theme that came with monaco
        const themeData = themes[themeName].themeData;
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
        lineNumbers: this.showLineNumbers ? 'on' : 'off',
        renderIndentGuides: this.showIndentGuides,
        minimap: {
          enabled: this.showMinimap
        }
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

      editor.onDidFocusEditorWidget(() => {
        if (this.isSettingsOpen) {
          this.closeSettingsDrawer();
        }
      });

      editor.onDidChangeCursorPosition(({ position }) => {
        this.updateCursorPosition({
          line: position.lineNumber,
          col: position.column
        });
      });

      // Fired when text is highlighted
      editor.onDidChangeCursorSelection(({ selection }) => {
        const lines = selection.endLineNumber - selection.startLineNumber;
        const chars = model
          .getValueInRange(editor.getSelection())
          .split('')
          .length;

        this.updateSelection({ lines, chars });
      });

      // Fired when the text in the editor changes
      editor.onDidChangeModelContent(e => {
        let content;
        let range;

        this.updateEditorContent(editor.getValue());

        if (e.isFlush || e.changes[0].forceMoveMarkers) {
          // flush/forceMoveMarkers will be true when the contents of
          // the editor were set programmatically. Don't send
          // any data since it'ss cause an endless loop
          return;
        }

        // Since undoing/redoing causes so many changes, we'll just
        // send the entire contents of the editor instead of broadcasting
        // every change that was undone/redone
        if (e.isUndoing || e.isRedoing) {
          range = null;
          content = editor.getValue();
        } else {
          range = e.changes[0].range;
          content = e.changes[0].text;
        }

        // A user is connected to this workspace so
        // emit to all connected users
        if (this.numUsersConnected > 0) {
          socket.emit('updateEditorContent', {
            content: content,
            range: range,
            room: this.workspaceId
          });
        } else if (this.connectedWorkspaceId) {

          // This user is connected to a different workspace
          // so emit to their workspace
          socket.emit('updateEditorContent', {
            content: content,
            range: range,
            room: this.connectedWorkspaceId
          });
        }
      });

      socket.on('editorContentUpdated', payload => {
        const { socketId, updatedContent, range } = payload;

        // Make sure this user's edits don't trigger
        // the editor content to update
        if (socket.id !== socketId) {
          if (!range) {
            editor.getModel().setValue(updatedContent);
          } else {
            editor.executeEdits('source', [{
              identifier: {
                major: 1,
                minor: 1
              },
              range: range,
              text: updatedContent,
              forceMoveMarkers: true
            }]);
          }
        }
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