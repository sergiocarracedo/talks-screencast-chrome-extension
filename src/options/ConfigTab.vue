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

          <canvas ref="layoutCanvas"></canvas>

          <div class="layout-wrapper">
            <div ref="layout" id="layout">
              <component
                :class="`ug-${ug}`"
                :is="ug"
              />
            </div>
          </div>
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
      layoutStream: null,
      cameraStream: null,
      screenCaptureStream: null
    }),
    computed: {
      ug: {
        get () {
          return this.$store.state.ug
        },
        set (value) {
          this.$store.commit('setUg', value)
        }
      },
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
      this.createLayoutStream()
      this.getDevices()
      this.setCameraStream()
      this.updatePreview()
    },
    methods: {
      createLayoutStream () {
        const canvas = this.$refs['layoutCanvas']

        this.$html2canvas(this.$refs['layout'], {
          canvas: canvas
        })
        this.layoutStream = canvas.captureStream()
        this.layoutStream.width = 1920
        this.layoutStream.height = 1080
        this.layoutStream.fullcanvas = 1

        // this.$refs['captureStreamPreview'].srcObject = this.layoutStream
      },
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

        // Add layout
        streams.push(this.layoutStream)

        // Add screen capture steam
        if (this.screenCaptureStream) {
          this.screenCaptureStream.top = 60
          this.screenCaptureStream.left = 0
          this.screenCaptureStream.width = 1520
          this.screenCaptureStream.height = 900
          streams.push(this.screenCaptureStream)
        }

        // Add camera capture
        if (this.cameraStream) {
          this.cameraStream.width = 400
          this.cameraStream.height = 230
          this.cameraStream.top = this.layoutStream.height - this.cameraStream.height - 80
          this.cameraStream.left = this.layoutStream.width - this.cameraStream.width
          streams.push(this.cameraStream)
        }

        console.log(streams)
        if (streams.length > 0) {
          const mixer = new MultiStreamsMixer(streams)

          mixer.frameInterval = 1
          mixer.startDrawingFrames()

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
