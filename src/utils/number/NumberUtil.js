/**
 * @Description : 数字工具类
 * @Author : cheng fei
 * @CreateDate 2019/9/6 22:02
 */
const NumberUtil = {
    /**
     * @Description : 四舍五入保留2位小数（不够位数，则用0替补）
     * @Author : cheng fei
     * @CreateDate 2019/9/6 22:04
     * @param num
     * @return {string|boolean}
     */
    keepTwoDecimalFull(num) {
        let result = parseFloat(num);
        if (isNaN(result)) {
            return 0;
        }
        result = Math.round(num * 100) / 100;
        let s_x = result.toString();
        let pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    },
    /**
     * @Description : 收尾取整
     * @Author : cheng fei
     * @CreateDate 2019/9/7 0:46
     * @param num
     * @return {number}
     */
    toCeil : function (num) {
        return Math.ceil(num * Math.pow(10, num)) / Math.pow(10, num);
    },
    /**
     * @Description : 去尾取整
     * @Author : cheng fei
     * @CreateDate 2019/9/7 0:47
     * @param num
     * @return {number}
     */
    toFloor : function (num) {
        return Math.floor(num * Math.pow(10, num)) / Math.pow(10, num);
    },
    /**
     * @Description : 获取小数
     * @Author : cheng fei
     * @CreateDate 2019/9/8 23:30
     * @param num
     */
    formatFloat(num) {
        return isNaN(parseFloat(num)) ? 0.00 : parseFloat(num);
    }
};
export default NumberUtil;
