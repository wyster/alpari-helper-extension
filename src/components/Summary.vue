<template>
  <button
      id="alpari-ext-summary"
      class="button button_type_primary"
      v-if="show && investmentSummary"
      v-on:click="save">
     <span class="button__deco">Сохранить</span>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { convertTextToObject } from '@/helper/summary';

@Component({})
export default class Summary extends Vue {
    public show: boolean = true;
    public investmentSummary: HTMLElement|null = null;

    public created(): void {
        console.log('created');

        this.investmentSummary = document.querySelector('#investment-summary');
    }

    private save(): void {
        if (this.investmentSummary === null) {
            console.error('#investment-summary not found on page');
            return;
        }
        console.log(convertTextToObject(this.investmentSummary.innerText));
        return;
    }
}
</script>
