<template>
  <div id="alpari-ext-summary" :class="$style.summary">
    <button
      class="button button_type_primary"
      :class="$style.button"
      v-if="show && investmentSummary"
      v-on:click="save">
      <span class="button__deco">Сохранить</span>
    </button>
    <button
      class="button button_type_primary"
      :class="$style.button"
      v-on:click="openStats">
      <span class="button__deco">Открыть статистику</span>
    </button>

    <span v-if="typeof $store.state.lastRollover !== 'undefined'">
      Последний ролловер: {{$store.state.lastRollover.format('DD.MM HH:mm')}}
    </span>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {convertTextToObject} from '@/helper/summary';
import * as Command from '@/consts/command';
import find from 'lodash/find';

interface AlpariConfig {
  summary: object;
}

@Component({})
export default class Summary extends Vue {
    public show: boolean = true;
    public investmentSummary: HTMLElement | null = null;
    private alpariConfig: AlpariConfig | null = null;

    public created(): void {
        console.log('created');

        this.investmentSummary = document.querySelector('#investment-summary');
        this.alpariConfig = JSON.parse(
          (document.querySelector('.config') as HTMLElement).getAttribute('data-config') as string,
        );
    }

    private save(): void {
        if (this.alpariConfig === null) {
            console.error('config is null');
            return;
        }
        window.postMessage({
            command: Command.SAVE_INVEST_STATS,
            data: find(this.alpariConfig.summary, ({currency: 'USD'} as any)),
        }, '*');

        this.show = false;
    }

    private openStats(): void {
        window.postMessage({
            command: Command.OPEN_INVEST_STATS,
        }, '*');
    }
}
</script>

<style lang="less" module>
  .summary {
    margin-top: 5px;
    margin-bottom: 10px;
  }
  .button {
    margin-right: 5px;

    &:last-child {
      margin-right: 0;
    }
  }
</style>