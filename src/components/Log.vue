<template>
  <div class="flex">
    <div class="box">
      <div :key="l" v-for="(c,l) in getLog()">
        <div class="one" v-html="c"></div>
      </div>
    </div>
    <div class="credits">
      <a class="abs" style="right:70px" target="_blank" href="https://discord.gg/gUwvjw2">
        <img class="icon" :src="require('@/assets/icons/discord.png')" />
        <span>Discord</span>
      </a>
      <a class="abs" target="_blank" style="right:20px" href="https://www.buymeacoffee.com/a4bl2n1">
        <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" />
      </a>
      <div class="abs" style="left:20px">{{this.$parent.player.version}}</div>
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
.flex {
  justify-content: center;
}

.one {
  margin: 4px;
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

.credits .abs {
  position: fixed;
  bottom: 65px;
  cursor: grab;
  text-decoration: none;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  font-weight: bold;
  display: block;
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