<template>
  <div class="home">
    <h1>Nouvelle attestation</h1> 
    <v-form
    ref="form"
    lazy-validation
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="profileId"
          :items="profiles"
          :rules="[v => !!v || 'Profil requis']"
          item-value="id"
          item-text="profile_name"
          label="Profil"
        />
      </v-col>
      <router-link :to="{name: 'NewProfile'}" class="newProfile">Ajouter un nouveau profil</router-link>
    </v-row>

    <v-subheader
    >
      Date et heure de création (pour antidater le document)
    </v-subheader>
    <v-divider />
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-menu
          v-model="times.creationDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="times.creationDateFormatted"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="times.creationDate"
            locale="fr-fr"
            @input="times.creationDateMenu = false"
          />
        </v-menu>
      </v-col>

       <v-col
          cols="12"
          sm="6"
        >
          <v-menu
            ref="menu"
            v-model="times.creationTimeMenu"
            :close-on-content-click="false"
            :return-value.sync="times.creationTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="times.creationTime"
                label="Heure"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="times.creationTimeMenu"
              v-model="time"
              format="24hr"
              full-width
              @click:minute="$refs.menu.save(times.creationTime)"
            />
          </v-menu>
        </v-col>
      </v-row>

    <v-subheader
    >
      Date et heure de sortie
    </v-subheader>
    <v-divider />
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-menu
          v-model="times.dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="times.dateFormatted"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="times.date"
            locale="fr-fr"
            @input="times.dateMenu = false"
          />
        </v-menu>
      </v-col>

       <v-col
          cols="12"
          sm="6"
        >
          <v-menu
            ref="menu"
            v-model="times.timeMenu"
            :close-on-content-click="false"
            :return-value.sync="times.time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="times.time"
                label="Heure"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="times.timeMenu"
              v-model="time"
              format="24hr"
              full-width
              @click:minute="$refs.menu.save(times.time)"
            />
          </v-menu>
        </v-col>
      </v-row>
      <v-subheader
      >
        Raisons
      </v-subheader>
      <v-divider />
      <v-radio-group
        v-model="reason"
        row
        hint="L'option carrottes est à vos risques et périls, ce sera visible par les forces de l'ordre"
        :persistent-hint="true"
      >
      <v-radio
        v-for="reason in reasons"
        :key="reason.code"
        :label="reason.label"
        :value="reason"
        
      />
    </v-radio-group>

    <v-img v-if="reason.code === 'achat_de_carrottes'"
      src='../assets/carrottes.jpg'
      width="400px"
    />

    <v-btn
      class="mr-4"
      @click="generate"
    >
      Générer
    </v-btn>
  </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapState } from 'vuex'
import { generatePdf, defaultReasons } from '../utils/'

export default {
  name: 'Home',
  components: {
  },
  computed: {
    ...mapState([
      'profiles',
    ]),
    date () { return this.times.date },
    creationDate () { return this.times.creationDate }
  },
  data: (vm) => ({
      profileId: null,
      reason: 0,
      reasons: defaultReasons,
      times: {
        date: new Date().toISOString().substr(0, 10),
        dateMenu: false,
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        timeMenu: false,
        creationDate: new Date().toISOString().substr(0, 10),
        creationDateMenu: false,
        creationDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        creationTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        creationTimeMenu: false,
      },
  }),
  methods: {
    ...mapActions(['loadProfiles']),
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    async generate () {
      let self = this
      let profile = this.profiles.find(profile => profile.id === self.profileId)
      profile.birthdate = this.formatDate(profile.birthdate)
      const pdfBlob = await generatePdf(profile, this.times, [this.reason])
      const blobURL = URL.createObjectURL(pdfBlob);
      window.open(blobURL)
    },
  },
  mounted() {
    this.loadProfiles()
  },
  watch: {
    profiles () {
      if (this.profiles.length) {
        this.profileId = this.profiles[0].id
      }
    },
    date () {
      this.times.dateFormatted = this.formatDate(this.times.date)
    },
    creationDate () {
      this.times.creationDateFormatted = this.formatDate(this.times.creationDate)
    },
  }
}

</script>

<style scoped>
  .newProfile {
    margin: auto 0;
  }
</style>
