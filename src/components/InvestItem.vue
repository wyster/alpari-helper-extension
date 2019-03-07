<template>
  <div>
      <div :class="$style.items">
        <span title="Бонус" :class="$style.item">{{item.bonus.toFixed(2)}}</span>
        <span title="Баланс" :class="$style.item">{{item.balance.toFixed(2)}}</span>
        <span title="Чистый баланс" :class="$style.item">{{(item.balance - item.bonus).toFixed(2)}}</span>
        <span title="Доход за весь период" :class="$style.item">{{item.tradeResult.toFixed(2)}}</span>
      </div>
      <div :class="$style.items2">
        <span title="Следующий ролловер" :class="$style.item" style="display: block">{{item.pammAccount.dateNextRolloverInput}}</span>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Item } from '@/items';

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
}
</script>

<style lang="less" module>
    .items {
        position: absolute;
        bottom: 0;
        right: 15px;
    }
    .items2 {
        position: absolute;
        top: 10px;
        left: 60px;
    }
    .item {
        margin: 0 5px;
        font-size: 12px;

        &:last-child {
            margin-right: 0;
        }
    }
</style>
