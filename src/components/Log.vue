<template>
  <div class="flex">
    <div class="box">
      <div :key="l" v-for="(c,l) in getLog()">
        <div class="one" v-html="c"></div>
      </div>
    </div>
    <div class="credits">
      <a class="abs" style="right:320px" target="_blank" href="https://discord.gg/gUwvjw2">
        <img class="icon" :src="require('@/assets/icons/discord.png')" alt="discord" />
      </a>
      <a class="abs" target="_blank" style="right:80px" href="https://www.buymeacoffee.com/a4bl2n1">
        <img class="icon" :src="require('@/assets/icons/coffe.svg')" alt="buy me a coffe" />
      </a>
      <a
        class="abs"
        target="_blank"
        style="right:140px"
        href="https://www.facebook.com/Schlau3Wurst"
      >
        <img class="icon" :src="require('@/assets/icons/facebook.png')" alt="facebook" />
      </a>
      <a class="abs" target="_blank" style="right:200px" href="https://twitter.com/schlauewurst">
        <img class="icon" :src="require('@/assets/icons/twitter.png')" alt="Twitter" />
      </a>
      <a class="abs" target="_blank" style="right:20px" href="https://www.patreon.com/schlauewurst">
        <img class="icon" :src="require('@/assets/icons/patreon.jpg')" alt="patreon" />
      </a>
      <a
        class="abs"
        target="_blank"
        style="right:260px"
        href="https://shop.spreadshirt.de/Absorber/"
      >
        <img class="icon" :src="require('@/assets/icons/spreadshirt.png')" alt="spreadshirt" />
      </a>

      <div class="abs" style="left:20px">{{this.$parent.player.version}}</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getLog() {
      return this.$parent.log.slice(-60).reverse();
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
  border: 1px solid black;
  position: fixed;
  bottom: 65px;
  cursor: grab;
  text-decoration: none;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  font-weight: bold;
  display: block;
  margin: auto;
}

.icon {
  width: 32px;
  height: 32px;
  padding: 2px;
}
</style>