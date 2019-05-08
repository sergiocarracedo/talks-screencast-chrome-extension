import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import modules from './modules'

Vue.use(Vuex)

const state = {
  title: 'Test',
  ug: 'phpvigo',
  ugList: [],
  cameraInputId: null,
  audioInputId: null,
  meetupTitle: 'Meetup title',
  showClock: true,
  lightningDuration: '5:00',
  recording: false
}

const mutations = {
  setTitle: (state, payload) => { state.title = payload },
  setAudioInput: (state, payload) => { state.audioInputId = payload },
  setCameraInput: (state, payload) => { state.cameraInputId = payload },
  setUg: (state, payload) => { state.ug = payload },
  setUgList: (state, payload) => { state.ugList = payload },
  setTalks: (state, payload) => { state.talks = payload },
  setShowClock: (state, payload) => {
    console.log(state)
    state.showClock = payload
  },
  setMeetupTitle: (state, payload) => { state.meetupTitle = payload },
  setLightningDuration: (state, payload) => { state.lightningDuration = payload },
  setRecordingStatus: (state, payload) => { state.recording = payload }
}

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  mutations,
  modules
})
