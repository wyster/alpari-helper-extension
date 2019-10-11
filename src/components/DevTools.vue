<template>
  <div :class="theme">
    <button @click="save()">
      {{ $t("saveDb") }}
    </button>
    <button @click="clear(STORAGE.INVEST_STATS)">
      {{ $t("clear") }}
    </button>
    <div v-if="investStats && investStats.length > 0">
      {{ $t("dataList") }} ({{ investStats.length }}):
      <div :class="$style.container">
        <div
          v-for="(item, index) in investStats"
          :key="index"
          :class="$style.item"
        >
          <a href="javascript:;" @click="showFullData(item)">
            {{ prepareDate(item.date) }}
          </a>
        </div>
      </div>
      <textarea
        v-if="fullData"
        :class="$style.textarea"
        v-model="fullData"
      ></textarea>
    </div>
    <div v-else>
      Загрузка данных...
    </div>
    <!--<textarea v-if="prepareTextarea() !== null" :class="$style.textarea" v-text="prepareTextarea()"></textarea>-->
    <!--<form @submit="put($event)">
      <textarea :class="$style.textarea" name="data"></textarea>
      <br />
      <input type="submit" />
    </form>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Storage from "@/consts/storage";
import { browser } from "webextension-polyfill-ts";
import moment from "moment-timezone";
import FileSaver from "file-saver";

// @todo type
async function getInvestStats(): Promise<any> {
  return new Promise(resolve => {
    browser.storage.local
      .get([Storage.INVEST_STATS])
      .then(({ investStats: result }) => {
        resolve(result);
      });
  });
}

@Component({})
export default class DevTools extends Vue {
  // @todo type
  private investStats: any | null = null;
  private STORAGE = Storage;
  private theme: string = "";
  private $style: any;
  private fullData: any = "";

  private async created(): Promise<any> {
    console.log("created");

    getInvestStats().then(result => {
      this.investStats = result;
    });

    if (typeof browser.devtools !== "undefined") {
      this.theme =
        browser.devtools.panels.themeName === "dark"
          ? this.$style.dark
          : this.$style.light;
    }
  }

  private clear(): void {
    if (confirm(this.$t("dropDbConfirm"))) {
      browser.storage.local.set({ [Storage.INVEST_STATS]: [] });
    }
  }

  private put(event: Event): void {
    event.preventDefault();
    const value = new FormData(event.target as HTMLFormElement).get(
      "data"
    ) as string;
    browser.storage.local.set({ [Storage.INVEST_STATS]: JSON.parse(value) });
  }

  private prepareTextarea(): null | string {
    return this.investStats ? JSON.stringify(this.investStats) : null;
  }

  private prepareDate(v: string): string {
    return moment
      .tz(v, "Europe/Kiev")
      .tz(moment.tz.guess())
      .format("Y-MM-DD hh:mm");
  }

  private save() {
    const blob = new Blob([JSON.stringify(this.investStats)], {
      type: "application/json;charset=utf-8"
    });
    FileSaver.saveAs(blob, "db.json");
  }

  private showFullData(item: any) {
    this.fullData = item;
  }
}
</script>

<style lang="less" module>
.textarea {
  width: 500px;
  height: 300px;
}

.dark {
  color: white;

  & textarea,
  & button {
    color: white;
    background-color: grey;
    border: 0;
  }
}

button {
  margin: 0 10px;

  &:first-child,
  &:last-child {
    margin: 0;
  }
}

form {
  margin: 10px 0;
}

.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: 140px;
}
</style>

<i18n>
{
  "en": {
    "clear": "Clear",
    "saveDb": "Save database",
    "dataList": "Data list",
    "dropDbConfirm": "Drop db?"
  },
  "ru": {
    "clear": "Очистить",
    "saveDb": "Сохранить базу",
    "dataList": "Список данных",
    "dropDbConfirm": "Очистить хранилище?"
  }
}
</i18n>
