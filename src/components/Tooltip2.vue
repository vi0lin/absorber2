<template>
  <transition name="fade">
    <div v-show="show" class="wiste">
      <div class="title">{{item}}</div>
      <div v-html="maketext(item)"></div>
    </div>
  </transition>
</template>

<script>
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
        let tipp = this.tippslist.find(x => x.id === l);
        let out = "<div><b>Description:</b><hr/>" + tipp.desc + "</div>";
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
.title {
  font-size: 25px;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.wiste {
  padding: 10px;
  position: fixed;
  border: 1px solid black;
  background: whitesmoke;
  pointer-events: none;
  z-index: 10;
  min-width: 100px;
  width: 230px;
  white-space: normal;
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
