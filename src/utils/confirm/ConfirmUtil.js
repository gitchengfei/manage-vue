/**
 * @Description : element 弹框封装(解决移动端显示异常问题)
 * @Author : cheng fei
 * @CreateDate 2019/5/29 14:43
 */
import { MessageBox } from 'element-ui';
import { isPC } from  '../system/SystemUtil'

export function Confirm(message , title, options) {
    let box =  MessageBox.confirm(message, title, options);
    if (!isPC()) {
        document.getElementsByClassName("el-message-box")[0].style.width = '90%';
    }
    return box;
}
