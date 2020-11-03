<template>
  <v-app>
    <v-container>
      <router-view />
    </v-container>
  </v-app>
</template>

<style lang="scss">
  body {
    background-color: #dfdfdf;
  }

  // INFO - CH - the div is here to have a higher specificity than the builtin class
  // improve by properly overriding theme classes
  div.theme--light.v-application {
    background-color: #ddd
  }

  div.theme--light.v-card {
    background-color: #f7f7f7;
  }

  div.v-subheader.theme--light {
    padding: 0;
    font-size: 16px;
    color: #333;
  }

  div.v-card__title {
    position: relative;
    top: 20px;
    left: 25px;
  }

  button.v-btn {
    border: 1px solid #aaa;
  }

  div.v-radio.theme--light {
    margin-bottom: 10px;
  }

  div.v-card__actions {
    padding: 15px;
  }

  .carrotte-img {
    margin: 15px auto 0 auto;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    max-width: 700px;
    margin: 0 auto;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
