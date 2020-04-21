import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import router from "../router/index";

Vue.use(Vuex);

//Allows axios to work locally or live
let base = window.location.host.includes("localhost")
  ? "//localhost:3000/"
  : "/";

let api = Axios.create({
  baseURL: base + "api/",
  timeout: 9000,
  withCredentials: true,
});

export default new Vuex.Store({
  state: {
    user: {},
    boards: [],
    activeBoard: {},
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setBoards(state, boards) {
      state.boards = boards;
    },
    setActiveBoard(state, board) {
      state.activeBoard = board;
    },
  },
  actions: {
    //#region -- AUTH STUFF --
    setBearer({}, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },
    async getProfile({ commit }) {
      try {
        let res = await api.get("/profile");
        commit("setUser", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    //#endregion

    //#region -- BOARDS --
    async getBoards({ commit, dispatch }) {
      try {
        let res = await api.get("boards");
        // console.log(res.data)
        commit("setBoards", res.data);
      } catch (error) {
        console.error(error);
      }
    },

    async getBoardById({ commit, dispatch }, boardId) {
      try {
        let res = await api.get("boards/" + boardId);
        commit("setActiveBoard", res.data);
      } catch (error) {
        console.error(error);
      }
    },

    async addBoard({ commit, dispatch }, boardData) {
      try {
        api.post("boards", boardData);
        dispatch("getBoards");
      } catch (error) {
        console.error(error);
      }
    },

    async deleteBoard({ commit, dispatch }, boardId) {
      try {
        await api.delete("boards/" + boardId);
        dispatch("getBoards");
      } catch (error) {
        console.error(error);
      }
    },
    //#endregion

    //#region -- LISTS --

    //#endregion
  },
});
