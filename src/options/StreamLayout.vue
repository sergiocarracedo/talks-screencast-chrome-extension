<template>
  <div class="layout">
    <canvas ref="layoutCanvas"></canvas>

    <div class="layout-wrapper">
      <div ref="layout" id="layout">
        <component
            :class="`ug-${ug}`"
            :is="ug"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'video-layout',
    props: {
      ug: {
        required: true
      }
    },
    data: () => ({
      layoutStream: null
    }),
    computed: {
      showClock () {
        return this.$store.state.showClock
      },
      ug () {
        return this.$store.state.ug
      },
      meetupTitle () {
        return this.$store.state.meetupTitle
      },
      talks () {
        return this.$store.state.talks.talks
      },
      currentTalk () {
        return this.$store.state.talks.currentTalk
      }
    },
    watch: {
      showClock () {
        this.updateCanvas()
      },
      ug () {
        this.updateCanvas()
      },
      meetupTitle: {
        handler: _.debounce(function () {
          this.updateCanvas()
        }, 1000)
      },
      talks: {
        handler: _.debounce(function () {
          this.updateCanvas()
        }, 1000),
        deep: true
      },
      currentTalk: {
        handler: _.debounce(function () {
          this.updateCanvas()
        }, 1000)
      }
    },
    mounted () {
      this.createLayoutStream()
    },
    methods: {
      createLayoutStream () {
        const canvas = this.$refs['layoutCanvas']

        this.updateCanvas()
        // setInterval(this.updateCanvas, 1500)

        this.layoutStream = canvas.captureStream()
        this.layoutStream.width = 1920
        this.layoutStream.height = 1080
        this.layoutStream.fullcanvas = 1

        this.$emit('createLayoutStream', this.layoutStream)
      },
      updateCanvas () {
        const canvas = this.$refs['layoutCanvas']
        this.$html2canvas(this.$refs['layout'], {
          canvas: canvas
        })
      }
    }
  }
</script>
