<template>
  <div>
    <input class="faker" v-model="$parent.player.name" />
    <div class="flex">
      <div class="kiste">
        <div :key="key" v-for="(value, key) in show(this.$parent.player)">
          <div style="margin:5px" class="flex">
            <div>
              <img class="icon" v-if="key" :src="require('@/assets/skills/'+key+'.png')" />
              <span>{{value}}</span>
            </div>
            <Tooltip2 :item="key" />
          </div>
        </div>
      </div>
      <div class="kiste">
        <span>Chances</span>
        <div
          style="margin:5px"
          :key="key+value"
          v-for="(key,value) in this.$parent.player.chance"
          class="flex"
        >
          <div>
            <span>{{key}}</span>
            <img class="icon" v-if="value" :src="require('@/assets/skills/'+value+'.png')" />
          </div>
          <Tooltip2 :item="value" />
        </div>
      </div>
      <div class="kiste">
        <span>Effects</span>
        <div
          style="margin:5px"
          :key="key+value"
          v-for="(key,value) in this.$parent.player.effects"
          class="flex"
        >
          <div>
            <span>{{key}}</span>
            <img class="icon" v-if="value" :src="require('@/assets/skills/'+value+'.png')" />
          </div>
          <Tooltip2 :item="value" />
        </div>
      </div>
      <div class="kiste">
        <span>Highscore</span>
        <div
          style="margin-left:10px"
          :key="key+value"
          v-for="(key,value ) in this.$parent.player.highscore"
          v-html="displayescore(value)"
        ></div>
      </div>
      <div class="kiste fux">
        <span style="width:200px;line-height:20px">Skills</span>
        <div :key="key+value" v-for="(key,value) in this.$parent.player.skills">
          <div>
            <img
              style="margin:5px"
              class="icon"
              :src="require('@/assets/skills/'+displayeskills(key)+'.png')"
            />
            <TextToolTip :title="displayeskills2(key).name" :item="displayeskills2(key).desc" />
          </div>
        </div>
      </div>
    </div>

    <button class="reset" @click="openreset">
      Reset
      <img class="icons" :src="require('@/assets/icons/reset.png')" alt="reset" />
    </button>
    <button v-show="$parent.player.go" class="reset" @click="$parent.displayfinish">
      Prestige
      <img class="icons" :src="require('@/assets/icons/star.png')" alt="reset" />
    </button>
    <button v-show="$parent.player.prestige>0" class="reset" @click="this.openskilltree">
      Skills
      <img class="icons" :src="require('@/assets/icons/skills.png')" alt="skills" />
    </button>
  </div>
</template>

<script>
import j from "./json/player.js";
import tipp from "./json/tipps.json";
import Tooltip2 from "./Tooltip2.vue";
import TextToolTip from "./TextToolTip.vue";
import choiseslist from "./json/choises.json";
import { debug } from "./gloabals.js";

export default {
  components: { Tooltip2, TextToolTip },
  data() {
    return {
      pl: null,
      dchance: null,
      deffects: null,
      dhighscore: null
    };
  },
  methods: {
    openreset() {
      let ov = this.$parent.$refs.ov.$data;
      ov.text = "Do you really want to wipe your save?";
      ov.obj = [
        { text: "yes", func: this.$parent.hardreset },
        { text: "no", func: this.closereset }
      ];
      ov.img = "icons/reset";
      this.$parent.overlay = true;
    },
    closereset() {
      this.$parent.overlay = false;
    },
    displayeffect(a) {
      let b = "";
      return (
        0 < this.$parent.player.effects[a] &&
          (b += a + ": " + this.$parent.player.effects[a]),
        b
      );
    },
    displayechance(a) {
      let b = "";
      return (
        0 < this.$parent.player.chance[a] &&
          (b += a + ": " + this.$parent.player.chance[a] + "%"),
        b
      );
    },
    displayescore(a) {
      let b = "";
      return (
        0 < this.$parent.player.highscore[a] &&
          (b += a + ": " + this.$parent.player.highscore[a]),
        b
      );
    },
    displayeskills(a) {
      a = a.substring(0, a.length - 1);
      let t = choiseslist.find(b => b.id === a).id;
      return t.substring(2);
    },
    displayeskills2(a) {
      a = a.substring(0, a.length - 1);
      let t = choiseslist.find(b => b.id === a);
      return t;
    },
    openskilltree() {
      this.$parent.skilltree = true;
      this.$parent.overlay = true;
    },
    show(p) {
      let pl = JSON.parse(JSON.stringify(p));
      delete pl.log;
      delete pl.name;
      delete pl.status;
      delete pl.counter;
      delete pl.go;

      delete pl.skills;

      delete pl.time;
      delete pl.auto;
      delete pl.debug;
      delete pl.tutorial;

      delete pl.cspeed;
      delete pl.clife;
      delete pl.lastEnemy;
      delete pl.resistance;
      delete pl.version;
      delete pl.effects;
      delete pl.highscore;
      delete pl.chance;

      return pl;
    }
  }
};
</script>

<style scoped>
.icon {
  float: left;
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.faker {
  background: grey;
  border: none;
  outline: none;
  padding: 10px;
  margin: 10px;
  font-size: 30px;
  font-weight: bold;
  cursor: default;
  font-family: "MedievalSharp", cursive;
}

.flex {
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.kiste {
  clear: both;
  padding: 10px;
  float: left;
  margin: 5px;
  border: 1px solid black;
  background-color: whitesmoke;
  min-width: 100px;
}

.reset {
  line-height: 32px;
  border-radius: 10px;
  font-size: 20px;
  font-family: "MedievalSharp", cursive;
  margin: 10px 0px 0px 10px;
  padding: 10px;
  outline: none;
  border: none;
  background: #fefefe;
  cursor: pointer;
}

.fux {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 200px;
}
.reset:hover {
  background: #c0c0c0;
}

.icons {
  float: left;
  height: 32px;
}

.debugclass {
  color: red;
  background: lightgrey;
}
</style>