<template>
  <div id="alpari-ext-summary" :class="$style.summary">
    <div :class="$style.buttons">
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
    </div>

    <div class="dotted-list-panel dotted-list-panel_rounded_yes dotted-list-panel_white_yes s_mb_27">
      <ul>
        <li 
          v-if="typeof $store.state.initDate !== 'undefined'"
          class="s_position_relative dotted-list-panel__item dotted-list-panel__item_border-bottom_dotted">
          <div class="dotted-list-panel__key s_position_relative s_float_l">Время открытия страницы:</div>
          <div class="dotted-list-panel__value s_position_relative s_float_r">{{formatDate($store.state.initDate)}}</div>
          <div class="s_clear_both"></div>
        </li>
        <li 
          v-if="typeof $store.state.lastRollover !== 'undefined'" 
          class="s_position_relative dotted-list-panel__item dotted-list-panel__item_border-bottom_dotted">
          <div class="dotted-list-panel__key s_position_relative s_float_l">Последний ролловер:</div>
          <div class="dotted-list-panel__value s_position_relative s_float_r">{{formatDate($store.state.lastRollover)}}</div>
          <div class="s_clear_both"></div>
        </li>
        <li 
          v-if="typeof $store.state.nextRollover !== 'undefined'" 
          class="s_position_relative dotted-list-panel__item dotted-list-panel__item_border-bottom_dotted">
          <div class="dotted-list-panel__key s_position_relative s_float_l">Следующий ролловер:</div>
          <div class="dotted-list-panel__value s_position_relative s_float_r">{{formatDate($store.state.nextRollover)}}</div>
          <div class="s_clear_both"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import * as Command from '@/consts/command';
import find from 'lodash/find';
import moment from 'moment-timezone';

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

        if (this.$store.state.nextRollover.tz(moment.tz.guess()).isBefore(moment())) {
            alert(`Пожалуйста обновите страницу, уже прошёл ролловер в ${this.formatDate(this.$store.state.nextRollover)}`);
            return;
        }
        if (!this.$store.state.nextRollover.clone().subtract(1, 'hour').isSame(this.$store.state.lastRollover)) {
            console.log(this.$store.state.nextRollover.format());
            alert(`Пожалуйста обновите страницу, последний ролловер был больше часа назад ${this.formatDate(this.$store.state.lastRollover)}`);
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

    private formatDate(date: moment.Moment): string {
        return date.tz(moment.tz.guess()).format('DD.MM.YY HH:mm:ss');
    }
}
</script>

<style lang="less" module>
  .buttons {
    margin: 10px 0;
    text-align: right;
  }

  .button {
    margin-right: 5px;

    &:last-child {
      margin-right: 0;
    }
  }
</style>