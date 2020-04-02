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
  background: grey;
  width: 100%;
  margin: 0px;
  padding: 0px;
  font-family: "MedievalSharp", cursive;
}

.resistance {
  background: lightcoral;
}
.effects {
  background: lightcyan;
}
.chance {
  background: lightgreen;
}

.basic {
  background: lightyellow;
}

#app {
  width: 900px;
  height: 600px;

  overflow: auto;
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

.btn {
  line-height: 32px;
  border-radius: 5%;
  font-size: 20px;
  font-family: "MedievalSharp", cursive;
  margin: 10px;
  padding: 10px;
  outline: none;
  border: none;
  cursor: pointer;
  background: #a5a5a5;
  transition: 0.1s;
  box-shadow: 0 5px #636363;
  display: block;
  border: 0.5px solid darkslategrey;
}

.btn img {
  float: left;
  width: 32px;
  height: 32px;
}

.btn:hover {
  background: #7a7a7a;
}

.btn:active,
.active {
  box-shadow: 0 2px #666;
  transform: translateY(4px);
  background: #505050;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.flex-colum {
  display: flex;
  flex-direction: column;
}
</style>
