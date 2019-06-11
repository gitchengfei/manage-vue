import StringUtil from "../string/StringUtil"
/**
 * @Description : element表格行样式工具类
 * @Author : cheng fei
 * @CreateDate 2019/5/23 17:12
 */
export function tableRowClassName({row}) {
    if (StringUtil.isBlank(row) || StringUtil.isBlank(row.status)){
        return 'success-row';
    } else {
        if (row.status) {
            return 'success-row';
        } else {
            return 'warning-row';
        }
    }
}

/**
 * @Description : 根据文件是否使用显示样式
 * @Author : cheng fei
 * @CreateDate 2019/6/9 18:21
 * @param row
 * @returns {string}
 */
export function tableRowClassNameByFileUsed({row}) {
    if (StringUtil.isBlank(row) || StringUtil.isBlank(row.used)){
        return 'success-row';
    } else {
        if (row.used) {
            return 'success-row';
        } else {
            return 'warning-row';
        }
    }
}
