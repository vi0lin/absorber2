<template>
  <div>
    <button class="btn" @click="resetOrder">Reset</button>
    <div id="columns" class="flex">
      <div :key="key" v-for="(value, key) in getPrestigeEnemys($parent.player.order)">
        <div
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          v-if="value.id"
          :id="value.id"
          draggable="true"
          class="box"
        >
          <img :src="getImgUrl(value.id)" :alt="value.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import elist from "./json/enemys.json";

export default {
  data() {
    return {
      enemys: elist,
      dragSrcEl: null
    };
  },
  methods: {
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
    resetOrder() {
      this.$parent.player.order = this.enemys.map(({ id: a }) => a);
    },
    getPrestigeEnemys(o) {
      let list = [];
      let pl = this.$parent.player.order;

      if (pl.order != undefined && pl.order.length > 0) {
        this.resetOrder();
      }

      for (let a of o) {
        list.push(elist.find(b => a == b.id));
      }

      let el = this;
      return list.filter(function(x) {
        if (x.prestige != null && x.prestige != undefined) {
          return el.$parent.player.prestige >= x.prestige;
        }
        return true;
      });
    },
    handleDragStart(e) {
      this.dragSrcEl = e.target;
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

      if (this.dragSrcEl != e.target) {
        let ord = this.$parent.player.order;
        let lastindex = ord.indexOf(this.dragSrcEl.id);
        ord[ord.indexOf(e.target.id)] = this.dragSrcEl.id;
        ord[lastindex] = e.target.id;
        this.$forceUpdate();
      }

      return false;
    },
    handleDragEnd(e) {
      $(".box").removeClass("over");
      $(".box").css("opacity", "1");
    }
  }
};
</script>

<style scoped>
.box {
  cursor: move;
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background: lightcyan;
  margin: 5px;
  border-radius: 20%;
}

img {
  user-select: none;
  height: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  pointer-events: none;
}
</style>