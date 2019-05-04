<template>
  <div id="phpvigo">
    <obs-header
        :title="meetupTitle"
        :logo="true"
    ></obs-header>

    <obs-aside :isLightning="currentTalk.isLightning"></obs-aside>

    <obs-footer :speaker="currentTalk.speaker" :title="currentTalk.title"></obs-footer>
  </div>
</template>

<script>
  import UserGroup from '../UserGroup'
  import './assets/fonts/dosis.css'
  import './assets/scss/phpvigo.scss'

  export default {
    name: 'phpvigo',
    mixins: [UserGroup]
  }
</script>
