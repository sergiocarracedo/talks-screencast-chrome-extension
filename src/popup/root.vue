<template>
    <div>
      <a class="primary" @click.prevent="tab">Config</a>
    </div>
</template>
<script>
  export default {
    data: () => ({
    }),
    computed: { },
    created () { },
    mounted () { },
    methods: {
      tab () {
        chrome.tabs.create({ url: 'pages/options.html' })
      }
    }
  }
</script>
