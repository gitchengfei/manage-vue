import axios from "axios";
import cryptoJs from 'crypto-js'
import config from '../../config/Config'
import DateUtil from "../date/DateUtil";
import store from "../../store/index"
import Config from "../../config/Config"
import router from "../../router";

/**
 * @Description : 获取请求头
 * @Author : cheng fei
 * @CreateDate 2019/5/16 15:23
 * @returns {{overTime: *, sign: *, token: (token|string|getters.token|*|CancelToken)}}
 */
export function getHeaders(param){
    let overTime = config.overtime + DateUtil.getTimeStamp();
    let isPc = store.getters.isPc;
    const appKey = isPc ? config.appKey.PC : config.appKey.mobile;
    return {
        token : store.getters.token,
        overTime : overTime,
        sign : cryptoJs.MD5(overTime + appKey).toString()
    }
}

// 创建axios实例
const service = axios.create({
    //base_url
    baseURL: Config.serverUrl,
    // 请求超时时间
    timeout: Config.overtime
});

// request拦截器
service.interceptors.request.use(
    config => {
       let headers = getHeaders();
        // 添加请求头
        config.headers[Config.tokenHeader] = headers.token;
        config.headers[Config.overTimeHeader] = headers.overTime;
        config.headers[Config.signHeader] = headers.sign;
        return config;
    },
    error => {
        // Do something with request error
        Promise.reject(error);
    }
);

// respone拦截器
/*service.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.message) {
            MessageBox.confirm(error.message, '错误', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'error',
                showClose: true,
            }).then(() => {
            })
        } else {
            MessageBox.confirm("请求服务器错误！", '错误', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'error',
                showClose: true,
            }).then(() => {
            })
        }
        return Promise.reject(error);
    }
);*/


/**
 * @Description : 转跳登陆页面
 * @Author : cheng fei
 * @CreateDate 2019/5/13 17:54
 */
function gotoLogin() {
    router.push({
        path: "/login",
        query: {redirect: router.currentRoute.fullPath}
    });
}

export default service;
