<template>
  <div class="one">
    <img :src="getImage" />
    <span>{{val}}</span>
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
  margin-top: 2px;
  height: 40px;
  width: 100px;
  line-height: 40px;
  white-space: nowrap;
  border: 0.5px solid lightgrey;
}

.one img {
  margin: 4px;
  float: left;
}
</style>