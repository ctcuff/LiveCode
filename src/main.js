import Vue from 'vue';
import App from './App.vue';
import store from '@/store';
import MdDialog from 'vue-material/dist/components/MdDialog';
import MdButton from 'vue-material/dist/components/MdButton';
import MdField from 'vue-material/dist/components/MdField';
import MdIcon from 'vue-material/dist/components/MdIcon';
import MdTooltip from 'vue-material/dist/components/MdTooltip';
import MdDivider from 'vue-material/dist/components/MdDivider';
import MdProgress from 'vue-material/dist/components/MdProgress';
import MdCheckbox from 'vue-material/dist/components/MdCheckbox';
import MdList from 'vue-material/dist/components/MdList';
import MdSnackbar from 'vue-material/dist/components/MdSnackbar';
import MdToolbar from 'vue-material/dist/components/MdToolbar';
import MdDrawer from 'vue-material/dist/components/MdDrawer';
import MdMenu from 'vue-material/dist/components/MdMenu';
import MdSubheader from 'vue-material/dist/components/MdSubheader';
import '@/assets/scss/global.scss';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/theme/default-dark.css';
import { firebase, firebaseDatabase } from '@/util/firebase';

firebase.auth().onAuthStateChanged(user => {
  store.commit('user/setIsSignedIn', user !== null);
  store.commit('user/setUid', (user && user.uid) || null);
  store.commit('user/setEmail', (user && user.email) || null);

  if (user) {
    const ref = firebaseDatabase.ref(`/users/${user.uid}`);

    ref.once('value').then(snapshot => {
      // Only give the user a workspace ID if they are registering
      // for the first time
      if (!snapshot.exists()) {
        const workspaceId = uuidv4().slice(0, 8).toUpperCase();
        ref
          .set({ workspaceId })
          .then(() => {
            store.commit('user/setWorkspaceId', workspaceId);
            store.dispatch('workspaceIdDialog/show');
          })
          .catch(err => console.log(err));
      } else {
        store.commit('user/setWorkspaceId', snapshot.val().workspaceId);
      }
    });
  } else {
    store.commit('user/setWorkspaceId', null);
  }
});

Vue.config.productionTip = false;
Vue.prototype.$firebase = firebase;
Vue.prototype.$firebaseDB = firebaseDatabase;

Vue.use(MdDialog);
Vue.use(MdButton);
Vue.use(MdField);
Vue.use(MdIcon);
Vue.use(MdTooltip);
Vue.use(MdDivider);
Vue.use(MdProgress);
Vue.use(MdCheckbox);
Vue.use(MdList);
Vue.use(MdSnackbar);
Vue.use(MdToolbar);
Vue.use(MdDrawer);
Vue.use(MdMenu);
Vue.use(MdSubheader);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = (c === 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
