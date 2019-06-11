/**
 * @Description : 密码处理工具
 * @Author : cheng fei
 * @CreateDate 2019/5/4 13:05
 */
import Base64 from "@/utils/login/Base64";
import cryptojS from "crypto-js";

const PasswordUtil = {
    /**
     * @Description : 加密密码
     * @Author : cheng fei
     * @CreateDate 2019/5/4 13:08
     */
    getPasswordByBase64 : function(password, username) {
        for (let i = 0; i < username.length; i++) {
            password = Base64.encode(password);
        }
        return password;
    },
    /**
     * @Description : 加密密码
     * @Author : cheng fei
     * @CreateDate 2019/5/4 13:09
     */
    getPasswordByMD5 : function(password, username) {
        for (let i = 0; i < username.length; i++) {
            password = cryptojS.enc.Utf8.parse(
                cryptojS.MD5(password).toString()
            );
        }
        return password;
    },
};
export default PasswordUtil;
