/**
 * @Description : 账号状态
 * @Author : cheng fei
 * @CreateDate 2019/5/13 11:20
 */

import * as types from "../mutation-types";
import {constantRouterMap} from "../../router";
import {setAccountInfo, removeAccountInfo, getHeadPortrait, updateHeadPortrait} from "../../utils/account/AccountUtil";
import {getAccountId, getAccountUsername, getToken, getAccountName, updateeadPortrait } from "../../utils/account/AccountUtil"


// initial state
const state = {
    // id
    accountId: getAccountId(),
    // 用户名
    username: getAccountUsername(),
    //姓名
    name: getAccountName(),
    //头像
    headPortrait : getHeadPortrait(),
    // 登录token
    token: getToken(),
    //是否弹出登录超时弹框
    isAlertLoginOverTime : true,
    // 路由权限列表
    routeAuthority: "",
    //路由列表
    routers: constantRouterMap
};

// getters
const getters = {
    accountId: state => state.accountId,
    username: state => state.username,
    name: state => state.name,
    headPortrait : state => state.headPortrait,
    token: state => state.token,
    isAlertLoginOverTime : state => state.isAlertLoginOverTime,
    routeAuthority: state => state.routeAuthority,
    routers: state => state.routers,
};

// mutations
const mutations = {
    //更新用户数据
    [types.RECEIVE_ACCOUNT_INFO](state, accountInfo) {
        if (accountInfo){
            setAccountInfo(accountInfo);
            if (accountInfo.token){
                state.token = accountInfo.token
            }
            if (accountInfo.headPortraitUrl) {
                state.headPortrait = accountInfo.headPortraitUrl;
            }
            if (accountInfo.account) {
                const  account = accountInfo.account;
                if (account.id){
                    state.accountId = account.id;
                }
                if (account.username) {
                    state.username = account.username;
                }
                if (account.name){
                    state.name = account.name;
                }
                state.isAlertLoginOverTime = true;
            }
        } else {
            state.token = "";
            state.accountId = "";
            state.username = "";
            state.name = "";
            state.headPortrait = "";
            removeAccountInfo();
        }

    },
    //更新是否弹出登录超时弹框
    [types.RECEIVE_IS_ALERT_LOGIN_OVER_TIME] (state, isAlertLoginOverTime) {
        state.isAlertLoginOverTime = isAlertLoginOverTime;
    },
    //更新用路由权限
    [types.RECEIVE_ACCOUNT_ROUTE_AUTHORITY](state, routeAuthority) {
        state.routeAuthority = routeAuthority;
    },
    //更新用户路由列表
    [types.RECEIVE_ROUTERS](state, routers) {
        const tempRm = constantRouterMap.concat(routers);
        state.routers = JSON.parse(JSON.stringify(tempRm));
    },
    [types.RECEIVE_ACCOUNT_INFO_HEAD_PORTRAIT] (state, headPortrait){
        state.headPortrait = headPortrait;
        updateHeadPortrait(headPortrait)

    }
};

export default {
    state,
    getters,
    mutations
};
