// import * as types from '../../vuex/mutation-types'

export default {
  computed: {
    meetupTitle () {
      return this.$store.state.meetupTitle
    },
    currentTalk () {
      return this.$store.state.talks.currentTalk
    }
  },
  mounted () {
    this.$store.dispatch('setCurrentTalk')
  }
}
