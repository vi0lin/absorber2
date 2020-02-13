<template>
  <div class="box">
    <div :key="l" v-for="(c,l) in getLog(this.$parent.player.log)" v-html="c"></div>
  </div>
</template>

<script>
export default {
  methods: {
    getLog(l) {
      return l.slice(-60).reverse();
    }
  }
};
</script>

<style scoped>
.box {
  background: darkgrey;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  float: left;
}
</style>