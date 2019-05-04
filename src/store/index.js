import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    title: 'Test',
    cameraInputId: null,
    audioInputId: null,
    screenCaptureStream: null
  },
  mutations: {
    setTitle: (state, payload) => { state.title = payload },
    setAudioInput: (state, payload) => { state.audioInputId = payload },
    setCameraInput: (state, payload) => { state.cameraInputId = payload },
    setScreenCaptureStream: (state, payload) => { state.screenCaptureStream = payload }
  }
})
