import * as Command from "@/consts/command";
import * as Storage from "@/consts/storage";
import * as Source from "@/consts/source";
import moment from "moment-timezone";
import nth from "lodash/nth";
import find from "lodash/find";
import { browser } from "webextension-polyfill-ts";

interface GenericObject {
  [key: string]: any;
}
let config: GenericObject = {};

function appendScriptSrc(src: string): Promise<any> {
  return new Promise(
    (resolve): void => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.src = browser.runtime.getURL(src);
      script.async = true;
      script.onload = resolve;
      document.head.appendChild(script);
    }
  );
}

appendScriptSrc("dist/page/main.js");

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
    "https://my.alpari.com/ru/investments/pamm_accounts/download/investment_accounts.json";
  const response: Response = await fetch(url);
  return response.json();
}

/**
 *
 */
async function getInvestStats(): Promise<any> {
  return new Promise(
    (resolve): void => {
      browser.storage.local.get([Storage.INVEST_STATS]).then(
        ({ investStats: result }): void => {
          if (typeof result === "undefined") {
            result = [];
          }
          resolve(result);
        }
      );
    }
  );
}

/**
 * Отдаёт дату последнего ролловера
 */
async function getlastRollover(): Promise<any> {
  const row = find(config.items, { status: "active" } as any);
  if (!row) {
    throw new Error("Last rollover not found");
  }
  // @todo type
  const id = (row as any).id;
  const endDate = moment().format("DD-MM-YYYY");
  const beforeDate = moment()
    .subtract(7, "day")
    .format("DD-MM-YYYY");
  let url =
    "https://my.alpari.com/ru/investor/pamm6/investment/hourly_monitoring/yield/";
  url += `${id}/${beforeDate}/${endDate}/`;
  const response: Response = await fetch(url);
  // @todo типы
  const data = await response.json();
  if (Array.isArray(data)) {
    let row = nth(data, -1);
    if (typeof row.date === "undefined") {
      throw new Error("Date not found");
    }
    const lastDate = moment.tz(row.date, "Europe/Kiev");
    // В альпари уже нет нулевых роллов, но они есть в этой статистике
    if (lastDate.hour() === 0) {
      row = nth(data, -2);
      if (typeof row.date === "undefined") {
        throw new Error("Date not found");
      }
      return moment.tz(row.date, "Europe/Kiev");
    }
    return lastDate;
  }

  throw new Error("Last rollover not found");
}

window.addEventListener(
  "message",
  async (message: MessageEvent): Promise<any> => {
    if (message.source !== window) {
      return;
    }
    if (message.data.source !== Source.PAGE) {
      return;
    }
    switch (message.data.command as string) {
      case Command.SAVE_INVEST_STATS:
        const preparedData: InvestStats = {
          stats: message.data.data,
          date: moment().format(),
          activeAccounts: await getActiveAccounts()
        };
        getInvestStats().then(
          (result): void => {
            result.push(preparedData);
            browser.storage.local.set({ [Storage.INVEST_STATS]: result });
          }
        );
        break;
      case Command.OPEN_INVEST_STATS:
        browser.runtime
          .sendMessage({ command: Command.OPEN_INVEST_STATS })
          .then(response => {
            console.log(response);
          });
        break;
      case Command.CLEAR_INVEST_STATS:
        browser.storage.local.set({ [Storage.INVEST_STATS]: {} });
        break;
      case Command.INIT:
        config = message.data.data.config;
        message.source.postMessage(
          {
            source: Source.CONTENT_SCRIPT,
            command: Command.INIT,
            lastRollover: (await getlastRollover()).format(),
            investStats: await getInvestStats()
          },
          message.origin
        );
        break;
    }
  }
);

export {};
