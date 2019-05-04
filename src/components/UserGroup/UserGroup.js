// import * as types from '../../vuex/mutation-types'

export default {
  computed: {
    meetup () {
      return 'Test' // this.$store.state.settings.meetup;
    },
    currentTalk () {
      return 'Talk' // this.$store.state.talks.currentTalk;
    }
  },
  mounted () {
    // this.$store.dispatch(types.ACTION_SET_CURRENT_TALK);
  }
}
