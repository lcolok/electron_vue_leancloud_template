<template>
  <div id="app">
    <lottie
      v-model="lottie"
      :options="defaultOptions"
      :height="400"
      :width="400"
      v-on:animCreated="handleAnimation"
    />
    <!--     <div>
      <p>Speed: x{{animationSpeed}}</p>
      <input
        type="range"
        value="1"
        min="0"
        max="3"
        step="0.5"
        v-on:change="onSpeedChange"
        v-model="animationSpeed"
      >
    </div>
    <button v-on:click="stop">stop</button>
    <button v-on:click="pause">pause</button>
    <button v-on:click="play">play</button>-->
  </div>
</template>

<script>
// import Lottie from './lottie.vue';

import * as animationData from "./assets/pinjump.json";

export default {
  name: "app",
  beforeCreate() {
    var _this = this;
    var url = this.$route.query.url;
    console.log(url);
    if (url) {
      this.$AV.Cloud.run("getLottieJSON", {
        url: url
      }).then(resp => {
        console.log(_this.defaultOptions);
        _this.defaultOptions = { animationData: JSON.parse(resp) };
        console.log(_this.defaultOptions);
        _this.anim.registerAnimation();
        console.log(_this.anim);
        _this.handleAnimation();
      });
    }
  },
  data() {
    return {
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
      lottie: false
    };
  },
  methods: {
    handleAnimation: function(anim) {
      this.anim = anim;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
