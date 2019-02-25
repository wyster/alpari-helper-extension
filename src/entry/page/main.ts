import Vue from 'vue';
import Summary from '@/Summary.vue';
import store from '@/store';
import '@/request';
import {prepareList} from '@/items';
import {EventBus} from '@/event-bus';

Vue.config.productionTip = false;

const div = document.createElement('div');
div.setAttribute('id', 'alpari-ext-summary');
const element = document.querySelector('[data-field-name="currencyButton"]');
if (element) {
  element.appendChild(div);

  new Vue({
    store,
    render: (h) => h(Summary),
  }).$mount('#alpari-ext-summary');
}

let config;
const configElement = document.querySelector('.config');
if (configElement) {
  const configAttribute = configElement.getAttribute('data-config');
  if (configAttribute) {
    config = JSON.parse(configAttribute);
  }
}

if (config !== null) {
  prepareList(config.items);
}

EventBus.$on('response', (e: XMLHttpRequest) => {
  const regExp = new RegExp('investment/list_accounts');
  if (regExp.exec(e.responseURL) !== null) {
    prepareList(JSON.parse(e.response).accounts.elements);
  }
});

export {};
