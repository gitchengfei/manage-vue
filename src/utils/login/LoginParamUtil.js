/**
 * @Description : 登陆参数处理工具
 * @Author : cheng fei
 * @CreateDate 2019/3/24 21:35
 */


import store from "../../store/index";
import Config from "../../config/Config"
import ZeroPadding from "./ZeroPadding";
import PasswordUtil from "../passwrod/PasswordUtil";
import Base64 from "./Base64";
import cryptojS from "crypto-js";

/**
 * @Description : 获取登陆参数
 * @Author : cheng fei
 * @CreateDate 2019/3/24 21:46
 * @Param username 用户名
 * @Param password 密码
 * @Param key 验证码key
 * @Param verificationCode 验证码
 */
const getLoginParam = function(username, password, key, verificationCode){

    // 对账号密码进行加密
    const strRandomIV = randomKey(16);
    const iv = cryptojS.enc.Utf8.parse(strRandomIV);
    const isPc = store.getters.isPc;
    const appKey = isPc ? Config.appKey.PC : Config.appKey.mobile;
    const md5Password = PasswordUtil.getPasswordByMD5(password, username);
    let strAesEncrypted = cryptojS.AES.encrypt(appKey, md5Password, {
        iv: iv,
        mode: cryptojS.mode.CBC,
        padding: cryptojS.pad.ZeroPadding
    });
    let strUserNameLength = ZeroPadding.left(username.length, 3);
    let md5_data = Base64.encode(strRandomIV + strUserNameLength + strAesEncrypted + username);
    return {
        data : md5_data,
        key : key,
        code : verificationCode
    };
};

/**
 * @Description : 获取指定长度的随机字符串
 * @Author : cheng fei
 * @CreateDate 2019/3/24 14:55
 * @Param length 随机字符串长度
 */
function randomKey(length) {
    var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789";
    var s = "";
    for (var i = 0; i < length; i++) {
        s += chars.charAt(Math.ceil(Math.random() * 1000) % chars.length);
    }
    return s;
}

export default getLoginParam
