
/**
 * @Description : localStorage 操作工具
 * @Author : cheng fei
 * @CreateDate 2019/5/9 10:14
 */


/**
 * @Description : 设置localStorage
 * @Author : cheng fei
 * @CreateDate 2019/5/9 10:15
 */
export const setLocalStorage = (key, value) => {
    if (!key) return;
    if (typeof value !== "string") {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value)
    
};

/**
 * @Description : 获取localStorage
 * @Author : cheng fei
 * @CreateDate 2019/5/9 14:31
 */
export const getLocalStorage = key => {
    if (!key) return;
    let value = localStorage.getItem(key);
    try {
        value = JSON.parse(value);
        return value;
    } catch (e) {
        return value;
    }
};

/**
 * @Description : 删除localStorage
 * @Author : cheng fei
 * @CreateDate 2019/5/9 14:31
 */
export const removeLocalStorage = key => {
    if (!key) return;
    localStorage.removeItem(key);
};
