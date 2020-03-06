<template>
  <transition name="fade">
    <div v-show="show" class="wiste">
      <div class="fleo" :key="g" v-for="(n,g) in item.gain">
        <div v-if="g!='effects'&&g!='chance'">
          <img :src="getImgUrlS(g)" />
          {{n}}
        </div>
        <div v-else :key="gi" v-for="(gn,gi) in item.gain[g]">
          <img :src="getImgUrlS(gi)" />
          {{gn}}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false,
      elistender: null,
      llistender: null
    };
  },
  methods: {
    getImgUrlS(pet) {
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
    makelist(l) {
      let alist = "";
      for (let i in l) {
        if (i != "effects" && i != "chance") {
          alist += `<div>${i}: ${l[i]}</div>`;
        } else {
          for (let c in l[i]) {
            alist += `<div>${c}: ${l[i][c]}</div>`;
          }
        }
      }
      return alist;
    }
  },
  mounted() {
    let el = this;
    this.elistender = function(e) {
      el.show = true;
      let eposy = e.target.getBoundingClientRect().left;
      let eposx = e.target.getBoundingClientRect().top;

      el.$el.style.top = eposx + "px";
      el.$el.style.left = eposy + "px";

      setTimeout(function() {
        try {
          let height = el.$el.offsetHeight;
          if (eposx + height >= 600) {
            el.$el.style.top = eposx - height + e.target.offsetHeight + "px";
          }
        } catch {}
      }, 50);
    };

    this.llistender = function() {
      el.show = false;
    };

    this.$el.parentElement.firstChild.addEventListener(
      "mouseenter",
      this.elistender
    );
    this.$el.parentElement.firstChild.addEventListener(
      "mouseleave",
      this.llistender
    );
  },
  beforeDestroy() {
    this.$el.parentElement.firstChild.removeEventListener(
      "mouseenter",
      this.elistender
    );
    this.$el.parentElement.firstChild.removeEventListener(
      "mouseleave",
      this.llistender
    );
  }
};
</script>

<style scoped>
.fleo {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

img {
  float: left;
}

.wiste {
  padding: 10px;
  position: fixed;
  border: 1px solid black;
  background: whitesmoke;
  pointer-events: none;
  z-index: 10;
  min-width: 100px;
  width: 180px;
}

.skiste {
  border: 1px solid black;
  background: red;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
