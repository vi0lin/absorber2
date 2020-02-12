<template>
  <div id="app">
    <Index />
  </div>
</template>

<script>
import Index from "./components/Index.vue";

export default {
  name: "app",
  components: {
    Index
  }
};
</script>

<style>
body,
html,
#app {
  background: grey;
  width: 100%;
  margin: 0px;
  padding: 0px;
  font-family: "MedievalSharp", cursive;
  overflow-x: hidden;
}
</style>
