<template>
  <div id="app">
    <!-- <ConfirmationPanel @closePanel="onCloseConfirmationPanel" /> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  constructor() {
    super();

    console.log('new App()', this);
  }

  async mounted(): Promise<void> {
    let me = await window.pivotal.getMe();
    console.log('me', me);
  }
}
</script>
