import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import store from './store'
// 配置axios
axios.defaults.baseURL = 'https://mysterious-tundra-91228.herokuapp.com/'
Vue.prototype.$http = axios

Vue.filter('dateFormat', function (value) {
  const dt = new Date(value)
  var m = dt.getMinutes()
  var s = dt.getSeconds()
  if (s < 10) {
    s = '0' + s
  }
  if (m < 10) {
    m = '0' + m
  }
  return `${m}:${s}`
})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
