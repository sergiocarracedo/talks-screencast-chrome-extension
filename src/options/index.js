import Vue from 'vue'
import root from './ConfigTab.vue'
import Vuetify from 'vuetify'
import 'babel-polyfill'
import VueHtml2Canvas from 'vue-html2canvas'
import store from '../store'
import ugComponents from '../components/UserGroup'
import 'vuetify/dist/vuetify.min.css'
import '../scss/config-tab.scss'

Vue.use(Vuetify)
Vue.use(VueHtml2Canvas)

// Read UserGroup folder and get all components
const ugList = []
for (let ugComponent in ugComponents) {
  Vue.component(ugComponents[ugComponent].name, ugComponents[ugComponent])
  ugList.push(ugComponents[ugComponent].name)
}

// Vue.component('settings-dialog', require('../components/Settings/SettingsDialog.vue').default)
// Vue.component('about-dialog', require('../components/About/AboutDialog.vue').default)
Vue.component('obs-header', require('../components/obs-header.vue').default)
Vue.component('obs-footer', require('../components/obs-footer.vue').default)
Vue.component('obs-aside', require('../components/obs-aside.vue').default)
Vue.component('obs-lightning', require('../components/obs-lightning.vue').default)
Vue.component('obs-timer', require('../components/obs-timer.vue').default)
Vue.component('obs-clock', require('../components/obs-clock.vue').default)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(root),
  store
})
