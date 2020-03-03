<template>
  <div>
    <div>
      <input v-model="loado" />
      <button @click="load">load</button>
      <button @click="starto">start</button>
      <button @click="stopo">stop</button>
    </div>
    <textarea class="area" v-model="tenemy"></textarea>

    <Fight v-if="this.tenemyo!=null" :item="this.tenemyo" />
  </div>
</template>

<script>
import enemys from "./json/enemys.json";
import Fight from "./Fight.vue";

export default {
  components: {
    Fight
  },
  data() {
    return {
      loado: "goblin",
      tenemy: "null",
      tenemyo: null
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    starto() {
      try {
        this.tenemyo = JSON.parse(this.tenemy);
      } catch {}
    },
    stopo() {
      this.tenemyo = null;
    },
    load() {
      try {
        let e = enemys.find(x => x.id == this.loado);
        this.tenemy = JSON.stringify(e, null, "\t");
      } catch {}
    }
  }
};
</script>

<style scoped>
.area {
  width: 300px;
  height: 300px;
}
</style>