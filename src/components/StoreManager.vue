<template>
  <div>
      <a
        href="javascript:;"
        @click="clear(STORAGE.INVEST_STATS)">
          Очистить
      </a>
      <form
        @submit="put($event)">
        <textarea :class="$style.textarea" name="data"></textarea>
        <input type="submit" />
      </form>
      <textarea :class="$style.textarea">{{investStats}}</textarea>
      <!--<div
        v-for="(item, index) in investStats"
        :key="index"
      >
          {{index}}
          <pre>{{item}}</pre>
      </div>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as Command from '@/consts/command';
import * as Storage from '@/consts/storage';

// @todo type
async function getInvestStats(): Promise<any> {
    return new Promise((resolve) => {
        chrome.storage.local.get([Storage.INVEST_STATS], ({investStats: result}) => {
            resolve(result);
        });
    });
}

@Component({})
export default class StoreManager extends Vue {
    // @todo type
    private investStats: any | null = null;
    private STORAGE = Storage;

    private async created(): Promise<any> {
        console.log('created');

        this.investStats = await getInvestStats();
    }

    private clear(storage: string): void {
        chrome.storage.local.set({[Storage.INVEST_STATS]: {}});
    }

    private put(event: Event): void {
        event.preventDefault();
        const value = (new FormData((event.target as HTMLFormElement)).get('data')) as string;
        chrome.storage.local.set({[Storage.INVEST_STATS]: JSON.parse(value)});
    }
}
</script>

<style lang="less" module>
    .textarea {
        width: 500px;
        height: 300px;;
    }
</style>
