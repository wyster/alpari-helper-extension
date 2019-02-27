import Vue from 'vue';
import store from '@/store';
import InvestItem from '@/components/InvestItem.vue';

export interface Item {
    id: number;
    /**
     * Бонус
     */
    bonus: number;
    /**
     * Баланс
     */
    balance: number;
    /**
     * Доход за весь период
     */
    tradeResult: number;
}

export function prepareList(items: Item[]) {
    items.forEach((item: Item) => {
        const feature = document.querySelector(`.investment-account-list-item-${item.id} .feature`);
        if (!feature) {
            return;
        }
        const div = document.createElement('div');
        feature.appendChild(div);

        new Vue({
            store,
            render: (h) => h(
                InvestItem,
                {
                    props: { item },
                },
            ),
        }).$mount(div);
    });
}
