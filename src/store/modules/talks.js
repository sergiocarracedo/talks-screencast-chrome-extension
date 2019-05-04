const defaultTalks = [{
  title: 'Charla',
  speaker: 'Ponente',
  isLightning: false
}]

const state = {
  talks: defaultTalks,
  currentTalk: {},
  currentTalkIndex: 0
}

const mutations = {
  addTalk (state, talk) {
    console.log(state)
    state.talks.push(talk)
  },
  removeTalk: (state, talk) => {
    const talks = state.talks
    talks.splice(talks.indexOf(talk), 1)
  },
  updateTalk: (state, talk) => {
    const talks = state.talks
    talks[talks.indexOf(talk)] = talk
  },
  setCurrentTalkIndex: (state, index) => { state.currentTalkIndex = index },
  setCurrentTalk: (state, talk) => { state.currentTalk = talk }
}

const actions = {
  setCurrentTalk: (context, index) => {
    if (index === undefined) {
      index = context.state.currentTalkIndex
    }
    context.commit('setCurrentTalkIndex', index)
    context.commit('setCurrentTalk', context.state.talks[index])
  }
}

const getters = {
  talksLength: state => state.talks.length
}

export default {
  state,
  mutations,
  actions,
  getters
}
