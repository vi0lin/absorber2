<template>
  <div class="stats">
    <input autocorrect="off" class="faker" v-model="$parent.player.name" />
    <div style="display: flex">
      <button
        v-show="$parent.player.go"
        class="btn"
        @click="$parent.displayfinish"
      >
        Prestige
        <img
          class="icons"
          :src="require('@/assets/icons/star.png')"
          alt="reset"
        />
      </button>
      <button
        v-show="$parent.player.prestige > 0"
        class="btn"
        @click="openskilltree"
      >
        Skills
        <img
          class="icons"
          :src="require('@/assets/icons/skills.png')"
          alt="skills"
        />
      </button>
    </div>
    <div class="flex">
      <div>
        <div @click="openbase = !openbase" class="kiste dark title">
          <span>Base</span>
          <span v-if="openbase" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openbase" class="kiste">
            <div class="innerbox">
              <Ability
                class="basic animateOpen"
                :key="key"
                v-for="(value, key) in show($parent.player)"
                :val="value"
                :pid="key"
              />
            </div>
          </div>
        </transition>
      </div>
      <div v-show="Object.keys($parent.player.chance).length !== 0">
        <div @click="openchance = !openchance" class="kiste dark title">
          <span>Chances</span>
          <span v-if="openchance" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openchance" class="kiste">
            <div class="innerbox">
              <Ability
                class="chance"
                :key="key + value"
                v-for="(value, key) in $parent.player.chance"
                :val="value"
                :pid="key"
              />
            </div>
          </div>
        </transition>
      </div>
      <div v-show="Object.keys($parent.player.effects).length !== 0">
        <div @click="openeffects = !openeffects" class="kiste dark title">
          <span>Effects</span>
          <span v-if="openeffects" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openeffects" class="kiste">
            <div class="innerbox">
              <Ability
                class="effects"
                :key="key + value"
                v-for="(value, key) in $parent.player.effects"
                :val="value"
                :pid="key"
              />
            </div>
          </div>
        </transition>
      </div>
      <div v-show="Object.keys($parent.player.resistance).length !== 0">
        <div @click="openres = !openres" class="kiste dark title">
          <span>Resistance</span>
          <span v-if="openres" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openres" class="kiste">
            <Ability
              class="resistance"
              :key="key + value"
              v-for="(value, key) in $parent.player.resistance"
              :val="value"
              :pid="key"
            />
          </div>
        </transition>
      </div>
      <div>
        <div @click="openhigh = !openhigh" class="kiste dark title">
          <span>Highscore</span>
          <span v-if="openhigh" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openhigh" class="kiste innerbox">
            <div
              :key="key + value"
              v-for="(key, value) in $parent.player.highscore"
            >
              <div v-show="key > 0">
                <div class="valbox">
                  <span class="val">{{ key }}</span>
                  <img class="icon" v-if="value" :src="getImgUrl(value)" />
                </div>
                <TextToolTip
                  :title="getRealEnemyName(value)"
                  :item="'killed in ' + key + ' seconds'"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div>
        <div @click="openall = !openall" class="kiste dark title">
          <span>All Scores</span>
          <span v-if="openall" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>

        <div v-show="openall" class="kiste innerbox">
          <div
            :key="key + value"
            v-for="(key, value) in $parent.player.allcount"
          >
            <div v-show="key > 0">
              <div class="valbox">
                <span class="val">{{ key }}</span>
                <img class="icon" v-if="value" :src="getImgUrl(value)" />
              </div>
              <TextToolTip
                :title="getRealEnemyName(value)"
                :item="'killed ' + key + ' times'"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="Object.keys($parent.player.skills).length !== 0">
        <div @click="openskills = !openskills" class="kiste dark title">
          <span>Skills</span>
          <span v-if="openskills" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>

        <div v-show="openskills" class="kiste fux">
          <div
            :key="value"
            v-for="(key, value) in groupSkills($parent.player.skills)"
          >
            <div class="valbox">
              <img
                class="icon"
                :src="
                  require('@/assets/skills/' + displayeskills(value) + '.png')
                "
              />
              <span class="val">{{ key }}</span>
            </div>
            <TextToolTip
              :title="displayeskills2(value).name"
              :item="displayeskills2(value).desc"
            />
          </div>
        </div>
      </div>
      <div v-if="companions.length > 0">
        <div
          style="width: 650px"
          @click="opencomp = !opencomp"
          class="kiste dark title"
        >
          <span>Kongpanions</span>
          <span v-if="opencomp" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <div style="width: 650px" v-show="opencomp" class="kiste innerbox">
          <div
            :class="{
              scomp: isSelectedC(value.id),
              comp: !isSelectedC(value.id),
            }"
            @click="selectComp(value.id)"
            :key="key"
            v-for="(value, key) in companions"
          >
            <img width="110" :src="value.normal_icon_url_small" />
            <div>{{ value.name }}</div>
            <Ability
              :val="getboni(value.tags).value"
              :pid="getboni(value.tags).key"
            />
          </div>
        </div>
      </div>
      <div v-if="$parent.player.prestige > 5">
        <div
          style="width: 650px"
          @click="openitems = !openitems"
          class="kiste dark title"
        >
          <span>Items</span>
          <span v-if="openitems" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>

        <div style="width: 650px" v-show="openitems" class="kiste innerbox">
          <div
            @click="EquipItem(value.id)"
            :class="{
              scomp: isEqupied(value.id),
              comp: !isEqupied(value.id),
            }"
            :key="key"
            v-for="(value, key) in this.itemslist"
          >
            <img width="110" :src="getImgUrl(value.id)" :alt="value.name" />
            <div>{{ value.name }}</div>
            <Tooltip :item="value" :type="'item'" />
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
          <label for="import" style="cursor: pointer">
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

        <button class="btn hard" @click="opensoft">
          <img :src="require('@/assets/icons/softreset.png')" alt="reset" />
          Softreset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TextToolTip from "./TextToolTip.vue";
