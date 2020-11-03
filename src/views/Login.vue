<template>
  <v-card>
    <v-card-title>
      <span class="headline">Connexion</span>
    </v-card-title>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-card-text>
        <v-container>
          <v-col>
            <v-text-field
              v-model="formData.username"
              label="Nom d'utilisateur*"
              :rules="required"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="formData.password"
              label="Mot de passe*"
              :rules="required"
              type="password"
            />
          </v-col>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="saveUser"
        >
          Se connecter
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'Login',
    data (vm) {
      return {
        formData: {
          username: "",
          password: "",
        },
        valid: false,
        required: [
          v => !!v || 'Le champs est requis',
        ]
      }
    },
    methods: {
      // ...mapActions(['postUser']),
      saveUser () {
        if (!this.$refs.form.validate()) return
        // this.postUser(this.formData)
      },
    },
  }
</script>