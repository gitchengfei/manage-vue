/**
 * @Description : 账号信息工具
 * @Author : cheng fei
 * @CreateDate 2019/5/9 14:27
 */

import { getSessionStorage, setSessionStorage, removeSessionStorage } from '../session_storage_util/SessionStorageUtil'

const accountInfoKey = "ACCOUNT-INFO";

/**
 * @Description : 获取登陆token
 * @Author : cheng fei
 * @CreateDate 2019/5/9 15:08
 */
export function getToken() {
    const accountInfo = getSessionStorage(accountInfoKey);
    if (accountInfo){
        return accountInfo.token;
    }
    return "";
}


/**
 * @Description : 获取当前登陆账号的用户名
 * @Author : cheng fei
 * @CreateDate 2019/5/9 15:17
 */
export function getAccountUsername() {
    const accountInfo = getSessionStorage(accountInfoKey);
    if (accountInfo){
        return accountInfo.account.username;
    }
    return "";
}


/**
 * @Description : 获取当前登陆账号Id
 * @Author : cheng fei
 * @CreateDate 2019/5/9 15:19
 */
export function getAccountId() {
    const accountInfo = getSessionStorage(accountInfoKey);
    if (accountInfo){
        if (accountInfo.account){
            return accountInfo.account.id;
        }
    }
    return "";
}


/**
 * @Description : 获取当前登陆账号的姓名
 * @Author : cheng fei
 * @CreateDate 2019/5/9 15:17
 */
export function getAccountName() {
    const accountInfo = getSessionStorage(accountInfoKey);
    if (accountInfo){
        if (accountInfo.account){
            return accountInfo.account.name;
        }
    }
    return "";
}

/**
 * @Description : 获取账号头像
 * @Author : cheng fei
 * @CreateDate 2019/6/2 12:33
 * @returns {*}
 */
export function getHeadPortrait() {
    const accountInfo = getSessionStorage(accountInfoKey);
    if (accountInfo){
        return accountInfo.headPortraitUrl;
    }
    return "";
}

/**
 * @Description : 获取登陆账号信息
 * @Author : cheng fei
 * @CreateDate 2019/5/9 14:28
 */
export function getAccountInfo() {
    return getSessionStorage(accountInfoKey);
}

/**
 * @Description : 设置账号信息
 * @Author : cheng fei
 * @CreateDate 2019/5/9 14:29
 */
export function setAccountInfo(accountInfo) {
    return setSessionStorage(accountInfoKey, accountInfo);
}

/**
 * @Description : 删除
 * @Author : cheng fei
 * @CreateDate 2019/5/9 15:06
 */
export function removeAccountInfo() {
    return removeSessionStorage(accountInfoKey);
}

/**
 * 修改头像
 */
export function updateHeadPortrait(headPortrait) {
   let accountInfo = getAccountInfo();
   accountInfo.headPortraitUrl = headPortrait;
   setAccountInfo(accountInfo)
}
