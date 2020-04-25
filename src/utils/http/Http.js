/**
 * @Description : http请求util
 * @Author : cheng fei
 * @CreateDate 2019/3/24 15:12
 */
import axios from "./axios";
import router from "../../router/index";
import { Confirm } from '../confirm/ConfirmUtil';
import { getToken } from "../account/AccountUtil"
import store from "../../store/index";
import  * as types from "../../store/mutation-types"


const http = {
    /**
     * @Description : Get 请求
     * @Author : cheng fei
     * @CreateDate 2019/3/24 15:23
     * @Param self 当前页面对象 (必填)
     * @Param url 访问相对地址 (必填)
     * @Param param 请求参数 (必填)
     * @Param successFunction 成功回调函数
     * @Param failedFunction 失败回调函数
     * @Param failedFunction 失败回调函数
     * @Param exceptionFunction 异常回调函数
     */
    doGet: function (self, url, param, successFunction, failedFunction, exceptionFunction) {
        doGet(self, url, param, successFunction, failedFunction, exceptionFunction, true);
    },

    /**
     * @Description : Get 请求检测参数,不提示错误信息
     * @Author : cheng fei
     * @CreateDate 2019/3/24 15:23
     * @Param self 当前页面对象 (必填)
     * @Param url 访问相对地址 (必填)
     * @Param param 请求参数 (必填)
     * @Param successFunction 成功回调函数
     * @Param failedFunction 失败回调函数
     * @Param exceptionFunction 异常回调函数
     */
    doGetCheckParam: function (self, url, param, successFunction, failedFunction, exceptionFunction) {
        doGet(self, url, param, successFunction, failedFunction, exceptionFunction,false);
    },
    /**
     * @Description : Post 表单请求
     * @Author : cheng fei
     * @CreateDate 2019/3/24 15:23
     * @Param self 当前页面对象 (必填)
     * @Param url 访问相对地址 (必填)
     * @Param param 请求参数 (必填)
     * @Param successFunction 成功回调函数
     * @Param failedFunction 失败回调函数
     * @Param exceptionFunction 异常回调函数
     */
    doPostForForm: function (self, url, param, successFunction, failedFunction, exceptionFunction) {
        doPostForForm(self, url, param, successFunction, failedFunction, exceptionFunction, true);
    },
    /**
     * @Description : Post 检测参数请求, 不提示错误信息
     * @Author : cheng fei
     * @CreateDate 2019/3/24 15:23
     * @Param self 当前页面对象 (必填)
     * @Param url 访问相对地址 (必填)
     * @Param param 请求参数 (必填)
     * @Param successFunction 成功回调函数
     * @Param failedFunction 失败回调函数
     * @Param exceptionFunction 异常回调函数
     */
    doPostCheckParam: function (self, url, param, successFunction, failedFunction, exceptionFunction) {
        doPostForForm(self, url, param, successFunction, failedFunction, exceptionFunction, false);
    },
    /**
     * @Description : 发送POST请求-json方式
     * @Author : cheng fei
     * @CreateDate 2019/3/24 21:10
     * @Param self 当前页面对象 (必填)
     * @Param url 访问相对地址 (必填)
     * @Param param 请求参数 (必填)
     * @Param successFunction 成功回调函数
     * @Param failedFunction 失败回调函数
     * @Param exceptionFunction 异常回调函数
     */
    doPostForJson : function (self, url, param, successFunction, failedFunction, exceptionFunction) {
        doPostForJson(self, url, param, successFunction, failedFunction, exceptionFunction, true)
    }

};

/**
 * @Description : 发送GET请求
 * @Author : cheng fei
 * @CreateDate 2019/3/24 21:11
 * @Param self 当前页面对象 (必填)
 * @Param url 访问相对地址 (必填)
 * @Param param 请求参数 (必填)
 * @Param successFunction 成功回调函数
 * @Param failedFunction 失败回调函数
 * @Param exceptionFunction 异常回调函数
 * @Param showErrorMSg 是否显示返回的错误信息
 */
function doGet(self, url, param, successFunction, failedFunction, exceptionFunction, showErrorMSg) {
    if (showErrorMSg) {
        store.commit(types.OPEN_HTTP);
    }
    axios({
        method: 'GET',
        url:  getGetUrl(url, param),
        // 数据转换
        transformRequest: [
            function (data) {
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
                }
                // 去掉最后的空行
                ret = ret.slice(0, -1);
                return ret
            }
        ]
    }).then(response => {
        if (showErrorMSg) {
            store.commit(types.CLOSE_HTTP);
        }
        if (checkResponseData(response.data, showErrorMSg)) {
            if (typeof successFunction === "function") {
                successFunction(self, response.data)
            }
        }else {
            if (typeof failedFunction === "function") {
                failedFunction(self)
            }
        }

    }).catch(error => {
        if (typeof exceptionFunction === "function") {
            failedFunction(self)
        }
        if (showErrorMSg) {
            store.commit(types.CLOSE_HTTP);
        }
        if (store.getters.doHttp === 0){
            errorMsg(self, "服务器异常!");
        }
        errorMsg("服务器异常!");
        console.log(error);
    })
}

/**
 * @Description : 发送POST请求-表单方式
 * @Author : cheng fei
 * @CreateDate 2019/3/24 21:10
 * @Param self 当前页面对象 (必填)
 * @Param url 访问相对地址 (必填)
 * @Param param 请求参数 (必填)
 * @Param successFunction 成功回调函数
 * @Param failedFunction 失败回调函数
 * @Param exceptionFunction 异常回调函数
 * @Param showErrorMSg 是否显示返回的错误信息
 */
