<template>
  <div class="one">
    <img :src="getImage" />
    <transition name="fade" mode="out-in">
      <span :key="val">{{val}}</span>
    </transition>
    <Tooltip2 v-if="tooltip" :item="pid" />
  </div>
</template>

<script>
import Tooltip2 from "./Tooltip2.vue";
export default {
  components: {
    Tooltip2
  },
  props: {
    pid: {
      type: String,
      required: true
    },
    val: {
      type: [String, Number],
      required: true
    },
    tooltip: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    getImage: function() {
      return this.images.find(x => x.id == this.pid).img;
    }
  }
};
</script>

<style scoped>
.one {
  margin: 1px;
  height: 40px;
  width: 100px;
  line-height: 40px;
  white-space: nowrap;
  box-shadow: inset 0 0 2px #000000;
}

.one img {
  margin: 4px;
  float: left;
}

.fade-enter-active {
  animation: fade 0.5s;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>