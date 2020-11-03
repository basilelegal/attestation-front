<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nouvelle Profil</span>
    </v-card-title>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.profile_name"
                label="Nom du profil*"
                :rules="required"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.firstname"
                label="Prénom*"
                :rules="required"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.lastname"
                label="Nom*"
                :rules="required"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.birthplace"
                label="Lieu de naissance*"
                :rules="required"
              />
            </v-col>
             <v-col
                cols="12"
                sm="6"
              >
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateFormatted"
                      label="Date de naissance"
                      prepend-icon="mdi-clock-time-four-outline"
                      v-bind="attrs"
                      v-on="on"
                      :rules="required"
                    />
                  </template>
                  <v-date-picker
                    v-model="formData.birthdate"
                    locale="fr-fr"
                    @input="dateMenu = false"
                  />
                </v-menu>
              </v-col>
          </v-row>
           <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.address"
                label="Adresse*"
                :rules="required"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.zipcode"
                label="Code postal*"
                :rules="required"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.city"
                label="Ville*"
                :rules="required"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="saveProfile"
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'NewProfile',
    computed: {
      date () { return this.formData.birthdate },
    },
    data (vm) {
      return {
        formData: {
          profile_name: "",
          firstname: "",
          lastname: "",
          birthplace: "",
          birthdate: null,
          address: "",
          zipcode: "",
          city: "",
        },
        valid: false,
        dateMenu: false,
        dateFormatted: null,
        required: [
          v => !!v || 'Le champs est requis',
        ]
      }
    },
    methods: {
      ...mapActions(['postProfile']),
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      saveProfile () {
        if (!this.$refs.form.validate()) return
        this.postProfile(this.formData)
      },
    },
    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.formData.birthdate)
      },
    },
  }
</script>