<template>
  <v-card>
    <v-card-text>
      <v-btn
        color="primary"
        @click="addTalk"
      >
        <v-icon>add</v-icon> Add talk
      </v-btn>

      <div class="talks-list">
        <v-layout row wrap v-for="(talk, index) in talks" :key="index">
          <v-flex xs1 sm1>
            <v-radio-group v-model="currentTalk">
              <v-radio
                :value="index"
                color="primary"
              ></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs11 sm4>
            <v-text-field
              v-model="talk.title"
              label="Talk title"
              @change="updateTalk(talk)"
            />
          </v-flex>
          <v-flex xs8 sm4>
            <v-text-field
                v-model="talk.speaker"
                label="Speaker"
                @change="updateTalk(talk)"
            />
          </v-flex>
          <v-flex xs3 sm2>
            <v-switch
                v-model="talk.isLightning"
                @change="updateTalk(talk)"
                color="primary"
                label="Lightning"
            ></v-switch>
          </v-flex>
          <v-flex xs1>
            <v-btn
              color="red"
              @click.native="removeTalk(talk)"
              flat
              icon
            >
              <v-icon>delete</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'talks',
    computed: {
      currentTalk: {
        get: function () {
          return this.$store.state.talks.currentTalkIndex
        },
        set: function (value) {
          this.$store.dispatch('setCurrentTalk', value)
        }
      },
      talks: {
        get: function () {
          return this.$store.state.talks.talks
        },
        set: function (newValue) {

        }
      },
      talksLength () {
        return this.$store.getters.talksLength
      }
    },
    methods: {
      addTalk () {
        this.$store.commit('addTalk', {
          title: null,
          speaker: null,
          isLightning: false
        })
      },
      removeTalk (talk) {
        this.$store.commit('removeTalk', talk)
      },
      updateTalk (talk) {
        this.$store.commit('updateTalk', talk)
      }
    }
  }
</script>