import { debug } from "./gloabals.js";
import { copyToClipboard, getClipBoard, removeItemOnce } from "./functions";
import { getboni } from "./displayfunc";
import Ability from "./Ability.vue";
import Tooltip from "./Tooltip.vue";

export default {
  components: { TextToolTip, Ability, Tooltip },
  data() {
    return {
      dchance: null,
      deffects: null,
      dhighscore: null,
      companions: [],
      openbase: true,
      openchance: true,
      openeffects: true,
      openres: true,
      openhigh: true,
      openall: true,
      openskills: true,
      opencomp: true,
      openitems: true,
    };
  },
  methods: {
    getboni(tags) {
      return getboni(tags);
    },
    selectComp(e) {
      this.$parent.player.companion = e;
      this.$parent.recalculate(this.$parent.player);
    },
    EquipItem(item) {
      if (this.$parent.player.items.includes(item)) {
        removeItemOnce(this.$parent.player.items, item);
      } else if (
        this.$parent.player.items.length >= this.$parent.player.maxitems
      ) {
        this.$parent.player.items.shift();
        this.$parent.player.items.push(item);
      } else {
        this.$parent.player.items.push(item);
      }
      this.$parent.recalculate(this.$parent.player);
    },
    isSelectedC(comp) {
      return !(this.$parent.player.companion != comp);
    },
    isEqupied(item) {
      if (this.$parent.player.items != undefined && item != undefined) {
        return this.$parent.player.items.includes(item);
      }
      return false;
    },
    reverse(str) {
      return str.split("").reverse().join("");
    },
    loadGame() {
      if (null != localStorage.getItem("saveGame")) {
        let a = JSON.parse(localStorage.getItem("saveGame"));
        this.$parent.recalculate(a);
      }
    },
    saveGame() {
      this.$parent.save();
    },
    exportSave() {
      if (this.beta) {
        copyToClipboard(JSON.stringify(this.$parent.player));
      } else {
        copyToClipboard(
          this.reverse(btoa(this.reverse(JSON.stringify(this.$parent.player))))
        );
      }

      this.$parent.log.push("<div>Save was downloaded</div>");
    },
    getRealEnemyName(id) {
      return this.enemieslist.find((x) => x.id == id).name;
    },
    importSave() {
      let el = this;
      this.$refs.import.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          var reader = new FileReader();

          reader.addEventListener("load", function (e) {
            let r = {};
            try {
              r = JSON.parse(e.target.result);
            } catch {
              r = JSON.parse(el.reverse(atob(el.reverse(e.target.result))));
            }

            el.$parent.recalculate(r);
            el.$parent.log.push("<div>Save was loaded</div>");
          });

          reader.readAsBinaryString(this.files[0]);
        }
      });
      this.saveGame();
    },
    groupSkills(list) {
      let obj = {};

      list.reduce(function (rv, x) {
        x = x.substring(0, x.length - 1);
        x in obj ? obj[x]++ : (obj[x] = 1);
      }, {});
      return obj;
    },
    openreset() {
      let ov = this.$parent.$refs.ov.$data;
      ov.text = "Do you really want to wipe your entire save?";
      ov.place = "30%";
      ov.obj = [
        { text: "yes", func: this.$parent.hardreset },
        { text: "no", func: this.closereset },
      ];
      ov.img = "icons/reset";
      this.$parent.overlay = true;
    },
    opensoft() {
      let ov = this.$parent.$refs.ov.$data;
      ov.text = "Do you really want to wipe your current run?";
      ov.place = "30%";
      ov.obj = [
        { text: "yes", func: this.$parent.softreset },
        { text: "no", func: this.closereset },
      ];
      ov.img = "icons/reset";
      this.$parent.overlay = true;
    },
    closereset() {
      this.$parent.overlay = false;
    },
    displayeskills(a) {
      return this.choiselist.find((b) => b.id === a).id.substring(2);
    },
    displayeskills2(a) {
      return this.choiselist.find((b) => b.id === a);
    },
    openskilltree() {
      this.$parent.skilltree = true;
      this.$parent.overlay = true;
    },
    getImgUrl(id) {
      return this.images.find((x) => x.id == id).img;
    },
    show(p) {
      let pl = JSON.parse(JSON.stringify(p));
      delete pl.name;
      delete pl.status;
      delete pl.counter;
      delete pl.go;
      delete pl.unlockeditems;
      delete pl.allcount;
      delete pl.companion;
      delete pl.skills;
      delete pl.time;
      delete pl.items;
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
    },
  },
  created() {
    let boot = setInterval(() => {
      if (this.$parent.kongregate != null) {
        if (!this.$parent.kongregate.services.isGuest() || this.beta) {
          let user = "";
          if (this.beta) {
            if (this.$parent.player.name == "showmethemoney") {
              user = "dirkf17";
            } else {
              user = this.$parent.player.name;
            }
          } else {
            user = this.$parent.kongregate.services.getUsername();
          }

          let el = this;
          let link =
            "https://api.kongregate.com/api/kongpanions.json?username=" + user;
          $.getJSON(link, function (data) {
            if (data.success) {
              el.companions = data.kongpanions;
              if (el.$parent.player.companion == 0) {
                el.$parent.player.companion = el.companions[0].id;
              }
            }
          });
        }
        clearInterval(boot);
      }
    }, 500);
  },
};
</script>

