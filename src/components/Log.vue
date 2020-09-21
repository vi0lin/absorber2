<template>
  <div
    class="log"
    :style="{ backgroundImage: 'url(' + require('@/assets/icons/background2.png') + ')' }"
  >
    <div class="flex">
      <div class="box">
        <div :key="l" v-for="(c,l) in getLog()">
          <div class="one" v-html="c"></div>
        </div>
      </div>
      <div class="credits">
        <a class="abs" style="right:320px" target="_blank" href="https://discord.gg/gUwvjw2">
          <img :src="require('@/assets/icons/discord.png')" alt="discord" />
        </a>
        <a
          class="abs"
          target="_blank"
          style="right:80px"
          href="https://www.buymeacoffee.com/a4bl2n1"
        >
          <img :src="require('@/assets/icons/coffe.svg')" alt="buy me a coffe" />
        </a>
        <a
          class="abs"
          target="_blank"
          style="right:140px"
          href="https://www.facebook.com/Schlau3Wurst"
        >
          <img :src="require('@/assets/icons/facebook.png')" alt="facebook" />
        </a>
        <a class="abs" target="_blank" style="right:200px" href="https://twitter.com/schlauewurst">
          <img :src="require('@/assets/icons/twitter.png')" alt="Twitter" />
        </a>
        <a
          class="abs"
          target="_blank"
          style="right:20px"
          href="https://www.patreon.com/schlauewurst"
        >
          <img :src="require('@/assets/icons/patreon.jpg')" alt="patreon" />
        </a>
        <a
          class="abs"
          target="_blank"
          style="right:260px"
          href="https://shop.spreadshirt.de/Absorber/"
        >
          <img :src="require('@/assets/icons/spreadshirt.png')" alt="spreadshirt" />
        </a>
        <div
          @click="openChange()"
          class="abs clickable"
          style="left:20px"
        >{{this.$parent.player.version}}</div>
      </div>
    </div>
    <div v-show="openedChange" class="box overlay">
      <div class="close" @click="closeChange()">x</div>
      <div :key="l.version" v-for="l in getChangeLog()">
        <h3>{{l.version}}</h3>
        <div :key="number" v-for="(text, number) in l.info">{{text}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openedChange: false,
    };
  },
  methods: {
    closeChange() {
      this.openedChange = false;
    },
    openChange() {
      this.openedChange = !this.openedChange ;
    },
    getLog() {
      return this.$parent.log.slice(-60).reverse();
    },
    getChangeLog() {
      return this.changelog;
    },
  },
};
</script>

<style scoped>

.log {
  margin-top: 20px;
}
.flex {
  justify-content: center;
}
.close {
  position: sticky;
  background: red;
  border: 1px solid black;
  float: right;
  padding: 2px;
  border-radius: 5px;
  cursor: pointer;
}
.close:hover {
  background: pink;
}
.clickable {
  cursor: pointer;
}
.one {
  margin: 4px;
}

.box {
  box-shadow: inset 0 0 4px grey;
  background: whitesmoke;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  float: left;
  min-width: 500px;
  min-height: 450px;
  margin: 10px;
}

.abs {
  border: 1px solid black;
  position: fixed;
  bottom: 65px;
  text-decoration: none;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  font-weight: bold;
  display: block;
  margin: auto;
  box-shadow: inset -2px -2px 4px lightgray;
}

.abs img {
  width: 32px;
  height: 32px;
  padding: 2px;
}

.overlay {
  position: absolute;
  top: 100px;
  left: 30px;
  min-height: 300px;
  height: 300px;
  overflow-y: scroll;
}
</style>