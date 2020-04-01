<template>
  <div>
    <div class="moreroom">
      <div>
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
        <div style="margin-left:10px;">
          Press
          <b>CTRL</b> for stats.
          <b>SHIFT</b> for description.
          <span v-show="$parent.player.prestige>=3">
            <b>DRAG</b> to change fighting order.
          </span>
        </div>
      </div>
      <div class="flex">
        <div :key="key" v-for="(value, key) in getPrestigeEnemys()">
          <Enemy :value="value" />
        </div>
      </div>
      <div>Any similarity with other books, games or movies is just coincidence and results from your fertile imagination.</div>
    </div>
  </div>
</template>

<script>
import Enemy from "./Enemy.vue";

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
    getPrestigeEnemys() {
      let list = [],
        el = this;

      for (let a of this.$parent.player.order) {
        list.push(this.enemieslist.find(b => a == b.id));
      }

      while (this.enemieslist.length > this.$parent.player.order.length) {
        this.$parent.player.order.push(
          this.enemieslist[this.$parent.player.order.length].id
        );
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
.kiste {
  border-radius: 5%;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  background: lightblue;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  text-align: center;
  width: 80px;
  min-height: 130px;
}
.kiste:hover {
  background: rgb(186, 233, 248);
}

.kiste img {
  user-select: none;
  height: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  pointer-events: none;
}

.kiste * {
  pointer-events: none;
}

.ready {
  background: lightcoral;
}
.ready:hover {
  background: lightcoral;
}
.image {
  width: 70px;
}

.moreroom {
  padding-bottom: 100px;
}

.icons {
  float: left;
  height: 32px;
}

.dun {
  font-size: 14px;
  display: inline;
  padding: 4px;
  box-shadow: 0 2px #999;
  line-height: 20px;
}

.dun:active,
.dun.active {
  box-shadow: 0 2px #666;
  transform: translateY(1px);
  background: #505050;
}

.dun > img {
  vertical-align: middle;
  height: 20px;
  width: 20px;
}
</style>