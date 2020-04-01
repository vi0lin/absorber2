<template>
  <div v-if="item!=null">
    <div>
      <img
        class="small"
        :class="{ big: item.typ.charAt(0) =='m', shinny: co(item.id), deactive: can(item.id) }"
        :src="getImage"
        @click="fun(item.id)"
      />
      <TextToolTip :title="gettipp.name" :item="gettipp.desc" />
    </div>
    <div class="flex-colum">
      <Accordion :can="can" :co="co" :fun="fun" :key="i.id" :item="i" v-for="i of item.open" />
    </div>
  </div>
</template>

<script>
import TextToolTip from "./TextToolTip.vue";
import Accordion from "./Accordion.vue";

export default {
  name: "Accordion",
  components: {
    Accordion,
    TextToolTip
  },
  props: {
    item: {
      type: Object,
      required: false
    },
    fun: {
      type: Function,
      required: false
    },
    co: {
      type: Function,
      required: false
    },
    can: {
      type: Function,
      required: false
    }
  },
  computed: {
    getImage: function() {
      return this.images.find(x => x.id == this.item.typ.substring(2)).img;
    },
    gettipp: function() {
      return this.choiselist.find(x => this.item.typ == x.id);
    }
  }
};
</script>

<style scoped>
.flex-colum {
  border: 1px solid darkgrey;
  display: flex;
  flex-flow: row wrap;
}

.right {
  float: right;
}
.small {
  cursor: pointer;
  width: 32px;
  height: 32px;
}
.big {
  width: 64px;
  height: 64px;
}
.deactive {
  filter: grayscale(100%);
  cursor: default;
}
.shinny {
  border: 1px solid yellow;
  cursor: default;
  border-radius: 20px;
}
</style>