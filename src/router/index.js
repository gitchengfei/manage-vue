import Vue from "vue";
import VueRouter from "vue-router";

if (process.env.NODE_ENV === "development") {
    Vue.use(VueRouter);
}

import Home from "../views/home/index.vue";

//账号管理
import Role from "../views/account/role/role"
import Account from "../views/account/account/account"

//系统设置
import Menu from "../views/system/menu/Menu";
import Permission from "../views/system/permission/Permission"
import Dictionary from "../views/system/dictionary/dictionary"
import DbLog from "../views/system/dbLog/dbLog"
import Api from "../views/system/api/Api"

//文件管理
import File from '../views/file/file'


const err401 = r =>
    require.ensure([], () => r(require("../views/error/err401.vue")), "home");
const err404 = r =>
    require.ensure([], () => r(require("../views/error/err404.vue")), "home");
const login = r =>
    require.ensure([], () => r(require("../views/login/index.vue")), "home");
const main = r =>
    require.ensure([], () => r(require("../views/home/main.vue")), "home");

// 注意 权限字段 authority （严格区分大小写）
export const constantRouterMap = [
    {
        path: "*",
        component: err404,
        hidden: true,
        meta : {
            authority : '',
            keepAlive : false,
        }
    },
    {
        path: "/401",
        component: err401,
        name: "401",
        hidden: true,
        meta : {
            authority : '',
            keepAlive : false,
        }
    },
    {
        path: "/404",
        component: err404,
        name: "404",
        hidden: true,
        meta : {
            authority : '',
            keepAlive : false,
        }
    },
    {
        path: "/500",
        component: err404,
        name: "500",
        hidden: true,
        meta : {
            authority : '',
            keepAlive : false,
        }
    },
    {
        path: "/login",
        component: login,
        name: "登录",
        hidden: true,
        meta : {
            authority : '',
            keepAlive : false,
        }
    },
    {
        path: "/",
        component: Home,
        redirect: "/main",
        name: "首页",
        hidden: true,
        meta : {
            authority : '',
            keepAlive : false,
        }
    },
    {
        path: "/main",
        component: Home,
        redirect: "/main/index",
        icon: "iconshouye",
        name: "控制台",
        noDropdown: true,
        meta : {
            authority : '',
            keepAlive : false,
        },
        children: [
            {
                path: "index",
                name: "控制台",
                component: main,
                meta : {
                    authority : '',
                    keepAlive : false,
                    tab: true
                }
            }
        ]
    },
];

export default new VueRouter({
    // mode: 'history', //后端支持可开
    routes: constantRouterMap,
    strict: process.env.NODE_ENV !== "production"
});

export const asyncRouterMap = [
    {
        path: "/system",
        redirect: "system",
        component: Home,
        icon: "iconxitongshezhi",
        name: "系统设置",
        meta: {
            authority: '/system'
        },
        children: [
            {
                path: "menu",
                component: Menu,
                name: "菜单设置",
                icon: "iconiconset0194",
                meta: {
                    authority: '/system/menu',
                    keepAlive : true,
                    tab: true

                }
            },
            {
                path: "permission",
                component: Permission,
                name: "权限管理",
                icon: "iconic_opt_feature",
                meta: {
                    authority: '/system/permission',
                    keepAlive : true,
                    tab: true
                }
            },
            {
                path: "dictionary",
                component: Dictionary,
                name: "数据字典",
                icon: "iconshujuzidian",
                meta: {
                    authority: "/system/dictionary",
                    keepAlive : true,
                    tab: true
                }
            },
            {
                path: "db/log",
                component: DbLog,
                name: "数据库操作日志",
                icon: "iconrizhi",
                meta: {
                    authority: '/system/db/log',
                    keepAlive : true,
                    tab: true
                }
            },
            {
                path: "api",
                component: Api,
                name: "接口文档",
                icon: "iconwendang",
                meta: {
                    authority: '/system/api',
                    keepAlive : true,
                    tab: true
                }
            },
        ]
    },{
        path: "/account",
        redirect: "account",
        component: Home,
        icon: "iconzhanghaoguanli",
        name: "账号管理",
        meta: {
            authority: '/account'
        },
        children: [
            {
                path: "account",
                component: Account,
                name: "账号列表",
                icon: "iconzhanghaoguanli1",
                meta: {
                    authority: '/account/account',
                    keepAlive : true,
                    tab: true
                }
            },
            {
                path: "role",
                component: Role,
                name: "角色管理",
                icon: "iconjiaoseguanli",
                meta: {
                    authority: '/account/role',
                    keepAlive : true,
                    tab: true
                }
            },
        ]
    },{
        path: "/file",
        redirect: "file",
        component: Home,
        icon: "iconwenjian",
        name: "文件管理",
        meta: {
            authority: '/file'
        },
        children: [
            {
                path: "file",
                component: File,
                name: "文件列表",
                icon: "iconfolder-fill",
                meta: {
                    authority: '/file/file',
                    keepAlive : true,
                    tab: true
                }
            },
        ]
    }
];
