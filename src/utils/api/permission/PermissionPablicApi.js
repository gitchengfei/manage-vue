/**
 * @Description : 权限工具类
 * @Author : cheng fei
 * @CreateDate 2019/5/22 17:03
 */

import router from "../../../router/index"
import axios from "../../http/axios"
import {checkHttpData} from "../../http/Http"
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import Vue from "vue";

/**
 * @Description : 将页面按钮权限url格式化为首字母大写的字符串
 * @Author : cheng fei
 * @CreateDate 2019/5/23 17:33
 * @Param key 页面权限key
 */
function formatPermissionKey(key) {
    let keyArray = key.split("/");
    for (let i in keyArray) {
        keyArray[i] = keyArray[i].charAt(0).toUpperCase() + keyArray[i].slice(1);
    }

    return keyArray.join("");
}

/**
 * @Description : 获取页面按钮权限
 * @Author : cheng fei
 * @CreateDate 2019/5/23 17:31
 * @Param permissions 必须是一个对象,用来接收页面按钮权限
 * @Param menuUrl 页面url
 *
 */
export async function getAccountMenuPermission(permissions, menuUrl) {
    store.commit(types.OPEN_HTTP);
    if (!menuUrl) {
        menuUrl = router.currentRoute.meta.authority;
    }
    const response = await axios({
        url: "/system/menu/account/menu/permission",
        method: "POST",
        params: {url: menuUrl}
    });
    store.commit(types.CLOSE_HTTP);
    let data = response.data;
    if (checkHttpData(data)) {
        data = data.data;
        if (!permissions) {
            permissions = {}
        }
        for (let key in data) {
            permissions[formatPermissionKey(key)] = data[key];
        }
    }
}
