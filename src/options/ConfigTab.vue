<template>
  <v-app id="config-tab">
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>VigoTech Talk Screencast</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-container grid-list-md>
      <v-layout justify-center>
        <v-flex xs12 sm8 md6>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <v-select
                      :items="videoInputs"
                      v-model="cameraInputId"
                      item-text="label"
                      item-value="id"
                      label="Camera"
                      @change="setCameraStream"
                  />

                  <v-select
                      :items="audioInputs"
                      v-model="audioInputId"
                      item-text="label"
                      item-value="id"
                      label="Audio"

                  />


                </v-flex>
                <v-flex xs12 sm6>
                  <video
                      autoplay="true"
                      ref="cameraStreamPreview"
                      class="camera-preview"
                      muted
                  />
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <v-btn @click="selectTab">
                    Select tab to record
                  </v-btn>

                  <v-list two-line>
                    <template v-for="(item, index) in tabs">
                      <v-list-tile
                          :key="item.id"
                          avatar
                          @click=""
                      >
                        <v-list-tile-avatar>
                          <img :src="item.favIconUrl">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title v-html="item.title"></v-list-tile-title>
                          <v-list-tile-sub-title v-html="item.url"></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>





                </v-flex>
                <v-flex xs12 sm6>
                  <video
                      autoplay="true"
                      ref="tabCaptureStreamPreview"
                      class="tab-capture-preview"
                      muted
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
  export default {
    data: () => ({
      videoInputs: [],
      audioInputs: [],
      tabs: []
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
    created () {
    },
    mounted () {
      this.getDevices()
      this.setCameraStream()
      this.getTabs()

      alert(chrome.extension.getURL('pages/background.html'))
    },
    methods: {
      getDevices: function () {
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
      setCameraStream: function () {
        const constraints = {
          video: {
            deviceId: {exact: this.cameraInputId}
          },
          audio: {
            deviceId: {exact: this.audioInputId}
          }
        }
        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            this.$refs['cameraStreamPreview'].srcObject = stream
          })
          .catch(() => {})
      },
      setTabStream: function (streamId) {
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
            console.log('Stream', stream)
            this.$refs['tabCaptureStreamPreview'].srcObject = stream
          })
          .catch(error => console.log(error, error.message))
      },
      getTabs () {
        chrome.tabs.query({}, (tabs) => {
          this.tabs = tabs
        })
      },
      selectTab () {
        chrome.desktopCapture.chooseDesktopMedia(['tab', 'window', 'screen'], (streamId) => {
          this.$store.commit('setTabInput', streamId)
          this.setTabStream(streamId)
        })
      }
    }
  }
</script>

<style>

</style>
