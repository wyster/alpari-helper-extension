import Vue from "vue";
import StoreManager from "@/components/StoreManager.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h): any => h(StoreManager)
}).$mount("#wrapper");

export {};
