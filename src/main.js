import Vue from 'vue';
import App from './App.vue';
import store from '@/store';
import '@/assets/scss/global.scss';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/theme/default-dark.css';
import firebaseConfig from '@/firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/database';

const app = firebase.initializeApp(firebaseConfig);
const firebaseDatabase = app.database();

Vue.config.productionTip = false;

new Vue({
  store,
  data() {
    return {
      workspaceId: uuidv4().slice(0, 8).toUpperCase(),
      firebaseDB: firebaseDatabase
    };
  },
  render: h => h(App),
}).$mount('#app');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = (c === 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
