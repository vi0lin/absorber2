<template>
  <transition name="fade">
    <div v-show="show && item != null" class="wiste">
      <div class="title">{{title}}</div>
      <hr v-show="title!=null" />
      <div>{{item}}</div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      required: false
    },
    title: {
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

    $(this.$el)
      .parent()
      .first()
      .on("mouseenter", this.elistender);

    $(this.$el)
      .parent()
      .first()
      .on("mouseleave", this.llistender);
  },
  beforeDestroy() {
    $(this.$el)
      .parent()
      .first()
      .off("mouseenter", this.elistender);

    $(this.$el)
      .parent()
      .first()
      .off("mouseleave", this.llistender);
  }
};
</script>

<style scoped>
.wiste {
  margin-left: 50px;
  padding: 10px;
  position: fixed;
  border: 1px solid black;
  background: whitesmoke;
  pointer-events: none;
  z-index: 10;
  width: 180px;
  white-space: normal;
}
.title {
  text-transform: capitalize;
  font-size: 20px;
}
.skiste {
  border: 1px solid black;
  background: red;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
