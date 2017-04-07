import Vue from 'vue'
import App from './App.vue'
import MintUi from 'mint-ui'
import VueRouter from 'vue-router'
import Foo from './component/foo.vue'
import Bar from './component/bar.vue'
import Toast from './component/toast.vue'
import btn from './component/button.vue'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Notice from './component/notice.vue'
import homework from './component/homework.vue'
import c_notice from './component/createNotice.vue'

Vue.use(VueAxios,axios)
Vue.use(MintUi)
Vue.use(VueRouter)
var routes = [{ path: '/foo', component: Foo }, { path: '/bar', component: Bar },{ path: '/toast',component:Toast },
      { path: '/notice', component:Notice },
      { path: '/homework',component:homework },
      { path: '/c_notice',component:c_notice }
];



var router = new VueRouter({
  routes: routes
});
sync(store,router);
// console.log(btn.$template);
Vue.component('Button',btn)
var app = new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store:store
})
export { app, router,store }
