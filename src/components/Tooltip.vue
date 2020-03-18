<template>
  <transition name="fade">
    <div v-if="create" v-show="show" class="wiste">
      <div v-if="ctrl">
        <h2 class="title">{{item.name}}</h2>
        <b>Stats:</b>
        <div class="fleo">
          <div class="fleo" :key="g" v-for="(n,g) in filtred(item)">
            <hr style="width:200px;" v-if="g=='effects'||g=='chance'" />
            <div class="fleo" v-if="g=='effects'||g=='chance'">
              <div class="one" :key="gi" v-for="(gn,gi) in item[g]">
                <img :src="getImgUrlS(gi)" />
                <span>{{gn}}</span>
              </div>
            </div>
            <div v-else class="one">
              <img :src="getImgUrlS(g)" />
              <span>{{n}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="shift">
        <h2 class="title">{{item.name}}</h2>
        <b>Description:</b>
        <hr />
        <img :src="getImgUrlS('description')" />
        <span class="lol">{{item.description}}</span>
      </div>
      <div v-else>
        <h2 class="title">{{item.name}}</h2>
        <b>Gain:</b>
        <div class="fleo">
          <div class="fleo" :key="g" v-for="(n,g) in item.gain">
            <hr style="width:200px;" v-if="g=='effects'||g=='chance'" />
            <div class="one" v-if="g!='effects'&&g!='chance'">
              <img :src="getImgUrlS(g)" />
              <span>{{n}}</span>
            </div>
            <div class="one" v-else :key="gi" v-for="(gn,gi) in item.gain[g]">
              <img :src="getImgUrlS(gi)" />
              <span>{{gn}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import tipps from "./json/tipps.json";

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    ctrl: {
      type: Boolean,
      required: false
    },
    shift: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      create: false,
      show: false,
      elistender: null,
      llistender: null,
      mlistender: null,
      target: null,
      x: 0,
      y: 0
    };
  },
  methods: {
    getinfo(i) {
      let tipp = tipps.find(x => x.id == i);
      if (tipp != undefined) {
        return tipp.desc;
      } else {
        return "No Description";
      }
    },
    filtred(arr) {
      let allowed = [
        "description",
        "name",
        "id",
        "boss",
        "clife",
        "cspeed",
        "status",
        "gain",
        "max",
        "prestige"
      ];

      let ob = Object.keys(arr)
        .filter(key => !allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = arr[key];

          return obj;
        }, {});

      return ob;
    },
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
    setReal() {
      let el = this;
      setTimeout(function() {
        let eposy = 0;
        let eposx = 0;
        try {
          if (el.x > 500) {
            eposy = el.target.left - 250;
          } else {
            eposy = el.target.left + el.target.width + 10;
          }

          if (el.y > 350) {
            eposx = el.target.bottom - el.$el.scrollHeight;
          } else {
            eposx = el.target.top + 10;
          }

          el.$el.style.top = eposx + "px";
          el.$el.style.left = eposy + "px";
        } catch {}
      }, 10);
    },
    setDimensions(e, el) {
      el.create = true;
      el.show = true;
      el.target = e.target.getBoundingClientRect();
      el.x = e.clientX;
      el.y = e.clientY;
      this.setReal();
    }
  },
  watch: {
    shift: function(val) {
      this.setReal();
    },
    ctrl: function(val) {
      this.setReal();
    }
  },
  mounted() {
    let el = this;

    this.elistender = function(e) {
      el.setDimensions(e, el);
    };

    this.mlistender = function(e) {
      el.setDimensions(e, el);
    };

    this.llistender = function() {
      el.show = false;
      el.create = false;
    };

    $(this.$el)
      .parent()
      .first()
      .on("mouseenter", this.elistender);

    $(this.$el)
      .parent()
      .first()
      .on("mousemove", this.mlistender);

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
      .off("mousemove", this.mlistender);

    $(this.$el)
      .parent()
      .first()
      .off("mouseleave", this.llistender);
  }
};
</script>

<style scoped>
.title {
  margin: 0px;
}
.one {
  margin-top: 2px;
  height: 40px;
  width: 100px;
  line-height: 40px;
  white-space: nowrap;
  border: 0.5px solid lightgrey;
}

.fleo {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

img {
  margin: 4px;
  float: left;
}

.wiste {
  padding: 10px;
  position: fixed;
  border: 1px solid black;
  background: whitesmoke;
  pointer-events: none;
  z-index: 10;
  width: 220px;
  overflow: hidden;
}

.iconz {
  float: left;
  margin-right: 10px;
  height: 32px;
  width: 32px;
}

.lol {
  line-height: 32px;
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
