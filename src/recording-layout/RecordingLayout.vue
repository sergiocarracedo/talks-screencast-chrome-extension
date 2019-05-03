<template>
  <div>
    <div>
      {{ tabInputId }} <br />
      <video ref="mainVideoStream" class="main-video" autoplay />
    </div>

    <div>
      {{ cameraInputId }}<br />
      <video ref="secondaryVideoStream" class="secondary-video" autoplay />
    </div>

    Recording layout
  </div>
</template>

<script>
  export default {
    data: () => ({
      text: 'hola'
    }),
    computed: {
      title () {
        return this.$store.state.title
      },
      audioInputId () {
        return this.$store.state.audioInputId
      },
      cameraInputId () {
        return this.$store.state.cameraInputId
      },
      tabInputId () {
        return this.$store.state.tabInputId
      }
    },
    mounted () {
      this.setSecondaryStream(this.cameraInputId)
      console.log(this.$store.state)
      this.setMainStream(this.tabInputId)
    },
    methods: {
      setSecondaryStream: function (deviceId) {
        const constraints = {
          video: {
            deviceId: {exact: deviceId}
          }
        }

        console.log('deviceId', deviceId)

        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            this.$refs['secondaryVideoStream'].srcObject = stream
          })
          // .catch(() => {})
      },
      setMainStream: function (streamId) {
        console.log(streamId)
        const constraints = {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: streamId
            }
          }
        }

        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            this.$refs['mainVideoStream'].srcObject = stream
          })
          .catch(error => console.log(error, error.message))
      }
    }
  }
</script>
