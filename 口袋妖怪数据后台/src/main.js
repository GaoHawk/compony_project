// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './vuex/store.js'
import { sync } from 'vuex-router-sync'
import Axios from 'axios'

Vue.filter("getStr",function(value){
    if(!value){return ''}
      value = "1-" + value;
    return value;
})


Vue.prototype.$http = Axios
Vue.use(ElementUI)
Vue.config.productionTip = false
sync(store,router);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  template: '<App/>',
  components: { App }
})
