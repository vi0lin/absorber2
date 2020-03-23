<template>
  <div>
    <div class="moreroom">
      <div>
        <button v-show="$parent.player.prestige>=3" class="btn dun" @click="resetOrder()">
          <img :src="require('@/assets/icons/order.png')" alt="auto" />
          <span>Reset Order</span>
        </button>
        <button
          @click="autofight()"
          class="btn dun"
          id="auto"
          :class="{active:this.$parent.player.auto}"
        >
          <img :src="require('@/assets/icons/auto.png')" alt="auto" />
          <span>Autofight</span>
        </button>
        <div style="margin-left:10px;">
          Press
          <b>CTRL</b> for stats.
          <b>SHIFT</b> for description.
          <span v-show="$parent.player.prestige>=3">
            <b>DRAG</b> to change fighting order.
          </span>
        </div>
      </div>
      <div class="flex">
        <div :key="key" v-for="(value, key) in getPrestigeEnemys()">
          <div
            :class="{ ready: checkready(value) }"
            @click="selectEnemy(value)"
            @click.middle="cheat(value)"
            class="kiste"
            v-if="$parent.player.prestige<3"
          >
            <div>
              {{getcount(value.id)}} / {{getLast(value.max,$parent.player.prestige)}}
              <br />
              <img v-if="value.id" class="image" :src="getImgUrl(value.id)" :alt="value.name" />
              <br />
              {{value.name}}
            </div>
            <Tooltip :shift="$parent.shiftIsPressed" :ctrl="$parent.cntrlIsPressed" :item="value" />
          </div>
          <div
            v-else
            :class="{ ready: checkready(value) }"
            @click="selectEnemy(value)"
            @click.middle="cheat(value)"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
            @dragover="handleDragOver"
            @dragenter="handleDragEnter"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            :id="value.id"
            draggable="true"
            class="kiste"
          >
            <div>
              {{getcount(value.id)}} / {{getLast(value.max,$parent.player.prestige)}}
              <br />
              <img v-if="value.id" class="image" :src="getImgUrl(value.id)" :alt="value.name" />
              <br />
              {{value.name}}
            </div>
          </div>
          <Tooltip :shift="$parent.shiftIsPressed" :ctrl="$parent.cntrlIsPressed" :item="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import e from "./json/enemys.json";
import Tooltip from "./Tooltip.vue";
import { respawn, getLast } from "./functions";

export default {
  components: { Tooltip },
  data() {
    return {
      enemys: e,
      dragSrcEl: null
    };
  },
  methods: {
    handleDragStart(e) {
      this.dragSrcEl = e.target.id;

      $(e.target).css("opacity", "0.5");
      e.dataTransfer.effectAllowed = "move";
    },
    handleDragOver(e) {
      e.preventDefault && e.preventDefault();
      return false;
    },
    handleDragEnter(e) {
      $(this).addClass("over");
    },
    handleDragLeave(e) {
      $(this).removeClass("over");
    },
    handleDrop(e) {
      e.stopPropagation && e.stopPropagation();

      if (e.target.id != this.dragSrcEl) {
        let ord = this.$parent.player.order;
        let lastindex = ord.indexOf(this.dragSrcEl);
        ord[ord.indexOf(e.target.id)] = this.dragSrcEl;
        ord[lastindex] = e.target.id;
        this.$forceUpdate();
      }

      return false;
    },
    handleDragEnd(e) {
      $(".kiste").removeClass("over");
      $(".kiste").css("opacity", "1");
    },
    autofight() {
      this.$parent.player.auto = !this.$parent.player.auto;
    },
    resetOrder() {
      this.$parent.player.order = this.enemys.map(({ id: a }) => a);
    },
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

    getPrestigeEnemys() {
      let list = [],
        el = this;

      for (let a of this.$parent.player.order) {
        list.push(this.enemys.find(b => a == b.id));
      }

      while (this.enemys.length > this.$parent.player.order.length) {
        this.$parent.player.order.push(
          this.enemys[this.$parent.player.order.length].id
        );
      }

      return list.filter(function(x) {
        if (x.prestige != null && x.prestige != undefined) {
          return el.$parent.player.prestige >= x.prestige;
        }
        return true;
      });
    },
    selectEnemy(t) {
      if (!this.checkready(t)) {
        this.$parent.enemy = t;
        this.$parent.active = "fight";

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
  }
};
</script>

<style scoped>
.kiste {
  border-radius: 5%;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  background: lightblue;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  text-align: center;
  width: 80px;
  min-height: 130px;
}
.kiste:hover {
  background: rgb(186, 233, 248);
}

.kiste img {
  user-select: none;
  height: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  pointer-events: none;
}

.kiste * {
  pointer-events: none;
}

.ready {
  background: lightcoral;
}
.ready:hover {
  background: lightcoral;
}
.image {
  width: 70px;
}

.moreroom {
  padding-bottom: 100px;
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

.dun {
  font-size: 14px;
  display: inline;
  padding: 4px;
  box-shadow: 0 2px #999;
  line-height: 20px;
}

.dun:active,
.dun.active {
  box-shadow: 0 2px #666;
  transform: translateY(1px);
  background: #505050;
}

.dun > img {
  vertical-align: middle;
  height: 20px;
  width: 20px;
}
</style>