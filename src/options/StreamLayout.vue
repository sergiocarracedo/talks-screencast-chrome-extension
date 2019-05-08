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
