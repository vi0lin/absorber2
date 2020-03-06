<template>
  <div>
    <div>
      <div class="fixed">
        <button @click="openTab('dungeon')" class="btn">
          <img :src="require('@/assets/icons/cave.png')" alt="dungeon" />
          Dungeon
        </button>
        <button @click="openTab('stats')" class="btn">
          <img :src="require('@/assets/icons/hero.png')" alt="stats" />
          Stats
        </button>
        <button @click="openTab('log')" class="btn">
          <img :src="require('@/assets/icons/log.png')" alt="log" />
          Log
        </button>
        <button v-show="this.player.prestige>=3" @click="openTab('order')" class="btn">
          <img :src="require('@/assets/icons/auto.png')" alt="order" />
          Order
        </button>
        <button class="btn" v-show="this.enemy!=null" @click="$refs.dun.selectEnemy(null)">
          <img :src="require('@/assets/icons/door.png')" alt="back" />
          Exit
        </button>
        <button
          v-show="this.player.name=='showmethemoney' && this.beta"
          @click="openTab('enemybuilder')"
          class="btn"
        >
          <img :src="require('@/assets/icons/cave.png')" alt="dungeon" />
          EnemyBuilder
        </button>
        <button @click="autofight()" class="btn" id="auto" :class="{active:this.player.auto}">
          <img :src="require('@/assets/icons/auto.png')" alt="auto" />
          Autofight
        </button>

        <div class="time">{{gettime(player.time)}}</div>
      </div>
      <div class="box">
        <Stats v-if="this.active == 'stats'" />
        <Dungeon ref="dun" v-show="this.active == 'dungeon'" />
        <Log v-if="this.active == 'log'" />
        <EnemyBuilder v-if="this.active == 'enemybuilder'" />
        <AutoOrder v-show="this.active == 'order'" />
      </div>
    </div>
    <div class="status">
      <div v-show="value>0" class="kiste" :key="key" v-for="(value, key) in this.player.status">
        <img class="icons" :src="getImgUrlS(key)" :alt="key" />
        <span class="itext">{{value}}</span>
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
import Progressbar from "./Progressbar.vue";
import Overlay from "./Overlay.vue";
import EnemyBuilder from "./EnemyBuilder.vue";
import AutoOrder from "./AutoOrder.vue";

import skilltree from "./json/skilltree.json";
import choiseslist from "./json/choises.json";
import { RoundAll } from "./displayfunc";
import { respawn, getLast, getNodeById, getLastBoss } from "./functions.js";
import { log } from "./gloabals.js";

import e from "./json/enemys.json";

if (document.referrer.includes("kongregate.com")) {
  kongregateAPI.loadAPI();
}

