<template>
  <div>
    <div
      :class="{ ready: checkready(value) }"
      @click="selectEnemy(value)"
      class="kiste"
      v-if="$parent.$parent.player.prestige<3"
    >
      <div>
        {{getcount(value.id)}} / {{getLast(value.max,$parent.$parent.player.prestige)}}
        <br />
        <img v-if="value.id" class="image" :src="getImage" :alt="value.name" />
        <br />
        {{value.name}}
      </div>
      <Tooltip
        :shift="$parent.$parent.shiftIsPressed"
        :ctrl="$parent.$parent.cntrlIsPressed"
        :item="value"
      />
    </div>
    <div
      v-else
      :class="{ ready: checkready(value) }"
      @click="selectEnemy(value)"
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
        {{getcount(value.id)}} / {{getLast(value.max,$parent.$parent.player.prestige)}}
        <br />
        <img v-if="value.id" class="image" :src="getImage" :alt="value.name" />
        <br />
        {{value.name}}
      </div>
    </div>
    <Tooltip
      :shift="$parent.$parent.shiftIsPressed"
      :ctrl="$parent.$parent.cntrlIsPressed"
      :item="value"
    />
  </div>
</template>

<script>
import Tooltip from "./Tooltip.vue";
import { getLast } from "./functions";
import { respawn } from "./functions";
export default {
  name: "Enemy",
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  components: {
    Tooltip
  },
  methods: {
    handleDragStart(e) {
      this.$parent.dragSrcEl = e.target.id;
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
      if (e.target.id != this.$parent.dragSrcEl) {
        let ord = this.$parent.$parent.player.order;
        let lastindex = ord.indexOf(this.$parent.dragSrcEl);
        ord[ord.indexOf(e.target.id)] = this.$parent.dragSrcEl;
        ord[lastindex] = e.target.id;
        this.$parent.$forceUpdate();
      }
      return false;
    },
    handleDragEnd(e) {
      $(".kiste").removeClass("over");
      $(".kiste").css("opacity", "1");
    },
    getcount(t) {
      this.$parent.$parent.player.counter[t] == null &&
        (this.$parent.$parent.player.counter[t] = 0);

      return this.$parent.$parent.player.counter[t];
    },
    getLast(j, p) {
      return getLast(j, p);
    },
    checkready(a) {
      return (
        null != a &&
        this.$parent.$parent.player.counter[a.id] >=
          getLast(a.max, this.$parent.$parent.player.prestige)
      );
    },
    selectEnemy(t) {
      if (!this.checkready(t)) {
        this.$parent.$parent.enemy = t;
        this.$parent.$parent.active = "fight";
        respawn(this.$parent.$parent.enemy);
      }
    }
  },
  computed: {
    getImage: function() {
      return this.images.find(x => x.id == this.value.id).img;
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

.image {
  width: 70px;
}
</style>