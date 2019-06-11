/**
 * @Description : 字符串补零
 * @Author : cheng fei
 * @CreateDate 2019/3/24 15:05
 * @Param
 */
const ZeroPadding = {
    left: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.left("0" + str, length);
    },
    right: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.right(str + "0", length);
    }
};

export default ZeroPadding
