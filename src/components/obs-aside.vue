<template>
  <aside>
    <obs-clock v-if="showClock"></obs-clock>
    <obs-lightning v-if="isLightning"></obs-lightning>
  </aside>
</template>

<script>
  export default {
    name: 'obs-aside',
    props: [
      'isLightning'
    ],
    computed: {
      showClock () {
        return true // this.$store.state.settings.showClock
      }
    }
  }
</script>
