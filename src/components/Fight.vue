<template>
  <div class="rows">
    <div class="row1 box">
      <h2 style="margin:4px 0px">{{item.name}}</h2>
      <b>Stats:</b>
      <hr />
      <div style="margin:0px 0px 4px 0px" :key="k" v-for="(s,k) in item">
        <div>
          <div v-if="filtred(k,s)">
            <img class="iconz" :src="getImgUrlS(k)" />
            <span class="lol">{{s}}</span>
          </div>
          <TextToolTip :title="k" :item="getinfo(k)" />
        </div>
        <div style="margin:0px 0px 4px 10px" v-if="k=='chance'">
          <div :key="cv" v-for="(c,cv) in item.chance">
            <div>
              <img class="iconz" :src="getImgUrlS(cv)" />
              <span class="lol">{{c}}</span>
            </div>
            <TextToolTip :title="cv" :item="getinfo(cv)" />
          </div>
        </div>
        <div style="margin:0px 0px 4px 10px" v-if="k=='effects'">
          <div :key="cv" v-for="(c,cv) in item.effects">
            <div>
              <img class="iconz" :src="getImgUrlS(cv)" />
              <span class="lol">{{c}}</span>
            </div>
            <TextToolTip :title="cv" :item="getinfo(cv)" />
          </div>
        </div>
        <div style="margin:0px 0px 4px 0px" v-if="k=='gain'">
          <b>Gain:</b>
          <hr />
          <div :key="gv" v-for="(g,gv) in item.gain">
            <div v-if="filtred(gv,g)">
              <img class="iconz" :src="getImgUrlS(gv)" />
              <span class="lol">{{g}}</span>
            </div>
            <TextToolTip :title="gv" :item="getinfo(gv)" />
            <div style="margin:0px 0px 4px 10px" v-if="gv=='chance'">
              <div :key="cv" v-for="(c,cv) in item.gain.chance">
                <div>
                  <img class="iconz" :src="getImgUrlS(cv)" />
                  <span class="lol">{{c}}</span>
                </div>
                <TextToolTip :title="cv" :item="getinfo(cv)" />
              </div>
            </div>
            <div style="margin:0px 0px 4px 10px" v-if="gv=='effects'">
              <div :key="cv" v-for="(c,cv) in item.gain.effects">
                <div>
                  <img class="iconz" :src="getImgUrlS(cv)" />
                  <span class="lol">{{c}}</span>
                </div>
                <TextToolTip :title="cv" :item="getinfo(cv)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row2 middle">
      <div>
        <div>
          <div
            style="text-align:center"
          >{{this.$parent.$parent.player.counter[item.id]}}/{{getLast(this.item.max,this.$parent.$parent.player.prestige)}}</div>
          <div class="name">{{item.name}}</div>
        </div>
        <div style="width:200px">
          <img
            ref="eimage"
            v-if="item.id"
            class="image"
            id="enemy"
            :src="getImgUrl(item.id)"
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
          <div v-show="value>0" class="kiste" :key="key" v-for="(value, key) in this.item.status">
            {{value}}
            <img class="icon" :src="getImgUrlB(key)" :alt="key" />
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
import TextToolTip from "./TextToolTip.vue";
import tipps from "./json/tipps.json";

export default {
  components: {
    Progressbar,
    TextToolTip
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
    getImgUrl(pet) {
      var images = require.context("../assets/enemys/", false, /\.png$/);
      let img = "";
      try {
        img = images("./" + pet + ".png");
        return img;
      } catch (e) {
        img = images("./goblin.png");
        return img;
      }
    },
    getImgUrlB(pet) {
      var images = require.context("../assets/buffs/", false, /\.png$/);
      let img = "";
      try {
        img = images("./" + pet + ".png");
        return img;
      } catch (e) {
        img = images("./poison.png");
        return img;
      }
    },
    getImgUrlS(pet) {
      var images = require.context("../assets/skills/", false, /\.png$/);
      let img = "";
      try {
        img = images("./" + pet + ".png");
        return img;
      } catch (e) {
        img = images("./dmg.png");
        return img;
      }
    },
    filtred(f, v) {
      let dont = [
        "name",
        "id",
        "boss",
        "clife",
        "cspeed",
        "effects",
        "status",
        "chance",
        "gain",
        "max"
      ];
      return !dont.includes(f) && v != 0;
    },
    getinfo(i) {
      let tipp = tipps.find(x => x.id == i);
      if (tipp != undefined) {
        return tipp.desc;
      } else {
        return "No Description";
      }
    },
    getLog() {
      return this.$parent.$parent.player.log.slice(-9).reverse();
    },
    exit() {
      this.$parent.$parent.enemy = null;
      try {
        this.$parent.tenemyo = null;
      } catch {}
    },
    won() {
      this.$parent.$parent.player.go = true;
      this.$parent.$parent.player.auto = false;
      this.$parent.$parent.displayfinish();
    }
  },
  mounted() {
    this.$parent.$parent.recovery = false;

    let player = this.$parent.$parent.player,
      classlist = this.$refs.eimage.classList;

    player.lastEnemy = this.item.id;

    this.timer2 = setInterval(() => {
      checkTurn(
        player,
        this.item,
        this.won,
        this.exit,
        classlist,
        this.$parent.$parent.kongregate
      );
    }, 100);

    this.timer1 = setInterval(() => {
      checkTurn(
        this.item,
        player,
        this.won,
        this.exit,
        classlist,
        this.$parent.$parent.kongregate
      );
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
.gain {
  border: 1px solid red;
}
.iconz {
  float: left;
  margin-right: 10px;
  height: 32px;
  width: 32px;
}

.lol {
  line-height: 32px;
}

.box {
  padding: 10px;
  background: darkgrey;
  width: 100%;
  min-width: 200px;
  min-height: 400px;
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
  height: 16px;
  margin: 2px;
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
    min-width: unset;
    min-height: unset;
  }

  .row2 {
    float: left;
    width: 50%;
    margin: 20px;
  }
  .row3 {
    overflow: auto;
    max-height: 100px;
    min-height: unset;
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