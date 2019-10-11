import Vue from "vue";
import DevTools from "@/components/DevTools.vue";
import i18n from "@/i18n";

Vue.config.devtools = true;
i18n.locale = navigator.language;

const app = new Vue({
  i18n,
  render: (h): any => h(DevTools)
}).$mount("#wrapper");

window.$app = app;

export {};
