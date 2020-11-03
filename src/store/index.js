import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


let urls = {}
urls.BASE = 'http://127.0.0.1:8000/api/'
urls.PROFILES = urls.BASE + 'profiles/'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profiles: [],
  },
  getters: {
    profiles: (state) => state.profiles
  },
  mutations: {
    setProfiles (state, profiles) {
      state.profiles = profiles
    }
  },
  actions: {
    async loadProfiles ( {commit} ) {
      const profiles = await axios.get(urls.PROFILES)
      commit('setProfiles', profiles.data)
    }
  },
  modules: {
  }
})
