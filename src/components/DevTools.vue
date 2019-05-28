<template>
  <div :class="theme">
    <div v-if="investStats && investStats.length > 0">
      Data list:
      <ul v-for="(item, index) in investStats" :key="index">
        <li>{{ prepareDate(item.date) }}</li>
      </ul>
    </div>
    <a href="javascript:;" @click="clear(STORAGE.INVEST_STATS)">
      Очистить
    </a>
    <form @submit="put($event)">
      <textarea :class="$style.textarea" name="data"></textarea>
      <br />
      <input type="submit" />
    </form>
    <textarea :class="$style.textarea" v-text="prepareTextarea()"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Storage from "@/consts/storage";
import { browser } from "webextension-polyfill-ts";
import moment from "moment-timezone";

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

  private async created(): Promise<any> {
    console.log("created");

    this.investStats = await getInvestStats();
    if (typeof browser.devtools !== "undefined") {
      this.theme =
        browser.devtools.panels.themeName === "dark"
          ? this.$style.dark
          : this.$style.light;
    }
  }

  private clear(): void {
    browser.storage.local.set({ [Storage.INVEST_STATS]: {} });
  }

  private put(event: Event): void {
    event.preventDefault();
    const value = new FormData(event.target as HTMLFormElement).get(
      "data"
    ) as string;
    browser.storage.local.set({ [Storage.INVEST_STATS]: JSON.parse(value) });
  }

  private prepareTextarea(): string {
    return JSON.stringify(this.investStats);
  }

  private prepareDate(v: string): string {
    return moment
      .tz(v, "Europe/Kiev")
      .tz(moment.tz.guess())
      .format("Y-MM-D hh:mm");
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
}
</style>