export default {
  components: {
    Stats,
    Dungeon,
    Progressbar,
    Log,
    Overlay,
    EnemyBuilder,
    AutoOrder
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
      overlay: true,
      skilltree: false,
      beta: true
    };
  },
  methods: {
    autofight() {
      this.player.auto = !this.player.auto;
    },
    getImgUrlS(pet) {
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
    recalculate(pl) {
      let player = {};
      player = JSON.parse(JSON.stringify(ep));
      player.counter = pl.counter;
      player.auto = pl.auto;

      pl.prestige != null && (player.prestige = pl.prestige);

      player.name = pl.name;
      player.go = pl.go;
      player.skills = pl.skills;
      player.lastEnemy = pl.lastEnemy;
      player.time = pl.time;
      player.tutorial = pl.tutorial;
      player.highscore = pl.highscore;
      player.log = log;
      player.speed = 2500;
      player.sspeed = 0;
      this.enemy = null;

      player.order =
        pl.order != undefined && pl.order.length > 0
          ? pl.order
          : e.map(({ id: a }) => a);

      for (let a in player.highscore)
        if (0 < player.highscore[a])
          if (this.kongregate != null)
            this.kongregate.stats.submit(a, player.highscore[a]);

      for (let a in player.counter) {
        for (let b, c = 0; c < player.counter[a]; c++) {
          if (((b = this.$refs.dun.enemys.find(b => b.id === a)), null != b)) {
            for (let a in b.gain) {
              if ("effects" != a && "chance" != a && "speed" != a) {
                player[a] += b.gain[a];
              } else if ("speed" == a) {
                if (player[a] >= 100) {
                  if (b.gain[a] > 0) {
                    if (player[a] > 110) {
                      player[a] -= b.gain[a];
                    } else {
                      player.sspeed += b.gain[a];
                    }
                  } else {
                    if (player.sspeed > 0) {
                      player.sspeed += b.gain[a];
                    } else {
                      player[a] -= b.gain[a];
                    }
                  }
                }
              } else if ("effects" == a) {
                for (let a in b.gain.effects) {
                  player.effects[a] == null
                    ? (player.effects[a] = b.gain.effects[a])
                    : (player.effects[a] += b.gain.effects[a]);
                }
              } else if ("chance" == a) {
                for (let a in b.gain.chance) {
                  player.chance[a] == null
                    ? (player.chance[a] = b.gain.chance[a])
                    : (player.chance[a] += b.gain.chance[a]);
                }
              }
            }
          }
        }
      }

      for (let a of player.skills) {
        let c = getNodeById(a, skilltree);

        if (c == undefined || c == null) {
          var index = player.skills.indexOf(a);
          if (index !== -1) {
            player.skills.splice(index, 1);
          }
        } else {
          let b = choiseslist.find(b => b.id === c.typ);

          for (let k in b.gain) {
            switch (k) {
              case "chance":
                for (let t in b.gain.chance) {
                  if (player.chance[t] != null) {
                    player.chance[t] += b.gain.chance[t];
                  } else {
                    player.chance[t] = b.gain.chance[t];
                  }
                }
                break;

              case "effects":
                for (let t in b.gain.effects) {
                  if (player.effects[t] != null) {
                    player.effects[t] += b.gain.effects[t];
                  } else {
                    player.effects[t] = b.gain.effects[t];
                  }
                }
                break;

              default:
                player[k] += b.gain[k];
                break;
            }
          }
        }
      }

      player.points = player.prestige - player.skills.length;

      if (player.counter[getLastBoss(player)] > 0) {
        player.go = true;
      }

      this.player = player;
      respawn(this.player);
    },
    openTab(t) {
      $(".active:not(#auto)").removeClass("active");

      let target = event.target.classList.contains("btn")
        ? event.target
        : event.target.parentNode;

      $(target).addClass("active");
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
    getLast(j, p) {
      return getLast(j, p);
    },
    hardreset() {
      this.recalculate(JSON.parse(JSON.stringify(ep)));
      this.overlay = false;
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
    }
  },
  mounted() {
    let el = this;

    if (document.referrer.includes("kongregate.com")) {
      kongregateAPI.loadAPI(function() {
        el.kongregate = kongregateAPI.getAPI();
      });
    }

    if (null != localStorage.getItem("saveGame")) {
      let a = JSON.parse(localStorage.getItem("saveGame"));
      this.recalculate(a);
    }

    0 >= this.player.tutorial && this.tutorial();

    this.player.log = log;

    if (this.kongregate != null) {
      if (!this.kongregate.services.isGuest() && player.name == "Rimuro") {
        player.name = this.kongregate.services.getUsername();
      }
    }

    setInterval(() => {
      localStorage.setItem("saveGame", JSON.stringify(this.player));
    }, 60000);

    setInterval(() => {
      this.player.time += 1;
    }, 1000);

    this.overlay = false;

    this.player.status = {
      poison: 0,
      fire: 0,
      stun: 0,
      slow: 0,
      silence: 0,
      rot: 0,
      bleed: 0,
      bury: 0,
      stim: 0,
      invert: 0
    };

    this.htimer = setInterval(() => {
      if (this.recovery) {
        let pl = this.player;

        pl.status = {
          poison: 0,
          fire: 0,
          stun: 0,
          slow: 0,
          silence: 0,
          rot: 0,
          bleed: 0,
          bury: 0,
          stim: 0,
          invert: 0
        };

        if (pl.clife + pl.recovery + pl.regeneration <= pl.life) {
          pl.clife < 0
            ? (pl.clife = pl.recovery + pl.regeneration)
            : (pl.clife += pl.recovery + pl.regeneration);
        } else {
          pl.clife = pl.life;
          if (pl.auto) {
            if (this.player.prestige >= 3) {
              for (let ind of this.player.order) {
                let e = this.$refs.dun.enemys.find(e => e.id == ind);
                let tmax = this.getLast(e.max, pl.prestige);
                if (pl.counter[e.id] < tmax) {
                  this.enemy = e;
                  break;
                }
              }
            } else {
              let last = this.$refs.dun.enemys.find(e => e.id == pl.lastEnemy);
              if (last != undefined) {
                let max = this.getLast(last.max, pl.prestige);
                if (pl.counter[last.id] < max) {
                  this.enemy = last;
                }
              }
            }
          }
        }
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.htimer);
  }
};
</script>

<style scoped>
.box {
  padding: 10px;
  padding-top: 80px;
}
.fixed {
  border: 1px solid black;
  width: 100%;
  position: fixed;
  background: grey;
  display: flex;
  align-items: center;
}
.time {
  margin-right: 10px;
  margin-left: auto;
  font-size: 25px;
  color: white;
  right: 10px;
}

.kiste {
  background: darkgrey;
  padding: 1px;
  border: 1px solid black;
  line-height: 32px;
}

.itext {
  color: white;
  font-stretch: bold;
  padding: 0px 2px;
}

.status {
  position: fixed;
  margin: 5px 5px;
  height: 34px;
  bottom: 60px;
  display: flex;
  flex-direction: column;
}
</style>