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
      <div>
        <div class="center" v-if="loading">
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div v-else>
          <div class="flex">
            <div :key="key" v-for="(value, key) in getPrestigeEnemys">
              <Enemy :min="getcount(value.id)" :max="getLast(value.max)" :value="value" />
            </div>
          </div>
          <div v-if="$parent.player.prestige>5">
            <div class="text">Fight for Items</div>
            <div class="flex">
              <br />
              <div class="kiste">
                <div>
                  <img :src="require('@/assets/icons/bronze.png')" alt="reset" />
                  <br />
                  <span>Bronze Tier</span>
                </div>
              </div>
              <div class="kiste">
                <div>
                  <img :src="require('@/assets/icons/silver.png')" alt="reset" />
                  <br />
                  <span>Silver Tier</span>
                </div>
              </div>
              <div class="kiste">
                <div>
                  <img :src="require('@/assets/icons/gold.png')" alt="reset" />
                  <br />
                  <span>Gold Tier</span>
                </div>
              </div>
              <div class="kiste">
                <div>
                  <img :src="require('@/assets/icons/platin.png')" alt="reset" />
                  <br />
                  <span>Platinum Tier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div        class="text"
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
      dragSrcEl: null,
      loading: true,
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
    },
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  computed: {
    getPrestigeEnemys() {
      let list = [],
        el = this;

      for (let a of this.$parent.player.order) {
        list.push(this.enemieslist.find((b) => a == b.id));
      }

      return list.filter(function (x) {
        if (x.prestige != null && x.prestige != undefined) {
          return el.$parent.player.prestige >= x.prestige;
        }
        return true;
      });
    },
  },
};
</script>

<style scoped>
.kiste {
  border-radius: 5%;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  background: whitesmoke;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  text-align: center;
  width: 80px;
  min-height: 100px;
  box-shadow: inset -2px -2px 2px lightgray;
  transition: 0.1s;
}
.kiste:hover {
  background: lightgray;
  box-shadow: inset -2px -2px 2px grey;
  transform: translate(0px, -10px);
}

.kiste img {
  user-select: none;
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  pointer-events: none;
}

.kiste * {
  pointer-events: none;
}

.center {
  display: block;
  width: 0%;
  margin: auto;
}

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

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>