<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
      <!--      <origin></origin>-->

<!--      <works></works>-->

      <three></three>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import origin from './components/originTable/origin.vue'
// import works from './components/collect/works.vue'
import three from './components/threeJs/threeYellow'

export default {
  name: 'App',
  components: {
      // origin
    // HelloWorld,
    //   works,
      three
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
