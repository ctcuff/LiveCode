import Vue from 'vue';
import Vuex from 'vuex';
import editor from '@/store/modules/editor';
import user from '@/store/modules/user';
import generateModalState from '@/store/modules/modal';
import {
  fontDialog,
  indentDialog,
  workspaceIdDialog,
  settingsDrawer,
  connectWorkspaceDialog,
  signInDialog,
  signOutDialog
} from '@/store/modules/moduleNames';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  modules: {
    editor,
    user,
    [fontDialog]: generateModalState(),
    [indentDialog]: generateModalState(),
    [workspaceIdDialog]: generateModalState(),
    [settingsDrawer]: generateModalState(),
    [connectWorkspaceDialog]: generateModalState(),
    [signInDialog]: generateModalState(),
    [signOutDialog]: generateModalState()
  }
});
