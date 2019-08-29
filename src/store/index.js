import Vue from 'vue';
import Vuex from 'vuex';
import editor from '@/store/modules/editor';
import generateModalState from '@/store/modules/modal';
import {
  fontDialog,
  indentDialog,
  workspaceIdDialog,
  settingsDrawer
} from '@/store/modules/moduleNames';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  modules: {
    editor,
    [fontDialog]: generateModalState(),
    [indentDialog]: generateModalState(),
    [workspaceIdDialog]: generateModalState(),
    [settingsDrawer]: generateModalState()
  }
});
