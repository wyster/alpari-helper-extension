import Vue from 'vue';
import '@/request';
import { prepareList } from '@/items';
import { EventBus } from '@/event-bus';
import '@/summary';
import * as Command from '@/consts/command';
import store from '@/store';
import moment from 'moment-timezone';
import map from 'lodash/map';

Vue.config.productionTip = false;

window.addEventListener('message', async (message: MessageEvent) => {
  if (message.source !== window) {
    return;
  }
  switch (message.data.command) {
    case Command.PAGE_LAST_ROLLOVER:
      store.state.lastRollover = moment.tz(
        message.data.lastRollover,
        'Europe/Kiev'
      );
      break;
  }
});

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

  window.postMessage(
    {
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
