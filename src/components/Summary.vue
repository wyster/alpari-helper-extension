<template>
  <div id="alpari-ext-summary" :class="$style.summary">
    <div :class="$style.buttons">
      <button
        class="button button_type_primary"
        :class="$style.button"
        v-if="show && investmentSummary"
        @click="save"
      >
        <span class="button__deco">{{ $t("Save") }}</span>
      </button>
      <button
        class="button button_type_primary"
        :class="$style.button"
        @click="openStats"
      >
        <span class="button__deco">{{ $t("Open Stats") }}</span>
      </button>
    </div>

    <div
      class="dotted-list-panel dotted-list-panel_rounded_yes dotted-list-panel_white_yes s_mb_27"
    >
      <ul>
        <li
          v-if="initDate"
          class="s_position_relative dotted-list-panel__item dotted-list-panel__item_border-bottom_dotted"
        >
          <div class="dotted-list-panel__key s_position_relative s_float_l">
            {{ $t("Page open time") }}:
          </div>
          <div class="dotted-list-panel__value s_position_relative s_float_r">
            {{ formatDate(initDate) }}
          </div>
          <div class="s_clear_both"></div>
        </li>
        <li
          v-if="lastRollover"
          class="s_position_relative dotted-list-panel__item dotted-list-panel__item_border-bottom_dotted"
        >
          <div class="dotted-list-panel__key s_position_relative s_float_l">
            {{ $t("Last rollover") }}:
          </div>
          <div class="dotted-list-panel__value s_position_relative s_float_r">
            {{ formatDate(lastRollover) }}
          </div>
          <div class="s_clear_both"></div>
        </li>
        <li
          v-if="nextRollover"
          class="s_position_relative dotted-list-panel__item dotted-list-panel__item_border-bottom_dotted"
        >
          <div class="dotted-list-panel__key s_position_relative s_float_l">
            {{ $t("Next rollover") }}:
          </div>
          <div class="dotted-list-panel__value s_position_relative s_float_r">
            {{ formatDate(nextRollover) }}
          </div>
          <div class="s_clear_both"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import * as Command from "@/consts/command";
import find from "lodash/find";
import moment from "moment-timezone";
import map from "lodash/map";
import * as Source from "@/consts/source";

interface AlpariConfig {
  summary: object;
  locale: string;
}

@Component({
  computed: mapGetters([
    "lastRollover",
    "nextRollover",
    "initDate",
    "investStats"
  ])
})
export default class Summary extends Vue {
  public show: boolean = true;
  public investmentSummary: HTMLElement | null = null;
  private alpariConfig: AlpariConfig | null = null;
  private lastRollover: moment.Moment | undefined | null;
  private nextRollover: moment.Moment | undefined;
  private initDate: moment.Moment | undefined;
  // @todo type
  private investStats: undefined | any;

  public created(): void {
    console.log("created");

    this.investmentSummary = document.querySelector("#investment-summary");
    this.alpariConfig = JSON.parse((document.querySelector(
      ".config"
    ) as HTMLElement).getAttribute("data-config") as string);

    if (this.alpariConfig) {
      this.$i18n.locale = this.alpariConfig.locale;
    }
  }

  private save(): void {
    if (!this.alpariConfig) {
      alert(
        "Произошла ошибка, попробуйте обновить страницу и повторить запрос!"
      );
      this.show = false;
      return;
    }

    if (!this.lastRollover) {
      alert(
        "Идёт загрузка данных, пожалуйста повторите запрос через несколько секунд!"
      );
      return;
    }

    if (!this.nextRollover) {
      alert(
        "Идёт загрузка данных, пожалуйста повторите запрос через несколько секунд!"
      );
      return;
    }

    if (this.nextRollover.tz(moment.tz.guess()).isBefore(moment())) {
      alert(
        `Пожалуйста обновите страницу, уже прошёл ролловер в ${this.formatDate(
          this.nextRollover
        )}`
      );
      this.show = false;
      return;
    }
    if (
      !this.nextRollover
        .clone()
        .subtract(1, "hour")
        .isSame(this.lastRollover)
    ) {
      alert(
        `Пожалуйста обновите страницу, последний ролловер был больше часа назад ${this.formatDate(
          this.lastRollover
        )}`
      );
      this.show = false;
      return;
    }

    const getLastSave = (): moment.Moment | null => {
      if (!this.investStats || this.investStats.length === 0) {
        return null;
      }
      // @todo типы
      const dates = map(this.investStats, item => {
        return moment(item.date);
      });

      return moment.max(dates);
    };

    const lastSave = getLastSave();
    if (
      lastSave !== null &&
      this.lastRollover !== undefined &&
      lastSave.isBetween(
        this.lastRollover.tz(moment.tz.guess()),
        this.nextRollover.tz(moment.tz.guess())
      )
    ) {
      alert("У вас уже есть статистика за текущий час!");
      this.show = false;
      return;
    }

    window.postMessage(
      {
        command: Command.SAVE_INVEST_STATS,
        data: find(this.alpariConfig.summary, { currency: "USD" } as any),
        source: Source.PAGE
      },
      "*"
    );

    this.show = false;
  }

  private openStats(): void {
    window.postMessage(
      {
        command: Command.OPEN_INVEST_STATS,
        source: Source.PAGE
      },
      "*"
    );
  }

  private formatDate(date: moment.Moment | null | undefined): string | null {
    if (date instanceof moment) {
      return date.tz(moment.tz.guess()).format("DD.MM.YY HH:mm:ss");
    }

    return null;
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
