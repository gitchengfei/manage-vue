import Vue from "vue";
import router from "./index";
import store from "../store/index";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { MessageBox} from "element-ui";
import {asyncRouterMap} from "./index";
import * as types from "../store/mutation-types"
import axios from "../utils/http/axios"
import { checkHttpData } from "../utils/http/Http"
import { Confirm } from "../utils/confirm/ConfirmUtil"


/**
 * @Description : 检测是否拥有路由权限是否有相应权限
 * @Author : cheng fei
 * @CreateDate 2019/5/16 15:57
 * @param routeAuthority
 * @param authority
 * @returns {boolean}
 */
function hasAuthority(routeAuthority, authority) {
    if (!authority){
        return true;
    }
    if (!routeAuthority || routeAuthority.length <= 0) {
        return false;
    }
    return routeAuthority.indexOf(authority) > -1;
}

/**
 * @Description : 判断拥有的路由权限中是否包含该路由
 * @Author : cheng fei
 * @CreateDate 2019/5/16 15:57
 * @param routeAuthority
 * @param route
 * @returns {boolean}
 */
function hasRouteAuthority(routeAuthority, route) {
    if (route.meta && route.meta.authority) {
        for(let i in routeAuthority ){
            if (routeAuthority[i].url.indexOf(route.meta.authority) > -1) {
                Vue.set(route.meta, "displayOrder", routeAuthority[i].displayOrder);
                return true;
            }
        }
    }
    return false;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param routeAuthority
 */
function filterAsyncRouter(asyncRouterMap, routeAuthority) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasRouteAuthority(routeAuthority, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, routeAuthority);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}


/**
 * @Description : 路由排序规则
 * @Author : cheng fei
 * @CreateDate 2019/6/2 15:28
 * @param route1
 * @param route2
 * @returns {number}
 */
function compareRoute(route1, route2){
    const displayOrder1 = route1.meta.displayOrder;
    const displayOrder2 = route2.meta.displayOrder;
    if (displayOrder1 < displayOrder2) {
        return -1;
    } else if (displayOrder1 > displayOrder2) {
        return 1
    } else {
        return 0
    }
}

/**
 * @Description : 递归排序路由
 * @Author : cheng fei
 * @CreateDate 2019/6/2 15:31
 * @param routes
 */
function displayOrderRoute(routes) {
    routes.sort(compareRoute)
    routes.forEach((item)=>{
        if (item.children && item.children.length) {
            displayOrderRoute(item.children)
        }
    })
}

/**
 * @Description : 获取路由url权限列表
 * @Author : cheng fei
 * @CreateDate 2019/6/2 16:07
 * @param routeAuthority
 */
function getRouteAuthorityUrl(routeAuthority) {
    let urls = [];
    routeAuthority.forEach((item)=>{
        urls.push(item.url)
    })

    return urls;
}

const whiteList = ["/login", "/401", "/404", "/500"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
    // 开启Progress
    NProgress.start();
    if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next();
        return;
    }

    let token = store.getters.token;
    // 判断是否有token
    if (token) {
        if (to.path === "/login") {
            next({path: "/"});
            // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
            NProgress.done();
            return;
        }

        // 判断是否需要加载菜单访问权限
        let routeAuthority = store.getters.routeAuthority;
        if (token && !routeAuthority) {
            store.commit(types.OPEN_HTTP);
            axios({
                url: "system/menu/account/authority",
                method: "POST",
                params: {}
            }).then((response)=>{
                store.commit(types.CLOSE_HTTP);
                let data = response.data;
                if (checkHttpData(data, to.path)) {
                    routeAuthority = !data.data ? [] : data.data;
                    store.commit(types.RECEIVE_ACCOUNT_ROUTE_AUTHORITY, getRouteAuthorityUrl(routeAuthority));
                    // 生成可访问的路由表
                    let accessedRouters = filterAsyncRouter(asyncRouterMap, routeAuthority);
                    //排序
                    displayOrderRoute(accessedRouters);
                    // 动态添加可访问路由表
                    router.addRoutes(accessedRouters);
                    // hack方法 确保addRoutes已完成
                    next({...to});
                    // 设置左边导航栏
                    store.commit(types.RECEIVE_ROUTERS, accessedRouters);
                    next();
                    return;
                }
            }).catch((error)=>{
                store.commit(types.CLOSE_HTTP);
                Confirm("加载用户菜单权限异常,请重新登陆！", '错误', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'error',
                    showClose: true,
                }).then(() => {
                    next({path: "/login",});
                })
            });
            return;
        }
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasAuthority(store.getters.routeAuthority, to.meta.authority)) {
            next();
            return;
        }
        next({
            path: "/401",
            query: {noGoBack: true}
        });
        NProgress.done(); // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        return;
    }
    let redirect = to.fullPath;
    store.commit(types.RECEIVE_ACCOUNT_INFO, "");
    // 否则全部重定向到登录页
    next({
        path: "/login",
        query: {redirect: redirect}
    });
    // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    NProgress.done();
});

router.afterEach(() => {
    // 结束Progress
    NProgress.done();
});
