<template>
  <div>
    <input class="faker" v-model="$parent.player.name" />
    <div class="flex">
      <div class="kiste">
        <div :key="key" v-for="(value, key) in show(this.$parent.player)">
          <span>{{key}}: {{value}}</span>
          <Tooltip2 :item="key" />
        </div>
      </div>
      <div class="kiste">
        <span>Chances</span>
        <div
          style="margin-left:10px"
          :key="key+value"
          v-for="(key,value) in this.$parent.player.chance"
        >
          <div v-html="displayechance(value)"></div>
          <Tooltip2 :item="value" />
        </div>
      </div>
      <div class="kiste">
        <span>Effects</span>
        <div
          style="margin-left:10px"
          :key="key+value"
          v-for="(key,value) in this.$parent.player.effects"
        >
          <div v-html="displayeffect(value)"></div>
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
      <div class="kiste">
        <span>Skills</span>
        <div
          style="margin-left:10px"
          :key="key+value"
          v-for="(key,value ) in this.$parent.player.skills"
        >
          <div>{{displayeskills(key)}}</div>
          <Tooltip2 :item="key" />
        </div>
      </div>
    </div>

    <button class="reset" @click="openreset">
      Reset
      <img class="icons" :src="require('@/assets/reset.png')" alt="reset" />
    </button>
  </div>
</template>

<script>
import j from "./json/player.js";
import tipp from "./json/tipps.json";
import Tooltip2 from "./Tooltip2.vue";
import choiseslist from "./json/choises.json";

export default {
  components: { Tooltip2 },
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
      this.$parent.$refs.ov.$data.text = "Are you sure you want to reset?";
      this.$parent.$refs.ov.$data.obj = [
        { text: "yes", func: this.$parent.hardreset },
        { text: "no", func: this.closereset }
      ];
      this.$parent.$refs.ov.$data.img = "reset";
      this.$parent.overlay = true;
    },
    closereset() {
      this.$parent.overlay = false;
    },
    displayeffect(v) {
      let out = "";
      if (this.$parent.player.effects[v] > 0) {
        out += v + ": " + this.$parent.player.effects[v];
      }
      return out;
    },
    displayechance(v) {
      let out = "";
      if (this.$parent.player.chance[v] > 0) {
        out += v + ": " + this.$parent.player.chance[v] + "%";
      }
      return out;
    },
    displayescore(v) {
      let out = "";
      if (this.$parent.player.highscore[v] > 0) {
        out += v + ": " + this.$parent.player.highscore[v];
      }
      return out;
    },
    displayeskills(v) {
      return choiseslist.find(x => x.id === v).name;
    },
    show(p) {
      let pl = JSON.parse(JSON.stringify(p));
      delete pl.log;
      delete pl.name;
      delete pl.status;
      delete pl.counter;
      delete pl.sp;
      delete pl.skills;

      delete pl.time;
      delete pl.auto;
      delete pl.tutorial;

      delete pl.cspeed;
      delete pl.clife;
      delete pl.lastenemy;
      delete pl.resistence;
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

.reset:hover {
  background: #c0c0c0;
}

.icons {
  float: left;
  height: 32px;
}
</style>