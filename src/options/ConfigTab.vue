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

          <stream-mixer
              :layoutStream="layoutStream"
              :cameraStream="cameraStream"
              :audioStream="audioStream"
              :screenCaptureStream="screenCaptureStream"
              @recordingStatusChange="onRecordingStatusChange"
          />


          <v-tabs color="primary" dark class="mb-5">
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
              <about />
            </v-tab-item>
          </v-tabs>

          <stream-layout
            :ug="ug"
            @createLayoutStream="onCreateLayoutStream"
          />

        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
  import Settings from './Settings'
  import Talks from './Talks'
  import About from './About'
  import StreamLayout from './StreamLayout'
  import StreamMixer from './StreamMixer'

  export default {
    components: {
      Settings,
      Talks,
      About,
      StreamMixer,
      StreamLayout
    },
    data: () => ({
      preview: true,
      cameraStream: null,
      audioStream: null,
      layoutStream: null,
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
      },
      recording () {
        return this.$store.state.recording
      }
    },
    watch: {
      cameraInputId (deviceId) {
        this.setCameraStream(deviceId)
      },
      audioInputId (deviceId) {
        this.setAudioStream(deviceId)
      },
      preview (newVal) {
        if (newVal) {
          this.createPreview()
        } else {
          this.destroyPreview()
        }
      }
    },
    created () {
      window.onbeforeunload = this.closeHandler
    },
    methods: {
      onCreateLayoutStream (layoutStream) {
        this.layoutStream = layoutStream
        this.createOrUpdateStreams()
      },
      onRecordingStatusChange (recordingStatus) {
        this.recording = recordingStatus
      },
      createOrUpdateStreams () {
        this.setCameraStream(this.cameraInputId)
        this.setAudioStream(this.audioInputId)
        // this.updatePreview()
      },
      destroyPreview () {
        try {
          this.mixerStream.releaseStreams()
          this.mixerStream = null
        } catch (e) {}

        this.layoutStream.getTracks().forEach(track => track.stop())

        try {
          this.cameraStream.getTracks().forEach(track => track.stop())
        } catch (e) {}

        try {
          this.screenCaptureStream.getTracks().forEach(track => track.stop())
        } catch (e) {}
      },
      onScreenCaptureStream (stream) {
        this.screenCaptureStream = stream
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
      setAudioStream (deviceId) {
        const constraints = {
          audio: {
            deviceId: {exact: deviceId}
          }
        }
        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            if (this.audioStream === null) {
              this.audioStream = stream
            }
          })
      },
      closeHandler (e) {
        if (this.recording) {
          e = e || window.event

          if (e) {
            e.returnValue = 'Close this tab cancel recording. Are you sure?'
          }
          return 'Close this tab cancel recording. Are you sure?'
        }
      }
    }
  }
</script>

