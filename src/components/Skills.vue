<template>
  <div>
    <h4>
      Skills
      <span v-show="this.$parent.player.sp>0">({{this.$parent.player.sp}})</span>
    </h4>
    <div class="flex">
      <div
        :class="{disabled : !isAvailable(value)}"
        class="kiste"
        :key="value.name"
        v-for="value in this.choises"
      >{{value.name}}</div>
    </div>
  </div>
</template>

<script>
import c from "./json/choises.json";
export default {
  data() {
    return {
      choises: c
    };
  },
  methods: {
    isAvailable(object) {
      if (object.require == "" && this.$parent.player.sp > 0) {
        return true;
      }
      if (
        this.$parent.player.counter[object.require] == 100 &&
        this.$parent.player.sp > 0
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-wrap: wrap;
}
.kiste {
  padding: 20px;
  border: 1px solid black;
  cursor: pointer;
  background: lightblue;
  margin: 10px;
  width: 300px;
}
.disabled {
  background: lightcoral;
}
</style>