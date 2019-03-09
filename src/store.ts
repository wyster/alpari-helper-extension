import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface RootState {
  lastRollover: object | undefined;
}

const state: RootState = {
  lastRollover: undefined,
};

export default new Vuex.Store({
  state,
  mutations: {

  },
  actions: {

  },
});
