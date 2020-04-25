<template>
    <div>
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="openDialog = true">{{getButtonMsg}}</el-button>
        <el-dialog :title="dialogTitle" :visible.sync="openDialog" :width="isPc ? '40%' : '80%'" top="10vh" append-to-body>
            <el-upload
                action=""
                :http-request="uploadOSSByElement"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :file-list = images
                :data="{
                    fileConstant : fileConstant,
                    filePurpose :filePurpose,
                }"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove" :disabled="disabled">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="openDialog = false">取消</el-button>
                <el-button type="primary" @click.native="close()">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {uploadOSSByElement} from "../../utils/file/upload/Upload"
    export default {
        name: "imgUpload",
        data () {
            return{
                uploadOSSByElement : uploadOSSByElement,
                //是否打开图片编辑弹窗
                openDialog : false,
                //显示图片地址
                dialogImageUrl: '',
                //显示图片弹窗
                dialogVisible: false,
                //文件列表
                files : [],
            }
        },
        props : {
            //图片列表
            images : {
                type : Array,
                default : [],
            },
            buttonTitle : {
                type: String,
                default: "",
            },
            dialogTitle : {
                type: String,
                default: "",
            },
            fileConstant : {
                type: String,
                default: "",
            },
            filePurpose : {
                type: String,
                default: "",
            },
            isPc : {
                type : Boolean,
                default : true
            },
            disabled : {
                type : Boolean,
                default : false
            }
        },
        computed : {
            /**
             * @Description : 获取按钮描述信息
             * @Author : cheng fei
             * @CreateDate 2020/1/31 10:27
             */
            getButtonMsg () {
                if (null == this.images || this.images.length === 0) {
                    return "上传" + this.buttonTitle;
                } else {

                    return (this.disabled ? "查看" : "编辑") + this.buttonTitle;
                }
            }
        },
        mounted () {
            if (this.images && this.images.length > 0) {
                this.images.forEach(img => {
                    this.files.push({
                        id : img.id,
                        name : img.name,
                        url : img.url,
                    })
                });
            }
        },
        methods : {
            /**
             * @Description : 关闭弹窗
             * @Author : cheng fei
             * @CreateDate 2020/2/1 13:01
             */
            close() {
                this.openDialog = false;
                this.$emit('closeCallback', this.files);
            },
            /**
             * @Description : 上传前方法
             * @Author : cheng fei
             * @CreateDate 2020/1/31 11:29
             */
            beforeAvatarUpload(file) {
                const isImg = (file.type).indexOf("image/") !== -1;
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isImg) {
                    this.$message.error('请上传图片！');
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!');
                }
                return isImg && isLt10M;
            },
            /**
             * @Description : 上传成功回调
             * @Author : cheng fei
             * @CreateDate 2020/1/31 11:29
             */
            handleAvatarSuccess (res, file) {
                this.files.push({
                    id : res.id,
                    name : res.fileName,
                    url : res.path,
                });
            },
            /**
             * @Description : 删除图片
             * @Author : cheng fei
             * @CreateDate 2020/1/31 11:18
             * @param file
             * @param fileList
             */
            handleRemove(file, fileList) {
               if (fileList && fileList.length > 0) {
                   if (this.files && this.files.length > 0) {
                       let index = -1;
                       for(let i in this.files) {
                           let isContinue = false;
                           for(let j in fileList) {
                               if (this.files[i].id === fileList[j].id) {
                                   isContinue = true;
                                   continue;
                               }
                           }
                           if (isContinue) {
                               continue;
                           } else {
                               index = i;
                               break;
                           }
                       }
                       if (index > -1) {
                           this.files.splice(index, 1)
                       }
                   }
               } else {
                   this.files = null;
               }
            },
            /**
             * @Description : 放大图片
             * @Author : cheng fei
             * @CreateDate 2020/1/31 11:19
             * @param file
             */
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>
