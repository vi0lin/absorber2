<template>
  <div>
    <div class="container">
      <div>
        <button :class="{ active: this.active=='dungeon' }" @click="openTab('dungeon')" class="btn">
          Dungeon
          <img class="icons" :src="require('@/assets/cave.png')" alt="dungeon" />
        </button>
        <button
          hidden
          :class="{ active: this.active=='skills' }"
          @click="openTab('skills')"
          class="btn"
        >
          Skills
          <span v-show="this.player.sp>0">({{this.player.sp}})</span>
        </button>
        <button :class="{ active: this.active=='stats' }" @click="openTab('stats')" class="btn">
          <img class="icons" :src="require('@/assets/hero.png')" alt="stats" />
          Stats
        </button>
        <button :class="{ active: this.active=='log' }" @click="openTab('log')" class="btn">
          <img class="icons" :src="require('@/assets/log.png')" alt="log" />
          Log
        </button>
        <div class="time">{{gettime(player.time)}}</div>
      </div>
      <div>
        <Stats v-show="this.active == 'stats'" />
        <Dungeon ref="dun" v-show="this.active == 'dungeon'" />
        <Skills v-show="this.active == 'skills'" />
        <Log v-show="this.active == 'log'" />
      </div>
    </div>
    <div class="flexy">
      <div v-show="value>0" class="kiste" :key="key" v-for="(value, key) in this.player.status">
        <img class="icon" :src="require('@/assets/'+key+'.png')" :alt="key" />
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
    <Overlay ref="ov" v-show="this.overlay" />
  </div>
</template>
<script>
import p from "./json/player.js";
import Stats from "./Stats.vue";
import Skills from "./Skills.vue";
import Dungeon from "./Dungeon.vue";
import Log from "./Log.vue";
import Progressbar from "./Progressbar.vue";
import Overlay from "./Overlay.vue";

import choiseslist from "./json/choises.json";

kongregateAPI.loadAPI();

