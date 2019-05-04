import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    title: 'Test',
    ug: 'phpvigo',
    cameraInputId: null,
    audioInputId: null
  },
  mutations: {
    setTitle: (state, payload) => { state.title = payload },
    setAudioInput: (state, payload) => { state.audioInputId = payload },
    setCameraInput: (state, payload) => { state.cameraInputId = payload },
    setUg: (state, payload) => { state.ug = payload }
  }
})
