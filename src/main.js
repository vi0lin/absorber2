import Vue from 'vue'
import App from './App.vue'
import enemieslist from "./components/json/enemys.json";
import tippslist from "./components/json/tipps.json";
import choiselist from "./components/json/choises.json";
import bufflist from "./components/json/bufflist.json";
import skillist from "./components/json/skilltree.json";


Vue.config.productionTip = false

Vue.prototype.enemieslist = enemieslist
Vue.prototype.tippslist = tippslist
Vue.prototype.choiselist = choiselist
Vue.prototype.bufflist = bufflist
Vue.prototype.skillist = skillist
Vue.prototype.images = []

new Vue({
  render: h => h(App),
}).$mount('#app')
