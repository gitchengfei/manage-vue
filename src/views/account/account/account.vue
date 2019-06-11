<template>
    <div>
        <!-- 数据列表 -->
        <div>
            <!-- 移动端 -->
            <div v-if="!isPc">
                <el-collapse v-model="activeName" accordion>
                    <!-- 筛选条件 -->
                    <el-collapse-item name="1">
                        <template slot="title">
                            <span style="padding-left: 5px;font-size: 2vh;">数据筛选</span>
                        </template>
                        <el-form label-position="left" inline class="demo-table-expand" style="margin-left: 7vw">
                            <el-form-item label="用户名：" size="mini">
                                <el-input v-model="query.username" placeholder="请输入用户名" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="姓名：" size="mini">
                                <el-input v-model="query.name" placeholder="请输入姓名" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="手机号：" size="mini">
                                <el-input v-model="query.phone" placeholder="请输入手机号" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱：" size="mini">
                                <el-input v-model="query.email" placeholder="请输入邮箱" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="角色：" size="mini">
                                <el-select v-model="query.roleId" placeholder="请选择">
                                    <el-option value="" label="全部"></el-option>
                                    <el-option
                                        v-for="item in roleCheckboxData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="每页显示记录数：" size="mini">
                                <el-select v-model="pageSize" placeholder="请选择" style="width: 20vw">
                                    <el-option value=3 label=3></el-option>
                                    <el-option value=5 label=5></el-option>
                                    <el-option value=10  label=10></el-option>
                                    <el-option value=15  label=15></el-option>
                                    <el-option value=20  label=20></el-option>
                                    <el-option value=50  label=50></el-option>
                                </el-select>
                            </el-form-item>
                            <el-button type="primary" size="small" @click="doSearch()"
                                       style="margin-left: 1vw;">查询
                            </el-button>
                        </el-form>
                    </el-collapse-item>

                    <!-- 数据列表 -->
                    <el-collapse-item name="2">
                        <template slot="title">
                            <span style="padding-left: 5px;font-size: 2vh">数据列表</span>
                        </template>
                        <el-table :data="accountList" :show-header="false" border :border="true"
                                  :row-class-name="$TableRowClassName" :empty-text="emptyText">
                            <el-table-column>
                                <template slot-scope="props">
                                    <el-form label-position="left" inline class="demo-table-expand">
                                        <el-form-item label="用户名：" size="mini">
                                            <span>{{ props.row.username }}</span>
                                        </el-form-item>
                                        <el-form-item label="姓名：" size="mini">
                                            <span>{{ props.row.name }}</span>
                                        </el-form-item>
                                        <el-form-item label="角色：" size="mini">
                                            <p v-for="role in props.row.roles"><span>{{ role.name }}</span></p>
                                        </el-form-item>
                                        <p>
                                            <el-form-item label="状态：">
                                                <el-switch
                                                    v-model="props.row.status"
                                                    active-color="#13ce66"
                                                    inactive-color="#ff4949"
                                                    :disabled="disabledButton(props.row.username) || !pagePermission.AccountAccountUpdateStatus"
                                                    @change="updateAccountStatus(props.row)">
                                                </el-switch>
                                            </el-form-item>
                                        </p>
                                        <el-collapse-transition>
                                            <div class="transition-box" v-show="props.row.showMore">
                                                <el-form-item label="手机号：" size="mini">
                                                    <span>{{ props.row.phone ? props.row.phone : '-' }}</span>
                                                </el-form-item>
                                                <el-form-item label="邮箱：" size="mini">
                                                    <span>{{ props.row.email ? props.row.email : '-' }}</span>
                                                </el-form-item>
                                                <p>
                                                    <el-form-item label="创建人：" size="mini">
                                                        <span>{{ props.row.createName ? props.row.createName : '-' }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="创建时间：" size="mini">
                                                        <span>{{ props.row.createTime ? $DateUtil.getDateTime(props.row.createTime) : '-' }}</span>
                                                    </el-form-item>
                                                </p>
                                                <p>
                                                    <el-form-item label="修改人：" size="mini">
                                                        <span>{{ props.row.updateName ? props.row.updateName : '-' }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="修改时间：" size="mini">
                                                        <span>{{ props.row.updateTime ? $DateUtil.getDateTime(props.row.updateTime) : '-' }}</span>
                                                    </el-form-item>
                                                </p>

                                            </div>
                                        </el-collapse-transition>
                                        <p>
                                            <el-form-item size="mini">
                                                <el-button type="text" size="small"
                                                           @click="openOrCloseAccountWindow(true)"
                                                           style="margin-left: 1vw;"
                                                           v-if="pagePermission.AccountAccountSave">新增账号
                                                </el-button>
                                                <el-button type="text" size="mini"
                                                           :disabled="disabledButton(props.row.username) || !pagePermission.AccountAccountReset"
                                                           @click="openOrCloseResetPasswordWindow(true, props.row)">
                                                    重置账号密码
                                                </el-button>
                                                <el-button type="text" size="mini"
                                                           :disabled="disabledButton(props.row.username) || !pagePermission.AccountAccountUpdateRole"
                                                           @click="openOrCloseResetRoleWindow(true, props.row)">
                                                    设置角色
                                                </el-button>
                                                <el-button type="text" size="mini"
                                                           :disabled="disabledButton(props.row.username) || !pagePermission.AccountAccountUpdate"
                                                           @click="openOrCloseAccountWindow(true, props.row)">
                                                    编辑
                                                </el-button>
                                                <el-button type="text" size="mini"
                                                           :disabled="disabledButton(props.row.username) || !pagePermission.AccountAccountDelete"
                                                           @click="deleteAccount(props.row.id)">
                                                    删除
                                                </el-button>
                                            </el-form-item>
                                        </p>
                                        <div align="center">
                                            <el-button size="mini" :autofocus="true" plain :icon="props.row.icon"
                                                       @click="seeMore(props.row)"
                                                       style="width: 100%; background: #ecf5ff"></el-button>
                                        </div>
                                    </el-form>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <!-- PC -->
            <div style="min-width: 1220px" v-else>
                <div class="header-item border-r">
                    <div class="header-top t-h2">
                        <span style="color: #000000;font-size: 2vh;">筛选条件</span>
                    </div>
                    <div style="height: 6.5vh;min-height: 51px">
                        <div class="search_div" style="margin: 1.3vh 1vw">
                            <span style="color: #000000;font-size: 1.6vh">用户名：</span>
                            <el-input v-model="query.username" placeholder="请输入用户名" @change="loadAccountList(true)"
                                      clearable
                                      style="width: 10vw"></el-input>
                        </div>
                        <div class="search_div" style="margin: 1.3vh 1vw">
                            <span style="color: #000000;font-size: 1.6vh">姓名：</span>
                            <el-input v-model="query.name" placeholder="请输入姓名" @change="loadAccountList(true)" clearable
                                      style="width: 10vw"></el-input>
                        </div>
                        <div class="search_div" style="margin: 1.3vh 1vw">
                            <span style="color: #000000;font-size: 1.6vh">手机号：</span>
                            <el-input v-model="query.phone" placeholder="请输入手机号" @change="loadAccountList(true)"
                                      clearable
                                      style="width: 10vw"></el-input>
                        </div>
                        <div class="search_div" style="margin: 1.3vh 1vw">
                            <span style="color: #000000;font-size: 1.6vh">邮箱：</span>
                            <el-input v-model="query.email" placeholder="请输入邮箱" @change="loadAccountList(true)"
                                      clearable
                                      style="width: 10vw"></el-input>
                        </div>
                        <div class="search_div" style="margin: 1.3vh 1vw">
                            <span style="color: #000000;font-size: 1.6vh">角色：</span>
                            <el-select v-model="query.roleId" placeholder="请选择" @change="loadAccountList(true)">
                                <el-option value="" label="全部"></el-option>
                                <el-option
                                    v-for="item in roleCheckboxData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="header-item border-r" style="margin-top: 2vh">
                    <div class="header-top t-h2">
                        <span style="color: #000000;font-size: 2vh;">数据列表</span>
                        <div style="float: right;margin-right: 2vw;">
                            <el-button type="primary" size="small" @click="openOrCloseAccountWindow(true)"
                                       style="margin-left: 1vw;" v-if="pagePermission.AccountAccountSave">新增
                            </el-button>
                            <el-button type="primary" size="small" @click="openOrCloseResetRoleWindow(true)"
                                       style="margin-left: 1vw;" v-if="pagePermission.AccountAccountUpdateRole">设置角色
                            </el-button>
                            <el-button type="primary" size="small" @click="seeMore"
                                       style="margin-left: 1vw;">{{seeMoreText}}
                            </el-button>
                        </div>
                    </div>
                    <div>
                        <el-table :data="accountList" :border="true" style="width: 100%" row-key="id"
                                  :row-class-name="$TableRowClassName" :empty-text="emptyText"
                                  @selection-change="selectionChange">
                            <el-table-column type="selection" width="55" align="center"
                                             :selectable="selectable"></el-table-column>
                            <el-table-column label="编号" align="center" width="60">
                                <template scope="scope">
                                    <span v-text="scope.$index+1"></span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="username" label="用户名" align="center"
                                             :width="!isSeeMore ? '' : 100"></el-table-column>
                            <el-table-column prop="name" label="姓名" align="center" width="120"></el-table-column>
                            <el-table-column prop="phone" label="手机号" align="center" :width="!isSeeMore ? '' : 120"
                                             :formatter="$StringUtil.formatByElementTable"></el-table-column>
                            <el-table-column prop="email" label="邮箱" align="center" :width="!isSeeMore ? '' : 160"
                                             :formatter="$StringUtil.formatByElementTable"></el-table-column>
                            <el-table-column prop="roles" label="角色" align="center" :width="!isSeeMore ? '' : 150">
                                <template slot-scope="scope">
                                    <div>
                                        <div
                                            v-if="$StringUtil.isNotBlank(scope.row.roles) && scope.row.roles.length > 0"
                                            v-for="(item, index) in scope.row.roles">
                                            <span>{{item.name}}</span>
                                        </div>
                                        <div v-if="$StringUtil.isBlank(scope.row.roles)">
                                            <span>-</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" label="状态" align="center" :width="!isSeeMore ? '' : 100">
                                <template slot-scope="scope">
                                    <el-switch
                                        v-model="scope.row.status"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        :disabled="disabledButton(scope.row.username) || !pagePermission.AccountAccountUpdateStatus"
                                        @change="updateAccountStatus(scope.row)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" label="创建日期" align="center"
                                             :width="!isSeeMore ? '' : 160"
                                             :formatter="$DateUtil.formatByElementTable"
                                             v-if="isSeeMore"></el-table-column>
                            <el-table-column prop="createName" label="创建人" align="center" :width="isSeeMore ? '' : 160"
                                             :formatter="$StringUtil.formatByElementTable"
                                             v-if="isSeeMore"></el-table-column>
                            <el-table-column prop="updateTime" label="修改日期" align="center"
                                             :width="!isSeeMore ? '' : 160"
                                             :formatter="$DateUtil.formatByElementTable"
                                             v-if="isSeeMore"></el-table-column>
                            <el-table-column prop="updateName" label="修改人" align="center" :width="!isSeeMore ? '' : 160"
                                             :formatter="$StringUtil.formatByElementTable"
                                             v-if="isSeeMore"></el-table-column>

                            <el-table-column label="操作" align="center" width="350">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini"
                                               :disabled="disabledButton(scope.row.username) || !pagePermission.AccountAccountReset"
                                               @click="openOrCloseResetPasswordWindow(true, scope.row)">
                                        重置账号密码
                                    </el-button>
                                    <el-button type="primary" size="mini"
                                               :disabled="disabledButton(scope.row.username) || !pagePermission.AccountAccountUpdateRole"
                                               @click="openOrCloseResetRoleWindow(true, scope.row)">
                                        设置角色
                                    </el-button>
                                    <el-button type="primary" size="mini"
                                               :disabled="disabledButton(scope.row.username) || !pagePermission.AccountAccountUpdate"
                                               @click="openOrCloseAccountWindow(true, scope.row)">
                                        编辑
                                    </el-button>
                                    <el-button type="danger" size="mini"
                                               :disabled="disabledButton(scope.row.username) || !pagePermission.AccountAccountDelete"
                                               @click="deleteAccount(scope.row.id)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div style="float: right; margin-right: 3vw; margin-top: 2vh">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    :page-size="pageSize"
                    :layout=" isPc ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
                    :total="total"
                    prev-text="上一页"
                    next-text="下一页"
                    :small="!isPc">
                </el-pagination>
            </div>
        </div>

        <!-- 表单 -->
        <el-dialog :title="accountForm.accountFormTitle" :visible.sync="accountForm.openOrClose"
                   :width="isPc ? '60%' : '95%'"
                   :top=" isPc ? (accountForm.id === '' ? '3vh' : '15vh') : (accountForm.id === '' ? '1vh' : '3vh')">
            <el-form :model="accountForm" :rules="accountFormRules" ref="accountForm">
                <!-- 解决浏览器自动填充 -->
                <input type="password" style="position:absolute;top: -9999px;"/>
                <el-form-item label="用户名" autocomplete="off" prop="username">
                    <el-input type="text" v-model="accountForm.username" clearable :disabled="accountForm.id !== ''" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="accountForm.id === ''">
                    <el-input type="password" v-model="accountForm.password" clearable show-password
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="affirmPassword" v-if="accountForm.id === ''">
                    <el-input type="password" v-model="accountForm.affirmPassword" clearable show-password
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input type="text" v-model="accountForm.name" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input type="text" v-model="accountForm.phone" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="text" v-model="accountForm.email" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles" v-if="accountForm.id === ''">
                    <br>
                    <el-checkbox style="margin-left: 1vw" :indeterminate="accountForm.isIndeterminate"
                                 v-model="accountForm.checkRoleAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <br>
                    <el-checkbox-group v-if="isPc" v-model="accountForm.roles" @change="handleCheckedRoleSChange">
                        <el-checkbox v-for="(item, index) in roleCheckboxData" :key="index"
                                     :style="index === 0 ? 'margin-left: 0.55vw;' : ' '"
                                     :label="item.id" border>{{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-else v-model="resetRoleFrom.roles" @change="handleCheckedRoleSChange">
                        <p v-for="(item, index) in roleCheckboxData" :key="index">
                            <el-checkbox :label="item.id" border>{{item.name}}
                            </el-checkbox>
                        </p>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseAccountWindow(false)">取消</el-button>
                <el-button type="primary" @click.native="submitAccountForm()">提交</el-button>
            </div>
        </el-dialog>

        <!-- 重置账号密码 -->
        <el-dialog :title="resetPasswordFrom.resetPasswordFromTitle" :visible.sync="resetPasswordFrom.openOrClose"
                   :width="isPc ? '60%' : '95%'" top="13vh">
            <el-form :model="resetPasswordFrom" :rules="resetPasswordFromRules" ref="resetPasswordFrom">
                <!-- 解决浏览器自动填充 -->
                <input type="password" style="position:absolute;top: -9999px;"/>
                <el-form-item label="用户名" autocomplete="off" prop="username">
                    <el-input type="text" v-model="resetPasswordFrom.username" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="resetPasswordFrom.password" clearable show-password
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="affirmPassword">
                    <el-input type="password" v-model="resetPasswordFrom.affirmPassword" clearable show-password
                              auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseResetPasswordWindow(false)">取消</el-button>
                <el-button type="primary" @click.native="submitResetPassword()">提交</el-button>
            </div>
        </el-dialog>

        <!-- 设置角色 -->
        <el-dialog :title="resetRoleFrom.resetRoleFromTitle" :visible.sync="resetRoleFrom.openOrClose"
                   :width="isPc ? '60%' : '95%'" top="15vh">
            <el-form :model="resetRoleFrom" ref="resetRoleFrom">
                <el-form-item label="" prop="roles">
                    <br>
                    <el-checkbox style="margin-left: 1vw" :indeterminate="resetRoleFrom.isIndeterminate"
                                 v-model="resetRoleFrom.checkRoleAll" @change="resetRoleFromHandleCheckAllChange">全选
                    </el-checkbox>
                    <br>
                    <el-checkbox-group v-if="isPc" v-model="resetRoleFrom.roles"
                                       @change="resetRoleFromHandleCheckedRoleSChange">
                        <el-checkbox v-for="(item, index) in roleCheckboxData" :key="index"
                                     :style="index === 0 ? 'margin-left: 0.55vw;' : ' '"
                                     :label="item.id" border>{{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>

                    <el-checkbox-group v-else v-model="resetRoleFrom.roles"
                                       @change="resetRoleFromHandleCheckedRoleSChange">
                        <p v-for="(item, index) in roleCheckboxData" :key="index">
                            <el-checkbox :label="item.id" border>{{item.name}}
                            </el-checkbox>
                        </p>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseResetRoleWindow(false)">取消</el-button>
                <el-button type="primary" @click.native="submitResetRole()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "role",
        data() {
            let _this = this;
            /**
             * @Description : 检测用户名
             * @Author : cheng fei
             * @CreateDate 2019/4/24 0:36
             */
            let validateUsername = function (rule, value, callback) {
                if (!/^[a-zA-Z_-][a-zA-Z0-9_-]{3,16}$/.test(value)) {
                    callback("用户名长度为4到16由字母，数字，下划线，减号组成，首位必须是字母或下划线！")
                } else if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "account/account/check/username",
                        {
                            excludeId: _this.accountForm.id,
                            username: _this.accountForm.username
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("用户名【 " + value + " 】已存在!")
                            }
                        },
                    )
                } else {
                    callback("请输入用户名称!")
                }
            };
            /**
             * @Description : 检测用户名
             * @Author : cheng fei
             * @CreateDate 2019/4/24 0:36
             */
            let validateResetPasswordFromUsername = function (rule, value, callback) {
                if (!/^[a-zA-Z_-][a-zA-Z0-9_-]{3,16}$/.test(value)) {
                    callback("用户名长度为4到16由字母，数字，下划线，减号组成，首位必须是字母或下划线！")
                } else if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "account/account/check/username",
                        {
                            excludeId: _this.resetPasswordFrom.id,
                            username: _this.resetPasswordFrom.username
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("用户名【 " + value + " 】已存在!")
                            }
                        },
                    )
                } else {
                    callback("请输入用户名称!")
                }
            };
            /**
             * @Description : 检测密码
             * @Author : cheng fei
             * @CreateDate 2019/4/28 15:32
             */
            let validatePassword = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if (value.length < 4 || value.length > 16) {
                        callback("密码长度在4-16位之间！")
                    } else {
                        callback();
                        if (_this.$StringUtil.isNotBlank(_this.accountForm.affirmPassword) && _this.accountForm.isCheckAffirmPassword) {
                            _this.$refs.accountForm.validateField(['affirmPassword']);
                        }
                    }
                } else {
                    callback("密码不能为空!")
                }
            };

            /**
             * @Description : 检测密码
             * @Author : cheng fei
             * @CreateDate 2019/4/28 15:32
             */
            let validateResetPasswordFromPassword = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if (value.length < 4 || value.length > 16) {
                        callback("密码长度在4-16位之间！")
                    } else {
                        callback();
                        if (_this.$StringUtil.isNotBlank(_this.resetPasswordFrom.affirmPassword) && _this.resetPasswordFrom.isCheckAffirmPassword) {
                            _this.$refs.resetPasswordFrom.validateField(['affirmPassword']);
                        }
                    }
                } else {
                    callback("密码不能为空!")
                }
            };
            /**
             * @Description : 验证确认密码
             * @Author : cheng fei
             * @CreateDate 2019/5/2 14:51
             */
            let validateAffirmPassword = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if (value === _this.accountForm.password) {
                        callback();
                        _this.accountForm.isCheckAffirmPassword = false;
                    } else {
                        callback("确认密码和密码不一致！");
                        _this.accountForm.isCheckAffirmPassword = true;
                    }
                } else {
                    callback("确认密码不能为空!");
                }
            };
            /**
             * @Description : 检测重置密码表单的确认密码
             * @Author : cheng fei
             * @CreateDate 2019/5/3 17:21
             */
            let validateResetPasswordFromAffirmPassword = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if (value === _this.resetPasswordFrom.password) {
                        callback();
                        _this.resetPasswordFrom.isCheckAffirmPassword = false;
                    } else {
                        callback("确认密码和密码不一致！");
                        _this.resetPasswordFrom.isCheckAffirmPassword = true;
                    }
                } else {
                    callback("确认密码不能为空!");
                }
            };
            /**
             * @Description : 验证手机号码
             * @Author : cheng fei
             * @CreateDate 2019/5/2 15:25
             */
            let validatePhone = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if (!/^(\+\d+)?1[34578]\d{9}$$/.test(value)) {
                        callback("手机号码不正确！");
                    } else {
                        _this.$Http.doPostCheckParam(
                            _this,
                            "account/account/check/phone",
                            {
                                excludeId: _this.accountForm.id,
                                phone: _this.accountForm.phone
                            },
                            function (self, data) {
                                if (data.data) {
                                    callback()
                                } else {
                                    callback("手机号【 " + value + " 】已使用!")
                                }
                            }
                        )
                    }
                } else {
                    callback("手机号码不能为空！");
                }
            };
            /**
             * @Description : 检测邮箱是否可用
             * @Author : cheng fei
             * @CreateDate 2019/5/2 15:30
             */
            let validateEmail = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/.test(value)) {
                        callback("邮箱格式不正确！")
                    } else {
                        _this.$Http.doPostCheckParam(
                            _this,
                            "account/account/check/email",
                            {
                                excludeId: _this.accountForm.id,
                                email: _this.accountForm.email
                            },
                            function (self, data) {
                                if (data.data) {
                                    callback()
                                } else {
                                    callback("手机号【 " + value + " 】已使用!")
                                }
                            }
                        )
                    }
                } else {
                    callback("邮箱不能为空！")
                }
            };
            /**
             * @Description : 检测账号角色
             * @Author : cheng fei
             * @CreateDate 2019/5/2 22:04
             */
            let validateRoles = function (rule, value, callback) {
                if (value.length == 0) {
                    callback("角色不能为空！")
                } else {
                    callback()
                }
            };
            return {
                //是否是PC端
                isPc: true,
                //折叠面板显示的值
                activeName: "2",
                //页面按钮权限(权限url首字母大写,否则不能动态修改)
                pagePermission: {
                    AccountAccountList: false,
                    AccountAccountSave: false,
                    AccountAccountUpdate: false,
                    AccountAccountUpdateStatus: false,
                    AccountAccountReset: false,
                    AccountAccountUpdateRole: false,
                    AccountAccountDelete: false,
                },
                //账号列表数据
                accountList: [],
                //是否显示更多信息
                isSeeMore: false,
                //账号模糊查询
                query: {
                    username: "",
                    name: "",
                    phone: "",
                    email: "",
                    roleId: "",
                },

                //账号列表选中的账号id
                selectedAccountIds: [],

                /**** 分页 *****/

                //当前页
                currentPage: 1,

                //每页加载记录数
                pageSize: 10,

                //总记录数
                total: 0,

                //角色多选框数据
                roleCheckboxData: [],

                //账号表单数据
                accountForm: {
                    //表单开关
                    openOrClose: false,
                    //表单标题
                    accountFormTitle: "",
                    //账号Id
                    id: "",
                    //用户名
                    username: "",
                    //密码
                    password: "",
                    //确认密码
                    affirmPassword: "",
                    //是否再次检测确认密码
                    isCheckAffirmPassword: false,
                    //账号名称
                    name: "",
                    //手机号
                    phone: "",
                    //邮箱
                    email: "",
                    //修改时间
                    updateTime: "",
                    //角色全选
                    checkRoleAll: false,
                    //全选样式控制
                    isIndeterminate: false,
                    //已选中角色
                    roles: [],

                },

                //表单验证规则
                accountFormRules: {
                    username: [
                        {required: true, message: "用户名不能为空！", trigger: "blur"},
                        {validator: validateUsername}
                    ],
                    password: [
                        {required: true, message: "密码不能为空！", trigger: "blur"},
                        {validator: validatePassword}
                    ],
                    affirmPassword: [
                        {required: true, message: "确认密码不能为空！", trigger: "blur"},
                        {validator: validateAffirmPassword}
                    ],
                    name: [
                        {required: true, message: "姓名不能为空！", trigger: "blur"},
                    ],
                    phone: [
                        {required: true, message: "手机号不能为空！", trigger: "blur"},
                        {validator: validatePhone}
                    ],
                    email: [
                        {required: true, message: "邮箱不能为空！", trigger: "blur"},
                        {validator: validateEmail}
                    ],
                },

                //重置账号密码表单
                resetPasswordFrom: {
                    //开关
                    openOrClose: false,
                    //是否检测确认密码
                    isCheckAffirmPassword: false,
                    //表单标题
                    resetPasswordFromTitle: "",
                    //账号id
                    id: "",
                    //用户名
                    username : "",
                    //密码
                    password: "",
                    //确认密码
                    affirmPassword: "",
                    //上次修改时间
                    updateTime: "",
                },

                //重置密码表单验证
                resetPasswordFromRules: {
                    username : [
                        {required: true, message: "密码不能为空！", trigger: "blur"},
                        {validator : validateResetPasswordFromUsername}
                    ],
                    password: [
                        {required: true, message: "密码不能为空！", trigger: "blur"},
                        {validator: validateResetPasswordFromPassword}
                    ],
                    affirmPassword: [
                        {required: true, message: "确认密码不能为空！", trigger: "blur"},
                        {validator: validateResetPasswordFromAffirmPassword}
                    ]
                },

                //设置角色表单
                resetRoleFrom: {
                    //开关
                    openOrClose: false,
                    //设置角色弹框标题
                    resetRoleFromTitle: "",
                    //是否全选
                    checkRoleAll: false,
                    isIndeterminate: false,

                    //账号ID列表
                    ids: [],
                    //角色列表
                    roles: [],
                },
            }
        },
        computed: {
            //数据为空时描述
            emptyText() {
                if (this.pagePermission.AccountAccountList) {
                    return "暂无数据"
                } else {
                    return "您无查看权限！"
                }
            },
            //显示更多按钮描述
            seeMoreText() {
                if (this.isSeeMore) {
                    return "显示简略信息"
                } else {
                    return "显示更多信息"
                }
            },
        },
        watch : {
            pageSize : function (newValue, oldValue) {
                const re = /^[1-9]+[0-9]*]*$/;
                if (!re.test(newValue)) {
                    this.pageSize = oldValue
                } else {
                   this.pageSize = parseInt(newValue)
                }
            }
        },
        async mounted() {
            this.isPc = this.$IsPC();
            this.pageSize = this.isPc ? 10 : 5;
            //页面按钮权限(权限url首字母大写,否则不能动态修改)
            await this.$GetAccountMenuPermission(this.pagePermission);
            //加载账号列表
            this.loadAccountList();
            //加载角色下拉列表
            this.loadRoleCheckbox();
        },
        methods: {
            /**
             * @Description :
             * @Author : cheng fei
             * @CreateDate 2019/5/29 15:40
             * @Param
             */
            seeMore(item) {
                if (this.isPc) {
                    this.isSeeMore = !this.isSeeMore
                } else {
                    item.showMore = !item.showMore;
                    if (item.showMore) {
                        item.icon = "el-icon-arrow-up";
                    } else {
                        item.icon = "el-icon-arrow-down";
                    }


                }
            },
            /**
             * @Description : 移动端执行查询
             * @Author : cheng fei
             * @CreateDate 2019/5/29 16:57
             */
            doSearch() {
                this.currentPage = 1;
                this.loadAccountList();
                this.showScreen = false;
            },
            /**
             * @Description : 账号列表选中项发生变化时
             * @Author : cheng fei
             * @CreateDate 2019/5/4 11:24
             * @Param
             */
            selectionChange(selection) {
                this.selectedAccountIds = [];
                for (let i in selection) {
                    this.selectedAccountIds.push(selection[i].id)
                }
            },
            /**
             * @Description : 是否禁用复选框
             * @Author : cheng fei
             * @CreateDate 2019/5/3 2:31
             */
            selectable(row, index) {
                if (row.username === this.$Config.administrator) {
                    return false;
                } else {
                    return true;
                }
            },
            /**
             * @Description : 是否禁用菜单按钮
             * @Author : cheng fei
             * @CreateDate 2019/5/3 2:35
             * @Param username 用户名
             */
            disabledButton(username) {
                if (username === this.$Config.administrator) {
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * @Description : 加载账号列表
             * @Author : cheng fei
             * @CreateDate 2019/4/27 14:20
             */
            loadAccountList(isInit) {
                if (isInit) {
                    this.currentPage = 1;
                }
                if (this.pagePermission.AccountAccountList) {
                    this.$Http.doPostForForm(
                        this,
                        "account/account/list",
                        {
                            username: this.query.username,
                            name: this.query.name,
                            phone: this.query.phone,
                            email: this.query.email,
                            roleId: this.query.roleId,
                            page: this.currentPage,
                            pageSize: this.pageSize
                        },
                        function (self, data) {
                            self.accountList = data.data.rows;
                            self.total = data.data.count;
                            if (!self.isPc) {
                                self.activeName = '2';
                                if (self.accountList && self.accountList.length > 0) {
                                    self.accountList.forEach((item) => {
                                        self.$set(item, 'showMore', false);
                                        self.$set(item, 'icon', 'el-icon-arrow-down')
                                    })
                                }
                            }
                        }
                    )
                }
            },
            /**
             * @Description : 修改每页显示条数
             * @Author : cheng fei
             * @CreateDate 2019/4/27 14:25
             */
            handleSizeChange(pageSize) {
                this.currentPage = 1;
                this.pageSize = pageSize;
                this.loadAccountList();
            },
            /**
             * @Description : 修改当前页码
             * @Author : cheng fei
             * @CreateDate 2019/4/27 14:27
             */
            handleCurrentChange(page) {
                this.currentPage = page;
                this.loadAccountList();
            },
            /**
             * @Description : 账号角色全选/全不选
             * @Author : cheng fei
             * @CreateDate 2019/5/3 16:49
             * @Param
             */
            handleCheckAllChange(val) {
                this.accountForm.roles = [];
                if (val) {
                    for (let i in this.roleCheckboxData) {
                        this.accountForm.roles.push(this.roleCheckboxData[i].id)
                    }
                }
                this.accountForm.isIndeterminate = false;
            },
            /**
             * @Description : 设置角色全选角色
             * @Author : cheng fei
             * @CreateDate 2019/5/3 18:29
             * @Param
             */
            resetRoleFromHandleCheckAllChange(val) {
                this.resetRoleFrom.roles = [];
                if (val) {
                    for (let i in this.roleCheckboxData) {
                        this.resetRoleFrom.roles.push(this.roleCheckboxData[i].id)
                    }
                }
                this.resetRoleFrom.isIndeterminate = false;
            },
            /**
             * @Description : 选择角色
             * @Author : cheng fei
             * @CreateDate 2019/5/3 16:50
             * @Param
             */
            handleCheckedRoleSChange(value) {
                let checkedCount = value.length;
                this.accountForm.checkRoleAll = checkedCount === this.roleCheckboxData.length;
                this.accountForm.isIndeterminate = checkedCount > 0 && checkedCount < this.roleCheckboxData.length;
            },
            /**
             * @Description : 设置角色窗口全中角色
             * @Author : cheng fei
             * @CreateDate 2019/5/3 18:31
             * @Param
             */
            resetRoleFromHandleCheckedRoleSChange(value) {
                let checkedCount = value.length;
                this.resetRoleFrom.checkRoleAll = checkedCount === this.roleCheckboxData.length;
                this.resetRoleFrom.isIndeterminate = checkedCount > 0 && checkedCount < this.roleCheckboxData.length;
            },
            /**
             * @Description : 加载角色多选框数据
             * @Author : cheng fei
             * @CreateDate 2019/5/2 21:49
             */
            loadRoleCheckbox() {
                this.$Http.doPostForForm(
                    this,
                    "account/role/checkbox",
                    {},
                    function (self, data) {
                        self.roleCheckboxData = data.data
                    }
                )
            },
            /**
             * @Description : 开启关闭账号表单
             * @Author : cheng fei
             * @CreateDate 2019/4/24 0:27
             * @Param value 开启(true)/关闭(false)
             * @Param data 修改时回显数据
             */
            openOrCloseAccountWindow(value, data) {
                this.accountForm.openOrClose = value;
                if (value) {
                    //开启表单
                    if (this.$ObjectUtil.isBlank(data)) {
                        //新增
                        this.accountForm.accountFormTitle = "新增账号"
                    } else {
                        //修改
                        this.accountForm.accountFormTitle = "修改账号";
                        this.accountForm.id = data.id;
                        this.accountForm.username = data.username;
                        this.accountForm.name = data.name;
                        this.accountForm.phone = data.phone;
                        this.accountForm.email = data.email;
                        this.accountForm.updateTime = this.$StringUtil.isBlank(data.updateTime) ? "" : data.updateTime;
                    }
                } else {
                    //关闭表单,重置数据
                    this.accountForm = {
                        //表单开关
                        openOrClose: false,
                        //表单标题
                        accountFormTitle: "",
                        //账号Id
                        id: "",
                        //用户名
                        username: "",
                        //密码
                        password: "",
                        //确认密码
                        affirmPassword: "",
                        //是否再次检测确认密码
                        isCheckAffirmPassword: false,
                        //账号名称
                        name: "",
                        //手机号
                        phone: "",
                        //邮箱
                        email: "",
                        //修改时间
                        updateTime: "",
                        //角色全选
                        checkRoleAll: false,
                        //全选样式控制
                        isIndeterminate: false,
                        //已选中角色
                        roles: [],

                    };
                    //重置验证
                    this.$refs["accountForm"].resetFields();
                }

            },
            /**
             * @Description : 提交账号表单
             * @Author : cheng fei
             * @CreateDate 2019/4/24 0:38
             */
            submitAccountForm() {
                this.$refs["accountForm"].validate(valid => {
                    if (valid) {
                        let param = {
                            name: this.accountForm.name,
                            phone: this.accountForm.phone,
                            email: this.accountForm.email,
                        };
                        let url;
                        if (this.$StringUtil.isBlank(this.accountForm.id)) {
                            url = "/account/account/save";
                            param.username = this.accountForm.username;
                            param.password = this.$PasswordUtil.getPasswordByBase64(this.accountForm.password, this.accountForm.username);
                            param.roleIds = this.accountForm.roles.join(",")
                        } else {
                            url = "/account/account/update";
                            param.id = this.accountForm.id;
                            param.updateTime = this.$DateUtil.formatTimestampForDateTime(this.accountForm.updateTime);
                        }

                        this.$Http.doPostForForm(
                            this,
                            url,
                            param,
                            function (self, data) {
                                self.openOrCloseAccountWindow(false);
                                self.loadAccountList();
                            }
                        )
                    }
                })
            },
            /**
             * @Description :
             * @Author : cheng fei
             * @CreateDate 2019/5/28 15:48
             * @Param account 账号详情
             */
            doUpdateAccountStatus(account) {
                this.$Http.doPostForForm(
                    this,
                    "account/account/update/status",
                    {
                        id: account.id,
                        status: account.status,
                        updateTime: this.$DateUtil.formatTimestampForDateTime(account.updateTime)
                    },
                    function (self, data) {
                        self.$message({
                            type: 'success',
                            message: account.status ? '启用账号成功！' : '禁用账号成功！'
                        });
                        self.loadAccountList();
                    },
                    function (self) {
                        self.loadAccountList();

                    }
                )
            },
            /**
             * @Description : 修改账号状态
             * @Author : cheng fei
             * @CreateDate 2019/5/4 13:15
             */
            updateAccountStatus(account) {
                if (account.status) {
                    this.doUpdateAccountStatus(account);
                } else {
                    this.$confirm('确认要禁用该账号？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.doUpdateAccountStatus(account);
                    }).catch(() => {
                        account.status = !account.status
                    });
                }
            },
            /**
             * @Description : 删除账号
             * @Author : cheng fei
             * @CreateDate 2019/4/28 15:43
             * @Param id id
             */
            deleteAccount(id) {
                this.$confirm('确认要删除该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$Http.doPostForForm(
                        this,
                        "account/account/delete",
                        {
                            id: id
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '删除账号成功!'
                            });
                            self.loadAccountList();
                        }
                    )
                }).catch(() => {

                });
            },
            /**
             * @Description : 开启/关闭重置密码窗口
             * @Author : cheng fei
             * @CreateDate 2019/5/3 16:52
             * @param value 开启关闭 true/false
             * @param account 重置账号密码的账号
             */
            openOrCloseResetPasswordWindow(value, account) {
                this.resetPasswordFrom.openOrClose = value;
                if (value) {
                    this.resetPasswordFrom.id = account.id;
                    this.resetPasswordFrom.username = account.username;
                    this.resetPasswordFrom.updateTime = this.$StringUtil.isBlank(account.updateTime) ? "" : account.updateTime;
                    this.resetPasswordFrom.resetPasswordFromTitle = "重置【 " + account.username + " 】账号密码"
                } else {
                    this.resetPasswordFrom = {
                        //开关
                        openOrClose: false,
                        //是否检测确认密码
                        isCheckAffirmPassword: false,
                        //表单标题
                        resetPasswordFromTitle: "",
                        //账号id
                        id: "",
                        username : "",
                        //密码
                        password: "",
                        //确认密码
                        affirmPassword: "",
                        //上次修改时间
                        updateTime: "",
                    };
                    //重置验证
                    this.$refs["resetPasswordFrom"].resetFields();
                }

            },
            /**
             * @Description : 提交重置密码表单
             * @Author : cheng fei
             * @CreateDate 2019/5/3 17:29
             */
            submitResetPassword() {
                this.$refs.resetPasswordFrom.validate((valid) => {
                    this.$Http.doPostForForm(
                        this,
                        "account/account/reset",
                        {
                            id: this.resetPasswordFrom.id,
                            username : this.resetPasswordFrom.username,
                            password: this.$PasswordUtil.getPasswordByBase64(this.resetPasswordFrom.password, this.resetPasswordFrom.username),
                            updateTime: this.$DateUtil.formatTimestampForDateTime(this.resetPasswordFrom.updateTime)
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '重置账号密码成功!'
                            });
                            self.loadAccountList();
                            self.openOrCloseResetPasswordWindow(false)
                        }
                    )
                });
            },
            /**
             * @Description : 开启关闭设置角色窗口
             * @Author : cheng fei
             * @CreateDate 2019/5/3 17:40
             * @Param
             */
            openOrCloseResetRoleWindow(value, account) {
                this.resetRoleFrom.openOrClose = value;
                if (value) {
                    if (account) {
                        //重置单个账号
                        this.resetRoleFrom.resetRoleFromTitle = "【 " + account.username + " 】- 设置角色";
                        //存储账号id
                        this.resetRoleFrom.ids = [];
                        this.resetRoleFrom.ids.push(account.id);
                        //回显已有角色
                        this.resetRoleFrom.roles = [];
                        for (let i in account.roles) {
                            this.resetRoleFrom.roles.push(account.roles[i].id)
                        }
                        this.resetRoleFromHandleCheckedRoleSChange(this.resetRoleFrom.roles)
                    } else {
                        this.resetRoleFrom.resetRoleFromTitle = "批量设置角色";
                        this.resetRoleFrom.ids = this.selectedAccountIds;
                    }
                } else {
                    //重置设置角色表单数据
                    this.resetRoleFrom = {
                        //开关
                        openOrClose: false,
                        //设置角色弹框标题
                        resetRoleFromTitle: "",
                        //是否全选
                        checkRoleAll: false,
                        isIndeterminate: false,

                        //账号ID列表
                        ids: [],
                        //角色列表
                        roles: [],
                    }
                }
            },
            /**
             * @Description : 提交修改账号拥有角色
             * @Author : cheng fei
             * @CreateDate 2019/5/4 11:55
             */
            submitResetRole() {
                this.$Http.doPostForForm(
                    this,
                    "account/account/update/role",
                    {
                        ids: this.resetRoleFrom.ids.join(","),
                        roleIds: this.resetRoleFrom.roles.join(",")
                    },
                    function (self, data) {
                        self.$message({
                            type: 'success',
                            message: '设置角色成功!'
                        });
                        self.loadAccountList();
                        self.openOrCloseResetRoleWindow(false)
                    }
                )
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "account.less";
    @import "../../../styles/commons.less";
</style>
