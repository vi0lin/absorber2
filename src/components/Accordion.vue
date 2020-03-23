<template>
  <div v-if="item!=null">
    <div>
      <img
        class="small"
        :class="{ big: gettype(item.typ)=='m', shinny: co(item.id), deactive: can(item.id) }"
        :src="getImgUrl(getreal(item.typ))"
        @click="chooseskill(item.id)"
      />
      <TextToolTip :title="gettipp(item).name" :item="gettipp(item).desc" />
    </div>
    <div class="flex-colum">
      <Accordion :can="can" :co="co" :fun="fun" :key="i.id" :item="i" v-for="i of item.open" />
    </div>
  </div>
</template>

<script>
import TextToolTip from "./TextToolTip.vue";
import Accordion from "./Accordion.vue";
import choises from "./json/choises.json";

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
  methods: {
    getImgUrl(pet) {
      var images = require.context("../assets/skills/", false, /\.png$/);
      let img = "";
      try {
        img = images("./" + pet + ".png");
        return img;
      } catch (e) {
        img = images("./dmg.png");
        return img;
      }
    },
    gettype(r) {
      return r.charAt(0);
    },
    getreal(r) {
      return r.substring(2);
    },
    gettipp(i) {
      try {
        return choises.find(x => i.typ == x.id);
      } catch {
        return "none";
      }
    },
    chooseskill(c) {
      this.fun(c);
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