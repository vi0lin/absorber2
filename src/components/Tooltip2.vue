<template>
  <transition name="fade">
    <div v-show="show" class="wiste" v-html="maketext(item)"></div>
  </transition>
</template>

<script>
import tipps from "./json/tipps.json";
import choise from "./json/choises.json";

export default {
  props: {
    item: {
      type: String,
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
    maketext(l) {
      try {
        let tipp = tipps.find(x => x.id === l);
        let out =
          "<div style='font-size: 25px;margin-bottom: 5px;text-transform: capitalize;'>" +
          l +
          "</div>";
        out += "<div><b>Description:</b><hr/>" + tipp.desc + "</div><br>";
        out += "<div><b>Calculation:</b><hr/>" + tipp.form + "</div>";
        return out;
      } catch {
        try {
          let chois = choise.find(x => x.id === l);
          let out = "";
          out += "<div><b>Description:</b><hr/>" + chois.desc + "</div><br>";
          return out;
        } catch {}
        return "<div><b>" + l + "</b></div>";
      }
    }
  },
  mounted() {
    let el = this;
    this.elistender = function(e) {
      el.show = true;
      let eposy =
        e.target.getBoundingClientRect().left + e.target.offsetWidth + 10;
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
