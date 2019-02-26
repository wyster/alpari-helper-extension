import Vue from 'vue';
import '@/request';
import {prepareList} from '@/items';
import {EventBus} from '@/event-bus';
import '@/summary';

Vue.config.productionTip = false;

let config: object|null = null;
const configElement = document.querySelector('.config');
if (configElement) {
  const configAttribute = configElement.getAttribute('data-config');
  if (configAttribute) {
    config = JSON.parse(configAttribute);
  }
}

if (config !== null) {
  prepareList((config as any).items);
}

EventBus.$on('response', (e: XMLHttpRequest) => {
  const regExp = new RegExp('investment/list_accounts');
  if (regExp.exec(e.responseURL) !== null) {
    prepareList(JSON.parse(e.response).accounts.elements);
  }
});

export {};
