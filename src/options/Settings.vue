<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <v-btn
              color="primary"
              @click="selectTab"
              block
          >
            Select tab to record
          </v-btn>
        </v-flex>
        <v-flex xs12 sm4>
          <v-select
              :items="videoInputs"
              v-model="cameraInputId"
              item-text="label"
              item-value="id"
              label="Camera"
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
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <v-text-field
            v-model="meetupTitle"
            label="Meetup Title"
          />
        </v-flex>
        <v-flex xs12 sm4>
          <v-text-field
            v-model="lightningDuration"
            label="Lightning Duration"
          />
        </v-flex>
        <v-flex xs12 sm4>
          <v-switch
            v-model="showClock"
            color="primary"
            label="Show Clock"
          ></v-switch>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'settings',
    data: () => ({
      videoInputs: [],
      audioInputs: []
    }),
    computed: {
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
      },
      meetupTitle: {
        get () {
          return this.$store.state.meetupTitle
        },
        set (value) {
          this.$store.commit('setMeetupTitle', value)
        }
      },
      showClock: {
        get () {
          return this.$store.state.showClock
        },
        set (value) {
          this.$store.commit('setShowClock', value)
        }
      },
      lightningDuration: {
        get () {
          return this.$store.state.lightningDuration
        },
        set (value) {
          this.$store.commit('setLightningDuration', value)
        }
      }
    },
    mounted () {
      this.getDevices()
    },
    methods: {
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
              // this.screenCaptureStream = stream
              this.$emit('onScreenCaptureStream', stream)
            })
            .catch(error => console.log(error, error.message))
        })
      }
    }
  }
</script>
