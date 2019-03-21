import Vue from 'vue';
import '@/request';
import { prepareList } from '@/items';
import { EventBus } from '@/event-bus';
import '@/summary';
import * as Command from '@/consts/command';
import store from '@/store';
import moment from 'moment-timezone';
import map from 'lodash/map';
import * as Storage from '@/consts/storage';
import * as Source from '@/consts/source';

Vue.config.productionTip = false;

window.addEventListener('message', async (message: MessageEvent) => {
  if (message.source !== window) {
    return;
  }
  if (message.data.source !== Source.CONTENT_SCRIPT) {
    return;
  }
  switch (message.data.command) {
    case Command.INIT:
      store.state.investStats = message.data[Storage.INVEST_STATS];
      store.state.lastRollover = moment.tz(
          message.data.lastRollover,
          'Europe/Kiev'
      );
      break;
  }
}, false);

function detectNextRollover(v: any): moment.Moment {
  // @todo типы
  const dates = map(v.items, item => {
    return moment.tz(item.pammAccount.dateNextRolloverInput, 'Europe/Kiev');
  });

  return moment.min(dates);
}

let config: object | null = null;
const configElement = document.querySelector('.config');
if (configElement) {
  const configAttribute = configElement.getAttribute('data-config');
  if (configAttribute) {
    config = JSON.parse(configAttribute);
  }
}

if (config !== null) {
  store.state.nextRollover = detectNextRollover(config);
  store.state.initDate = moment();

  window.parent.postMessage(
    {
      source: Source.PAGE,
      command: Command.INIT,
      data: {
        config
      }
    },
    '*'
  );
  prepareList((config as any).items);
}

EventBus.$on('response', (e: XMLHttpRequest) => {
  const regExp = new RegExp('investment/list_accounts');
  if (regExp.exec(e.responseURL) !== null) {
    prepareList(JSON.parse(e.response).accounts.elements);
  }
});

export {};
