<template>
  <transition name="fade">
    <div v-if="create" v-show="show" class="wiste">
      <div v-if="ctrl">
        <h2 style="margin:4px 0px">{{item.name}}</h2>
        <b>Gain:</b>
        <hr />
        <div class="fleo" :key="g" v-for="(n,g) in item.gain">
          <div style="margin:4px 0px" v-if="g!='effects'&&g!='chance'">
            <img :src="getImgUrlS(g)" />
            {{n}}
          </div>
          <div style="margin:0px 0px 4px 10px" v-else :key="gi" v-for="(gn,gi) in item.gain[g]">
            <img :src="getImgUrlS(gi)" />
            {{gn}}
          </div>
        </div>
      </div>
      <div v-else-if="shift">
        <h2 style="margin:4px 0px">{{item.name}}</h2>
        <b>Description:</b>
        <hr />
        <img class="iconz" :src="getImgUrlS('description')" />
        <span class="lol">{{item.description}}</span>
      </div>
      <div v-else>
        <h2 style="margin:4px 0px">{{item.name}}</h2>
        <b>Stats:</b>
        <hr />
        <div style="margin:0px 0px 4px 0px" :key="k" v-for="(s,k) in item">
          <div>
            <div v-if="filtred(k,s)">
              <img class="iconz" :src="getImgUrlS(k)" />
              <span class="lol">{{s}}</span>
            </div>
          </div>
          <div style="margin:0px 0px 4px 10px" v-if="k=='chance'">
            <div :key="cv" v-for="(c,cv) in item.chance">
              <div>
                <img class="iconz" :src="getImgUrlS(cv)" />
                <span class="lol">{{c}}</span>
              </div>
            </div>
          </div>
          <div style="margin:0px 0px 4px 10px" v-if="k=='effects'">
            <div :key="cv" v-for="(c,cv) in item.effects">
              <div>
                <img class="iconz" :src="getImgUrlS(cv)" />
                <span class="lol">{{c}}</span>
              </div>
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
      llistender: null
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
    filtred(f, v) {
      let dont = [
        "description",
        "name",
        "id",
        "boss",
        "clife",
        "cspeed",
        "effects",
        "status",
        "chance",
        "gain",
        "max"
      ];
      return !dont.includes(f) && v != 0;
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
    }
  },
  mounted() {
    let el = this;

    this.elistender = function(e) {
      el.create = true;

      setInterval(function() {
        el.show = true;
        try {
          let eposy = e.target.getBoundingClientRect().left;
          let eposx = e.target.getBoundingClientRect().top;
          el.$el.style.top = eposx + "px";
          el.$el.style.left = eposy + "px";
        } catch {}
      }, 100);
    };

    this.llistender = function() {
      el.show = false;
      el.create = false;
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
  max-height: 300px;
  overflow: auto;
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
