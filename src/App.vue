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
  user-select: none;
  image-rendering: optimizeQuality;
  background: grey;
  width: 100%;
  margin: 0px;
  padding: 0px;
  font-family: "MedievalSharp", cursive;
}

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: #777;
}

::-webkit-scrollbar-thumb {
  background: #474747;
}

::-webkit-scrollbar-thumb:hover {
  background: #616161;
}
</style>
