import Vue from 'vue'
import root from './RecordingLayout.vue'
import store from '../store'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(root),
  store
})
