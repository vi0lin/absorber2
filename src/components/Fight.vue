<template>
  <div class="rows">
    <div class="row1 box">
      <b>{{item.name}}</b>
      <hr />
      <div v-html="filtred(item)"></div>
    </div>
    <div class="row2 middle">
      <div>
        <div>
          <div
            style="text-align:center"
          >{{this.$parent.$parent.player.counter[item.id]}}/{{getLast(this.$parent.$parent.enemy.max,this.$parent.$parent.player.prestige)}}</div>
          <div class="name">{{item.name}}</div>
        </div>
        <div style="width:200px">
          <img
            ref="eimage"
            v-if="item.id"
            class="image"
            id="enemy"
            :src="require('@/assets/enemys/'+item.id+'.png')"
            :alt="item.name"
          />
          <span
            class="dmgind"
            :style="'color:'+ind.color"
            :key="k"
            v-for="(ind,k) in dmgind"
          >{{ind.text}}</span>
        </div>

        <div class="flex">
          <div
            v-show="value>0"
            class="kiste"
            :key="key"
            v-for="(value, key) in this.$parent.$parent.enemy.status"
          >
            {{value}}
            <img class="icon" :src="require('@/assets/buffs/'+key+'.png')" :alt="key" />
          </div>
        </div>
      </div>
      <Progressbar :val="item.cspeed" :max="item.speed" :speed="true" />
      <Progressbar :val="item.clife" :max="item.life" />
    </div>
    <div class="row3 box">
      <div :key="key" v-for="(l,key) in getLog()" v-html="l"></div>
    </div>
  </div>
</template>

<script>
import Progressbar from "./Progressbar.vue";
import {
  checkTurn,
  absorbEnemy,
  respawn,
  checkPlayerDeath,
  checkCleared,
  getLast
} from "./functions.js";

import { displayEnemyStats } from "./displayfunc.js";
import { dmgind } from "./gloabals.js";

export default {
  components: {
    Progressbar
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timer1: null,
      timer2: null,
      dmgind: dmgind
    };
  },
  methods: {
    getLast(j, p) {
      return getLast(j, p);
    },
    filtred(f) {
      return displayEnemyStats(f);
    },
    getLog() {
      return this.$parent.$parent.player.log.slice(-10).reverse();
    },
    exit() {
      this.$parent.$parent.enemy = null;
    }
  },
  mounted() {
    this.$parent.$parent.recovery = false;

    let player = this.$parent.$parent.player,
      enemy = this.item,
      disfi = this.$parent.$parent.displayfinish,
      classlist = this.$refs.eimage.classList;

    player.lastEnemy = enemy.id;

    this.timer2 = setInterval(() => {
      checkTurn(player, enemy, disfi, this.exit, classlist);
    }, 100);

    this.timer1 = setInterval(() => {
      checkTurn(enemy, player, disfi, this.exit, classlist);
    }, 100);
  },
  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    this.$parent.$parent.recovery = true;
    respawn(this.item);
  }
};
</script>

<style scoped>
.box {
  padding: 10px;
  background: darkgrey;
  width: 100%;
}

.rows {
  margin: 10px;
  display: flex;
  align-content: space-between;
}

.row1 {
  overflow: auto;
  max-height: 320px;
  float: left;
  width: 20%;
  border-radius: 5px;
}

.row2 {
  float: left;
  width: 60%;
}

.row3 {
  overflow: auto;
  max-height: 320px;
  float: left;
  width: 20%;
  border-radius: 5px;
}

.flex {
  margin: 5px 0px;
  height: 18px;
  display: flex;
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kiste {
  background: darkgrey;
  padding: 1px;
  border: 1px solid black;
  line-height: 16px;
}
.image {
  margin: 0px 10px;
  width: 180px;
}

.animated {
  animation: shake 0.2s linear;
}

.die {
  animation: spin 0.4s linear;
}

@keyframes shake {
  0% {
    margin: 0px 10px;
  }
  25% {
    margin: 0px 20px;
  }
  75% {
    margin: 0px 0px;
  }
  100% {
    margin: 0px 10px;
  }
}

@keyframes spin {
  100% {
    transform: rotate(90deg);
    opacity: 0;
  }
}
.name {
  text-align: center;
  padding: 10px;
  color: white;
  font-size: 20px;
}

.dmgind {
  position: absolute;
  left: 50%;
  font-size: 40px;
  font-weight: 500;
  animation: fly 1s linear;
}

@keyframes fly {
  0% {
    top: 50%;
    opacity: 1;
  }
  100% {
    top: 0%;
    opacity: 0;
  }
}

.itext {
  color: white;
  font-stretch: bold;
  padding: 0px 2px;
}

.icon {
  height: 16px;
  width: 16px;
  margin: 0px;
  float: right;
}

@media screen and (max-device-width: 500px) {
  .row1 {
    overflow: auto;
    max-height: 320px;
    float: left;
    width: 30%;
    border-radius: 5px;
  }

  .row2 {
    float: left;
    width: 50%;
    margin: 20px;
  }
  .row3 {
    overflow: auto;
    max-height: 260px;
    float: left;
    width: 100%;
    border-radius: 5px;
  }

  .rows {
    margin-top: 10px;
    flex-wrap: wrap;
    display: flex;
    align-content: space-between;
  }
}
</style>