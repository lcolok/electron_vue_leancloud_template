
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
  appId: 'OoFIwrWMmpITh2amlEu1ydM4-gzGzoHsz',
  appKey: 'iwJMvV3U3JqKMkSmdLFJU1v4',
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

