
/** 
 * @Description : sessionStorage 操作工具
 * @Author : cheng fei 
 * @CreateDate 2019/5/9 10:14
 */ 


/** 
 * @Description : 设置sessionStorage
 * @Author : cheng fei 
 * @CreateDate 2019/5/9 10:15
 */
export const setSessionStorage = (key, value) => {
    if (!key) return;
    if (typeof value !== "string") {
        value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value)
};

/**
 * @Description : 获取sessionStorage
 * @Author : cheng fei
 * @CreateDate 2019/5/9 14:31
 */
export const getSessionStorage = key => {
    if (!key) return;
    let value = sessionStorage.getItem(key);
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

/**
 * @Description : 删除sessionStorage
 * @Author : cheng fei
 * @CreateDate 2019/5/9 14:31
 */
export const removeSessionStorage = key => {
    if (!key) return;
    sessionStorage.removeItem(key);
};
