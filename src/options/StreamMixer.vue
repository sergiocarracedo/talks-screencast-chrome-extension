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

      <v-card-actions>
        <v-btn
            color="primary"
            @click="startRecording"
            :disabled="recording"
        >
          <v-icon>fiber_manual_record</v-icon> Start recording
        </v-btn>

        <v-btn
            color="primary"
            @click="stopRecording"
            :disabled="!recording"
        >
          <v-icon>stop</v-icon> Stop recording
        </v-btn>

        <v-spacer />
        {{ recordingTime }}
        <v-spacer />

        <v-btn
            :href="file"
            :disabled="!file"
            download="meetup.webm"
        >
          <v-icon>save</v-icon> Download
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import MultiStreamsMixer from 'multistreamsmixer'

  export default {
    name: 'stream-mixer',
    props: {
      cameraStream: null,
      audioStream: null,
      screenCaptureStream: null,
      layoutStream: null
    },
    date: () => ({
      recordingStartTime: null,
      recordingStopTime: null,
      recordingTime: '00:00:00',
      recordingInterval: null,
      layoutStream: null,
      mixer: null,
      mixedStream: null,
      mediaRecorder: null,
      buffer: [],
      file: null,
      audioLevel: 0
    }),
    mounted () {
      this.createOrUpdateMixer()
    },
    destroyed () {
      this.destroyPreview()
      this.mediaRecorder.stop()
    },
    methods: {
      startRecording () {
        // Clear buffer
        this.buffer = []

        const options = {
          mimeType: 'video/webm',
          video: {
            width: 1920,
            height: 1080
          }
        }

        this.mediaRecorder = new MediaRecorder(this.mixedStream, options)
        this.mediaRecorder.onstop = this.onStopRecording
        this.mediaRecorder.ondataavailable = this.onDataAvailable
        this.mediaRecorder.start()

        this.recording = true
        this.recordingStartTime = new Date()
        clearInterval(this.recordingInterval)
        this.recordingInterval = setInterval(this.recordingTimeUpdate, 1000)
      },
      stopRecording () {
        this.mediaRecorder.stop()
      },
      recordingTimeUpdate () {
        const d = moment.duration(moment(new Date()).diff(this.recordingStartTime)).asSeconds()
        const h = ('0' + parseInt(d / 3600)).slice(-2)
        const m = ('0' + parseInt((d / 60) % 60)).slice(-2)
        const s = ('0' + parseInt(d % 60)).slice(-2)
        this.recordingTime = `${h}:${m}:${s}`
      },
      onStopRecording (e) {
        clearInterval(this.recordingInterval)
        this.recording = false
        this.recordingStopTime = new Date()

        const blob = new Blob(this.buffer, {
          type: 'video/webm'
        })

        this.file = URL.createObjectURL(blob)
      },
      onDataAvailable (e) {
        if (e.data) {
          this.buffer.push(e.data)
        }
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

        if (streams.length > 0) {
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

            console.log('tracks', this.mixedStream.getTracks())

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
