<template>
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
      ref="downloadButton"
      download="meetup.webm"
    >
      <v-icon>save</v-icon> Download
    </v-btn>
  </v-card-actions>
</template>

<script>
  import moment from 'moment'

  export default {
    props: {
      stream: null
    },
    data: () => ({
      recording: false,
      recordingStartTime: null,
      recordingStopTime: null,
      recordingTime: '00:00:00',
      recordingInterval: null,
      mediaRecorder: null,
      buffer: [],
      file: null
    }),
    mounted () {
      this.$store.commit('setRecordingStatus', false)
    },
    destroyed () {
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

        this.mediaRecorder = new MediaRecorder(this.stream, options)
        this.mediaRecorder.onstop = this.onStopRecording
        this.mediaRecorder.ondataavailable = this.onDataAvailable
        this.mediaRecorder.start()

        this.recording = true
        this.recordingStartTime = new Date()
        clearInterval(this.recordingInterval)
        this.recordingInterval = setInterval(this.recordingTimeUpdate, 1000)
        this.$store.commit('setRecordingStatus', true)
      },
      stopRecording () {
        this.mediaRecorder.stop()
        this.$store.commit('setRecordingStatus', false)
        this.$refs['downloadButton'].click()
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
      }
    }
  }
</script>
