/**
 * @Description : 阿里云OSS工具
 * @Author : cheng fei
 * @CreateDate 2019/6/1 21:11
 */

import OSS from 'ali-oss'
import { Message } from 'element-ui';
import {Aliyun} from "../../../config/AliyunConfig"
import FILE_CONSTANT from "../../../config/FileConstant"
import {createUUID} from '../../UUID/UUIDUtil'
import axios  from "../../http/axios"
import { checkHttpData } from "../../http/Http"
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import DateUtil from "../../date/DateUtil";

/**
 * @Description : 上传文件至OSS
 * @Author : cheng fei
 * @CreateDate 2019/6/1 21:40
 * @param option
 * @param newFileName
 * @param meta
 * @returns {Promise<*|*|*>}
 */
async function uploadToOSS(option, newFileName, meta) {



}

/**
 * @Description : 删除OSS上文件
 * @Author : cheng fei
 * @CreateDate 2019/6/1 21:41
 */
function deleteOSSFile (uploadFileName) {
    try {
        let client = new OSS(Aliyun.OSS);
        client.delete(uploadFileName);
    } catch (e) {
        console.log(e);
    }
}


/**
 * @Description : 保存文件到数据库
 * @Author : cheng fei
 * @CreateDate 2019/6/1 21:54
 * @param option
 * @param uploadFileName
 * @returns {Promise<*>}
 */
async function saveFile(option, uploadFileName) {
    const url = "file/save";
    const params = {
        uploadFileName: uploadFileName
    };
    const response = await axios({
        method: 'POST',
        url: url,
        data: params,
        // 数据转换
        transformRequest: [
            function (data) {
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&"
                }
                // 去掉最后的空行
                ret = ret.slice(0, -1);
                return ret
            }
        ]
    });
    const data = response.data;
    if (data && data.status != 200) {
        option.onError('上传失败');
        deleteOSSFile(uploadFileName)
        checkHttpData(data, false)
    } else {
        return data.data;
    }


}


/**
 * @Description : 用element upload组件上传主键上传文件至OSS
 * @Author : cheng fei
 * @CreateDate 2019/6/1 21:15
 * @param option element 组件参数
 * @param type 类型(数据字典定义的文件类型)
 * @param filePurpose 文件用途(数据字典中定于的文件用途)
 * @param time
 * @returns {Promise<void>}
 */
export async function uploadOSSByElement(option) {
    store.commit(types.OPEN_HTTP, "上传中,请稍后...");
    try {
        const file = option.file;
        const fileName = file.name;
        const point = fileName.lastIndexOf('.');
        const suffix = fileName.substr(point);
        const newFileName = createUUID() + suffix;
        const date = DateUtil.getDate().replace(/-/g, "/");
        const  meta = {
            fileName : encodeURI(fileName),
            path: date + '/' + newFileName,
            fileExtension: suffix.substr(1),
            fileType: file.type,
            type : option.data && option.data.fileConstant ? option.data.fileConstant : "",
            filePurpose :  option.data && option.data.filePurpose ? option.data.filePurpose : "",
            size: file.size,
            time: option.data && option.data.time ? option.data.time : "",
        };
        // 获取OSS连接
        let client = new OSS(Aliyun.OSS);
        // 分片上传文件
        let ret = null;
        try {
            ret =  await client.multipartUpload(
                date + '/' + newFileName,
                file,
                {
                    progress: async function (p) {
                        let e = {};
                        e.percent = p * 100;
                        option.onProgress(e)
                    },
                    meta: meta,
                }
            );
            store.commit(types.CLOSE_HTTP);
        }catch (e) {
            console.log("error==>", e);
            store.commit(types.CLOSE_HTTP);
            if (e && e.code === 'ConnectionTimeoutError') {
                option.onError("上传超时!");
            } else {
                option.onError("上传失败!");
            }
        }
        if (ret && ret.res.statusCode === 200) {
            //将上传后结果上传至后台
            try {
                return await saveFile(option, date + '/' +newFileName);
            } catch (e) {
                console.log("error==>", e);
                deleteOSSFile(date + '/' +newFileName)
            }
        } else {
            option.onError('上传失败')
        }
    } catch (error) {
        console.log("error==>", error);
        option.onError('上传失败');
    }
}

/**
 * @Description : 上传失败函数,提示失败信息
 * @Author : cheng fei
 * @CreateDate 2019/6/1 22:26
 * @param err
 * @param file
 * @param fileList
 */
export function onUploadError(err, file, fileList){
    Message.error(err)
}


/**
 * @Description : 上传文件
 * @Author : cheng fei
 * @CreateDate 2020/1/31 13:18
 * @param option 上传参数
 * @param fileConstant 文件类型
 * @param filePurpose 文件用途
 * @return {Promise<void>}
 */
export async function uploadByFile(option) {
    return await uploadOSSByElement(option)
}
