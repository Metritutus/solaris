import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import VueGtag from 'vue-gtag'
import Toasted from 'vue-toasted'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap'
import 'bootswatch/dist/darkly/bootstrap.min.css'

import 'pixi.js'
import 'pixi-viewport'

Vue.config.productionTip = false

Vue.use(new VueSocketio({
  debug: true,
  connection: `//${process.env.VUE_APP_SOCKETS_HOST}`,
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
}))

let trackingCode = process.env.VUE_APP_GOOGLE_ANALYTICS_TRACKING_CODE

if (trackingCode) {
  Vue.use(VueGtag, {
    config: { id: trackingCode }
  }, router)
}

Vue.use(Toasted, {
  position: 'bottom-right',
  duration: 3000
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
