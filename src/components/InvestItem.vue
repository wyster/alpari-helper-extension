<template>
  <div>
      <div :class="$style.items">
        <span title="Бонус" :class="$style.item">{{item.bonus.toFixed(2)}}</span>
        <span title="Баланс" :class="$style.item">{{item.balance.toFixed(2)}}</span>
        <span title="Чистый баланс" :class="$style.item">{{(item.balance - item.bonus).toFixed(2)}}</span>
        <span title="Доход за весь период" :class="[$style.item, {[$style['green']] : item.tradeResult > 0, [$style['red']] : item.tradeResult < 0}]">{{item.tradeResult.toFixed(2)}}</span>
      </div>
      <div :class="$style.items2">
        <span title="Следующий ролловер на вывод" :class="[$style.item, $style['red']]">{{formatDate(item.pammAccount.dateNextRollover)}}</span>
        <span title="Следующий ролловер на ввод" :class="[$style.item, $style['green']]">{{formatDate(item.pammAccount.dateNextRolloverInput)}}</span>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Item } from '@/items';
import moment from 'moment';

@Component({
})
export default class InvestItem extends Vue {
    @Prop({
        type: Object,
        default() {
            return {};
        },
    })
    public item!: Item[];

    private formatDate(date: string) {
        const dateObject = moment(date);
        if (dateObject.isSame(new Date(), 'day')) {
            return dateObject.format('HH');
        }

        return dateObject.format('DD.MM HH');
    }
}
</script>

<style lang="less" module>
    .items {
        position: absolute;
        bottom: 0;
        right: 15px;
        opacity: 0.5;

        &:hover {
            opacity: 1;
        }
    }
    .items2 {
        position: absolute;
        top: 0;
        right: 15px;
        opacity: 0.3;

        &:hover {
            opacity: 1;
        }
    }
    .item {
        margin: 0 3px;
        font-size: 12px;
        display: inline-block;

        &:last-child {
            margin-right: 0;
        }
    }

    .red {
        color: #d03333;
    }

    .green {
        color: #68883e;
    }
</style>
