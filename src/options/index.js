import Vue from 'vue'
import root from './ConfigTab.vue'
import Vuetify from 'vuetify'
import store from '../store'
import 'vuetify/dist/vuetify.min.css'
import '../scss/config-tab.scss'

Vue.use(Vuetify)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(root),
  store
})
