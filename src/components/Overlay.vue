<template>
  <div>
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
          <div class="btn" :key="k" v-for="(thing,k) in obj" @click="thing.func">{{thing.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      obj: [],
      img: "",
      background: "",
      color: "rgba(0, 0, 0, 0.4)",
      place: "40%"
    };
  }
};
</script>

<style scoped>
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
</style>