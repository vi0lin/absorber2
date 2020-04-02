<template>
  <div :class="{ all: this.beta }" v-if="!loading">
    <div :style="{ backgroundImage: 'url(' + require('@/assets/icons/background.png') + ')' }">
      <div class="fixed">
        <button
          :class="{ active: this.active=='fight' }"
          v-if="this.enemy!=null"
          @click="openTab('fight')"
          class="btn"
        >
          <img :src="require('@/assets/icons/auto.png')" alt="fight" />
          Fight
        </button>
        <button :class="{ active: this.active=='dungeon' }" @click="openTab('dungeon')" class="btn">
          <img :src="require('@/assets/icons/cave.png')" alt="dungeon" />
          Dungeon
        </button>
        <button :class="{ active: this.active=='stats' }" @click="openTab('stats')" class="btn">
          <img :src="require('@/assets/icons/hero.png')" alt="stats" />
          Stats
        </button>
        <button :class="{ active: this.active=='log' }" @click="openTab('log')" class="btn">
          <img :src="require('@/assets/icons/log.png')" alt="log" />
          Log
        </button>
        <button class="btn" v-show="this.enemy!=null" @click="exitFight()">
          <img :src="require('@/assets/icons/door.png')" alt="back" />
          Exit
        </button>

        <div class="time">{{gettime(player.time)}}</div>
      </div>
      <div class="box">
        <Stats v-show="this.active == 'stats'" />
        <Dungeon v-show="this.active == 'dungeon'" />
        <Log v-show="this.active == 'log'" />
        <Fight v-if="this.enemy!=null" v-show="this.active == 'fight'" :item="this.enemy" />
      </div>
    </div>
    <div class="status">
      <div v-show="value>0" :key="key" v-for="(value, key) in this.player.status">
        <img :src="getImgUrl('b'+key)" :alt="key" />
        <span>{{value}}</span>
      </div>
    </div>
    <Progressbar :max="player.life" :val="player.clife" :ab="true" />
    <Progressbar
      v-show="this.enemy!=null"
      :max="player.speed"
      :val="player.cspeed"
      :speed="true"
      :ab="true"
    />
    <Overlay :skilltree="skilltree" ref="ov" v-show="this.overlay" />
  </div>
</template>
<script>
import p from "./json/player.js";
import ep from "./json/playerempty.js";
import Stats from "./Stats.vue";
import Dungeon from "./Dungeon.vue";
import Log from "./Log.vue";
import Fight from "./Fight.vue";
import Progressbar from "./Progressbar.vue";
import Overlay from "./Overlay.vue";

import { RoundAll, getboni } from "./displayfunc";
import { respawn, getLast, getNodeById, getLastBoss } from "./functions.js";
import { log } from "./gloabals.js";

document.referrer.includes("kongregate.com") && kongregateAPI.loadAPI();

