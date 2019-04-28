import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

Vue.use(Vuex);

interface RootState {
  lastRollover: moment.Moment | undefined;
  nextRollover: moment.Moment | undefined;
  initDate: moment.Moment | undefined;
  investStats: undefined | any;
}

const state: RootState = {
  lastRollover: undefined,
  nextRollover: undefined,
  initDate: undefined,
  investStats: undefined
};

export default new Vuex.Store({
  state,
  mutations: {},
  actions: {}
});
