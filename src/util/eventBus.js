import Vue from 'vue';

const EventBus = new Vue();
const Events = {
  UPDATE_EDITOR_CONFIG: 'updateEditorConfig',
  OPEN_SETTINGS_DRAWER: 'openSettingsDrawer',
  SHOW_FONT_DIALOG: 'showFontDialog',
  // Fired when the user clicks or uses
  // the arrow to go to a different line of code
  UPDATE_CURSOR_POSITION: 'updateCursorPosition',
  SHOW_INDENTATION_DIALOG: 'showIndentationDialog',
  // Fired when text in the editor is highlighted
  CHARACTER_SELECTION_CHANGE: 'onCharSelectChange',
  // Fired when text in the editor is added/removed.
  // This is used for getting the size in bytes
  ON_TEXT_CONTENT_CHANGE: 'onTextContChange'
};


export { EventBus, Events };