<template>
  <div id="stream-mixer">
    <v-card class="mb-5">
      <v-card-title>
        <h5 class="headline">
          Preview
        </h5>
        <v-spacer></v-spacer>
        {{ parseInt(audioLevel) }} <v-icon>volume_up</v-icon>
      </v-card-title>

      <video
          autoplay="true"
          ref="captureStreamPreview"
          class="capture-preview"
          muted
      />

      <recording
        :stream="mixedStream"
      />
    </v-card>
  </div>
</template>

<script>
  import MultiStreamsMixer from 'multistreamsmixer'
  import Recording from './Recording'

  export default {
    name: 'stream-mixer',
    components: {
      Recording
    },
    props: {
      cameraStream: null,
      audioStream: null,
      screenCaptureStream: null,
      layoutStream: null
    },
    data: () => ({
      mixer: null,
      mixedStream: null,
      audioLevel: 0
    }),
    watch: {
      cameraStream (val) {
        this.createOrUpdateMixer()
      },
      audioStream (val) {
        this.createOrUpdateMixer()
      },
      screenCaptureStream (val) {
        this.createOrUpdateMixer()
      },
      layoutStream (val) {
        this.createOrUpdateMixer()
      }
    },
    methods: {
      createOrUpdateMixer () {
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

        if (streams !== null && streams.length > 0) {
          if (this.mixer === null) {
            this.mixer = new MultiStreamsMixer(streams)
            this.mixedStream = this.mixer.getMixedStream()
            this.$refs['captureStreamPreview'].srcObject = this.mixedStream
          } else {
            this.mixer.resetVideoStreams(streams)
          }

          // Add audio
          if (this.audioStream) {
            console.log('audiostream')
            this.mixedStream.getAudioTracks().forEach(track => this.mixedStream.removeTrack(track))
            this.mixedStream.addTrack(this.audioStream.getAudioTracks()[0])

            const audioContext = new AudioContext()
            const analyser = audioContext.createAnalyser()
            const microphone = audioContext.createMediaStreamSource(this.audioStream)
            const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

            analyser.smoothingTimeConstant = 0.8
            analyser.fftSize = 1024

            microphone.connect(analyser)
            analyser.connect(javascriptNode)
            javascriptNode.connect(audioContext.destination)

            javascriptNode.onaudioprocess = () => {
              const array = new Uint8Array(analyser.frequencyBinCount)
              analyser.getByteFrequencyData(array)
              let values = 0

              const length = array.length
              for (let i = 0; i < length; i++) {
                values += (array[i])
              }

              this.audioLevel = values / length
            }
          }

          this.mixer.frameInterval = 1
          this.mixer.startDrawingFrames()
        }
      }
    }
  }
</script>
