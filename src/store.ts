import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import { Moment } from "moment-timezone/moment-timezone";

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
    lastRollover({ lastRollover }: RootState): Moment | null | undefined {
      return lastRollover;
    },
    nextRollover({ nextRollover }: RootState): Moment | undefined {
      return nextRollover;
    },
    initDate({ initDate }: RootState): Moment | undefined {
      return initDate;
    },
    investStats({ investStats }: RootState): undefined | any {
      return investStats;
    }
  }
});
