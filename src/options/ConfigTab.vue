<template>
  <v-app id="config-tab">
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>VigoTech Talk Screencast</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-container grid-list-md>
      <v-layout justify-center>
        <v-flex xs12 sm8 md8>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-select
                      :items="videoInputs"
                      v-model="cameraInputId"
                      item-text="label"
                      item-value="id"
                      label="Camera"
                      @change="setCameraStream"
                  />
                </v-flex>
                <v-flex xs12 sm4>
                  <v-select
                      :items="audioInputs"
                      v-model="audioInputId"
                      item-text="label"
                      item-value="id"
                      label="Audio"

                  />
                </v-flex>
                <v-flex xs12 sm4>
                  <v-btn
                      color="primary"
                      @click="selectTab"
                  >
                    Select tab to record
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>


          <v-card>
            <video
                autoplay="true"
                ref="captureStreamPreview"
                class="capture-preview"
                muted
            />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
  import MultiStreamsMixer from 'multistreamsmixer'
  export default {
    data: () => ({
      videoInputs: [],
      audioInputs: [],
      cameraStream: null,
      screenCaptureStream: null
    }),
    computed: {
      title: {
        get () {
          return this.$store.state.title
        },
        set (value) {
          this.$store.commit('setTitle', value)
        }
      },
      audioInputId: {
        get () {
          return this.$store.state.audioInputId
        },
        set (value) {
          this.$store.commit('setAudioInput', value)
        }
      },
      cameraInputId: {
        get () {
          return this.$store.state.cameraInputId
        },
        set (value) {
          this.$store.commit('setCameraInput', value)
        }
      }
    },
    watch: {
      screenCaptureStream (newVal, oldVal) {
        this.updatePreview()
      },
      cameraStream (newVal, oldVal) {
        this.updatePreview()
      }
    },
    mounted () {
      this.getDevices()
      this.setCameraStream()
      this.updatePreview()
    },
    methods: {
      setCameraStream () {
        const deviceId = this.cameraInputId
        const constraints = {
          video: {
            deviceId: {exact: deviceId}
          }
        }
        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            this.cameraStream = stream
          })
      },
      getDevices () {
        navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            devices.forEach((device, key) => {
              switch (device.kind) {
                case 'audioinput':
                  this.audioInputs.push({
                    id: device.deviceId,
                    label: device.label || `Microphone: ${device.deviceId}`
                  })
                  break
                case 'videoinput':
                  this.videoInputs.push({
                    id: device.deviceId,
                    label: device.label || `Video: ${device.deviceId}`
                  })
                  break
              }
            })
          })
      },
      updatePreview () {
        const streams = []

        // Add screen capture steam
        if (this.screenCaptureStream) {
          this.screenCaptureStream.fullcanvas = 1
          this.screenCaptureStream.width = 1920
          this.screenCaptureStream.height = 1080
          streams.push(this.screenCaptureStream)
        }

        // Add camera capture
        if (this.cameraStream) {
          this.cameraStream.width = 320
          this.cameraStream.height = 200
          if (this.screenCaptureStream) {
            this.cameraStream.top = this.screenCaptureStream.height - this.cameraStream.height
            this.cameraStream.left = this.screenCaptureStream.width - this.cameraStream.width
          } else {
            this.cameraStream.top = 0
            this.cameraStream.left = 0
          }
          streams.push(this.cameraStream)
        }

        if (streams.length > 0) {
          const mixer = new MultiStreamsMixer(streams)

          mixer.frameInterval = 1
          mixer.startDrawingFrames()

          console.log(mixer.getMixedStream())

          this.$refs['captureStreamPreview'].srcObject = mixer.getMixedStream()
        }
      },
      selectTab () {
        chrome.desktopCapture.chooseDesktopMedia(['tab', 'window', 'screen'], (streamId) => {
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
              this.screenCaptureStream = stream
            })
            .catch(error => console.log(error, error.message))
        })
      }
    }
  }
</script>

<style>

</style>
