<template>
  <div class="moreroom">
    <div v-show="this.$parent.enemy==null">
      <div style="margin-left:10px;">
        Press
        <i>CTRL</i> for gain and
        <i>SHIFT</i> for description
      </div>
      <div class="flex">
        <div
          :class="{ ready: checkready(value) }"
          @click="selectEnemy(value)"
          @click.middle="cheat(value)"
          class="kiste"
          :key="key"
          v-for="(value, key) in getPrestigeEnemys(this.enemys)"
        >
          <div>
            {{getcount(value.id)}} / {{getLast(value.max,$parent.player.prestige)}}
            <br />
            <img v-if="value.id" class="image" :src="getImgUrl(value.id)" :alt="value.name" />
            <br />
            {{value.name}}
          </div>
          <Tooltip :shift="shiftIsPressed" :ctrl="cntrlIsPressed" :item="value" />
        </div>
      </div>
    </div>

    <Fight v-if="this.$parent.enemy!=null" :item="this.$parent.enemy" />
  </div>
</template>

<script>
import e from "./json/enemys.json";
import Fight from "./Fight.vue";
import Tooltip from "./Tooltip.vue";
import { respawn, getLast } from "./functions";

export default {
  components: { Fight, Tooltip },
  data() {
    return {
      enemys: e,
      cntrlIsPressed: false,
      shiftIsPressed: false
    };
  },
  methods: {
    cheat(e) {
      if (this.$parent.player.name == "showmethemoney" && this.$parent.beta) {
        let max = getLast(e.max, this.$parent.player.prestige);
        this.$parent.player.counter[e.id] = max - 1;
        this.$parent.recalculate(this.$parent.player);
      }
    },
    getLast(j, p) {
      return getLast(j, p);
    },
    checkready(a) {
      return (
        null != a &&
        this.$parent.player.counter[a.id] >=
          getLast(a.max, this.$parent.player.prestige)
      );
    },

    getPrestigeEnemys(en) {
      let el = this;
      return en.filter(function(x) {
        if (x.prestige != null) {
          return el.$parent.player.prestige >= x.prestige;
        }
        return true;
      });
    },
    selectEnemy(t) {
      if (!this.checkready(t)) {
        this.$parent.enemy = t;

        this.$parent.enemy != null
          ? respawn(this.$parent.enemy)
          : (this.$parent.player.auto = false);
      }
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
    getcount(t) {
      this.$parent.player.counter[t] == null &&
        (this.$parent.player.counter[t] = 0);

      return this.$parent.player.counter[t];
    }
  },
  mounted() {
    let el = this;
    window.addEventListener("keydown", function(e) {
      if (event.which == "17") {
        el.cntrlIsPressed = true;
      }
      if (event.which == "16") {
        el.shiftIsPressed = true;
      }
    });
    window.addEventListener("keyup", function(e) {
      el.cntrlIsPressed = false;
      el.shiftIsPressed = false;
    });
  }
};
</script>

<style scoped>
.kiste {
  border-radius: 5%;
  font-size: 20px;
  user-select: none;
  cursor: pointer;
  background: lightblue;
  margin: 10px;
  padding: 30px;
  border: 1px solid black;
  text-align: center;
}
.kiste:hover {
  background: rgb(186, 233, 248);
}
.ready {
  background: lightcoral;
}
.ready:hover {
  background: lightcoral;
}
.image {
  width: 100px;
  max-width: 200px;
}

.moreroom {
  padding-bottom: 250px;
}

@media screen and (max-device-width: 500px) {
  .moreroom {
    padding-bottom: 0px;
  }
}

.icons {
  float: left;
  height: 32px;
}
</style>