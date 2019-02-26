<template>
  <div :class="$style.items">
      <span title="Бонус" :class="$style.item">{{item.bonus}}</span>
      <span title="Баланс" :class="$style.item">{{item.balance}}</span>
      <span title="Чистый баланс" :class="$style.item">{{item.balanceClear}}</span>
      <span title="Доход за весь период" :class="$style.item">{{item.tradeResult}}</span>
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

    public created() {
        console.log(this.item);
    }
}
</script>

<style lang="less" module>
    .items {
        position: absolute;
        bottom: -15px;
        right: 0;
    }
    .item {
        margin: 0 5px;
        font-size: 12px;

        &:last-child {
            margin-right: 0;
        }
    }
</style>
