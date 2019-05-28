import Vue from "vue";
import DevTools from "@/components/DevTools.vue";

Vue.config.devtools = true;

new Vue({
  render: (h): any => h(DevTools)
}).$mount("#wrapper");

export {};
