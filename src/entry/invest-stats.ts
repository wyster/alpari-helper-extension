import Highcharts from "highcharts";
import map from "lodash/map";
import moment from "moment";
import { browser } from "webextension-polyfill-ts";
import * as Storage from "@/consts/storage";

console.log("invest stats script inited");

async function getInvestStats(): Promise<any> {
  return new Promise((resolve): void => {
    browser.storage.local
      .get([Storage.INVEST_STATS])
      .then(({ investStats: result }): void => {
        resolve(result);
      });
  });
}

async function init(): Promise<any> {
  const stats = await getInvestStats();
  console.log(stats);

  const options = {
    chart: {
      type: "arearange",
      zoomType: "x",
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1
      }
    },

    xAxis: {
      categories: [] as any,
      // Визуальное выделение зоны при наведении
      crosshair: true
    },

    tooltip: {
      // Тултип для всех
      shared: true
    },

    yAxis: [
      {
        title: {
          text: "Кол-во"
        },
        max:
          Math.max(
            ...map(stats, "stats.archiveInvestmentCount"),
            ...map(stats, "stats.archiveInvestmentCount")
          ) * 3
      },
      {
        title: {
          text: "Баланс"
        }
      },
      {
        title: {
          text: "Прирост"
        },
        // Выводит справа
        opposite: true
      }
    ],

    series: [] as any
  };

  options.series.push(
    {
      type: "column",
      yAxis: 0,
      name: "Активные инвестиции",
      data: map(stats, "stats.activeInvestmentCount")
    },
    {
      type: "column",
      yAxis: 0,
      name: "Архив",
      data: map(stats, "stats.archiveInvestmentCount")
    },
    {
      type: "spline",
      yAxis: 1,
      name: "Баланс по всем инвестиционным счетам",
      data: map(stats, "stats.balance")
    },
    {
      type: "spline",
      yAxis: 2,
      name: "Прирост за всё время",
      data: map(stats, "stats.profitOverall")
    },
    {
      type: "spline",
      yAxis: 2,
      name: "Прирост за всё время (Только активные)",
      data: map(stats, "stats.profitOverallActive")
    }
  );

  options.xAxis.categories = map(stats, (item): string => {
    return moment(item.date).format("YYYY-MM-DD HH:mm");
  });

  Highcharts.chart("chart", options as any);
}

init();
