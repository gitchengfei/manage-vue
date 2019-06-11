/**
 * @Description : 文件下载工具
 * @Author : cheng fei
 * @CreateDate 2019/6/5 12:50
 */
import Config from "../../../config/Config"
import {getHeaders} from "../../http/axios"

/**
 * @Description : 不弹窗下载
 * @Author : cheng fei
 * @CreateDate 2019/6/5 12:59
 * @param url
 * @param iframeId iframe标签Id
 */
export function downFile(url, iframeId) {
    if (!iframeId) {
        iframeId = "download_iframe"
    }

    const iframe = document.getElementById(iframeId);
    if (iframe != null) {
        iframe.remove()
    }
    const header = getHeaders();
    if (url.lastIndexOf('?' > -1)) {
        url = url + "&"
    } else {
        url = url + "?"
    }
    url = url + Config.tokenHeader + "=" + header.token + "&" + Config.overTimeHeader + "=" + header.overTime + "&" + Config.signHeader + "=" + header.sign;
    try {
        const elemIF = document.createElement("iframe");
        elemIF.id = iframeId;
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {
        console.log(e)
    }
}
