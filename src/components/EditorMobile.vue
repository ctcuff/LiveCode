<template>
  <div id="editor-mobile">{{defaultText}}</div>
</template>

<script>
  import { editorDefaults } from '@/store/modules/editor';
  import { mapState, mapActions, mapGetters } from 'vuex';
  import { socket } from '@/util/socket';

  const ace = window.ace;
  let editor;

  export default {
    data() {
      return {
        defaultText: editorDefaults.content
      };
    },
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
        'connectedWorkspaceId'
      ]),
      ...mapGetters('user', ['numUsersConnected']),
      ...mapGetters('editor', ['contentSizeInBytes'])
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
        if (type.includes('editor')) {
          switch (type) {
            case 'editor/setFontSize':
              editor.setOption('fontSize', payload);
              break;
            case 'editor/setLanguage':
              editor.setOption('mode', `ace/mode/${payload}`);
              break;
            case 'editor/setEditorTheme':
              editor.setOption('theme', `ace/theme/${payload}`);
              break;
            case 'editor/toggleWhitespace':
              editor.setOption('showInvisibles', this.renderWhitespace);
              break;
            case 'editor/setIndentSize':
              editor.session.setOption('tabSize', this.indentSize);
              break;
            case 'editor/setUseTabs':
              editor.session.setOption('useSoftTabs', !this.useTabs);
              break;
            case 'editor/toggleWordWrap':
              editor.session.setOption('wrap', this.wordWrap);
              break;
            case 'editor/toggleLineNumbers':
              editor.setOption('showLineNumbers', this.showLineNumbers);
              editor.setOption('showGutter', this.showLineNumbers);
              break;
            case 'editor/toggleIndentGuides':
              editor.setOption('displayIndentGuides', this.showIndentGuides);
              break;
          }
        }
      }
    },
    destroyed() {
      if (editor) {
        editor.destroy();
      }
    },
    mounted() {
      this.$store.subscribe(this.handleConfigChange);

      editor = ace.edit('editor-mobile');
      editor.renderer.setPadding(16);
      editor.setOptions({
        fontSize: this.fontSize,
        showLineNumbers: this.showLineNumbers,
        showGutter: this.showLineNumbers,
        displayIndentGuides: this.showIndentGuides,
        showInvisibles: this.renderWhitespace,
        theme: `ace/theme/${this.currentTheme}`,
        mode: `ace/mode/${this.selectedLanguage}`,
        wrapBehavioursEnabled: true,
        showPrintMargin: false,
        scrollPastEnd: true
      });
      editor.session.setOptions({
        useSoftTabs: !this.useTabs, // false === use tabs
        tabSize: this.indentSize,
        wrap: this.wordWrap
      });


      editor.on('changeSelection', () => {
        const { row, column } = editor.getCursorPosition();
        const { start, end } = editor.getSelectionRange();
        const selectedText = editor.getSelectedText();

        if (!start || !end || !row || !column) {
          return;
        }

        this.updateSelection({
          lines: end.row - start.row,
          chars: selectedText.split('').length
        });

        this.updateCursorPosition({
          line: row + 1,
          col: column + 1
        });
      });

      editor.session.on('change', e => {
        const { start, end, action, lines } = e;
        const content = (action === 'insert') ? lines.join('') : '';

        // Need to add 1 to the range since Monaco's line
        // numbers start at 1
        const range = {
          startLineNumber: start.row + 1,
          startColumn: start.column + 1,
          endLineNumber: end.row + 1,
          endColumn: end.column + 1
        };

        this.updateEditorContent(editor.getValue());

        if (this.numUsersConnected > 0) {
          socket.emit('updateEditorContent', {
            content: content,
            range: range,
            room: this.workspaceId
          });
        } else if (this.connectedWorkspaceId) {
          socket.emit('updateEditorContent', {
            content: content,
            range: range,
            room: this.connectedWorkspaceId
          });
        }
      });

      editor.on('focus', () => {
        if (this.isSettingsOpen) {
          this.closeSettingsDrawer();
        }
      });

      socket.on('editorContentUpdated', payload => {
        const { socketId, updatedContent, range } = payload;

        // Make sure this user's edits don't trigger
        // the editor content to update
        if (socket.id !== socketId) {
          if (!range) {
            editor.setValue(updatedContent);
            editor.clearSelection();
            return;
          }

          const aceRange = new ace.Range(
            range.startLineNumber - 1,
            range.startColumn - 1,
            range.endLineNumber - 1,
            range.endColumn - 1
          );

          if (updatedContent) {
            editor.session.replace(aceRange, updatedContent);
          } else {
            editor.session.remove(aceRange);
          }
        }
      });
    }
  };
</script>

<style lang="scss" scoped>
  @import "../assets/scss/navbar";
  @import "../assets/scss/gutter";

  #editor-mobile {
    width: 100%;
    height: calc(100vh - #{$navbar-height} - #{$gutter-height});
  }
</style>