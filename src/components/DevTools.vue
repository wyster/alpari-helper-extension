<template>
  <div :class="theme">
    <button
      @click="save()"
      v-if="investStats !== null && investStats.length > 0"
    >
      {{ $t("saveDb") }}
    </button>
    <button
      @click="clear(STORAGE.INVEST_STATS)"
      v-if="investStats !== null && investStats.length > 0"
    >
      {{ $t("clear") }}
    </button>
    <label v-if="investStats !== null && investStats.length === 0">
      Upload dump
      <input type="file" accept="application/json" @change="readFile" />
    </label>
    <div v-if="investStats !== null">
      <template v-if="investStats.length > 0">
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
      </template>
      <template v-if="investStats.length === 0">
        {{ $t("dbIsEmpty") }}
      </template>
    </div>
    <div v-else>
      Загрузка данных...
    </div>
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
  private theme = "";
  private $style: any;
  private fullData: any = "";

  private async created(): Promise<any> {
    getInvestStats().then(result => {
      this.investStats = result;
      console.log(this.investStats);
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
      this.investStats = [];
    }
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

  private save(): void {
    const blob = new Blob([JSON.stringify(this.investStats)], {
      type: "application/json;charset=utf-8"
    });
    FileSaver.saveAs(blob, "db.json");
  }

  private showFullData(item: any): void {
    this.fullData = item;
  }

  private readFile(e: Event): void {
    const input = e.target as HTMLFormElement;
    input.remove();
    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result as string);
      browser.storage.local.set({
        [Storage.INVEST_STATS]: data
      });
      this.investStats = data;
    };
    reader.readAsText(input.files[0]);
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

  textarea,
  button,
  input[type="file"] {
    color: white;
    background-color: grey;
    border: 0;
  }

  a {
    color: white;
  }
}

button,
input[type="file"] {
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
  "clear": "Clear database",
  "saveDb": "Save database to file",
  "dataList": "Data list",
  "dropDbConfirm": "Drop db?",
  "dbIsEmpty": "Database is empty"
  },
  "ru": {
  "clear": "Очистить базу данных",
  "saveDb": "Сохранить базу данных в файл",
  "dataList": "Список данных",
  "dropDbConfirm": "Очистить хранилище?",
  "dbIsEmpty": "База данных пустая"
  }
  }
</i18n>
