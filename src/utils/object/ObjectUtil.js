/**
 * @Description : 对象工具类
 * @Author : cheng fei
 * @CreateDate 2019/4/22 0:21
 */

import StringUtil from "../string/StringUtil"

const ObjectUtil = {

    /**
     * @Description : 判断对象是否为空
     * @Author : cheng fei
     * @CreateDate 2019/4/22 0:30
     * @Param obj obj
     * @Param isStrictNull 是否严格的为空(有属性值不为空, 默认为false)
     */
    isBlank: function (obj, isStrictNull) {
        if(StringUtil.isBlank(isStrictNull)){
            isStrictNull = false
        }
        return isBlank(obj, isStrictNull)
    },
    /**
     * @Description : 判断对象是否不为空
     * @Author : cheng fei
     * @CreateDate 2019/4/22 0:31
     * @Param obj obj
     * @Param isStrictNull 是否严格的为空(有属性值不为空, 默认为false)
     */
    isNotBlank(obj, isStrictNull) {
        if(StringUtil.isBlank(isStrictNull)){
            isStrictNull = false
        }
        return isNotBlank(obj, isStrictNull)
    }

};

/**
 * @Description : 判断对象是否为空
 * @Author : cheng fei
 * @CreateDate 2019/4/22 0:17
 * @Param obj obj
 * @Param isStrictNull 是否严格的为空(所有属性值都为空)
 */
function isBlank(obj, isStrictNull) {
    if (StringUtil.isBlank(obj)){
        return true;
    }
    let isNull = true;
    for (let attr in obj) {
        if (isStrictNull) {
            if (StringUtil.isNotBlank(obj[attr])) {
                isNull = false;
                break;
            }
        } else {
            return false;
        }
    }
    return isNull;
}

/**
 * @Description : 判断对象是否为空
 * @Author : cheng fei
 * @CreateDate 2019/4/22 0:18
 * @Param obj obj
 * @Param isStrictNull 是否严格的为空(有属性值不为空)
 */
function isNotBlank(obj, isStrictNull) {
    if (StringUtil.isBlank(obj)){
        return false;
    }
    let isNull = true;
    for (let attr in obj) {
        if (isStrictNull) {
            if (StringUtil.isNotBlank(obj[attr])) {
                isNull = false;
                break;
            }
        } else {
            return true;
        }
    }
    return !isNull;
}

export default ObjectUtil;
