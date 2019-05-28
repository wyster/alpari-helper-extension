import Vue from "vue";
import store from "@/store";
import Summary from "@/components/Summary.vue";
import i18n from "@/i18n";

const accountTabs = document.querySelector(".account-tabs") as HTMLElement;

function initVueInstance(): void {
  const id = "alpari-ext-summary";
  const root = document.querySelector(`#${id}`);
  if (root instanceof HTMLElement && (root as any).__vue__ instanceof Vue) {
    return;
  }
  const element = accountTabs.querySelector("#investment-summary");
  if (element instanceof HTMLElement) {
    const div = document.createElement("div");
    element.appendChild(div);

    new Vue({
      store,
      i18n,
      render: (h): any => h(Summary)
    }).$mount(div);
  }
}

function run(): void {
  let timeout: number;
  const observer = new MutationObserver(
    (): void => {
      clearTimeout(timeout);
      timeout = setTimeout((): void => {
        initVueInstance();
      }, 500);
    }
  );

  const config = { childList: true, subtree: true };

  observer.observe(accountTabs, config);

  initVueInstance();
}

if (accountTabs instanceof HTMLElement) {
  run();
}

export {};
