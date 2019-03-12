import * as Command from '@/consts/command';
import * as Storage from '@/consts/storage';
import moment from 'moment-timezone';
import nth from 'lodash/nth';
import find from 'lodash/find';

interface GenericObject {
  [key: string]: any;
}
let config: GenericObject = {};

appendScriptSrc('dist/page/main.js');

function appendScriptSrc(src: string): Promise<any> {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = chrome.runtime.getURL(src);
    script.async = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}
interface InvestStats {
  stats: object;
  date: string;
  activeAccounts: object;
}

/**
 * Список активных инвест счетов
 */
async function getActiveAccounts(): Promise<any> {
  const url =
    'https://my.alpari.com/ru/investments/pamm_accounts/download/investment_accounts.json';
  const response: Response = await fetch(url);
  return response.json();
}

/**
 * Отдаёт дату последнего ролловера
 */
async function getlastRollover(): Promise<any> {
  const row = find(config.items, { status: 'active' } as any);
  if (!row) {
    throw new Error('Last rollover not found');
  }
  // @todo type
  const id = (row as any).id;
  const endDate = moment().format('DD-MM-YYYY');
  const beforeDate = moment()
    .subtract(7, 'day')
    .format('DD-MM-YYYY');
  let url =
    'https://my.alpari.com/ru/investor/pamm6/investment/hourly_monitoring/yield/';
  url += `${id}/${beforeDate}/${endDate}/`;
  const response: Response = await fetch(url);
  // @todo типы
  const data = await response.json();
  if (Array.isArray(data)) {
    const lastDate = moment.tz(nth(data, -1).date, 'Europe/Kiev');
    // В альпари уже нет нулевых роллов, но они есть в этой статистике
    if (lastDate.hour() === 0) {
      return moment.tz(nth(data, -2), 'Europe/Kiev');
    }
    return lastDate;
  }

  throw new Error('Last rollover not found');
}

window.addEventListener('message', async (message: MessageEvent) => {
  if (message.source !== window) {
    return;
  }
  switch (message.data.command as string) {
    case Command.SAVE_INVEST_STATS:
      const preparedData: InvestStats = {
        stats: message.data.data,
        date: moment().format(),
        activeAccounts: await getActiveAccounts()
      };
      chrome.storage.local.get(
        [Storage.INVEST_STATS],
        ({ investStats: result }) => {
          if (typeof result === 'undefined') {
            result = [];
          }
          result.push(preparedData);
          chrome.storage.local.set({ [Storage.INVEST_STATS]: result });
        }
      );
      break;
    case Command.OPEN_INVEST_STATS:
      chrome.runtime.sendMessage(
        { command: Command.OPEN_INVEST_STATS },
        response => {
          console.log(response);
        }
      );
      break;
    case Command.CLEAR_INVEST_STATS:
      chrome.storage.local.set({ [Storage.INVEST_STATS]: {} });
      break;
    case Command.INIT:
      config = message.data.data.config;
      message.source.postMessage(
        {
          command: Command.PAGE_LAST_ROLLOVER,
          lastRollover: (await getlastRollover()).format()
        },
        message.origin
      );
      break;
  }
});

export {};
