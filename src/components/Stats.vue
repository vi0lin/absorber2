<template>
  <div style="padding-bottom:50px;">
    <input class="faker" v-model="$parent.player.name" />
    <div>
      <button v-show="$parent.player.go" class="btn" @click="$parent.displayfinish">
        Prestige
        <img class="icons" :src="require('@/assets/icons/star.png')" alt="reset" />
      </button>
      <button v-show="$parent.player.prestige>0" class="btn" @click="this.openskilltree">
        Skills
        <img class="icons" :src="require('@/assets/icons/skills.png')" alt="skills" />
      </button>
    </div>
    <div class="flex">
      <div class="kiste">
        <span class="title">Base</span>
        <div :key="key" v-for="(value, key) in show(this.$parent.player)">
          <div class="valbox">
            <div>
              <img class="icon" v-if="key" :src="getImgUrl(key)" />
              <span class="val">{{value}}</span>
            </div>
            <Tooltip2 :item="key" />
          </div>
        </div>
      </div>
      <div class="kiste">
        <span class="title">Chances</span>
        <div :key="key+value" v-for="(key,value) in this.$parent.player.chance">
          <div class="valbox">
            <span class="val">{{key}}</span>
            <img class="icon" v-if="value" :src="getImgUrl(value)" />
          </div>
          <Tooltip2 :item="value" />
        </div>
      </div>
      <div class="kiste">
        <span class="title">Effects</span>
        <div :key="key+value" v-for="(key,value) in this.$parent.player.effects">
          <div class="valbox">
            <span class="val">{{key}}</span>
            <img class="icon" v-if="value" :src="getImgUrl(value)" />
          </div>
          <Tooltip2 :item="value" />
        </div>
      </div>
      <div class="kiste">
        <span class="title">Highscore</span>
        <div :key="key+value" v-for="(key,value ) in this.$parent.player.highscore">
          <div v-show="key>0">
            <div class="valbox">
              <span class="val">{{key}}</span>
              <img class="icon" v-if="value" :src="getImgUrlH(value)" />
            </div>
            <TextToolTip :title="value" :item="'killed in '+key+' seconds'" />
          </div>
        </div>
      </div>
      <div class="kiste fux">
        <span class="title">Skills</span>
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
      <div class="ecke">
        <button class="btn export" @click="exportSave">
          <img :src="require('@/assets/icons/export.png')" alt="Export" />
          Export
        </button>

        <input ref="import" id="import" accept="text/txt" type="file" />

        <button class="btn import" @click="importSave">
          <label for="import" style="cursor:pointer">
            <img :src="require('@/assets/icons/import.png')" alt="Import" />
            <span>Import</span>
          </label>
        </button>

        <button class="btn load" @click="loadGame">
          <img :src="require('@/assets/icons/load.png')" alt="Load" />
          Load
        </button>

        <button class="btn save" @click="saveGame">
          <img :src="require('@/assets/icons/save.png')" alt="Save" />
          Save
        </button>

        <button class="btn hard" @click="openreset">
          <img :src="require('@/assets/icons/reset.png')" alt="reset" />
          Hardreset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import j from "./json/player.js";
import tipp from "./json/tipps.json";
import Tooltip2 from "./Tooltip2.vue";
import TextToolTip from "./TextToolTip.vue";
import choiseslist from "./json/choises.json";
import { debug } from "./gloabals.js";
import { copyToClipboard, getClipBoard } from "./functions";

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
    reverse(str) {
      return str
        .split("")
        .reverse()
        .join("");
    },
    loadGame() {
      if (null != localStorage.getItem("saveGame")) {
        let a = JSON.parse(localStorage.getItem("saveGame"));
        this.$parent.recalculate(a);
      }
    },
    saveGame() {
      localStorage.setItem("saveGame", JSON.stringify(this.$parent.player));
    },
    exportSave() {
      if (this.$parent.beta) {
        copyToClipboard(JSON.stringify(this.$parent.player));
      } else {
        copyToClipboard(
          this.reverse(btoa(this.reverse(JSON.stringify(this.$parent.player))))
        );
      }

      this.$parent.player.log.push("<div>Save was downloaded</div>");
    },
    importSave() {
      let el = this;
      this.$refs.import.addEventListener("change", function() {
        if (this.files && this.files[0]) {
          var myFile = this.files[0];
          var reader = new FileReader();

          reader.addEventListener("load", function(e) {
            let r = {};
            try {
              r = JSON.parse(e.target.result);
            } catch {
              r = JSON.parse(el.reverse(atob(el.reverse(e.target.result))));
            }

            el.$parent.recalculate(r);
            el.$parent.player.log.push("<div>Save was loaded</div>");
          });

          reader.readAsBinaryString(myFile);
        }
      });
      this.saveGame();
    },
    openreset() {
      let ov = this.$parent.$refs.ov.$data;
      ov.text = "Do you really want to wipe your entire save?";
      ov.place = "30%";
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
    getImgUrl(pet) {
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
    getImgUrlH(pet) {
      var images = require.context("../assets/enemys/", false, /\.png$/);
      let img = "";
      try {
        img = images("./" + pet + ".png");
        return img;
      } catch (e) {
        img = images("./chulthuluseye.png");
        return img;
      }
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
      delete pl.order;

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
.title {
  width: 310px;
  margin: 4px;
}

#import {
  display: none;
}
.val {
  line-height: 25px;
  font-size: 14px;
}
.icon {
  float: left;
  width: 25px;
  height: 25px;
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
  align-items: flex-start;
}

.fux {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 200px;
}

.kiste {
  width: 310px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  margin: 5px;
  border: 1px solid black;
  background-color: whitesmoke;
  min-width: 100px;
}

.valbox {
  margin: 5px;
  padding: 2px;
  width: 80px;
  white-space: nowrap;
  border: 0.5px solid lightgrey;
}

.ecke {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 65px;
  right: 0px;
}

.import {
  padding: 0px;
}

.import > label {
  padding: 10px;
  display: inline-block;
  width: 100%;
  height: 100%;
  margin: 0px;
}
</style>