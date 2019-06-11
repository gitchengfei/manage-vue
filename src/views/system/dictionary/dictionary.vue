<template>
    <div>
        <!-- 移动端 -->
        <div v-if="!isPc">
            <div>
                <div>
                    <el-form>
                        <el-form-item size="mini">
                            <div>

                                <div style="float: left">
                                    <el-button type="text" size="small"
                                               @click="goBack()">返回上一级
                                    </el-button>
                                    <el-button type="text" size="small"
                                               @click="openOrCloseDictionaryWindow(true)"
                                               v-if="pagePermission.SystemDictionarySave">新增数据字典
                                    </el-button>
                                </div>

                                <div align="right" style="float: right">
                                    <span style="color: #909399">每页显示记录数：</span>
                                    <el-select v-model="pageSize" placeholder="请选择" @change="handleSizeChange" style="width: 15vw; height: 10px">
                                        <el-option value=3 label=3></el-option>
                                        <el-option value=5 label=5></el-option>
                                        <el-option value=10 label=10></el-option>
                                        <el-option value=15 label=15></el-option>
                                        <el-option value=20 label=20></el-option>
                                        <el-option value=50 label=50></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item size="mini">
                            <el-breadcrumb separator-class="el-icon-arrow-right">
                                <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
                                    <el-button type="text" @click="changParentDictionary(item, index)">{{item.name}}
                                    </el-button>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                            <span style="color: red; font-size: 14px">*备注：删除数据字典或修改数据字典固定编码时，请先全局搜索源码是否在源码中使用该固定编码，慎重操作！以免影响引起程序异常！</span>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div>
                <!-- <div>
                     <span></span>
                 </div>-->
                <el-table :data="dictionaryList" :show-header="true" border :border="true"
                          :row-class-name="$TableRowClassName" :empty-text="emptyText">
                    <el-table-column label="数据列表">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item size="mini">
                                    <span>名称：</span>
                                    <el-button type="text" size="medium" @click="clickDictionary(props.row)">
                                        {{props.row.name}}
                                    </el-button>
                                </el-form-item>
                                <p>
                                    <el-form-item label="Key：" size="mini">
                                        <span>{{ props.row.key }}</span>
                                    </el-form-item>
                                    <el-form-item label="value：" size="mini">
                                        <span>{{ props.row.value ? props.row.value : '-' }}</span>
                                    </el-form-item>
                                </p>
                                <p>
                                    <el-form-item label="状态：">
                                        <el-switch
                                            v-model="props.row.status"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            :disabled="!pagePermission.SystemDictionaryUpdateStatus"
                                            @change="updateDictionaryStatus(props.row)">
                                        </el-switch>
                                    </el-form-item>
                                </p>
                                <el-collapse-transition>
                                    <div class="transition-box" v-show="props.row.showMore">
                                        <el-form-item label="排序码：" size="mini">
                                            <span>{{ props.row.displayOrder}}</span>
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
                                        <el-button type="text" size="mini"
                                                   :disabled="!pagePermission.SystemDictionaryUpdate"
                                                   @click="openOrCloseDictionaryWindow(true, props.row)">
                                            编辑
                                        </el-button>
                                        <el-button type="text" size="mini"
                                                   :disabled="!pagePermission.SystemDictionaryDelete"
                                                   @click="deleteDictionary(props.row.id)">删除
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
            </div>
        </div>

        <!-- PC -->
        <div v-else>
            <div>
                <el-button style="margin-top: 2vh;" type="primary" size="small"
                           @click="openOrCloseDictionaryWindow(true)" v-if="pagePermission.SystemDictionarySave">新增
                </el-button>
                <el-button style="margin-top: 2vh;" type="primary" size="small"
                           @click="goBack()">返回上一级
                </el-button>
            </div>
            <div style="margin: 2vh 0vw 2vh 1.5vw;">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
                        <el-button type="text" @click="changParentDictionary(item, index)">{{item.name}}</el-button>
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <span style="color: red; font-size: 18px">*备注：删除数据字典或修改数据字典固定编码时，请先全局搜索源码是否在源码中使用该固定编码，慎重操作！以免影响引起程序异常！</span>
            </div>
            <div>
                <div>
                    <el-table :data="dictionaryList" :border="true" style="width: 100%" row-key="id"
                              :row-class-name="$TableRowClassName" :empty-text="emptyText">
                        <el-table-column label="编号" align="center" width="70">
                            <template scope="scope">
                                <span v-text="scope.$index+1"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称" align="center" width="200">
                            <template scope="scope">
                                <el-button type="text" @click="clickDictionary(scope.row)">{{scope.row.name}}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="key" label="key" align="center"></el-table-column>
                        <el-table-column prop="value" label="value" align="center" width="100"
                                         :formatter="$StringUtil.formatByElementTable"></el-table-column>
                        <el-table-column prop="displayOrder" label="排序码" align="center" width="80"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="$DateUtil.formatByElementTable"
                                         width="180"></el-table-column>
                        <el-table-column prop="createName" label="创建人" align="center" :formatter="$StringUtil.formatByElementTable"
                                         width="130"></el-table-column>
                        <el-table-column prop="updateTime" label="修改时间" align="center" :formatter="$DateUtil.formatByElementTable"
                                         width="180"></el-table-column>
                        <el-table-column prop="updateName" label="修改人" align="center" :formatter="$StringUtil.formatByElementTable"
                                         width="130"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center" width="80">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :disabled="!pagePermission.SystemDictionaryUpdateStatus"
                                    @change="updateDictionaryStatus(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" :disabled="!pagePermission.SystemDictionaryUpdate"
                                           @click="openOrCloseDictionaryWindow(true, scope.row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" size="mini" :disabled="!pagePermission.SystemDictionaryDelete"
                                           @click="deleteDictionary(scope.row.id)">删除
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
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="pageSize"
                    :layout="isPc ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
                    :small="!isPc"
                    :total="total"
                    prev-text="上一页"
                    next-text="下一页">
                </el-pagination>
            </div>
        </div>

        <!-- 表单 -->
        <el-dialog :title="dictionaryForm.dictionaryFormTitle" :visible.sync="dictionaryForm.openOrClose" :width="isPc ? '60%' : '90%'"
                   :top="isPc ? '10vh' : '2vh'">
            <el-form :model="dictionaryForm" :rules="dictionaryFormRules" ref="dictionaryForm">
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="dictionaryForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="key" prop="key">
                    <el-input type="text" v-model="dictionaryForm.key" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="value" prop="value">
                    <el-input type="text" v-model="dictionaryForm.value" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序码" prop="displayOrder">
                    <el-input type="text" v-model="dictionaryForm.displayOrder" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseDictionaryWindow(false)">取消</el-button>
                <el-button type="primary" @click="submitDictionaryForm()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "dictionary",
        data() {
            let _this = this;
            /**
             * @Description : 检测数据字典名称
             * @Author : cheng fei
             * @CreateDate 2019/4/10 23:49
             * @Param
             */
            let validateName = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "system/dictionary/check/name",
                        {
                            id: _this.dictionaryForm.id,
                            parentId: _this.dictionaryForm.parentId,
                            name: _this.dictionaryForm.name
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("[ " + value + " ]数据字典已存在!")
                            }
                        }
                    )
                } else {
                    callback("请输入数据字典名称!")
                }
            };
            /**
             * @Description : 检测数据字典key
             * @Author : cheng fei
             * @CreateDate 2019/4/10 23:55
             * @Param
             */
            let validateKey = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "system/dictionary/check/key",
                        {
                            id: _this.dictionaryForm.id,
                            key: _this.dictionaryForm.key
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("key[ " + value + " ]已存在!")
                            }
                        }
                    )
                } else {
                    callback("请输入key!")
                }
            };
            /**
             * @Description : 检测数据字典value
             * @Author : cheng fei
             * @CreateDate 2019/4/10 23:55
             * @Param
             */
            let validateValue = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "system/dictionary/check/value",
                        {
                            id: _this.dictionaryForm.id,
                            parentId: _this.dictionaryForm.parentId,
                            value: _this.dictionaryForm.value
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("value[ " + value + " ]已存在!")
                            }
                        }
                    )
                } else {
                    callback()
                }
            };
            /**
             * @Description : 检测排序码
             * @Author : cheng fei
             * @CreateDate 2019/4/11 0:00
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
                //页面按钮权限(权限url首字母大写,否则不能动态修改)
                pagePermission: {
                    SystemDictionaryList: false,
                    SystemDictionarySave: false,
                    SystemDictionaryUpdate: false,
                    SystemDictionaryUpdateStatus: false,
                    SystemDictionaryDelete: false
                },
                //数据字典列表
                dictionaryList: [],
                //数据字典总数
                total: 0,
                //当前选中页码
                currentPage: 1,
                //每页加载条数
                pageSize: 10,
                //道行面包屑数据
                breadcrumbList: [
                    {
                        id: 0,
                        name: "顶级",
                    }
                ],
                //当前选中的数据字典
                selectDictionary: "",

                //数据字典表单数据
                dictionaryForm: {
                    //表单标题
                    dictionaryFormTitle: "",
                    //表单是否打开
                    openOrClose: false,
                    //id
                    id: "",
                    //父级ID
                    parentId: 0,
                    //名称
                    name: "",
                    //key
                    key: "",
                    //value
                    value: "",
                    //排序码
                    displayOrder: "",
                    //修改时间
                    updateTime: "",
                },
                //表单验证
                dictionaryFormRules: {
                    name: [
                        {required: true, message: "数据字典名称不能为空!", trigger: "blur"},
                        {validator: validateName}
                    ],
                    key: [
                        {required: true, message: "数据字典key不能为空!", trigger: "blur"},
                        {validator: validateKey}
                    ],
                    value: [
                        {validator: validateValue}
                    ],
                    displayOrder: [
                        {required: true, message: "排序码不能为空!", trigger: "blur"},
                        {validator: validateDisplayOrder}
                    ]
                }
            }
        },
        computed: {
            //数据为空时描述
            emptyText() {
                if (this.pagePermission.SystemDictionaryList) {
                    return "暂无数据"
                } else {
                    return "您无查看权限！"
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
            //加载页面按钮权限
            await this.$GetAccountMenuPermission(this.pagePermission);
            //加载数据字典列表
            this.loadDictionaryList()
        },
        /**
         * @Description : 加载数据字典列表
         * @Author : cheng fei
         * @CreateDate 2019/4/15 23:11
         */
        methods: {
            /**
             * @Description : 移动端显示更多
             * @Author : cheng fei
             * @CreateDate 2019/5/30 16:52
             * @Param
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
             * @Description : 加载数据字典列表
             * @Author : cheng fei
             * @CreateDate 2019/4/15 23:22
             * @Param
             */
            loadDictionaryList() {
                if (this.pagePermission.SystemDictionaryList) {
                    let url = "system/dictionary/list";
                    let params = {
                        parentId: this.$ObjectUtil.isBlank(this.selectDictionary) ? 0 : this.selectDictionary.id,
                        page: this.currentPage,
                        pageSize: this.pageSize
                    };
                    this.$Http.doPostForForm(
                        this,
                        url,
                        params,
                        function (self, data) {
                            self.dictionaryList = data.data.rows;
                            self.total = data.data.count;
                            if (!self.isPc) {
                                if (self.dictionaryList && self.dictionaryList.length > 0) {
                                    self.dictionaryList.forEach((item) => {
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
             * @Description : 修改每页加载条数
             * @Author : cheng fei
             * @CreateDate 2019/4/15 23:29
             * @Param pageSize 每页加载条数
             */
            handleSizeChange(pageSize) {
                this.currentPage = 1;
                if (this.isPc) {
                    this.pageSize = pageSize;
                }
                this.loadDictionaryList();
            },
            /**
             * @Description : 修改加载页码
             * @Author : cheng fei
             * @CreateDate 2019/4/15 23:32
             * @Param page 页码
             */
            handleCurrentChange(page) {
                this.currentPage = page;
                this.loadDictionaryList();
            },
            /**
             * @Description :
             * @Author : cheng fei
             * @CreateDate 2019/4/15 23:56
             * @Param
             */
            changParentDictionary(parentDictionary, index) {
                this.selectDictionary = parentDictionary;
                this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
                //刷新数据
                this.loadDictionaryList();

            },
            /**
             * @Description : 点击数据字典
             * @Author : cheng fei
             * @CreateDate 2019/4/16 0:02
             * @Param dictionary 数据字典数据
             */
            clickDictionary(dictionary) {
                this.selectDictionary = {
                    id: dictionary.id,
                    name: dictionary.name,
                };
                this.breadcrumbList.push(this.selectDictionary);
                //刷新数据
                this.loadDictionaryList()
            },
            /**
             * @Description : 返回上一级
             * @Author : cheng fei
             * @CreateDate 2019/4/16 0:26
             */
            goBack() {
                if (this.breadcrumbList.length === 1) {
                    return
                }
                this.selectDictionary = this.breadcrumbList[this.breadcrumbList.length - 2];
                this.breadcrumbList.splice(this.breadcrumbList.length - 1, 1);
                this.loadDictionaryList();
            },
            /**
             * @Description : 执行修改数据字典
             * @Author : cheng fei
             * @CreateDate 2019/5/28 17:27
             * @Param  dictionary 数据字典数据
             */
            doUpdateDictionaryStatus(dictionary) {
                let params = {
                    id: dictionary.id,
                    status: dictionary.status,
                    updateTime: this.$StringUtil.isBlank(dictionary.updateTime) ? "" : this.$DateUtil.formatTimestampForDateTime(dictionary.updateTime)
                };
                this.$Http.doPostForForm(
                    this,
                    "system/dictionary/update/status",
                    params,
                    function (self, data) {
                        self.loadDictionaryList();
                        self.$message({
                            type: 'success',
                            message: dictionary.status ? '启用数据字典成功！' : '禁用数据字典成功！'
                        });
                    },
                    function (self) {
                        self.loadDictionaryList();
                    }
                )
            },
            /**
             * @Description : 修改数据字典状态
             * @Author : cheng fei
             * @CreateDate 2019/4/16 1:14
             * @Param dictionary 数据字典数据
             */
            updateDictionaryStatus(dictionary) {
                if (dictionary.status) {
                    this.doUpdateDictionaryStatus(dictionary)
                } else {
                    this.$confirm('确认要禁用该数据字典,禁用后该数据字典以及其子数据字典都不可用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.doUpdateDictionaryStatus(dictionary)
                    }).catch(() => {
                        dictionary.status = !dictionary.status
                    })

                }
            },
            /**
             * @Description : 删除数据字典
             * @Author : cheng fei
             * @CreateDate 2019/4/16 1:03
             * @Param 数据字典id
             */
            deleteDictionary(id) {
                this.$confirm('确认要删除该数据字典?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$Http.doPostForForm(
                        this,
                        "system/dictionary/delete",
                        {
                            id: id
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '删除数据字典成功!'
                            });
                            //刷新数据
                            self.loadDictionaryList();
                        }
                    )
                }).catch(() => {
                });
            },
            /**
             * @Description : 开启数据字典新增/编辑窗口
             * @Author : cheng fei
             * @CreateDate 2019/4/12 1:01
             * @Param flag 开启/关闭
             * @Param data 修改数据回显
             */
            openOrCloseDictionaryWindow(flag, data) {
                this.dictionaryForm.openOrClose = flag;
                if (flag) {
                    //开启数据字典编辑窗口
                    if (this.dictionaryForm.id === "" && this.$ObjectUtil.isBlank(data)) {
                        //添加
                        this.dictionaryForm.dictionaryFormTitle = "添加数据字典"
                    } else {
                        this.dictionaryForm.dictionaryFormTitle = "修改数据字典";
                        //设置回显
                        this.dictionaryForm.id = data.id;
                        this.dictionaryForm.name = data.name;
                        this.dictionaryForm.key = data.key;
                        this.dictionaryForm.value = this.$StringUtil.isBlank(data.value) ? "" : data.value;
                        this.dictionaryForm.displayOrder = data.displayOrder;
                        this.dictionaryForm.updateTime = data.updateTime;
                    }
                } else {
                    //关闭数据字典编辑窗口
                    //重置数据
                    this.dictionaryForm = {
                        //表单标题
                        dictionaryFormTitle: "",
                        //表单是否打开
                        openOrClose: false,
                        //id
                        id: "",
                        //父级ID
                        parentId: 0,
                        //名称
                        name: "",
                        //key
                        key: "",
                        //value
                        value: "",
                        //排序码
                        displayOrder: "",
                        //修改时间
                        updateTime: "",
                    };
                    //重置验证
                    this.$refs["dictionaryForm"].resetFields();
                }
            },
            /**
             * @Description : 提交表单
             * @Author : cheng fei
             * @CreateDate 2019/4/12 1:03
             */
            submitDictionaryForm() {
                this.$refs["dictionaryForm"].validate(valid => {
                    if (valid) {
                        let params = {
                            parentId: this.$ObjectUtil.isBlank(this.selectDictionary) ? 0 : this.selectDictionary.id,
                            name: this.dictionaryForm.name,
                            key: this.dictionaryForm.key,
                            value: this.dictionaryForm.value,
                            displayOrder: this.dictionaryForm.displayOrder
                        };

                        let url = "";
                        if (this.dictionaryForm.id === "") {
                            url = "system/dictionary/save";
                        } else {
                            url = "system/dictionary/update";
                            params.id = this.dictionaryForm.id;
                            params.updateTime = this.$StringUtil.isBlank(this.dictionaryForm.updateTime) ? "" : this.$DateUtil.formatTimestampForDateTime(this.dictionaryForm.updateTime);
                        }

                        this.$Http.doPostForForm(
                            this,
                            url,
                            params,
                            function (self, data) {
                                self.$message({
                                    type: 'success',
                                    message: self.dictionaryForm.id === "" ? '新增数据字典成功!' : '修改数据字典成功!'
                                });
                                self.openOrCloseDictionaryWindow(false);
                                self.loadDictionaryList();
                            }
                        )
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
