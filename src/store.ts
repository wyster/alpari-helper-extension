import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

Vue.use(Vuex);

interface RootState {
  lastRollover: moment.Moment | undefined | null;
  nextRollover: moment.Moment | undefined;
  initDate: moment.Moment | undefined;
  // @todo type
  investStats: undefined | any;
}

const state: RootState = {
  lastRollover: null,
  nextRollover: undefined,
  initDate: undefined,
  investStats: undefined
};

export default new Vuex.Store({
  state,
  mutations: {},
  actions: {},
  getters: {
    lastRollover({ lastRollover }: RootState) {
      return lastRollover;
    },
    nextRollover({ nextRollover }: RootState) {
      return nextRollover;
    },
    initDate({ initDate }: RootState) {
      return initDate;
    }
  }
});
