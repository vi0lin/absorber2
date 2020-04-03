<template>
  <div :style="{ backgroundImage: 'url(' + require('@/assets/icons/background2.png') + ')' }">
    <div class="moreroom">
      <div>
        <div style="margin-top:20px;margin-bottom:10px" class="text">
          <button v-show="$parent.player.prestige>=3" class="btn dun" @click="resetOrder()">
            <img :src="require('@/assets/icons/order.png')" alt="auto" />
            <span>Reset Order</span>
          </button>
          <button
            @click="autofight()"
            class="btn dun"
            id="auto"
            :class="{active:this.$parent.player.auto}"
          >
            <img :src="require('@/assets/icons/auto.png')" alt="auto" />
            <span>Autofight</span>
          </button>
          Press
          <b>CTRL</b> for stats.
          <b>SHIFT</b> for description.
          <span v-show="$parent.player.prestige>=3">
            <b>DRAG</b> to change fighting order.
          </span>
        </div>
      </div>
      <div class="flex">
        <div :key="key" v-for="(value, key) in getPrestigeEnemys">
          <Enemy :min="getcount(value.id)" :max="getLast(value.max)" :value="value" />
        </div>
      </div>
      <div
        class="text"
      >Any similarity with other books, games or movies is just coincidence and results from your fertile imagination.</div>
    </div>
  </div>
</template>

<script>
import Enemy from "./Enemy.vue";
import { getLast } from "./functions";
export default {
  components: { Enemy },
  data() {
    return {
      dragSrcEl: null
    };
  },
  methods: {
    autofight() {
      this.$parent.player.auto = !this.$parent.player.auto;
    },
    resetOrder() {
      this.$parent.player.order = this.enemieslist.map(({ id: a }) => a);
    },
    getcount(id) {
      this.$parent.player.counter[id] == null &&
        (this.$parent.player.counter[id] = 0);
      return this.$parent.player.counter[id];
    },
    getLast(v) {
      return getLast(v, this.$parent.player.prestige);
    }
  },
  computed: {
    getPrestigeEnemys() {
      let list = [],
        el = this;

      for (let a of this.$parent.player.order) {
        list.push(this.enemieslist.find(b => a == b.id));
      }

      return list.filter(function(x) {
        if (x.prestige != null && x.prestige != undefined) {
          return el.$parent.player.prestige >= x.prestige;
        }
        return true;
      });
    }
  }
};
</script>

<style scoped>
.moreroom {
  padding-top: 10px;
  padding-bottom: 80px;
}

.dun {
  background: lightskyblue;
  font-size: 14px;
  display: inline;
  padding: 4px;
  box-shadow: 0 2px #0a9bf5;
  line-height: 20px;
}
.text {
  background: lightgray;
  margin-left: 10px;
  padding: 20px;
  display: block;
  width: 790px;
  border-radius: 5px;
  border: 1px solid black;
  box-shadow: inset 0 0 4px grey;
}

.dun:hover {
  background: #9dd7fb;
}

.dun:active,
.dun.active {
  box-shadow: 0 2px #054d7a;
  transform: translateY(1px);
  background: #0a9bf5;
}

.dun > img {
  vertical-align: middle;
  height: 20px;
  width: 20px;
}
</style>