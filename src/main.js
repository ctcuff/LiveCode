import Vue from 'vue';
import App from './App.vue';
import '@/assets/scss/global.scss';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/theme/default-dark.css';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

Vue.config.productionTip = false;
Vue.prototype.$workspaceId = uuidv4().slice(0, 8).toUpperCase();

new Vue({
  render: h => h(App),
}).$mount('#app');
