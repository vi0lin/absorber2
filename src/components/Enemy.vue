<template>
  <div>
    <div style="display:flex">
      <div
        :class="{ ready: checkready(value) }"
        @click="selectEnemy(value)"
        @click.middle="cheat(value)"
        class="kiste"
        v-if="$parent.$parent.player.prestige<3"
      >
        <div>
          <transition name="fade" mode="out-in">
            <span :key="getcount">{{getcount}}</span>
          </transition>/
          <transition name="fade" mode="out-in">
            <span :key="getLast">{{getLast}}</span>
          </transition>
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
        @click.middle="cheat(value)"
        @click="selectEnemy(value)"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        draggable="true"
        class="kiste"
        :id="value.id"
      >
        <div>
          <transition name="fade" mode="out-in">
            <span :key="getcount">{{getcount}}</span>
          </transition>/
          <transition name="fade" mode="out-in">
            <span :key="getLast">{{getLast}}</span>
          </transition>

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
        let saveid = this.$parent.dragSrcEl;
        ord.splice(ord.indexOf(saveid), 1);
        ord.splice(ord.indexOf(e.target.id), 0, saveid);
        this.$parent.$forceUpdate();
      }
      return false;
    },
    handleDragEnd(e) {
      $(".kiste").removeClass("over");
      $(".kiste").css("opacity", "1");
    },
    cheat(e) {
      if (
        this.$parent.$parent.player.name == "showmethemoney" &&
        this.$parent.$parent.beta
      ) {
        this.$parent.$parent.player.counter[e.id] =
          getLast(e.max, this.$parent.$parent.player.prestige) - 1;
        this.$parent.$parent.recalculate(this.$parent.$parent.player);
      }
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
        this.$parent.$parent.enemy = respawn(t);
        this.$parent.$parent.active = "fight";
      }
    }
  },
  computed: {
    getImage: function() {
      return this.images.find(x => x.id == this.value.id).img;
    },
    getcount: function() {
      if (this.$parent.$parent.player.counter[this.value.id] == null) {
        return 0;
      }
      return this.$parent.$parent.player.counter[this.value.id];
    },
    getLast: function() {
      return getLast(this.value.max, this.$parent.$parent.player.prestige);
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
  min-height: 140px;
  box-shadow: inset -2px -2px 2px #76bdd5;
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
  height: auto;
}

.ready {
  background: lightcoral;
  box-shadow: inset -2px -2px 2px #ec5f5f;
}
.ready:hover {
  background: lightcoral;
}

.fade-enter-active {
  animation: fade 0.4s;
}

@keyframes fade {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>