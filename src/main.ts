import Vue from 'vue';
import Summary from './Summary.vue';
import store from './store';

Vue.config.productionTip = false;

const div = document.createElement('div');
div.setAttribute('id', 'alpari-ext-summary');
const element = document.querySelector('[data-field-name="currencyButton"]');
if (element) {
  element.appendChild(div);

  new Vue({
    store,
    render: (h) => h(Summary),
  }).$mount('#alpari-ext-summary');
}
