<template>
  <div>
    <div v-show="this.$parent.enemy==null">
      <div @click="autofight()" class="auto" :class="{autofight:this.$parent.player.auto}">
        Autofight
        <img class="icons" :src="require('@/assets/icons/auto.png')" alt="auto" />
      </div>
      <div class="flex">
        <div
          :class="{ ready: checkready(value) }"
          @click="selectEnemy(value)"
          class="kiste"
          :key="key"
          v-for="(value, key) in getPrestigeEnemys(this.enemys)"
        >
          <div>
            {{getcount(value.id)}} / {{value.max}}
            <br />
            <img
              v-if="value.id"
              class="image"
              :src="require('@/assets/enemys/'+value.id+'.png')"
              :alt="value.name"
            />
            <br />
            {{value.name}}
          </div>
          <Tooltip :item="value" />
        </div>
      </div>
    </div>
    <button class="back" v-show="this.$parent.enemy!=null" @click="selectEnemy(null)">
      Exit
      <img class="icons" :src="require('@/assets/icons/door.png')" alt="back" />
    </button>
    <Fight v-if="this.$parent.enemy!=null" :item="this.$parent.enemy" />
  </div>
</template>

<script>
import e from "./json/enemys.json";
import Fight from "./Fight.vue";
import Tooltip from "./Tooltip.vue";
import { respawn } from "./functions";

export default {
  components: { Fight, Tooltip },
  data() {
    return {
      enemys: e
    };
  },
  methods: {
    checkready(a) {
      return null != a && this.$parent.player.counter[a.id] >= a.max;
    },
    autofight() {
      this.$parent.player.auto = !this.$parent.player.auto;
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
    getcount(t) {
      this.$parent.player.counter[t] == null &&
        (this.$parent.player.counter[t] = 0);

      return this.$parent.player.counter[t];
    }
  }
};
</script>

<style scoped>
.flex {
  text-align: center;
  flex-wrap: wrap;
  display: flex;
}
.kiste {
  border-radius: 5%;
  font-size: 20px;
  user-select: none;
  cursor: pointer;
  background: lightblue;
  margin: 10px;
  padding: 30px;
  border: 1px solid black;
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
}

.back {
  line-height: 32px;
  border-radius: 5%;
  font-size: 20px;
  font-family: "MedievalSharp", cursive;
  margin: 10px 0px 0px 10px;
  padding: 10px;
  outline: none;
  border: none;
  background: #fefefe;
  cursor: pointer;
}

.back:hover {
  background: #c0c0c0;
}

.icons {
  float: left;
  height: 32px;
}
.auto {
  width: 100px;
  line-height: 32px;
  border-radius: 10px;
  font-size: 15px;
  user-select: none;
  cursor: pointer;
  background: lightgrey;
  margin: 5px;
  padding: 5px;
  border-style: outset;
}
.autofight {
  background: lightblue;
  border-style: inset;
}
.autofight:hover {
  background: lightblue;
}
</style>