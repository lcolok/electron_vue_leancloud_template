<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>{{ $t('ERROR!!') }}</span>
        <span class="font-weight-light">{{ $t('ERROR!!') }}</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn flat href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
        <span class="mr-2">{{ $t('ERROR!!') }}</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloI18n/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import HelloI18n from "@/components/HelloI18n.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
    HelloI18n
  },
  data() {
    return {
      //
    };
  }
};
</script>