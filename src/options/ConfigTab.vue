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
          <v-tabs color="primary" dark>
            <v-tab ripple>
              Sources and Settings
            </v-tab>
            <v-tab ripple>
              Talks
            </v-tab>
            <v-tab ripple>
              About
            </v-tab>
            <v-tab-item>
              <settings
                @onScreenCaptureStream="onScreenCaptureStream"
              />
            </v-tab-item>
            <v-tab-item>
              <talks />
            </v-tab-item>
            <v-tab-item>
              About
            </v-tab-item>
          </v-tabs>

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
  import Settings from './Settings'
  import Talks from './Talks'

  export default {
    components: {
      Settings,
      Talks
    },
    data: () => ({
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
      audioInputId () {
        return this.$store.state.audioInputId
      },
      cameraInputId () {
        return this.$store.state.cameraInputId
      }
    },
    watch: {
      cameraInputId (deviceId) {
        this.setCameraStream(deviceId)
      },
      screenCaptureStream (newVal, oldVal) {
        this.updatePreview()
      },
      cameraStream (newVal, oldVal) {
        this.updatePreview()
      }
    },
    mounted () {
      this.createLayoutStream()
      this.setCameraStream()
      this.updatePreview()
    },
    methods: {
      onScreenCaptureStream (stream) {
        this.screenCaptureStream = stream
      },
      createLayoutStream () {
        const canvas = this.$refs['layoutCanvas']

        this.updateCanvas()

        setInterval(this.updateCanvas, 5000)

        this.layoutStream = canvas.captureStream()
        this.layoutStream.width = 1920
        this.layoutStream.height = 1080
        this.layoutStream.fullcanvas = 1

        // this.$refs['captureStreamPreview'].srcObject = this.layoutStream
      },
      updateCanvas () {
        const canvas = this.$refs['layoutCanvas']
        this.$html2canvas(this.$refs['layout'], {
          canvas: canvas
        })
      },
      setCameraStream (deviceId) {
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
      }
    }
  }
</script>
