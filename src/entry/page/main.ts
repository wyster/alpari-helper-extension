import Vue from 'vue';
import '@/request';
import { prepareList } from '@/items';
import { EventBus } from '@/event-bus';
import '@/summary';
import * as Command from '@/consts/command';
import store from '@/store';
import moment from 'moment-timezone';

Vue.config.productionTip = false;

window.addEventListener('message', async (message: MessageEvent) => {
  if (message.source !== window) {
    return;
  }
  switch (message.data.command) {
    case Command.PAGE_LAST_ROLLOVER:
      store.state.lastRollover = moment.tz(
        message.data.lastRollover,
        moment.tz.guess()
      );
      break;
  }
});

function detectNextRollover(v: any): moment.Moment {
  // @todo типы
  return moment
    .tz(v.items[0].pammAccount.dateNextRolloverInput, 'Europe/Kiev')
    .tz(moment.tz.guess());
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
