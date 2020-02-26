<template>
  <transition name="fade">
    <div v-show="show &&item!=null" class="wiste">{{item}}</div>
  </transition>
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      show: false,
      elistender: null,
      llistender: null
    };
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
