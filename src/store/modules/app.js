import { getLocalStorage, setLocalStorage } from "../../utils/session_storage_util/LocaStorageUtil";
import * as types from "../mutation-types";
import { Loading } from 'element-ui';


const state = {
    sidebar: {
        opened: !+getLocalStorage("sidebarStatus")
    },
    visitedViews: [],
    doHttp : 0,
    isPc : "",
    pageTabs : [],
    pageTabValue : "",
};

//加载
let loadingInstance = "";

// getters
const getters = {
    sidebar: state => state.sidebar,
    visitedViews: state => state.visitedViews,
    isPc: state=> state.isPc,
    pageTabs: state=> state.pageTabs,
    pageTabValue: state=> state.pageTabValue,
};

// actions
const actions = {
    ToggleSideBar({ commit }) {
        commit(types.TOGGLE_SIDEBAR);
    },
    ShowSideBar({ commit }) {
        commit(types.SHOW_SIDEBAR);
    },
    addVisitedViews({ commit }, view) {
        commit(types.ADD_VISITED_VIEWS, view);
    },
    delVisitedViews({ commit, state }, view) {
        return new Promise(resolve => {
            commit(types.DEL_VISITED_VIEWS, view);
            resolve([...state.visitedViews]);
        });
    }
};

// mutations
const mutations = {
    [types.TOGGLE_SIDEBAR](state) {
        if (state.sidebar.opened) {
            setLocalStorage("sidebarStatus", 1);
        } else {
            setLocalStorage("sidebarStatus", 0);
        }
        state.sidebar.opened = !state.sidebar.opened;
    },
    [types.SHOW_SIDEBAR](state) {
        if (state.sidebar.opened) {
            setLocalStorage("sidebarStatus", 1);
        }
        state.sidebar.opened = false;
    },
    [types.ADD_VISITED_VIEWS](state, view) {
        if (state.visitedViews.some(v => v.path === view.path)) return;
        state.visitedViews.push({ name: view.name, path: view.path });
    },
    [types.DEL_VISITED_VIEWS](state, view) {
        let index;
        for (const [i, v] of state.visitedViews.entries()) {
            if (v.path === view.path) {
                index = i;
                break;
            }
        }
        state.visitedViews.splice(index, 1);
    },
    [types.OPEN_HTTP](state, msg){
        if (!msg) {
            msg = '加载中...'
        }
        state.doHttp += 1;
        if (state.doHttp === 1){
            loadingInstance = Loading.service({fullscreen: true, text:msg, background: "rgba(0, 0, 0, 0.5)"});
        }
    },
    [types.CLOSE_HTTP](state){
        state.doHttp -= 1;
        if (state.doHttp === 0){
            loadingInstance.close();
        }
    },
    [types.IS_PC](state, isPc){
        state.isPc = isPc;
    },
    [types.ADD_PAGE_TAB](state, route){
        if (route && route.meta && route.meta.tab) {
            for(var i = 0 ; i < state.pageTabs.length; i ++) {
                if (state.pageTabs[i].path === route.path) {
                    state.pageTabValue = route.path;
                    return;
                }
            }
            state.pageTabs.push(route);
            state.pageTabValue = route.path;
        }
    },
    [types.DELETE_PAGE_TAB](state, path){
        if (state.pageTabs.length === 1) {
            return;
        }
        for(var i = 0 ; i < state.pageTabs.length; i ++) {
            if (state.pageTabs[i].path === path) {
                state.pageTabs.splice(i, 1);
                state.pageTabValue =  state.pageTabs[i === state.pageTabs.length ? (i - 1) : (i + 1) ].path;
                return
            }
        }
    },
    [types.SET_PAGE_TAB_VALUE](state, value){
        state.pageTabValue = value;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
