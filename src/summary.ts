import Vue from 'vue';
import store from '@/store';
import Summary from '@/components/Summary.vue';

const accountTabs = document.querySelector('.account-tabs') as HTMLElement;

if (accountTabs instanceof HTMLElement) {
  run();
}

function initVueInstance(): void {
  const id = 'alpari-ext-summary';
  const root = document.querySelector(`#${id}`);
  if (root instanceof HTMLElement && (root as any).__vue__ instanceof Vue) {
    return;
  }
  const element = accountTabs.querySelector('#investment-summary');
  if (element instanceof HTMLElement) {
    const div = document.createElement('div');
    element.appendChild(div);

    new Vue({
      store,
      render: h => h(Summary)
    }).$mount(div);
  }
}

function run() {
  let timeout: number;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      initVueInstance();
    }, 500);
  });

  const config = { childList: true, subtree: true };

  observer.observe(accountTabs, config);

  initVueInstance();
}

export {};
