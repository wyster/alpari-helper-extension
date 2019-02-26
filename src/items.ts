import Vue from 'vue';
import store from '@/store';
import InvestItem from '@/InvestItem.vue';

export interface Item {
    id: number;
    bonus: number;
}

export function prepareList(items: Item[]) {
    items.forEach((item: Item) => {
        if (item.bonus === 0) {
            return;
        }
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