function doPostForForm(self, url, param, successFunction, failedFunction, exceptionFunction, showErrorMSg) {
    if (showErrorMSg) {
        store.commit(types.OPEN_HTTP);
    }
    axios({
        method: 'POST',
        url: url,
        data: param,
        // 数据转换
        transformRequest: [
            function (data) {
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&"
                }
                // 去掉最后的空行
                ret = ret.slice(0, -1);
                return ret
            }
        ]
    }).then(response => {
        if (showErrorMSg) {
            store.commit(types.CLOSE_HTTP);
        }
        if (checkResponseData(response.data, showErrorMSg)) {
            if (typeof successFunction === "function") {
                successFunction(self, response.data)
            }
        } else {
            if (typeof failedFunction === "function") {
                failedFunction(self)
            }
        }

    }).catch(error => {
        if (typeof exceptionFunction === "function") {
            exceptionFunction(error)
        }
        if (showErrorMSg) {
            store.commit(types.CLOSE_HTTP);
        }
        if (store.getters.doHttp === 0){
            errorMsg(self, "服务器异常!");
        }
        errorMsg("服务器异常!");
        console.log(error);
    });
}


/**
 * @Description : 发送POST请求-json方式
 * @Author : cheng fei
 * @CreateDate 2019/3/24 21:10
 * @Param self 当前页面对象 (必填)
 * @Param url 访问相对地址 (必填)
 * @Param param 请求参数 (必填)
 * @Param successFunction 成功回调函数
 * @Param failedFunction 失败回调函数
 * @Param exceptionFunction 异常回调函数
 * @Param showErrorMSg 是否显示返回的错误信息
 */
function doPostForJson(self, url, param, successFunction, failedFunction, exceptionFunction, showErrorMSg) {
    if (showErrorMSg) {
        store.commit(types.OPEN_HTTP);
    }
    axios({
        method: 'POST',
        url: url,
        data: param,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then(response => {
        if (showErrorMSg) {
            store.commit(types.CLOSE_HTTP);
        }
        if (checkResponseData(response.data, showErrorMSg)) {
            if (typeof successFunction === "function") {
                successFunction(self, response.data)
            }
        }else {
            if (typeof failedFunction === "function") {
                failedFunction(self)
            }
        }
    }).catch(error => {
        if (typeof exceptionFunction === "function") {
            exceptionFunction(error)
        }
        if (showErrorMSg) {
            store.commit(types.CLOSE_HTTP);
        }
        if (store.getters.doHttp === 0){
            errorMsg(self, "服务器异常!");
        }
        console.log(error);
    })
}

/**
 * @Description : 获取GET请求URL
 * @Author : cheng fei
 * @CreateDate 2019/3/24 15:36
 * @Param
 */
function getGetUrl(baseUrl, param) {
    let paramStr = "";
    if (param !== null && param !== undefined && param !== "") {
        for (var i in param){
            paramStr += (i + "=" + param[i] + "&")
        }

        if (paramStr.length > 0) {
            paramStr = "?" + paramStr.substring(0, paramStr.length - 1);
        }
    }

    return baseUrl + paramStr
}


/**
 * @Description : 检测请求返回数据
 * @Author : cheng fei
 * @CreateDate 2019/5/15 9:57
 * @param self
 * @param data
 * @param showErrorMSg
 * @returns {boolean}
 */
function checkResponseData(data, showErrorMSg, redirect) {
    if (!redirect) {
        redirect = router.currentRoute
    }
    if (!data) {
        gotoLogin(redirect);
        return false;
    } else if (data.status !== 200) {
        if (data.code === 10200){
            if (isAlertLoginOverTime()) {
                let token = getToken();
                if (!token) {
                    errorMsg("请先登录!")
                } else {
                    errorMsg("登陆超时，请重新登录！")
                }
                gotoLogin(redirect);
            }
            return false;
        } else if (data.code === 10201 || data.code === 10202 || data.code === 10203 || data.code === 10204) {
            if (isAlertLoginOverTime()) {
                errorMsg(data.msg);
                gotoLogin(redirect);
            }
            return false;
        } else {
            if (showErrorMSg) {
                errorMsg(data.msg)
            }
            return false;
        }
    }
    return true;
}

/**
 * @Description : 是否弹出登录超时弹框
 * @Author : cheng fei
 * @CreateDate 2019/5/17 17:30
 * @returns {boolean}
 */
function isAlertLoginOverTime() {
    if (store.getters.isAlertLoginOverTime) {
        store.commit(types.RECEIVE_IS_ALERT_LOGIN_OVER_TIME, false);
        return true;
    } else {
        return false;
    }
}

/**
 * @Description : 输出错误信息
 * @Author : cheng fei
 * @CreateDate 2019/3/24 20:55
 * @Param
 */
function errorMsg(msg) {
    Confirm(msg, '错误', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'error',
        showClose: true,
    }).then(() => {
    })
}

/**
 * @Description : 转跳登陆页面
 * @Author : cheng fei
 * @CreateDate 2019/5/13 17:54
 */
function gotoLogin(redirect) {
    if (!redirect) {
        redirect = router.currentRoute.fullPath
    }
    router.push({
        path: "/login",
        query: {redirect: redirect}
    });
}

export default http

/**
 * @Description :
 * @Author : cheng fei
 * @CreateDate 2019/5/22 17:50
 * @Param 检测请求返回数据
 */
export function checkHttpData(data, showErrorMSg, redirect){
    return checkResponseData(data, showErrorMSg, redirect)
}
