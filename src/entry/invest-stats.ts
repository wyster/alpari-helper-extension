import Highcharts from 'highcharts';
import map from 'lodash/map';
import moment from 'moment';

console.log('invest stats script inited');

async function getInvestStats(): Promise<any> {
    return new Promise((resolve) => {
        chrome.storage.local.get(['investStats'], ({investStats: result}) => {
            resolve(result);
        });
    });
}

async function init() {
    const options = {
        xAxis: {
            categories: [] as any,
        },

        series: [] as any,

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true,
            },
        },
    };

    const stats = await getInvestStats();
    console.log(stats);

    options.series.push(
        {
            name: 'Активные инвестиции',
            data: map(stats, 'stats.activeInvestmentCount'),
        },
        {
            name: 'Архив',
            data: map(stats, 'stats.archiveInvestmentCount'),
        },
        {
            name: 'Баланс по всем инвестиционным счетам',
            data: map(stats, 'stats.balance'),
        },
        {
            name: 'Прирост за всё время',
            data: map(stats, 'stats.profitOverall'),
        },
        {
            name: 'Прирост за всё время (Только активные)',
            data: map(stats, 'stats.profitOverallActive'),
        },
    );

    options.xAxis.categories = map(stats, (item) => {
        return moment(item.date).format('YYYY-MM-DD HH:mm');
    });

    Highcharts.chart('chart', options as any);
}

init();
