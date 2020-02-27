<template>
  <div>
    <div v-show="!skilltree">
      <img
        v-if="this.background!=''"
        class="bc"
        :src="require('@/assets/icons/'+this.background+'.png')"
      />
      <div class="overlay" :style="'background-color:' +this.color">
        <div class="box" :style="'left:'+this.place">
          <div style="font-size: 30px;">{{text}}</div>
          <div>
            <img width="200px;" v-if="this.img!=''" :src="require('@/assets/'+this.img+'.png')" />
          </div>
          <div class="flex">
            <div class="btn" :key="k" v-for="(thing,k) in obj" @click="thing.func">
              <div>{{thing.text}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="skilltree">
      <div class="overlay" :style="'background-color:' +this.color">
        <div class="kiste">
          <button class="btn close" @click="close">X</button>
          <div class="points">Points: {{this.$parent.player.points}}</div>
          <div class="middle">
            <Accordion
              :can="this.canBeChoosen"
              :co="this.choosen"
              :fun="this.chooseskill"
              :item="st[0]"
            />
            <Accordion
              :can="this.canBeChoosen"
              :co="this.choosen"
              :fun="this.chooseskill"
              :item="st[1]"
            />
            <Accordion
              :can="this.canBeChoosen"
              :co="this.choosen"
              :fun="this.chooseskill"
              :item="st[2]"
            />
            <Accordion
              :can="this.canBeChoosen"
              :co="this.choosen"
              :fun="this.chooseskill"
              :item="st[3]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import skilltree from "./json/skilltree.json";
import Accordion from "./Accordion.vue";
import { getParentById } from "./functions.js";

export default {
  components: {
    Accordion
  },
  methods: {
    chooseskill(s) {
      if (
        !this.choosen(s) &&
        this.$parent.player.points > 0 &&
        !this.canBeChoosen(s)
      ) {
        this.$parent.player.skills.push(s);
        this.$parent.player.points--;
        this.$parent.recalculate(this.$parent.player);
      }
    },
    choosen(s) {
      return this.$parent.player.skills.includes(s);
    },
    close() {
      this.$parent.overlay = false;
      this.$parent.skilltree = false;
    },
    canBeChoosen(s) {
      var start = ["s_dmg0", "s_magic0", "s_life0", "s_speed0"];

      if (start.includes(s)) {
        return false;
      }

      var target = getParentById(s, skilltree);

      if (target != undefined) {
        if (!this.choosen(target.id)) {
          return true;
        }
      }
      return false;
    }
  },
  props: {
    skilltree: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      text: "",
      obj: [],
      img: "",
      background: "",
      color: "rgba(0, 0, 0, 0.4)",
      place: "40%",
      st: skilltree
    };
  }
};
</script>

<style scoped>
.middle {
  position: relative;
  top: 0%;
  left: 0%;
}
.bc {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
.btn {
  background: darkgrey;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid black;
  margin-bottom: 20px;
}
.btn:hover {
  background: grey;
}
.flex {
  width: 500px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.box {
  text-align: center;
  background: lightgrey;
  top: 25%;
  position: absolute;
  padding: 20px;
  border: 1px solid black;
  border-radius: 5px;
}
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
}
.close {
  position: fixed;
  background: darkred;
  right: 30px;
  top: 20px;
}
.close:hover {
  background: red;
}
.points {
  position: fixed;
  padding: 10px;
  background: darkgrey;
  right: 100px;
  top: 20px;
  border-radius: 5px;
}
.kiste {
  position: relative;
  margin: 10px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  background: grey;
  padding: 10px;
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  overflow: auto;
}
</style>