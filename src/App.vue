<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
      <works></works>
<!--      <origin></origin>-->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import works from './components/collect/works.vue'
// import origin from './components/originTable/origin.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
      works
      // origin
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
