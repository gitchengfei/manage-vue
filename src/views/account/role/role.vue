<template>
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
                        <el-form-item label="角色名：" size="mini">
                            <el-input v-model="name" placeholder="请输入用户名" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="每页显示记录数：" size="mini">
                            <el-select v-model="pageSize" placeholder="请选择" style="width: 20vw">
                                <el-option value="3" label="3"></el-option>
                                <el-option value="5" label="5"></el-option>
                                <el-option value="10" label="10"></el-option>
                                <el-option value="15" label="15"></el-option>
                                <el-option value="20" label="20"></el-option>
                                <el-option value="50" label="50"></el-option>
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
                    <el-table :data="roleList" :show-header="false" border :border="true"
                              :row-class-name="$TableRowClassName" :empty-text="emptyText">
                        <el-table-column>
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="角色名称：" size="mini">
                                        <span>{{ props.row.name }}</span>
                                    </el-form-item>
                                    <p>
                                        <el-form-item label="状态：">
                                            <el-switch
                                                v-model="props.row.status"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                :disabled="!pagePermission.AccountRoleUpdateStatus"
                                                @change="updateAccountStatus(props.row)">
                                            </el-switch>
                                        </el-form-item>
                                    </p>
                                    <el-collapse-transition>
                                        <div class="transition-box" v-show="props.row.showMore">
                                            <el-form-item label="排序码：" size="mini">
                                                <span>{{ props.row.displayOrder }}</span>
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
                                            <el-form-item label="备注：" size="mini">
                                                <span>{{ props.row.remark ? props.row.remark : '-' }}</span>
                                            </el-form-item>
                                        </div>
                                    </el-collapse-transition>
                                    <p>
                                        <el-form-item size="mini">
                                            <el-button type="text" size="small" @click="openOrCloseRoleWindow(true)"
                                                       v-if="pagePermission.AccountRoleSave"
                                                       style="margin-left: 1vw;">新增
                                            </el-button>
                                            <el-button type="text" size="mini"
                                                       :disabled="!pagePermission.AccountRolePermissionUpdate"
                                                       @click="openOrCloseRolePermissionWindow(true, props.row)">
                                                权限设置
                                            </el-button>
                                            <el-button type="text" size="mini"
                                                       :disabled="!pagePermission.AccountRoleUpdate"
                                                       @click="openOrCloseRoleWindow(true, props.row)">
                                                编辑
                                            </el-button>
                                            <el-button type="text" size="mini"
                                                       :disabled="!pagePermission.AccountRoleDelete"
                                                       @click="deleteRole(props.row.id)">删除
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
        <!-- pc -->
        <div v-else>
            <div class="header-item border-r">
                <div class="header-top t-h2">
                    <span style="color: #000000;font-size: 2vh;">筛选条件</span>
                </div>
                <div style="height: 6.5vh;min-height: 51px">
                    <div class="search_div" style="margin: 1.3vh 1vw">
                        <span style="color: #000000;font-size: 1.6vh">角色名：</span>
                        <el-input v-model="name" placeholder="请输入角色名" @change="changName" clearable
                                  style="width: 10vw"></el-input>
                    </div>
                </div>
            </div>
            <div class="header-item border-r" style="margin-top: 2vh">
                <div class="header-top t-h2">
                    <span style="color: #000000;font-size: 2vh;">数据列表</span>
                    <div style="float: right;margin-right: 2vw;">
                        <el-button type="primary" size="small" @click="openOrCloseRoleWindow(true)"
                                   v-if="pagePermission.AccountRoleSave"
                                   style="margin-left: 1vw;">新增
                        </el-button>
                    </div>
                </div>
                <div>
                    <el-table :data="roleList" :border="true" style="width: 100%" row-key="id"
                              :row-class-name="$TableRowClassName" :empty-text="emptyText">
                        <el-table-column label="编号" align="center" width="80">
                            <template scope="scope">
                                <span v-text="scope.$index+1"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="角色名称" align="center" width="120"></el-table-column>
                        <el-table-column prop="displayOrder" label="排序码" align="center" width="80"></el-table-column>
                        <el-table-column prop="createTime" label="创建日期" align="center" width="200"
                                         :formatter="$DateUtil.formatByElementTable"></el-table-column>
                        <el-table-column prop="createName" label="创建人" align="center" width="150"
                                         :formatter="$StringUtil.formatByElementTable"></el-table-column>
                        <el-table-column prop="updateTime" label="修改日期" align="center" width="200"
                                         :formatter="$DateUtil.formatByElementTable"></el-table-column>
                        <el-table-column prop="updateName" label="修改人" align="center" width="200"
                                         :formatter="$StringUtil.formatByElementTable"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center" width="100">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :disabled='!pagePermission.AccountRoleUpdateStatus'
                                    @change="updateRoleStatus(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" align="center"
                                         :formatter="$StringUtil.formatByElementTable"></el-table-column>
                        <el-table-column label="操作" align="center" width="250">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini"
                                           :disabled="!pagePermission.AccountRolePermissionUpdate"
                                           @click="openOrCloseRolePermissionWindow(true, scope.row)">
                                    权限设置
                                </el-button>
                                <el-button type="primary" size="mini" :disabled="!pagePermission.AccountRoleUpdate"
                                           @click="openOrCloseRoleWindow(true, scope.row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" size="mini" :disabled="!pagePermission.AccountRoleDelete"
                                           @click="deleteRole(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div>
            <div style="float: right; margin-right: 3vw; margin-top: 2vh;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    :page-size="pageSize"
                    :small="!isPc"
                    :layout=" isPc ? 'total, sizes, prev, pager, next, jumper' : ' prev, pager, next'"
                    :total="total"
                    prev-text="上一页"
                    next-text="下一页">
                </el-pagination>
            </div>
        </div>

        <!-- 表单 -->
        <el-dialog :title="roleForm.roleFormTitle" :visible.sync="roleForm.openOrClose" :width="isPc ? '60%' : '90%'"
                   top="10vh">
            <el-form :model="roleForm" :rules="roleFormRules" ref="roleForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input type="text" v-model="roleForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序码" prop="displayOrder">
                    <el-input type="text" v-model="roleForm.displayOrder" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="text" v-model="roleForm.remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseRoleWindow(false)">取消</el-button>
                <el-button type="primary" @click.native="submitRoleForm()">提交</el-button>
            </div>
        </el-dialog>

        <!-- 权限设置 -->
        <el-dialog :title="menuPermissionWindowTitle" :visible.sync="menuPermissionWindow"
                   :width=" isPc ? '50%' : '90%'" :top="isPc ? '10vh' : '2vh'">
            <el-tree ref="menuPermissionTree" :props="menuPermissionTreeProps"
                     :render-content="menuPermissionTreeRenderContent"
                     :data="menuPermissionTreeData" node-key="id" :show-checkbox="true" :default-expand-all="true">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseRolePermissionWindow(false)">取消</el-button>
                <el-button type="primary" @click.native="submitRolePermission()">提交</el-button>
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
             * @Description : 检测角色名称
             * @Author : cheng fei
             * @CreateDate 2019/4/24 0:36
             */
            let validateName = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "account/role/check/name",
                        {
                            id: _this.roleForm.id,
                            name: _this.roleForm.name
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("[ " + value + " ]角色名称已存在!")
                            }
                        }
                    )
                } else {
                    callback("请输入角色名称!")
                }
            };
            /**
             * @Description : 检测排序码
             * @Author : cheng fei
             * @CreateDate 2019/4/28 15:32
             */
            let validateDisplayOrder = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    var re = /^[0-9]+$/;
                    if (re.test(value)) {
                        callback()
                    } else {
                        callback("排序码必须为正整数!")
                    }
                } else {
                    callback("排序码不能为空!")
                }
            };
            return {
                //是否是PC端
                isPc: true,
                //移动端默认展开
                activeName: '2',
                //页面按钮权限(权限url首字母大写,否则不能动态修改)
                pagePermission: {
                    AccountRoleList: false,
                    AccountRoleSave: false,
                    AccountRoleUpdate: false,
                    AccountRoleUpdateStatus: false,
                    AccountRolePermissionUpdate: false,
                    AccountRoleDelete: false,
                },
                //角色列表数据
                roleList: [],

                //角色模糊查询
                name: "",

                /**** 分页 *****/

                //当前页
                currentPage: 1,

                //每页加载记录数
                pageSize: 10,

                //总记录数
                total: 0,

                //角色表单数据
                roleForm: {
                    //表单开关
                    openOrClose: false,
                    //表单标题
                    roleFormTitle: "",
                    //角色Id
                    id: "",
                    //角色名称
                    name: "",
                    //排序码
                    displayOrder: "",
                    //角色备注
                    remark: "",
                    //修改时间
                    updateTime: ""
                },

                //表单验证规则
                roleFormRules: {
                    name: [
                        {required: true, message: "角色名称不能为空!", trigger: "blur"},
                        {validator: validateName}
                    ],
                    displayOrder: [
                        {required: true, message: "菜单排序码不能为空!", trigger: "blur"},
                        {validator: validateDisplayOrder}
                    ]
                },

                //角色权限窗口开关
                menuPermissionWindow: false,

                //角色权限窗口title
                menuPermissionWindowTitle: "",

                //角色权限树
                menuPermissionTreeProps: {
                    label: 'name',
                    children: 'children',
                },

                //选中角色Id
                chooseRoleId: "",

                //角色权限树数据
                menuPermissionTreeData: [],

                //角色权限数据
                rolePermissionData: [],
            }
        },
        computed: {
            //数据为空时描述
            emptyText() {
                if (this.pagePermission.AccountRoleList) {
                    return "暂无数据"
                } else {
                    return "您无查看权限！"
                }
            },
        },
        watch: {
            pageSize: function (newValue, oldValue) {
                const re = /^[1-9]+[0-9]*]*$/;
                if (!re.test(newValue)) {
                    this.pageSize = oldValue
                } else {
                    this.pageSize = parseInt(newValue)
                }
            }
        },
        async mounted() {
            //是否是PC端
            this.isPc = this.$IsPC();
            this.pageSize = this.isPc ? 10 : 5;
            //页面按钮权限(权限url首字母大写,否则不能动态修改)
            await this.$GetAccountMenuPermission(this.pagePermission);
            //加载角色列表
            this.loadRoleList();

        },
        methods: {

            /**
             * @Description : 移动端显示更多
             * @Author : cheng fei
             * @CreateDate 2019/5/29 23:48
             * @Param item 当前记录
             */
            seeMore(item) {
                item.showMore = !item.showMore;
                if (item.showMore) {
                    item.icon = "el-icon-arrow-up";
                } else {
                    item.icon = "el-icon-arrow-down";
                }
            },
            /**
             * @Description : 移动端数据筛选
             * @Author : cheng fei
             * @CreateDate 2019/5/29 23:49
             */
            doSearch() {
                this.currentPage = 1;
                this.loadRoleList();
            },
            /**
             * @Description : 加载角色列表
             * @Author : cheng fei
             * @CreateDate 2019/4/27 14:20
             */
            loadRoleList() {
                if (this.pagePermission.AccountRoleList) {
                    this.$Http.doPostForForm(
                        this,
                        "account/role/list",
                        {
                            name: this.name,
                            page: this.currentPage,
                            pageSize: this.pageSize
                        },
                        function (self, data) {
                            self.roleList = data.data.rows;
                            self.total = data.data.count;
                            if (!self.isPc) {
                                self.activeName = '2';
                                if (self.roleList && self.roleList.length > 0) {
                                    self.roleList.forEach((item) => {
                                        self.$set(item, 'showMore', false)
                                        self.$set(item, 'icon', 'el-icon-arrow-down')
                                    })
                                }
                            }
                        }
                    )
                }
            },
            /**
             * @Description : 修改模糊查询
             * @Author : cheng fei
             * @CreateDate 2019/4/27 14:24
             */
            changName() {
                this.currentPage = 1;
                this.loadRoleList();
            },
            /**
             * @Description : 修改每页显示条数
             * @Author : cheng fei
             * @CreateDate 2019/4/27 14:25
             */
            handleSizeChange(pageSize) {
                this.currentPage = 1;
                this.pageSize = pageSize;
                this.loadRoleList();
            },
            /**
             * @Description : 修改当前页码
             * @Author : cheng fei
             * @CreateDate 2019/4/27 14:27
             */
            handleCurrentChange(page) {
                this.currentPage = page;
                this.loadRoleList();
            },
            /**
             * @Description : 开启关闭角色表单
             * @Author : cheng fei
             * @CreateDate 2019/4/24 0:27
             * @Param value 开启(true)/关闭(false)
             * @Param data 修改时回显数据
             */
            openOrCloseRoleWindow(value, data) {
                this.roleForm.openOrClose = value;
                if (value) {
                    //开启表单
                    if (this.$ObjectUtil.isBlank(data)) {
                        //新增
                        this.roleForm.roleFormTitle = "新增角色"
                    } else {
                        //修改
                        this.roleForm.roleFormTitle = "修改角色";
                        this.roleForm.id = data.id;
                        this.roleForm.name = data.name;
                        this.roleForm.displayOrder = data.displayOrder;
                        this.roleForm.remark = data.remark;
                        this.roleForm.updateTime = this.$StringUtil.isBlank(data.updateTime) ? "" : data.updateTime;
                    }
                } else {
                    //关闭表单,重置数据
                    this.roleForm = {
                        //表单开关
                        openOrClose: false,
                        //表单标题
                        roleFormTitle: "",
                        //角色Id
                        id: "",
                        //角色名称
                        name: "",
                        //角色备注
                        remark: "",
                        //修改时间
                        updateTime: "",
                    };
                    //重置验证
                    this.$refs["roleForm"].resetFields();
                }
            },
            /**
             * @Description : 提交角色表单
             * @Author : cheng fei
             * @CreateDate 2019/4/24 0:38
             */
            submitRoleForm() {
                this.$refs["roleForm"].validate(valid => {
                    if (valid) {
                        let param = {
                            name: this.roleForm.name,
                            displayOrder: this.roleForm.displayOrder,
                            remark: this.roleForm.remark
                        };
                        let url;
                        if (this.$StringUtil.isBlank(this.roleForm.id)) {
                            url = "/account/role/save";
                        } else {
                            url = "/account/role/update";
                            param.id = this.roleForm.id;
                            param.updateTime = this.$StringUtil.isBlank(this.roleForm.updateTime) ? "" : this.$DateUtil.formatTimestampForDateTime(this.roleForm.updateTime);
                        }

                        this.$Http.doPostForForm(
                            this,
                            url,
                            param,
                            function (self, data) {
                                self.openOrCloseRoleWindow(false);
                                self.loadRoleList();
                            }
                        )
                    }
                })
            },
            /**
             * @Description : 执行修改角色状态
             * @Author : cheng fei
             * @CreateDate 2019/5/28 16:53
             * @Param role 角色
             */
            doUpdateRoleStatus(role) {
                this.$Http.doPostForForm(
                    this,
                    "account/role/update/status",
                    {
                        id: role.id,
                        status: role.status,
                        updateTime: this.$DateUtil.formatTimestampForDateTime(role.updateTime)
                    },
                    function (self, data) {
                        self.$message({
                            type: 'success',
                            message: role.status ? '启用角色成功！' : '禁用角色成功！'
                        });
                        self.loadRoleList();
                    },
                    function (self) {
                        self.loadRoleList();

                    }
                )
            },
            /**
             * @Description :
             * @Author : cheng fei
             * @CreateDate 2019/5/28 16:55
             * @Param role 角色
             */
            updateRoleStatus(role) {
                if (role.status) {
                    this.doUpdateRoleStatus(role);
                } else {
                    this.$confirm('确认要禁用该角色？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.doUpdateRoleStatus(role);
                    }).catch(() => {
                        role.status = !role.status
                    });
                }
            },
            /**
             * @Description : 删除角色
             * @Author : cheng fei
             * @CreateDate 2019/4/28 15:43
             * @Param id id
             */
            deleteRole(id) {
                this.$confirm('确认要删除该角色?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$Http.doPostForForm(
                        this,
                        "account/role/delete",
                        {
                            id: id
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '删除角色成功!'
                            });
                            self.loadRoleList();
                        }
                    )
                }).catch(() => {

                })
            },
            /**
             * @Description : 菜单权限树自定义渲染
             * @Author : cheng fei
             * @CreateDate 2019/4/30 0:29
             */
            menuPermissionTreeRenderContent(h, {node, data, store}) {
                return h(
                    'div',
                    node.data.menu ? {class: "menu_node"} : {class: "permission_node"},
                    node.label
                );
            },
            /**
             * @Description : 为菜单权限树自定义class加载css
             * @Author : cheng fei
             * @CreateDate 2019/4/30 0:31
             */
            setPermissionNodeCss() {
                let func = function (_this) {
                    // levelname是上面的最底层节点的名字
                    let levelName = document.getElementsByClassName('permission_node');
                    if (_this.$ObjectUtil.isBlank(levelName) || levelName.length === 0) {
                        window.setTimeout(function () {
                            func(_this);
                        }, 10);
                    } else {
                        for (let i = 0; i < levelName.length; i++) {
                            // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
                            // 最底层的节点，包括多选框和名字都让他左浮动
                            levelName[i].parentNode.style.cssFloat = 'left';
                            levelName[i].parentNode.style.styleFloat = 'left';
                        }
                    }
                };
                func(this);
            },
            /**
             * @Description : 开启关闭角色权限窗口
             * @Author : cheng fei
             * @CreateDate 2019/4/28 23:03
             */
            openOrCloseRolePermissionWindow(value, role) {
                this.menuPermissionWindow = value;
                if (value) {
                    //开启窗口
                    this.menuPermissionWindowTitle = '【 ' + role.name + ' 】- 权限设置';
                    this.chooseRoleId = role.id;
                    this.loadRolePermissionTree();
                    this.loadRolePermission();
                    this.$nextTick(function () {
                        this.setPermissionNodeCss()
                    })
                } else {
                    //关闭窗口
                    this.menuPermissionWindowTitle = "";
                    this.chooseRoleId = "";
                    this.rolePermissionData = [];
                    // this.menuPermissionTreeData = [];
                }
            },
            /**
             * @Description : 加载权限树
             * @Author : cheng fei
             * @CreateDate 2019/4/29 21:51
             */
            loadRolePermissionTree() {
                this.$Http.doPostForForm(
                    this,
                    "system/menu/permission/tree",
                    {},
                    function (self, data) {
                        self.menuPermissionTreeData = data.data
                    }
                )
            },
            /**
             * @Description : 加载角色权限
             * @Author : cheng fei
             * @CreateDate 2019/4/30 2:22
             */
            loadRolePermission() {
                this.$Http.doPostForForm(
                    this,
                    "account/role/permission/get",
                    {
                        id: this.chooseRoleId
                    },
                    function (self, data) {
                        if (self.$ObjectUtil.isNotBlank(data.data)) {
                            self.$refs.menuPermissionTree.setCheckedKeys(data.data)
                        } else {
                            self.$refs.menuPermissionTree.setCheckedKeys([])
                        }
                    }
                )
            },
            submitRolePermission() {
                let rolePermissionNodes = this.$refs.menuPermissionTree.getCheckedNodes(false, true);
                let rolePermissions = [];
                for (let i in rolePermissionNodes) {
                    rolePermissions.push(rolePermissionNodes[i].id)
                }
                this.$Http.doPostForForm(
                    this,
                    "account/role/permission/update",
                    {
                        id: this.chooseRoleId,
                        permissions: rolePermissions.length > 0 ? rolePermissions.join(",") : ""
                    },
                    function (self, data) {
                        self.openOrCloseRolePermissionWindow(false);
                        self.$message({
                            type: 'success',
                            message: '修改角色权限成功！'
                        });
                    }
                )

            }

        }
    }
</script>

<style lang="less" scoped>
    @import "role.less";
    @import "../../../styles/commons.less";
</style>
