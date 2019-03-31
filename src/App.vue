
<style scoped>
@import "/assets/css/general.css";
@import "../node_modules/animate.css/animate.css";
</style>


<template v-cloak>
  <div id="app">
    <!--     <transition enter-to-class="animated bounceInLeft" leave-to-class="animated bounceOutRight" mode="out-in">
      <router-view></router-view>
    </transition>-->
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
