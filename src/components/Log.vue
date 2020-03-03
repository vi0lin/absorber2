<template>
  <div class="all">
    <div class="box">
      <div class="one" :key="l" v-for="(c,l) in getLog()" v-html="c"></div>
    </div>
    <div class="credits">
      <a target="_blank" href="https://discord.gg/gUwvjw2">
        <img class="icon" :src="require('@/assets/icons/discord.png')" />
        <span>Discord</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getLog() {
      return this.$parent.player.log.slice(-60).reverse();
    }
  }
};
</script>

<style scoped>
.one {
  margin: 4px;
}
.all {
  display: flex;
  justify-content: center;
}
.box {
  background: darkgrey;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  float: left;
  min-width: 500px;
  min-height: 200px;
  margin: 10px;
}
.credits a {
  position: fixed;
  bottom: 65px;
  right: 10px;
  cursor: grab;
  text-decoration: none;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  font-weight: bold;
}
span {
  color: #7289da;
  line-height: 32px;
  float: right;
}
.icon {
  width: 32px;
  height: 32px;
}
</style>