<style scoped>
.stats {
  padding-bottom: 50px;
  margin: 10px;
  margin-top: 40px;
}

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
  display: block;
  width: 790px;
  border: 1px solid black;
  box-shadow: inset 0 0 4px grey;
  border-radius: 10px;
  background: lightgrey;
  outline: none;
  padding: 10px;
  margin: 10px;
  font-size: 30px;
  font-weight: bold;
  cursor: text;
  font-family: "MedievalSharp", cursive;
}

.flex {
  align-items: flex-start;
}

.kiste {
  margin: 5px;
  padding: 10px;
  width: 310px;
  border: 1px solid black;
  background-color: lightgray;
  border-radius: 5px;
  box-shadow: inset 0 0 4px grey;
  min-width: 100px;
}
.innerbox {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.icons {
  width: 32px;
  height: 32px;
  margin-right: 5px;
}

.valbox {
  margin: 5px;
  padding: 2px;
  width: 80px;
  white-space: nowrap;
  border: 0.5px solid black;
  background: gold;
}

.ecke {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 65px;
  right: 40px;
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
.comp {
  margin: 5px;
  border: 3px dotted grey;
  padding: 5px;
  max-width: 100px;
  text-align: center;
}
.comp img {
  width: 100px;
}
.scomp img {
  width: 100px;
}
.scomp {
  margin: 5px;
  width: 100px;
  border: 3px solid yellow;
  padding: 5px;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dark {
  background: darkgrey;
  transition: background-color 0.5s ease;
}
.dark:hover {
  background: yellowgreen;
}
</style>