<template>
  <div id="vigotech">
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
  import './assets/scss/vigojug.scss'

  export default {
    name: 'vigojug',
    mixins: [UserGroup]
  }
</script>
