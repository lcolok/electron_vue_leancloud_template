
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import store from './store'
import lottie from "vue-lottie";
import Vue from "vue";
Vue.component("lottie", lottie);
Vue.config.productionTip = false

import AV from 'leancloud-storage'

//以下这个为美国节点
/* AV.init({
  appId: 'eiFnyWWSdKM4YOW6jdrc77AP-MdYXbMMI',
  appKey: 'JWmRjxc5E33n2lebvMDhURsH',
}); */
AV.init({
  appId: '1oHwyqv3qyzH6hFsjCJULJ31-gzGzoHsz',
  appKey: 'g7G4uPGRbJc5GaK4yn36FqkC',
});

Vue.prototype.$AV = AV;

// Vue.prototype.$Vue = Vue;

new Vue({
  router,
  i18n,
  store,
  lottie,
  render: h => h(App)
}).$mount('#app')

