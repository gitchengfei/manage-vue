import Config from "../../config/Config"
import store from "../../store/index";
import * as types from "../../store/mutation-types";
/**
 * @Description : 判断是否是PC端
 * @Author : cheng fei
 * @CreateDate 2019/5/26 20:52
 * @returns {boolean}
 * @constructor
 */
export function isPC() {
    const isPc = store.getters.isPc;
    if (isPc === "") {
        const userAgentInfo = navigator.userAgent;
        const Agents = Config.MobileTerminalSystem;
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        store.commit(types.IS_PC, flag);
        return flag;
    } else {
        return isPc;
    }
}
