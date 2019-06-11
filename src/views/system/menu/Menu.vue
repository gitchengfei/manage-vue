<template>
    <div>
        <div>
            <!-- 移动端 -->
            <div v-if="!isPc">
                <el-collapse v-model="activeName" accordion>
                    <!-- 筛选条件 -->
                    <el-collapse-item name="1">
                        <template slot="title">
                            <span style="padding-left: 5px;font-size: 2vh;">父菜单：{{choseParentPath}}</span>
                        </template>
                        <el-form label-position="left" inline class="demo-table-expand" style="margin-left: 7vw">
                            <el-form-item label="" size="mini">
                                <div style="font-size: 16px" v-if="pagePermission.SystemMenuList">
                                    <el-tree ref="menuTree" :accordion="true" :props="menuTreeProps"
                                             :load="loadMenuTreeNode"
                                             :data="menuTreeData" node-key="id"
                                             lazy :highlight-current="true" @node-click="clickMenuTreeNode">
                                    </el-tree>
                                </div>
                            </el-form-item>
                            <p>
                                <el-button type="primary" size="mini" @click="doSearch()"
                                           style="margin-left: 1vw;">查看菜单列表
                                </el-button>
                                <el-button v-if="pagePermission.SystemMenuSave"
                                           type="primary" size="mini"
                                           @click="openOrCloseMenuWindow(true)">新增菜单
                                </el-button>
                            </p>
                        </el-form>
                    </el-collapse-item>

                    <!-- 数据列表 -->
                    <el-collapse-item name="2">
                        <template slot="title">
                            <span style="padding-left: 5px;font-size: 2vh">菜单列表</span>
                        </template>
                        <el-table :data="menuList" :border="true" :show-header="false" style="width: 100%" row-key="id"
                                  :row-class-name="$TableRowClassName" :empty-text="emptyText">
                            <el-table-column>
                                <template slot-scope="props">
                                    <el-form label-position="left" inline class="demo-table-expand">
                                        <el-form-item label="菜单名：" size="mini">
                                            <span>{{ props.row.name }}</span>
                                        </el-form-item>
                                        <el-form-item label="URL：" size="mini">
                                            <span>{{ props.row.url }}</span>
                                        </el-form-item>
                                        <p>
                                            <el-form-item label="状态：">
                                                <el-switch
                                                    v-model="props.row.status"
                                                    active-color="#13ce66"
                                                    inactive-color="#ff4949"
                                                    :disabled='!pagePermission.SystemMenuUpdateStatus'
                                                    @change="updateMenuStatus(props.row)">
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
                                                        <span>{{ props.row.createName ? props.row.createName : '-' }}
                                                        </span>
                                                    </el-form-item>
                                                    <el-form-item label="创建时间：" size="mini">
                                                        <span>{{ props.row.createTime ?
                                                            $DateUtil.getDateTime(props.row.createTime) : '-' }}
                                                        </span>
                                                    </el-form-item>
                                                </p>
                                                <p>
                                                    <el-form-item label="修改人：" size="mini">
                                                        <span>{{ props.row.updateName ? props.row.updateName : '-' }}
                                                        </span>
                                                    </el-form-item>
                                                    <el-form-item label="修改时间：" size="mini">
                                                        <span>{{ props.row.updateTime ?
                                                            $DateUtil.getDateTime(props.row.updateTime) : '-' }}
                                                        </span>
                                                    </el-form-item>
                                                </p>

                                            </div>
                                        </el-collapse-transition>
                                        <p>
                                            <el-form-item size="mini">
                                                <el-button type="text" size="mini"
                                                           :disabled="!pagePermission.SystemMenuUpdate"
                                                           @click="openOrCloseMenuWindow(true, props.row)">
                                                    编辑
                                                </el-button>
                                                <el-button type="text" size="mini"
                                                           :disabled="!pagePermission.SystemMenuDelete"
                                                           @click="deleteMenu(props.row.id)">删除
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
            <div v-else>
                <div class="table-left border-r" style="min-width: 200px">
                    <div class="header-top">
                        <span style="color: #000000">菜单</span>
                        <el-button class="btnbox-r fl-r" v-if="pagePermission.SystemMenuSave"
                                   style="margin-top: 13px;"
                                   type="primary" size="mini"
                                   @click="openOrCloseMenuWindow(true)">新增菜单
                        </el-button>
                    </div>
                    <div style="font-size: 16px" v-if="pagePermission.SystemMenuList">
                        <el-tree ref="menuTree" :accordion="true" :props="menuTreeProps" :load="loadMenuTreeNode"
                                 :data="menuTreeData" node-key="id"
                                 lazy :highlight-current="true" @node-click="clickMenuTreeNode">
                        </el-tree>
                    </div>
                    <div style="height: 50px; color: #909399; text-align:center; line-height: 50px" v-else>
                        {{emptyText}}
                    </div>
                </div>
                <div class="table-right">
                    <div class="header-top1">
                        <span style="color: #000000">数据列表</span>
                    </div>
                    <div>
                        <el-table :data="menuList" :border="true" style="width: 100%" row-key="id"
                                  :row-class-name="$TableRowClassName" :empty-text="emptyText">
                            <el-table-column label="编号" align="center" width="80">
                                <template scope="scope">
                                    <span v-text="scope.$index+1"></span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="菜单名" align="center" width="100"></el-table-column>
                            <el-table-column prop="url" label="URL" align="center"></el-table-column>
                            <el-table-column prop="displayOrder" label="排序码" align="center"
                                             width="80"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" align="center"
                                             :formatter="$DateUtil.formatByElementTable" width="180"></el-table-column>
                            <el-table-column prop="createName" label="创建人" align="center"
                                             :formatter="$StringUtil.formatByElementTable"
                                             width="150"></el-table-column>
                            <el-table-column prop="updateTime" label="修改时间" align="center"
                                             :formatter="$DateUtil.formatByElementTable" width="180"></el-table-column>
                            <el-table-column prop="updateName" label="修改人" align="center"
                                             :formatter="$StringUtil.formatByElementTable"
                                             width="150"></el-table-column>
                            <el-table-column prop="status" label="状态" align="center" width="80">
                                <template slot-scope="scope">
                                    <el-switch
                                        v-model="scope.row.status"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        :disabled='!pagePermission.SystemMenuUpdateStatus'
                                        @change="updateMenuStatus(scope.row)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="150">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini"
                                               :disabled="!pagePermission.SystemMenuUpdate"
                                               @click="openOrCloseMenuWindow(true, scope.row)">
                                        编辑
                                    </el-button>
                                    <el-button type="danger" size="mini"
                                               :disabled="!pagePermission.SystemMenuDelete"
                                               @click="deleteMenu(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>

        <!--表单-->
        <el-dialog :title="menuForm.menuFormTitle" :visible.sync="menuForm.openOrClose" :width=" isPc ? '60%' : '90%'"
                   :top=" isPc ? '10vh' : '5vh'">
            <el-form :model="menuForm" :rules="menuFormRules" ref="menuForm">
                <el-form-item label="父菜单" prop="parentId">
                    <span>{{menuForm.parentPath === "" ? "顶级菜单" : menuForm.parentPath}}</span>
                    <br>
                    <el-button v-if="menuForm.id !== ''" type="primary" size="small"
                               @click="openOrCloseUpdateMenuTreeWindow(true)">修改父菜单
                    </el-button>
                    <input type="hidden" name="id" v-model="menuForm.id"/>
                    <input type="hidden" name="parentId" v-model="menuForm.parentId"/>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input type="text" v-model="menuForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="URL" prop="url">
                    <el-input type="text" v-model="menuForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序码" prop="displayOrder">
                    <el-input type="text" v-model="menuForm.displayOrder" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseMenuWindow(false)">取消</el-button>
                <!--<el-button type="primary" @click.native="submitMenuForm()" :loading="formLoading">提交</el-button>-->
                <el-button type="primary" @click.native="submitMenuForm()">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改父菜单" :visible.sync="menuTreeWindow" width="50%" top="15vh">
            <div>
                <div>父菜单:{{updateParentMenuPath}}</div>
            </div>
            <div>
                <el-tree ref="updateMenuTree" :accordion="true" :props="menuTreeProps"
                         :load="loadUpdateParentMenuTreeNode"
                         :data="updateParentMenuTreeDate"
                         :lazy="true" :highlight-current="true" @node-click="clickUpdateParentMenuNode">
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseUpdateMenuTreeWindow(false)">取消</el-button>
                <el-button type="primary" @click.native="submitUpdateMenu">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Menu",
        data() {
            let _this = this;
            /**
             * @Description : 检测菜单名称函数
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:30
             * @Param
             */
            let validateName = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "system/menu/check/name",
                        {
                            id: _this.menuForm.id,
                            parentId: _this.menuForm.parentId,
                            name: _this.menuForm.name
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("[ " + value + " ]菜单已存在!")
                            }
                        }
                    )
                } else {
                    callback("请输入菜单名称!")
                }
            };
            /**
             * @Description : 检测菜单URL函数
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:29
             * @Param
             */
            let validateURL = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if ("#" === value) {
                        callback()
                    } else {
                        _this.$Http.doPostCheckParam(
                            _this,
                            "system/menu/check/url",
                            {
                                id: _this.menuForm.id,
                                url: value
                            },
                            function (self, data) {
                                if (data.data) {
                                    callback()
                                } else {
                                    callback("[ " + value + " ]已存在!")
                                }
                            }
                        )
                    }
                } else {
                    callback("请输入菜单URL!")
                }
            };
            /**
             * @Description : 检测排序码
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:34
             * @Param
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
                //移动端显示内容
                activeName: '2',
                //
                choseParentPath: '顶级菜单',
                //页面按钮权限(权限url首字母大写,否则不能动态修改)
                pagePermission: {
                    SystemMenuList: false,
                    SystemMenuSave: false,
                    SystemMenuUpdateStatus: false,
                    SystemMenuUpdate: false,
                    SystemMenuDelete: false,
                },
                //菜单树属性设置
                menuTreeProps: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'hasChildren'
                },
                //菜单树数据
                menuTreeData: [
                    {
                        id: 0,
                        name: "顶级菜单",
                        parentId: -1,
                        children: [],
                        hasChildren: false
                    }
                ],
                //选中的菜单树节点
                menuTreeLoadNode: null,
                //加载树的回调
                menuTreeNodeResolve: null,
                //选中菜单树节点data
                selectMenuTreeNode: "",
                //菜单列表
                menuList: [],
                //菜单表单
                menuForm: {
                    //表单开关
                    openOrClose: false,
                    //表单名称
                    menuFormTitle: "",
                    //id
                    id: "",
                    //父节点路径
                    parentPath: "",
                    //父节点ID
                    parentId: 0,
                    //菜单名称
                    name: "",
                    //url
                    url: "",
                    //排序码
                    displayOrder: "",
                    //更新时间
                    updateTime: "",
                },
                //菜单标点验证
                menuFormRules: {
                    name: [
                        {required: true, message: "菜单名称不能为空!", trigger: "blur"},
                        {validator: validateName}
                    ],
                    url: [
                        {required: true, message: "菜单URL不能为空!", trigger: "blur"},
                        {validator: validateURL}
                    ],
                    displayOrder: [
                        {required: true, message: "菜单排序码不能为空!", trigger: "blur"},
                        {validator: validateDisplayOrder}
                    ]
                },
                //菜单树窗口开关
                menuTreeWindow: false,
                //修改后的父菜单路径
                updateParentMenuPath: "",
                updateParentMenuTreeDate: [
                    {
                        id: 0,
                        name: "顶级菜单",
                        parentId: '',
                        children: [],
                        hasChildren: false
                    }
                ],
                //修改菜单树的选中节点
                updateParentMenuNode: null
            }
        },
        computed: {
            //数据为空时描述
            emptyText() {
                if (this.pagePermission.SystemMenuList) {
                    return "暂无数据"
                } else {
                    return "您无查看权限！"
                }
            },
        },
        async mounted() {
            this.isPc = this.$IsPC();
            //页面按钮权限(权限url首字母大写,否则不能动态修改)
            await this.$GetAccountMenuPermission(this.pagePermission);
            //加载菜单列表
            this.loadMenuList();
        },
        methods: {
            /**
             * @Description : 移动端查看更多
             * @Author : cheng fei
             * @CreateDate 2019/5/30 15:02
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
             * @Description :
             * @Author : cheng fei
             * @CreateDate 2019/5/30 14:42
             * @Param
             */
            doSearch() {
                this.activeName = '2';
            },
            /**
             * @Description : 懒加载菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/3/30 0:29
             * @Param
             */
            loadMenuTreeNode(node, resolve) {
                let parentId = "";
                if (node.level === 0) {
                    resolve(this.menuTreeData);
                    this.menuTreeLoadNode = node.childNodes[0];
                    this.refreshTreeNode()
                } else {
                    parentId = this.$StringUtil.isBlank(node.data.id) ? 0 : node.data.id;
                    this.$Http.doPostForForm(
                        this,
                        "system/menu/tree",
                        {
                            parentId: parentId
                        },
                        function (self, data) {
                            if (self.$ObjectUtil.isNotBlank(data.data)) {
                                for (let i in data.data) {
                                    data.data[i].hasChildren = !data.data[i].hasChildren
                                }
                            }
                            let children = self.$ObjectUtil.isBlank(data.data) ? [] : data.data;
                            if (node.level === 0) {
                                self.menuTreeData = children
                            } else {
                                self.$set(node.data, "children", children)
                            }
                            resolve(children)
                        }
                    )
                }
            },
            /**
             * @Description : 刷新树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/3 0:35
             * @Param node 刷新节点
             * @Param isExpanded 节点展开状态(true/false, 默认true)
             */
            refreshTreeNode(node, isExpanded) {

                if (this.$StringUtil.isBlank(isExpanded)) {
                    isExpanded = true
                }

                if (this.$ObjectUtil.isBlank(node)) {
                    node = this.menuTreeLoadNode;
                }
                let theChildren = node.childNodes;
                theChildren.splice(0, theChildren.length);
                this.$Http.doPostForForm(
                    this,
                    "system/menu/tree",
                    {
                        parentId: node.data.id
                    },
                    function (self, data) {
                        if (self.$ObjectUtil.isNotBlank(data.data)) {
                            for (let i in data.data) {
                                data.data[i].hasChildren = !data.data[i].hasChildren
                            }
                        }
                        let children = self.$ObjectUtil.isBlank(data.data) ? [] : data.data;
                        if (children.length > 0) {
                            node.doCreateChildren(children);
                            node.data.children = children;
                        }
                        if (node.childNodes.length > 0) {
                            node.isLeaf = false;
                            node.expanded = isExpanded;
                        } else {
                            node.isLeaf = true;
                        }
                    }
                )
            },
            /**
             * @Description : 点击菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/3/30 2:05
             * @Param
             */
            clickMenuTreeNode(data, node) {
                this.menuTreeLoadNode = node;
                this.selectMenuTreeNode = this.$ObjectUtil.isBlank(data) ? "" : data;
                this.loadMenuList();
                if (!this.isPc) {
                    this.choseParentPath = this.$TreeUtil.getAllParentNodePathById(data.id, this.menuTreeData, "id", "parentId", "children", "name", true);
                }
            },
            /**
             * @Description : 加载菜单列表
             * @Author : cheng fei
             * @CreateDate 2019/3/30 1:13
             * @Param
             */
            loadMenuList() {
                if (this.pagePermission.SystemMenuList) {
                    let parentId = 0;
                    if (this.$StringUtil.isNotBlank(this.selectMenuTreeNode)) {
                        parentId = this.selectMenuTreeNode.id
                    }
                    this.$Http.doPostForForm(
                        this,
                        "system/menu/list",
                        {
                            parentId: parentId
                        },
                        function (self, data) {
                            if (self.$ObjectUtil.isNotBlank(data.data)) {
                                self.menuList = data.data;
                                if (!self.isPc) {
                                    if (self.menuList && self.menuList.length > 0) {
                                        self.menuList.forEach((item) => {
                                            self.$set(item, 'showMore', false);
                                            self.$set(item, 'icon', 'el-icon-arrow-down')
                                        })
                                    }
                                }
                            } else {
                                self.menuList = []
                            }
                        }
                    )
                }
            },
            /**
             * @Description : 开启添加菜单窗窗口
             * @Author : cheng fei
             * @CreateDate 2019/3/30 1:53
             * @Param
             */
            openOrCloseMenuWindow(value, data) {
                if (value) {
                    //开启表单
                    if (this.$ObjectUtil.isNotBlank(data)) {
                        //修改菜单
                        this.menuForm.openOrClose = value;
                        this.menuForm.menuFormTitle = "修改菜单";
                        this.menuForm.id = data.id;
                        this.menuForm.parentId = data.parentId;
                        this.menuForm.name = data.name;
                        this.menuForm.url = data.url;
                        this.menuForm.displayOrder = data.displayOrder;
                        this.menuForm.updateTime = data.updateTime;
                        this.menuForm.parentPath = this.$TreeUtil.getAllParentNodePathById(parentId, this.menuTreeData, "id", "parentId", "children", "name", true);
                    } else {
                        //添加菜单
                        this.menuForm.menuFormTitle = "添加菜单";
                        if (this.$ObjectUtil.isBlank(this.selectMenuTreeNode)){
                            this.$confirm("未选中父菜单！", '错误', {
                                confirmButtonText: '确定',
                                showCancelButton: false,
                                type: 'error',
                                showClose: true,
                            }).then(() => {
                            });
                            return;
                        }
                        this.menuForm.openOrClose = value;
                        this.menuForm.parentId = this.$ObjectUtil.isBlank(this.selectMenuTreeNode) ? 0 : this.selectMenuTreeNode.id;
                        //获取父节点地址
                        if (this.$ObjectUtil.isNotBlank(this.selectMenuTreeNode)) {
                            this.menuForm.parentPath = this.$TreeUtil.getAllParentNodePathByNode(this.selectMenuTreeNode, this.menuTreeData, "id", "parentId", "children", "name", true);
                        }
                    }

                } else {
                    //关闭表单,重置数据
                    this.menuForm.openOrClose = value;
                    this.menuForm.openOrClose = false;
                    this.menuForm.menuFormTitle = "";
                    this.menuForm.parentPath = "";
                    this.menuForm.id = "";
                    this.menuForm.parentId = "";
                    this.menuForm.name = "";
                    this.menuForm.url = "";
                    this.menuForm.displayOrder = "";
                    //重置验证
                    this.$refs["menuForm"].resetFields();
                }
            },
            /**
             * @Description : 提交菜单表单
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:43
             * @Param
             */
            submitMenuForm() {
                this.$refs["menuForm"].validate(valid => {
                    if (valid) {
                        let param = {
                            name: this.menuForm.name,
                            url: this.menuForm.url,
                            displayOrder: this.menuForm.displayOrder,
                        };
                        let url = "";
                        if (this.menuForm.id === "") {
                            url = "system/menu/save";
                            if (this.$ObjectUtil.isBlank(this.selectMenuTreeNode)) {
                                param.parentId = 0
                            } else {
                                param.parentId = this.selectMenuTreeNode.id
                            }
                        } else {
                            url = "system/menu/update";
                            param.id = this.menuForm.id;
                            param.parentId = this.menuForm.parentId;
                            param.updateTime = this.$StringUtil.isBlank(this.menuForm.updateTime) ? "" : this.$DateUtil.formatTimestampForDateTime(this.menuForm.updateTime);
                        }
                        this.$Http.doPostForForm(
                            this,
                            url,
                            param,
                            function (self, data) {
                                self.$message({
                                    type: 'success',
                                    message: self.menuForm.id === "" ? '新增菜单成功!' : '修改菜单成功!'
                                });
                                data.data.hasChildren = !data.data.hasChildren;
                                if (self.menuForm.id !== "" && self.menuTreeLoadNode.data.id !== param.parentId) {
                                    //修改父菜单时,刷新另一父菜单节点
                                    let node = self.$refs.menuTree.getNode(self.menuForm.parentId);
                                    self.refreshTreeNode(node, true);
                                    self.refreshTreeNode("", false);
                                } else {
                                    self.refreshTreeNode();
                                }
                                self.openOrCloseMenuWindow(false);
                                self.loadMenuList()
                            }
                        )
                    }
                })
            },
            /**
             * @Description : 执行修改菜单状态
             * @Author : cheng fei
             * @CreateDate 2019/5/28 15:57
             * @Param menu 菜单
             */
            doUpdateMenuStatus(menu) {
                this.$Http.doPostForForm(
                    this,
                    "system/menu/update/status",
                    {
                        id: menu.id,
                        status: menu.status,
                        updateTime: this.$StringUtil.isBlank(menu.updateTime) ? "" : this.$DateUtil.formatTimestampForDateTime(menu.updateTime)
                    },
                    function (self, data) {
                        self.loadMenuList();
                        self.$message({
                            type: 'success',
                            message: menu.status ? '启用菜单成功！' : '禁用菜单成功！'
                        });
                    },
                    function (self) {
                        self.loadMenuList();
                    }
                )
            },
            /**
             * @Description : 删除菜单
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:27
             * @Param menu 菜单
             */
            updateMenuStatus(menu) {
                if (menu.status) {
                    this.doUpdateMenuStatus(menu)
                } else {
                    this.$confirm('确认要禁用该菜单,禁用后该菜单以及其子菜单都不可用？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.doUpdateMenuStatus(menu)
                    }).catch(() => {
                        menu.status = !menu.status
                    });
                }
            },
            /**
             * @Description : 删除菜单
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:27
             * @Param id 菜单ID
             */
            deleteMenu(id) {
                this.$confirm('确认要删除该菜单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$Http.doPostForForm(
                        this,
                        "system/menu/delete",
                        {
                            id: id
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '删除菜单成功!'
                            });
                            self.loadMenuList();
                            self.refreshTreeNode();
                        }
                    )
                }).catch(() => {
                });
            },
            /**
             * @Description : 开启关闭菜单树窗口-用户修改菜单父节点
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:28
             * @Param
             */
            openOrCloseUpdateMenuTreeWindow(value) {
                this.menuTreeWindow = value;
                if (value) {
                    //开启
                } else {
                    //关闭
                    this.updateParentMenuNode = null;
                    this.updateParentMenuPath = "";
                }
            },
            /**
             * @Description : 提交修改父菜单
             * @Author : cheng fei
             * @CreateDate 2019/4/3 2:13
             * @Param
             */
            submitUpdateMenu() {
                this.menuForm.parentPath = this.updateParentMenuPath
                this.menuForm.parentId = this.updateParentMenuNode.data.id
                this.openOrCloseUpdateMenuTreeWindow(false)
            },
            /**
             * @Description : 加载修改父菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:44
             * @Param
             */
            loadUpdateParentMenuTreeNode(node, resolve) {
                let parentId = "";
                if (node.level === 0) {
                    resolve(this.updateParentMenuTreeDate);
                    this.clickUpdateParentMenuNode(node.childNodes[0].data, node.childNodes[0]);
                    this.refreshUpdateTreeNode();

                } else {
                    this.$Http.doPostForForm(
                        this,
                        "system/menu/tree",
                        {
                            parentId: node.data.id,
                            excludeId: this.menuForm.id
                        },
                        function (self, data) {
                            if (self.$ObjectUtil.isNotBlank(data.data)) {
                                for (let i in data.data) {
                                    data.data[i].hasChildren = !data.data[i].hasChildren
                                }
                                if (node.level === 0) {
                                    self.menuTreeData = data.data
                                } else {
                                    self.$set(node.data, "children", data.data)
                                }
                                resolve(data.data)
                            }
                        }
                    )
                }
            },
            /**
             * @Description : 刷新修改父节点树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/3 0:35
             * @Param
             */
            refreshUpdateTreeNode() {
                let theChildren = this.updateParentMenuNode.childNodes;
                theChildren.splice(0, theChildren.length);
                this.$Http.doPostForForm(
                    this,
                    "system/menu/tree",
                    {
                        parentId: this.updateParentMenuNode.data.id,
                        excludeId: this.menuForm.id
                    },
                    function (self, data) {
                        if (self.$ObjectUtil.isNotBlank(data.data)) {
                            for (let i in data.data) {
                                data.data[i].hasChildren = !data.data[i].hasChildren
                            }
                        }
                        let children = self.$ObjectUtil.isBlank(data.data) ? [] : data.data;
                        if (children.length > 0) {
                            self.updateParentMenuNode.doCreateChildren(children);
                            self.updateParentMenuNode.data.children = children;
                        }
                        if (self.updateParentMenuNode.childNodes.length > 0) {
                            self.updateParentMenuNode.isLeaf = false;
                            self.updateParentMenuNode.expanded = true;
                        } else {
                            self.updateParentMenuNode.isLeaf = true;
                        }
                    }
                )
            },
            /**
             * @Description : 点击修改父菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/1 2:02
             * @Param
             */
            clickUpdateParentMenuNode(data, node) {
                this.updateParentMenuNode = node;
                this.updateParentMenuPath = this.$TreeUtil.getAllParentNodePathByNode(data, this.updateParentMenuTreeDate, "id", "parentId", "children", "name", true);
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "Menu.less";
    @import "../../../styles/commons.less";
</style>
