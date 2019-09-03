import Vue from 'vue';
import Vuex from 'vuex';
import editor from '@/store/modules/editor';
import user from '@/store/modules/user';
import snackbar from '@/store/modules/snackbar';
import generateModalState from '@/store/modules/modal';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  modules: {
    editor,
    user,
    snackbar,
    'fontDialog': generateModalState(),
    'indentDialog': generateModalState(),
    'workspaceIdDialog': generateModalState(),
    'settingsDrawer': generateModalState(),
    'connectWorkspaceDialog': generateModalState(),
    'signInDialog': generateModalState(),
    'signOutDialog': generateModalState(),
    'disconnectWorkspaceDialog': generateModalState()
  }
});