export default {
  components: { Stats, Dungeon, Skills, Progressbar, Log, Overlay },
  watch: {
    player: {
      deep: true,
      handler(e) {
        this.player.life = Math.round((e.life + Number.EPSILON) * 100) / 100;
        this.player.clife = Math.round((e.clife + Number.EPSILON) * 100) / 100;
        this.player.speed = Math.round((e.speed + Number.EPSILON) * 100) / 100;

        this.player.dmg = Math.round((e.dmg + Number.EPSILON) * 100) / 100;
        this.player.magic = Math.round((e.magic + Number.EPSILON) * 100) / 100;
        this.player.regeneration =
          Math.round((e.regeneration + Number.EPSILON) * 100) / 100;

        this.player.recovery =
          Math.round((e.recovery + Number.EPSILON) * 100) / 100;
        this.player.effects.lifesteal =
          Math.round((e.effects.lifesteal + Number.EPSILON) * 100) / 100;
        this.player.effects.block =
          Math.round((e.effects.block + Number.EPSILON) * 100) / 100;
        this.player.chance.crit =
          Math.round((e.chance.crit + Number.EPSILON) * 100) / 100;
        this.player.chance.instakill =
          Math.round((e.chance.instakill + Number.EPSILON) * 100) / 100;
        this.player.chance.stun =
          Math.round((e.chance.stun + Number.EPSILON) * 100) / 100;
        this.player.chance.poison =
          Math.round((e.chance.poison + Number.EPSILON) * 100) / 100;
        this.player.chance.fire =
          Math.round((e.chance.fire + Number.EPSILON) * 100) / 100;
        this.player.chance.double =
          Math.round((e.chance.double + Number.EPSILON) * 100) / 100;
        this.player.chance.dodge =
          Math.round((e.chance.dodge + Number.EPSILON) * 100) / 100;
        this.player.chance.supercrit =
          Math.round((e.chance.supercrit + Number.EPSILON) * 100) / 100;
        this.player.chance.megacrit =
          Math.round((e.chance.megacrit + Number.EPSILON) * 100) / 100;
        this.player.chance.slow =
          Math.round((e.chance.slow + Number.EPSILON) * 100) / 100;
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
      overlay: false
    };
  },
  methods: {
    recalculate(pl) {
      this.player = JSON.parse(JSON.stringify(p));
      this.player.counter = pl.counter;
      this.player.auto = pl.auto;
      this.player.prestige = pl.prestige;
      this.player.skills = pl.skills;
      this.player.lastenemy = pl.lastenemy;
      this.player.time = pl.time;
      this.player.version = pl.version;
      this.player.name = pl.name;
      this.player.tutorial = pl.tutorial;
      this.player.highscore = pl.highscore;

      for (let score in this.player.highscore) {
        if (this.player.highscore[score] > 0) {
          try {
            kong.stats.submit(score, this.player.highscore[score]);
          } catch {}
        }
      }

      for (let s in this.player.skills) {
        let skill = choiseslist.find(x => x.id === this.player.skills[s]);
        for (let thing in skill.gain) {
          this.player[thing] += skill.gain[thing];
        }
      }

      for (let en in this.player.counter) {
        for (let i = 0; i < this.player.counter[en]; i++) {
          let t = this.$refs.dun.enemys.find(x => x.id === en);
          if (t != undefined) {
            for (let g in t.gain) {
              if (g != "effects" && g != "chance" && g != "speed") {
                this.player[g] += t.gain[g];
              } else if (g == "speed") {
                this.player[g] -= t.gain[g];
              } else if (g == "effects") {
                for (let ef in t.gain.effects) {
                  this.player.effects[ef] += t.gain.effects[ef];
                }
              } else if (g == "chance") {
                for (let ef in t.gain.chance) {
                  this.player.chance[ef] += t.gain.chance[ef];
                }
              }
            }
          }
        }
      }

      try {
        if (!this.kongregate.services.isGuest()) {
          this.player.name = this.kongregate.services.getUsername();
        }
      } catch {}
    },
    openTab(t) {
      this.active = t;
    },
    tutorial() {
      switch (this.player.tutorial) {
        case 0:
          this.overlay = true;
          this.$refs.ov.$data.text = "Welcome";
          this.$refs.ov.$data.img = "blue_slime";
          this.$refs.ov.$data.obj = [{ text: "next", func: this.tutorial }];
          break;
        case 1:
          this.$refs.ov.$data.img = "";
          this.$refs.ov.$data.text = "Killing Enemys will steal their stats..";
          this.$refs.ov.$data.color = "rgba(0, 0, 0, 0)";
          this.$refs.ov.$data.background = "tut";
          this.$refs.ov.$data.obj = [{ text: "next", func: this.tutorial }];
          break;

        case 2:
          this.$refs.ov.$data.text = "and add them to yours";
          this.$refs.ov.$data.background = "tut2";
          break;

        case 3:
          this.$refs.ov.$data.text = "the goal is to kill the flying eye";
          this.$refs.ov.$data.place = "30%";
          this.$refs.ov.$data.img = "chulthuluseye";
          this.$refs.ov.$data.color = "rgba(0, 0, 0, 0.4)";
          this.$refs.ov.$data.background = "";
          break;

        case 4:
          this.$refs.ov.$data.text = "have fun playing";
          this.$refs.ov.$data.img = "bat";
          this.$refs.ov.$data.obj = [{ text: "start", func: this.tutorial }];
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
      if (this.player.prestige <= this.player.skills.length) {
        this.player.prestige++;
      }
      this.overlay = true;
      this.$refs.ov.$data.place = "20%";
      this.$refs.ov.$data.text = "You finished the game!";
      this.$refs.ov.$data.img = "finish";

      let obj = [{ text: "continue", func: this.continue }];
      let filtred = choiseslist.filter(
        x => this.player.skills.indexOf(x.id) == -1
      );
      for (let c in filtred) {
        obj.push({
          text: filtred[c].name,
          func: () => this.addskill(filtred[c])
        });
      }

      if (obj.length < 2) {
        obj.push({ text: "hardreset", func: this.hardreset });
      }

      this.$refs.ov.$data.obj = obj;
    },
    hardreset() {
      this.recalculate(JSON.parse(JSON.stringify(p)));
      this.overlay = false;
    },
    reset() {
      let pres = this.player.prestige;
      let skills = this.player.skills;
      this.player = JSON.parse(JSON.stringify(p));
      this.player.tutorial = 6;
      this.player.prestige = pres;
      this.player.skills = skills;

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
    gettime(t) {
      var sec_num = parseInt(t, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (hours > 0) {
        return hours + ":" + minutes + ":" + seconds;
      }
      if (minutes > 0) {
        return minutes + ":" + seconds;
      }
      return seconds;
    }
  },
  mounted() {
    let el = this;
    try {
      kongregateAPI.loadAPI(function() {
        el.kongregate = kongregateAPI.getAPI();
      });
    } catch {}

    if (localStorage.getItem("saveGame") != null) {
      let test = JSON.parse(localStorage.getItem("saveGame"));
      if (test.version == p.version && test.version != undefined) {
        this.recalculate(test);
      } else {
        for (let thin in p) {
          if (test[thin] == undefined) {
            test[thin] = p[thin];
          }
        }
      }
    }

    if (this.player.tutorial <= 0) {
      this.tutorial();
    }

    if (this.player.prestige > this.player.skills.length) {
      this.displayfinish();
    }

    setInterval(() => {
      localStorage.setItem("saveGame", JSON.stringify(this.player));
    }, 5000);

    setInterval(() => {
      this.player.time += 1;
    }, 1000);

    this.htimer = setInterval(() => {
      if (this.recovery) {
        this.player.status.poison = 0;
        this.player.status.fire = 0;
        this.player.status.stun = 0;
        this.player.status.slow = 0;
        this.player.status.silence = 0;

        if (
          this.player.clife + this.player.recovery + this.player.regeneration <=
          this.player.life
        ) {
          if (this.player.clife < 0) {
            this.player.clife = this.player.recovery + this.player.regeneration;
          } else {
            this.player.clife +=
              this.player.recovery + this.player.regeneration;
          }
        } else {
          this.player.clife = this.player.life;
          if (this.player.auto) {
            for (let en in this.$refs.dun.enemys) {
              let e = this.$refs.dun.enemys[en];
              if (e.id == this.player.lastenemy) {
                if (this.player.counter[e.id] < e.max) {
                  this.enemy = e;
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
.time {
  font-size: 25px;
  color: white;
  position: absolute;
  top: 15px;
  right: 15px;
}
.container {
  margin: 10px;
}
.btn {
  line-height: 32px;
  border-radius: 5%;
  font-size: 20px;
  font-family: "MedievalSharp", cursive;
  margin: 10px;
  padding: 10px;
  outline: none;
  border: none;
  background: #fefefe;
  cursor: pointer;
}
.btn:hover {
  background: #c0c0c0;
}
.active {
  background: #999999;
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

.icon {
  height: 32px;
  width: 32px;
  margin: 0px;
  float: right;
}

.flexy {
  position: absolute;
  margin: 5px 5px;
  height: 34px;
  display: flex;
  bottom: 60px;
}

.icons {
  float: left;
  height: 32px;
}
</style>