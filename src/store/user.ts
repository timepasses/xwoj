import { StoreOptions } from "vuex";

export default {
  namespaced: true,
  // initial state
  //state：存储的状态信息
  state: () => ({
    loginUser: {
      userName: "未登录",
    },
  }),

  // getters
  getters: {},

  // mutations
  //定义了对变量进行增删改的方法
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },

  // actions
  //执行异步操作并且触发mutation的更改（调用mutation）
  actions: {
    getLoginUser({ commit, state }, payload) {
      // todo 远程获取登录信息
      commit("updateUser", { userName: "xxj" });
    },
  },
} as StoreOptions<any>;
