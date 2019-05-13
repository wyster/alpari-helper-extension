import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

Vue.use(Vuex);

interface RootState {
  lastRollover: moment.Moment | undefined | null;
  nextRollover: moment.Moment | undefined;
  initDate: moment.Moment | undefined;
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
  actions: {}
});
