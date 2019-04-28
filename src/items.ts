import Vue from "vue";
import store from "@/store";
import InvestItem from "@/components/InvestItem.vue";

export interface PammAccount {
  /**
   * Дата следующего ролловера на вывод
   */
  dateNextRollover: string;
  /**
   * Дата следующего ролловера на ввод
   */
  dateNextRolloverInput: string;
}

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
  /**
   * Информация о памм счете
   */
  pammAccount: PammAccount;
}

export function prepareList(items: Item[]): void {
  items.forEach(
    (item: Item): void => {
      const feature = document.querySelector(
        `.investment-account-list-item-${item.id}`
      );
      if (!feature) {
        return;
      }
      const div = document.createElement("div");
      feature.appendChild(div);

      new Vue({
        store,
        render: (h): any =>
          h(InvestItem, {
            props: { item }
          })
      }).$mount(div);
    }
  );
}
