/**
 * @Description : 数据字典公用接口
 * @Author : cheng fei
 * @CreateDate 2019/6/4 12:09
 */
import axios from "../../http/axios"
import {checkHttpData} from "../../http/Http"
import HTTP from "../../http/Http"
import store from "../../../store";
import * as types from "../../../store/mutation-types";

/**
 * @Description : 同步获取数据字典下拉列表
 * @Author : cheng fei
 * @CreateDate 2019/6/4 12:09
 * @param parentKey 父节点固定编码
 */
export async function getDictionarySelectBySync(parentKey) {
    if (!parentKey) {
        return []
    }
    store.commit(types.OPEN_HTTP);
    const response = await axios({
        url: "system/dictionary/select",
        method: "POST",
        params: {parentKey: parentKey},
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
    });
    store.commit(types.CLOSE_HTTP);
    checkHttpData(response.data, true)
    return response.data.data
}

/**
 * @Description : 异步获取数据字典下拉列表
 * @Author : cheng fei
 * @CreateDate 2019/6/4 12:09
 * @param parentKey 父节点固定编码
 * @param self 当前vue对象
 * @param successFunction 成功回调函数
 * @param failedFunction 失败回调函数
 * @param exceptionFunction 异常回调函数
 */
export function getDictionarySelectByAsync(parentKey, self, successFunction, failedFunction, exceptionFunction,) {
    if (!parentKey) {
        return []
    }
    HTTP.doPostForForm(self, "system/dictionary/select", {parentKey : parentKey}, successFunction, failedFunction, exceptionFunction)
}
