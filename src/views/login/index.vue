<template>
    <div class="login-container">
        <el-form class="card-box login-form" autoComplete="on" :model="ruleForm" :rules="rules" ref="ruleForm"
                 label-position="left">
            <h3 class="title">XXX后台管理系统登录</h3>
            <el-form-item prop="username" class="item">
                <el-input
                    placeholder="用户名/手机号/邮箱"
                    name="username"
                    autoComplete="on"
                    v-model="ruleForm.username">
                    <i slot="prefix" class="el-input__icon">
                        <span class="iconfont iconzhanghaoguanli"></span>
                    </i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" class="item">
                <el-input
                    placeholder="密码"
                    name="password" :type="isShowPwd ? 'text' : 'password'"
                    @keyup.enter.native="handleLogin"
                    v-model="ruleForm.password"
                    autoComplete="on">
                    <i slot="prefix" class="el-input__icon">
                        <span class="iconfont iconmima"></span>
                    </i>
                    <i slot="suffix" class="el-input__icon" @click='isShowPwd = !isShowPwd'>
                        <span class="iconfont iconkejian" v-if="!isShowPwd"></span>
                        <span class="iconfont iconbukejian" v-else></span>
                    </i>
                </el-input>

            </el-form-item>
            <el-form-item prop="verificationCode" class="item">
                <el-input
                    placeholder="验证码"
                    name="verificationCode" type="text"
                    @keyup.enter.native="handleLogin"
                    v-model="ruleForm.verificationCode"
                    autoComplete="on"
                    maxlength="4">
                    <i slot="prefix" class="el-input__icon">
                        <span class="iconfont iconyanzhengma"></span>
                    </i>
                </el-input>
                <img style="width: 70px" id="code_img" @click="changeCode()" src="" title="点击更换">
            </el-form-item>
            <input type="hidden" name="key" v-model="ruleForm.key"/>
            <div>
                <el-button style="width:100%;margin-bottom:30px;" @click="handleLogin()">登录</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import { createUUID } from "../../utils/UUID/UUIDUtil";
    import getLoginParam from "../../utils/login/LoginParamUtil";


    export default {
        data() {
            let validatePwd = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入密码"));
                } else {
                    callback();
                }
            };
            return {
                //加载中参数
                loadingOptions: {
                    target: document.getElementById("login_loading"),
                    text: "登陆中,请稍后...",
                    lock: true,
                    background: "rgba(0, 0, 0, 0.5)",
                },
                //登陆参数
                ruleForm: {
                    username: "",
                    password: "",
                    verificationCode: "",
                    key: "",
                    checked: true
                },
                //登陆表单验证
                rules: {
                    username: [
                        {required: true, message: "请输入登录名", trigger: "blur"}
                    ],
                    password: [
                        {validator: validatePwd, trigger: "blur"}
                    ],
                    verificationCode: [
                        {required: true, message: "请输入验证码", trigger: "blur"}
                    ]

                },
                // 是否显示密码
                isShowPwd: false,
                // 回调地址
                redirect: null
            };
        },
        methods: {
            /**
             * @Description : 切换验证码
             * @Author : cheng fei
             * @CreateDate 2019/3/24 12:08
             */
            changeCode: function () {
                let img = document.getElementById("code_img");
                this.ruleForm.key = createUUID();
                img.src = this.$Config.serverUrl + "system/verification/code?key=" + this.ruleForm.key + "&t=" + this.$DateUtil.getTimeStamp()
            },
            /**
             * @Description : 保存token
             * @Author : cheng fei
             * @CreateDate 2019/3/26 0:13
             * @Param
             */
            saveToken(token){
                TokenUtil.saveToke(token);
            },
            /**
             * @Description : 登陆
             * @Author : cheng fei
             * @CreateDate 2019/3/24 14:51
             */
            handleLogin() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        //获取登陆参数
                        let loginParam = getLoginParam(this.ruleForm.username, this.ruleForm.password, this.ruleForm.key, this.ruleForm.verificationCode);
                        //登陆
                        this.$Http.doPostForForm(
                            this,
                            "system/login",
                            loginParam,
                            function (self, data) {
                                self.$store.commit(self.$Types.RECEIVE_ACCOUNT_INFO, data.data);
                                self.$router.push({
                                    path: "/"
                                });

                            },
                            function (self) {
                                self.changeCode();
                            }
                        );
                    } else {
                        return false;
                    }
                });
            },

        },
        created() {
            // 将参数拷贝进查询对象
            let query = this.$route.query;
            if (query.redirect) {
                // URL Encode
                this.redirect = decodeURIComponent(query.redirect);
            }
        },
        mounted() {
            //加载验证码
            this.changeCode();

        }
    };
</script>

<style type="text/scss" lang="scss">
    @import "../../styles/mixin";

    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    .login-container {
        @include relative;
        height: 100%;
        background-color: $bg;
        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        .item {
            .el-form-item__content {
                display: flex;
                flex-flow: row;
            }
        }
        input {
            background: transparent;
            border: 0;
            -webkit-appearance: none;
            border-radius: 0;
            padding: 0.46rem 0.0666rem 0.16rem 0.2rem;
            color: $light_gray;
            height: 100%;
        }
        .el-input {
            display: inline-block;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 0.13333rem;
        }
        .svg-container {
            padding: 0.08rem 0.0666rem 0.08rem 0.2rem;
            color: $dark_gray;
            vertical-align: middle;
            display: inline-block;
            &_login {
                font-size: 20px;
            }
        }
        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0 auto 0.5333rem auto;
            text-align: center;
            font-weight: bold;
        }
        .login-form {
            @include fxied-center;
            top: 40%;
            width: 22em;
            padding: 0.4666rem 0.4666rem 0.2rem 0.4666rem;
        }
        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 0.0666rem;
            color: #454545;
        }
        .show-pwd {
            position: absolute;
            right: 0.1333rem;
            top: 0.09333rem;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
        }
        .thirdparty-button {
            /*position: absolute;*/
            /*right: .4666rem;*/
            /*bottom: .37333rem;*/
        }
    }
</style>
