<template>
  <div>
      <span title="Бонус">{{item.bonus}}</span>
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
