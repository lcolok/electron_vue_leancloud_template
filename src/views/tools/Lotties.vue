
<style>
html {
  overflow: -moz-hidden-unscrollable;
  height: 100%;
  width:100%;

}

body::-webkit-scrollbar {
  display: none;
}

body {
  object-fit: contain;
  -ms-overflow-style: none;
  height: 100%;
  width: calc(100vw + 18px);
  overflow: auto;
}

.fill {
  object-fit: fill;
}
.contain {
  object-fit: contain;
}
.cover {
  object-fit: cover;
}
.none {
  object-fit: none;
}
.scale-down {
  object-fit: scale-down;
}

.box {
  width: 160px;
  height: 160px;
  margin: 10px 0 20px;
  background-color: #fd1100;
  overflow: hidden;
  resize: both;
}
</style>

<template>
  <div class="contain" ref="lavContainer"></div>
</template>


<script>
import lottie from "lottie-web";

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
        this.anim = lottie.loadAnimation({
          container: this.$refs.lavContainer,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: JSON.parse(resp),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            hideOnTransparent: true
          }
        });
      });
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
