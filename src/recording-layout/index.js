import Vue from 'vue'
import root from './RecordingLayout.vue'
import store from '../store'
import '../scss/recoding-layout.scss'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(root),
  store
})