export default {
  components: {
    Stats,
    Dungeon,
    Progressbar,
    Log,
    Overlay,
    Fight
  },
  watch: {
    player: {
      deep: true,
      handler(e) {
        RoundAll(e, this.player);
      }
    }
  },
  data() {
    return {
      active: "dungeon",
      player: p,
      enemy: null,
      htimer: null,
      recovery: true,
      kongregate: null,
      overlay: false,
      skilltree: false,
      beta: false,
      cntrlIsPressed: false,
      shiftIsPressed: false,
      log: log,
      complist: [],
      loading: true
    };
  },
  methods: {
    exitFight() {
      this.enemy = null;
      this.player.auto = false;
      this.active = "dungeon";
    },
    getImgUrl(id) {
      return this.images.find(x => x.id == id).img;
    },
    recalculate(pl) {
      let player = JSON.parse(JSON.stringify(ep));
      player.counter = pl.counter;
      player.auto = pl.auto;
      player.companion = pl.companion;
      pl.prestige != null && (player.prestige = pl.prestige);

      player.name = pl.name;
      player.go = pl.go;
      player.skills = pl.skills;
      player.lastEnemy = pl.lastEnemy;
      player.time = pl.time;
      player.tutorial = pl.tutorial;
      player.highscore = pl.highscore;
      player.speed = 2500;
      player.sspeed = 0;
      this.enemy = null;

      if (null != player.companion) {
        let a = getboni(this.complist.find(a => a.id == pl.companion).tags);
        a.chance
          ? player.chance[a.key] == null
            ? (player.chance[a.key] = a.value)
            : (player.chance[a.key] += a.value)
          : "speed" == a.key
          ? (player[a.key] -= a.value)
          : (player[a.key] += a.value);
      }

      player.order =
        pl.order != undefined && pl.order.length > 0
          ? pl.order
          : this.enemieslist.map(({ id: a }) => a);

      for (let b in player.highscore)
        0 < player.highscore[b] &&
          null != this.kongregate &&
          this.kongregate.stats.submit(b, player.highscore[b]);

      for (let d in player.counter)
        for (let e, a = 0; a < player.counter[d]; a++)
          if (((e = this.enemieslist.find(a => a.id === d)), null != e))
            for (let b in e.gain)
              if (
                "effects" != b &&
                "chance" != b &&
                "speed" != b &&
                "resistance" != b
              )
                player[b] += e.gain[b];
              else if ("speed" == b)
                100 <= player[b] &&
                  (0 < e.gain[b]
                    ? 110 < player[b]
                      ? (player[b] -= e.gain[b])
                      : (player.sspeed += e.gain[b])
                    : 0 < player.sspeed
                    ? (player.sspeed += e.gain[b])
                    : (player[b] -= e.gain[b]));
              else if ("effects" == b)
                for (let b in e.gain.effects)
                  null == player.effects[b]
                    ? (player.effects[b] = e.gain.effects[b])
                    : (player.effects[b] += e.gain.effects[b]);
              else if ("chance" == b)
                for (let b in e.gain.chance)
                  null == player.chance[b]
                    ? (player.chance[b] = e.gain.chance[b])
                    : (player.chance[b] += e.gain.chance[b]);
              else if ("resistance" == b)
                for (let b in e.gain.resistance)
                  null == player.resistance[b]
                    ? (player.resistance[b] = e.gain.resistance[b])
                    : (player.resistance[b] += e.gain.resistance[b]);

      for (let b of player.skills) {
        let a = getNodeById(b, this.skillist);
        if (a == null || null == a) {
          var index = player.skills.indexOf(b);
          -1 !== index && player.skills.splice(index, 1);
        } else {
          let c = this.choiselist.find(b => b.id === a.typ);
          for (let a in c.gain)
            switch (a) {
              case "chance":
                for (let a in c.gain.chance)
                  null == player.chance[a]
                    ? (player.chance[a] = c.gain.chance[a])
                    : (player.chance[a] += c.gain.chance[a]);
                break;
              case "effects":
                for (let a in c.gain.effects)
                  null == player.effects[a]
                    ? (player.effects[a] = c.gain.effects[a])
                    : (player.effects[a] += c.gain.effects[a]);
                break;
              case "resistance":
                for (let a in c.gain.resistance)
                  null == player.resistance[a]
                    ? (player.resistance[a] = c.gain.resistance[a])
                    : (player.resistance[a] += c.gain.resistance[a]);
                break;
              default:
                player[a] += c.gain[a];
            }
        }
      }

      player.points = player.prestige - player.skills.length;

      0 < player.counter[getLastBoss(player)] && (player.go = !0);

      this.player = player;
      respawn(this.player);
    },
    openTab(t) {
      this.active = t;
    },
    tutorial() {
      let ov = this.$refs.ov.$data;
      switch (this.player.tutorial) {
        case 0:
          this.overlay = true;
          ov.text = "Welcome";
          ov.img = "enemys/blue_slime";
          ov.obj = [{ text: "next", func: this.tutorial }];
          break;
        case 1:
          ov.img = "";
          ov.text = "Killing Enemies will steal their stats..";
          ov.color = "rgba(0, 0, 0, 0)";
          ov.background = "tut";
          ov.obj = [{ text: "next", func: this.tutorial }];
          break;

        case 2:
          ov.text = "and add them to yours";
          ov.background = "tut2";
          break;

        case 3:
          ov.text = "the goal is to kill the flying eye";
          ov.place = "30%";
          ov.img = "enemys/chulthuluseye";
          ov.color = "rgba(0, 0, 0, 0.4)";
          ov.background = "";
          break;

        case 4:
          ov.text = "have fun playing";
          ov.img = "enemys/bat";
          ov.obj = [{ text: "start", func: this.tutorial }];
          break;

        case 5:
          this.overlay = false;
          break;

        default:
          break;
      }
      this.player.tutorial++;
    },
    displayfinish() {
      let ov = this.$refs.ov.$data,
        player = this.player;

      let obj = [
        { text: "continue", func: this.continue },
        { text: "prestige", func: this.reset }
      ];

      ov.place = "20%";
      ov.text = "You finished the game!";
      ov.img = "icons/finish";
      ov.obj = obj;

      this.overlay = true;
    },
    getLast: (j, p) => getLast(j, p),
    hardreset() {
      this.recalculate(JSON.parse(JSON.stringify(ep)));
      this.overlay = false;
      this.save();
    },
    reset() {
      this.player.prestige++;
      this.player.points++;
      let pres = this.player.prestige;
      let skills = this.player.skills;
      let name = this.player.name;
      let order = this.player.order;
      this.player = JSON.parse(JSON.stringify(ep));
      this.player.name = name;
      this.player.order = order;
      this.player.tutorial = 6;
      this.player.prestige = pres;
      this.player.skills = skills;
      this.player.time = 0;

      this.recalculate(this.player);
      this.overlay = false;
    },
    continue() {
      this.overlay = false;
    },
    addskill(s) {
      this.player.skills.push(s.id);
      this.reset();
    },
    gettime(a) {
      var b = parseInt(a, 10),
        c = Math.floor(b / 3600),
        d = Math.floor((b - 3600 * c) / 60),
        e = b - 3600 * c - 60 * d;
      return (
        10 > c && (c = "0" + c),
        10 > d && (d = "0" + d),
        10 > e && (e = "0" + e),
        0 < c ? c + ":" + d + ":" + e : 0 < d ? d + ":" + e : e
      );
    },
    setNextEnemy() {
      if (this.player.prestige >= 3) {
        for (let ind of this.player.order) {
          let e = this.enemieslist.find(e => e.id == ind);
          if (
            this.player.counter[e.id] <
            this.getLast(e.max, this.player.prestige)
          ) {
            this.enemy = respawn(e);
            break;
          }
        }
      } else {
        let last = this.enemieslist.find(e => e.id == this.player.lastEnemy);
        if (last != undefined) {
          if (
            this.player.counter[last.id] <
            this.getLast(last.max, this.player.prestige)
          ) {
            this.enemy = respawn(last);
          } else {
            this.enemy = null;
            this.active = "dungeon";
          }
        }
      }
    },
    save() {
      if (typeof Storage !== "undefined") {
        localStorage.setItem("saveGame", JSON.stringify(this.player));
      }
    },
    resetStatus(p) {
      for (let a of this.bufflist) p.status[a] = 0;
    },
    preloading() {
      var requireImage = require.context("../assets/enemys/", false, /\.png$/);

      for (let a of this.enemieslist)
        this.images.push({ id: a.id, img: requireImage("./" + a.id + ".png") });

      requireImage = require.context("../assets/skills/", false, /\.png$/);

      for (let a of this.tippslist)
        this.images.push({ id: a.id, img: requireImage("./" + a.id + ".png") });

      requireImage = require.context("../assets/buffs/", false, /\.png$/);

      for (let a of this.bufflist)
        this.images.push({ id: "b" + a, img: requireImage("./" + a + ".png") });

      this.loading = false;
    }
  },
  mounted() {
    this.preloading();
    let el = this;

    document.referrer.includes("kongregate.com") &&
      kongregateAPI.loadAPI(function() {
        el.kongregate = kongregateAPI.getAPI();
      });

    $.getJSON("https://api.kongregate.com/api/kongpanions/index.json", function(
      data
    ) {
      if (data.success) el.complist = data.kongpanions;
    }).done(function() {
      null == localStorage.getItem("saveGame")
        ? el.recalculate(el.player)
        : el.recalculate(JSON.parse(localStorage.getItem("saveGame")));

      6 != el.player.tutorial && el.tutorial();
    });

    if (
      this.kongregate != null &&
      !this.kongregate.services.isGuest() &&
      player.name == "Rimuro"
    ) {
      player.name = this.kongregate.services.getUsername();
    }

    window.addEventListener("keydown", function() {
      "17" == event.which && (el.cntrlIsPressed = !0);
      "16" == event.which && (el.shiftIsPressed = !0);
    });

    window.addEventListener("keyup", function() {
      el.cntrlIsPressed = false;
      el.shiftIsPressed = false;
    });

    setInterval(() => {
      this.save();
    }, 60000);

    setInterval(() => {
      this.player.time += 1;
    }, 1000);

    this.resetStatus(this.player);

    this.htimer = setInterval(() => {
      if (this.recovery) {
        this.resetStatus(this.player);
        this.player.clife + this.player.recovery + this.player.regeneration <=
        this.player.life
          ? 0 > this.player.clife
            ? (this.player.clife =
                this.player.recovery + this.player.regeneration)
            : (this.player.clife +=
                this.player.recovery + this.player.regeneration)
          : ((this.player.clife = this.player.life),
            this.player.auto && this.setNextEnemy());
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.htimer);
  }
};
</script>

<style scoped>
.all {
  border: 3px solid red;
}
.box {
  padding-top: 74px;
}
.fixed {
  border: 1px solid black;
  width: 100%;
  position: fixed;
  background: grey;
  display: flex;
  align-items: center;
  z-index: 2;
}
.time {
  margin-right: 10px;
  margin-left: auto;
  font-size: 25px;
  color: white;
  right: 10px;
}

.status {
  position: fixed;
  margin: 5px 5px;
  height: 40px;
  bottom: 60px;
  display: flex;
  flex-direction: row;
}

.status > div {
  background: darkgrey;
  padding: 1px 5px 1px 2px;
  border: 1px solid black;
  box-shadow: inset -1px -1px 2px grey;
  border-radius: 5px;
  margin: 0px 5px;
}

.status > div > span {
  line-height: 36px;
  color: white;
  font-stretch: bold;
}
.status > div > img {
  float: left;
  margin-right: 2px;
}
</style>