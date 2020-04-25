/**
 * @Description : 字符串工具类
 * @Author : cheng fei
 * @CreateDate 2019/3/29 21:15
 */

import ObjectUtil from "../object/ObjectUtil"

const stringUtil = {
    /**
     * @Description : 判断字符串为空
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:15
     * @Param value value
     */
    isBlank: function (value) {
        return isBlank(value)
    },
    /**
     * @Description : 判断字符串不为空
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:15
     * @Param value value
     */
    isNotBlank(value) {
        return isNotBlank(value)
    },
    /**
     * @Description : 格式化字符串
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:14
     * @Param value value
     */
    formatToString(value){
        if (isBlank(value)){
            return "-"
        }else {
            return value
        }
    },
    /**
     * @Description : 检测Boolean
     * @Author : cheng fei
     * @CreateDate 2020/2/3 12:06
     * @param value
     */
    checkBoolean(value) {
        if (value) {
            if (value === true || value === "true") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    /**
     * @Description : 格式化字符串(element表格字符串格式化)
     * @Author : cheng fei
     * @CreateDate 2019/4/21 23:53
     * @Param row 行数据
     * @Param column 列数据
     */
    formatByElementTable(row, column){
        let value = row;
        if (ObjectUtil.isBlank(row) || ObjectUtil.isBlank(column) || isBlank(column.property)){
            return "";
        }
        if (column.property.indexOf(".") !== -1) {
            let propertys = column.property.split(".");
            for (let i in propertys) {
                value = value[propertys[i]]
            }
        } else {
            value = row[column.property]
        }
        if (isBlank(value)){
            return "-"
        }else {
            return value
        }
    },
    /**
     * @Description : 格式化文件大小
     * @Author : cheng fei
     * @CreateDate 2019/6/10 18:06
     * @Param row 行数据
     * @Param column 列数据
     */
    formatFileSizeByElementTable (row, column) {
        console.log("row==>", row.size)
        return formatFileSize(row.size)
    },
    /**
     * @Description : 数据为空时提示信息
     * @Author : cheng fei
     * @CreateDate 2020/2/4 16:29
     * @param size
     */
    formatByElementTableEmptyText (pagePermission) {
        if (pagePermission) {
            return "暂无数据"
        } else {
            return "您无查看权限！"
        }
    }
};

/**
 * @Description :
 * @Author : cheng fei
 * @CreateDate 2019/6/10 18:52
 */
function formatFileSize(size) {
    try {
        size = parseInt(size)
        size = size /1024
        if (size /1024 < 1) {
            return size.toFixed(2) + "KB";
        } else {
            return (size / 1024).toFixed(2) + 'MB';
        }
    } catch (e) {
        console.log("e==>", e);
        return "-";
    }
}

/**
 * @Description : 判断字符串是否为空
 * @Author : cheng fei
 * @CreateDate 2019/4/22 0:11
 * @Param
 */
function isBlank(value) {
    return (value === null || value === undefined || value === "")
}
/**
 * @Description : 判断字符串是否不为空
 * @Author : cheng fei
 * @CreateDate 2019/4/22 0:12
 * @Param
 */
function isNotBlank(value) {
    return !(value === null || value === undefined || value === "")
}
export default  stringUtil
