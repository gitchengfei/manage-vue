import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";
import app from "./modules/app";
import Account from "./modules/Account"

if (process.env.NODE_ENV === "development") {
    Vue.use(Vuex);
}

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        app,
        Account
    },
    strict: debug
    // plugins: debug ? [createLogger()] : []
});
