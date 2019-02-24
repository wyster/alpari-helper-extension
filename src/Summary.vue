<template>
  <button
      class="button button_type_primary"
      v-on:click="save">
     <span class="button__deco">Сохранить</span>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { convertTextToObject } from './helper/summary';

@Component({})
export default class Summary extends Vue {
    private save(): void {
        const text = (document.querySelector('#investment-summary') as HTMLInputElement).innerText;
        console.log(convertTextToObject(text));
    }
}
</script>
