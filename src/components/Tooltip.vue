<template>
  <transition name="fade">
    <div v-if="create" v-show="show" class="wiste">
      <div v-if="ctrl">
        <h2 class="title">{{item.name}}</h2>
        <b>Stats:</b>
        <div class="fleo">
          <div class="fleo" :key="g" v-for="(n,g) in filtred(item)">
            <hr style="width:200px;" v-if="g=='effects'||g=='chance'" />
            <div class="one" v-if="g!='effects'||g!='chance'">
              <img :src="getImgUrlS(g)" />
              <span>{{n}}</span>
            </div>
            <div class="one" v-else :key="gi" v-for="(gn,gi) in item[g]">
              <img :src="getImgUrlS(gi)" />
              <span>{{gn}}</span>
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
    filtred(arr) {
      let allowed = [
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
        "max",
        "prestige"
      ];

      let ob = Object.keys(arr)
        .filter(key => !allowed.includes(key))
        .reduce((obj, key) => {
          if (arr[key] > 0) {
            obj[key] = arr[key];
          }
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
