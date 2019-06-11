
import Object from "@/utils/object/ObjectUtil"
import stringUtil from "../string/StringUtil";
/**
 * @Description : 时间工具
 * @Author : cheng fei
 * @CreateDate 2019/3/24 12:42
 * @Param
 */
const DateUtil = {

    /**
     * @Description : 获取当前时间戳
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:16
     */
    getTimeStamp: function () {
        return getTimeStamp();
    },

    /**
     * @Description : 获取当前时间 年月日-时分秒
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:16
     * @Param
     */
    getDateTime: function () {
        return getDate(true);
    },
    /**
     * @Description : 获取时间-年月日
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:20
     * @Param
     */
    getDate : function(){
        return getDate(false);
    },
    /**
     * @Description : 格式化时间戳-年月日-时分秒
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:22
     * @Param value value
     * @Param isIncludeTime 是否包含时间(默认true)
     * @Param isReturnNull 为空时,是否返回空串(默认false)
     */
    formatDateTimeForTimestamp : function (value, isIncludeTime, isReturnNull) {
        isIncludeTime = isIncludeTime ? true : isIncludeTime;
        isReturnNull ? false : isReturnNull

        if (!value) {
            if (isReturnNull) {
                return "";
            } else {
                return "-";
            }
        }

        return formatDate(value, isIncludeTime)
    },
    /**
     * @Description : 格式化表格日期(element表格)
     * @Author : cheng fei
     * @CreateDate 2019/4/21 23:56
     * @Param row 行数据
     * @Param column 列数据
     */
    formatByElementTable(row, column) {
        let value = row;
        if (column.property.indexOf(".") !== -1) {
            let propertys = column.property.split(".")
            for (let i in propertys) {
                value = value[propertys[i]]
            }
        } else {
            value = row[column.property]
        }

        if (stringUtil.isBlank(value)){
            return "-";
        }

        return formatDate(value, true);
    },
    /**
     * @Description : 格式化时间为时间戳
     * @Author : cheng fei
     * @CreateDate 2019/4/3 2:39
     * @Param value value
     */
    formatTimestampForDateTime : function(value){
        if (stringUtil.isBlank(value)) {
            return "";
        }
        let date = new Date(value);
        return date.getTime();
    }

};



/**
 * @Description : 获取当前时间
 * @Author : cheng fei
 * @CreateDate 2019/3/24 15:55
 * @param includeTime 是否包含时分秒
 */
function getDate(includeTime) {
    let date = new Date();
    let sign1 = '-';
    let sign2 = ':';
    // 年
    let year = date.getFullYear();
    // 月
    let month = date.getMonth() + 1;
    // 日
    let day = date.getDate();

    // 给一位数数据前面加 “0”
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (day >= 0 && day <= 9) {
        day = '0' + day
    }

    if (includeTime){
        // 时
        let hour = date.getHours();
        // 分
        let minutes = date.getMinutes();
        // 秒
        let seconds = date.getSeconds();

        if (hour >= 0 && hour <= 9) {
            hour = '0' + hour
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = '0' + minutes
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = '0' + seconds
        }
        return year + sign1 + month + sign1 + day + ' ' + hour + sign2 + minutes + sign2 + seconds
    } else {
        return year + sign1 + month + sign1 + day
    }
}

/**
 * @Description : 格式化时间
 * @Author : cheng fei
 * @CreateDate 2019/3/29 21:29
 * @Param
 */
function formatDate(value, includeTime) {
    let date = new Date(value);
    let sign1 = '-';
    let sign2 = ':';
    // 年
    let year = date.getFullYear();
    // 月
    let month = date.getMonth() + 1;
    // 日
    let day = date.getDate();

    // 给一位数数据前面加 “0”
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (day >= 0 && day <= 9) {
        day = '0' + day
    }

    if (includeTime){
        // 时
        let hour = date.getHours();
        // 分
        let minutes = date.getMinutes();
        // 秒
        let seconds = date.getSeconds();

        if (hour >= 0 && hour <= 9) {
            hour = '0' + hour
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = '0' + minutes
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = '0' + seconds
        }
        return year + sign1 + month + sign1 + day + ' ' + hour + sign2 + minutes + sign2 + seconds
    } else {
        return year + sign1 + month + sign1 + day
    }
}


/**
 * @Description : 获取当前时间戳
 * @Author : cheng fei
 * @CreateDate 2019/3/24 21:31
 * @Param
 */
function getTimeStamp (){
    let time = new Date();
    return time.getTime();
}

export default DateUtil;

