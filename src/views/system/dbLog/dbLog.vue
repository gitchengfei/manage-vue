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
                        <el-form-item label="操作类型：" size="mini">
                            <el-dropdown style="font-size: 1.6vh">
                        <span class="el-dropdown-link">{{selectType}}<i class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="(item, index) in typeList" :command="item">{{item.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                        <el-form-item label="操作人：" size="mini">
                            <el-input v-model="name" placeholder="请输入操作人" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="操作时间：" size="mini">
                            <p>
                                <el-date-picker
                                    v-model="startTime"
                                    type="date"
                                    placeholder="请选择开始时间">
                                </el-date-picker>
                            </p>
                            <p>
                                <el-date-picker
                                    v-model="endTime"
                                    type="date"
                                    placeholder="请选择结束时间">
                                </el-date-picker>
                            </p>
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
                        <el-button type="primary" size="mini" @click="doSearch()"
                                   style="margin-left: 6vw;">查询
                        </el-button>
                        <el-form-item>
                            <div v-if="pagePermission.SystemDbLogDelete && deleteDateList.length !== 0">
                                <span style="color: #000000;font-size: 1.6vh;">删除数据库操作日志：</span>
                                <el-dropdown @command="selectedDeleteDate" style="font-size: 1.6vh">
                        <span class="el-dropdown-link">
                        {{deleteDateTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item, index) in deleteDateList" :command="item">
                                            {{item.name}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-button type="primary" size="mini" @click="deleteDbLog" style="margin-left: 6vw;">删除
                                </el-button>
                            </div>
                        </el-form-item>

                    </el-form>
                </el-collapse-item>

                <!-- 数据列表 -->
                <el-collapse-item name="2">
                    <template slot="title">
                        <span style="padding-left: 5px;font-size: 2vh">数据列表</span>
                    </template>
                    <el-table :data="dbLogList" :show-header="false" border :border="true"
                              :row-class-name="$TableRowClassName" :empty-text="emptyText">
                        <el-table-column>
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="操作人：" size="mini">
                                        <span>{{ props.row.accountName }}</span>
                                    </el-form-item>
                                    <el-form-item label="操作日期：" size="mini">
                                        <span>{{ $DateUtil.getDateTime(props.row.createTime) }}</span>
                                    </el-form-item>
                                    <el-form-item label="操作类型：" size="mini">
                                        <span>{{ props.row.typeName }}</span>
                                    </el-form-item>
                                    <el-form-item label="日志：" size="mini">
                                        <span>{{ props.row.log }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </div>
        <!-- PC -->
        <div style="min-width: 1000px" v-else>
            <div class="header-item border-r">
                <div class="header-top t-h2">
                    <span style="color: #000000;font-size: 2vh;">筛选条件</span>
                </div>
                <div style="height: 60px;">
                    <div class="search_div">
                        <span style="color: #000000;font-size: 1.6vh">操作类型：</span>
                        <el-dropdown @command="selectedType" style="font-size: 1.6vh">
                        <span class="el-dropdown-link">{{selectType}}<i class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in typeList" :command="item">{{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="search_div" style="margin: 1.3vh 1vw">
                        <span style="color: #000000;font-size: 1.6vh">操作人：</span>
                        <el-input v-model="name" placeholder="请输入操作人" @change="changName" clearable
                                  style="width: 10vw"></el-input>
                    </div>
                    <div class="search_div" style="margin: 1.3vh 1vw">
                        <span style="color: #000000;font-size: 1.6vh">操作时间：</span>
                        <el-date-picker
                            v-model="startTime"
                            type="date"
                            @change="changStartTime"
                            placeholder="请选择开始时间">
                        </el-date-picker>
                        <span style="color: #000000;font-size: 1.6vh"> -- </span>
                        <el-date-picker
                            v-model="endTime"
                            type="date"
                            @change="changEndTime"
                            placeholder="请选择结束时间">
                        </el-date-picker>
                    </div>
                    <div class="search_div" style="margin: 1.6vh 1vw">
                        <el-button type="primary" size="small" @click="resetSearch">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="header-item border-r" style="margin-top: 2vh">
                <div class="header-top t-h2">
                    <span style="color: #000000;font-size: 2vh;">数据列表</span>
                    <div style="float: right;margin-right: 2vw;"
                         v-if="pagePermission.SystemDbLogDelete && deleteDateList.length !== 0">
                        <span style="color: #000000;font-size: 1.6vh;">删除数据库操作日志：</span>
                        <el-dropdown @command="selectedDeleteDate" style="font-size: 1.6vh">
                        <span class="el-dropdown-link">
                        {{deleteDateTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in deleteDateList" :command="item">{{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="primary" size="small" @click="deleteDbLog" style="margin-left: 1vw;">删除
                        </el-button>
                    </div>
                </div>
                <div>
                    <el-table :data="dbLogList" :border="true" style="width: 100%" row-key="id"
                              :row-class-name="$TableRowClassName" :empty-text="emptyText">
                        <el-table-column label="编号" align="center" width="80">
                            <template scope="scope">
                                <span v-text="scope.$index+1"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountName" label="操作人" align="center" width="200"></el-table-column>
                        <el-table-column prop="createTime" label="操作日期" align="center" width="200"
                                         :formatter="$DateUtil.formatByElementTable"></el-table-column>
                        <el-table-column prop="typeName" label="操作类型" align="center" width="200"
                                         :formatter="$StringUtil.formatByElementTable"></el-table-column>
                        <el-table-column prop="log" label="日志" align="left" :formatter="$StringUtil.formatByElementTable"></el-table-column>
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
                    :layout=" isPc ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
                    :small="!isPc"
                    :total="total"
                    prev-text="上一页"
                    next-text="下一页">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "dbLog",
        data() {
            return {
                //是否是PC端
                isPc: true,
                //移动端显示
                activeName: '2',
                //页面按钮权限(权限url首字母大写,否则不能动态修改)
                pagePermission: {
                    SystemDbLogList: false,
                    SystemDbLogDelete: false,
                },
                //数据库操作日志数据
                dbLogList: [],
                //数据库操作日志数据总数
                total: 0,
                //当前选中页码
                currentPage: 1,
                //每页加载条数
                pageSize: 10,

                //数据库操作日志类型
                typeList: [],
                //选中数据库操作日志类型名称
                selectType: "",
                //选中数据库操作日志类型key
                selectedTypeKey: "",
                //操作人模糊查询
                name: "",
                //开始时间
                startTime: "",
                //结束时间
                endTime: "",
                //删除数据库日志选项列表
                deleteDateList: [],
                //删除数据库操作日志标题
                deleteDateTitle: "",
                //删除数据库操作日志周期
                deleteDateKey: "",

            }
        },
        computed: {
            //数据为空时描述
            emptyText() {
                if (this.pagePermission.SystemDbLogList) {
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
            this.isPc = this.$IsPC();
            this.pageSize = this.isPC ? 10 : 5;
            //加载页面按钮权限
            await this.$GetAccountMenuPermission(this.pagePermission);
            //加载数据库操作类型
            this.loadTypeList();
            //加载数据库操作日志选项
            this.loadDeleteDateList();
            //加载数据库操作日志列表
            this.loadDbLog();
        },
        methods: {
            /**
             * @Description : 异动端查询
             * @Author : cheng fei
             * @CreateDate 2019/5/30 10:17
             */
            doSearch() {
                this.currentPage = 1;
                this.loadDbLog();
            },
            /**
             * @Description : 加载数据库操作日志选项
             * @Author : cheng fei
             * @CreateDate 2019/4/17 22:07
             */
            loadDeleteDateList() {
                this.$GetDictionarySelectByAsync(
                    "SYSTEM_DB_LOG_DELETE_OPTION",
                    this,
                    function (self, data) {
                        self.deleteDateList = data.data
                        self.deleteDateTitle = self.deleteDateList[0].name;
                        self.deleteDateKey = self.deleteDateList[0].key;
                    }
                );
            },
            /**
             * @Description :
             * @Author : cheng fei
             * @CreateDate 2019/4/17 22:04
             * @Param item 删除类型
             */
            selectedDeleteDate(item) {
                this.deleteDateTitle = item.name;
                this.deleteDateKey = item.key
            },
            /**
             * @Description : 删除数据库操作日志
             * @Author : cheng fei
             * @CreateDate 2019/4/17 22:15
             */
            deleteDbLog() {
                this.$confirm('确认要删除数据库操作日志?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$Http.doPostForForm(
                        this,
                        "system/db/log/delete",
                        {
                            key: this.deleteDateKey
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '删除数据字典成功!'
                            });
                            //刷新数据
                            self.currentPage = 1;
                            self.loadDbLog();
                        }
                    )
                }).catch(() => {

                });
            },
            /**
             * @Description : 加载数据库操作日志类型
             * @Author : cheng fei
             * @CreateDate 2019/4/17 0:54
             * @Param
             */
            loadTypeList() {
                this.$GetDictionarySelectByAsync(
                    "SYSTEM_DB_LOG_TYPE",
                    this,
                    function (self, data) {
                        self.typeList = data.data;
                        self.typeList.unshift({
                            key: "",
                            value: "",
                            name: "全部分类"
                        });
                        self.selectType = self.typeList[0].name
                    });
            },
            /**
             * @Description : 选中数据库操作类型
             * @Author : cheng fei
             * @CreateDate 2019/4/17 1:42
             * @Param
             */
            selectedType(item) {
                this.selectType = item.name;
                this.selectedTypeKey = item.key;
                this.loadDbLog();
            },
            /**
             * @Description : 改变操作人
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:05
             * @Param
             */
            changName() {
                this.currentPage = 1;
                this.loadDbLog();
            },
            /**
             * @Description : 改变开始时间
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:18
             */
            changStartTime() {
                let startTime = new Date(this.startTime);
                let endTime = new Date(this.endTime);
                if (startTime.getTime() > endTime.getTime()) {
                    this.$confirm("开始时间不能大于结束时间！", '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        showClose: true,
                    }).then(() => {
                        this.startTime = "";
                    }).catch(()=>{
                        this.startTime = "";
                    });
                } else {
                    this.currentPage = 1;
                    this.loadDbLog();
                }
            },
            /**
             * @Description :改变结束时间
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:19
             */
            changEndTime() {
                let endTime = new Date(this.endTime);
                let startTime = new Date(this.startTime);
                if (startTime.getTime() > endTime.getTime()) {
                    this.$confirm("结束时间不能小于开始时间！", '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        showClose: true,
                    }).then(() => {
                        this.endTime = "";
                    }).catch(()=>{
                        this.endTime = "";
                    });
                } else {
                    this.currentPage = 1;
                    this.loadDbLog();
                }
            },
            /**
             * @Description : 重置搜索
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:56
             * @Param
             */
            resetSearch() {
                this.selectType = "全部分类";
                this.selectedTypeKey = "";
                this.name = "";
                this.startTime = "";
                this.endTime = "";
                this.loadDbLog()
            },
            /**
             * @Description : 加载数据操作日志列表
             * @Author : cheng fei
             * @CreateDate 2019/4/17 0:20
             * @Param
             */
            loadDbLog() {
                if (this.pagePermission.SystemDbLogList) {
                    this.$Http.doPostForForm(
                        this,
                        "system/db/log/list",
                        {
                            type: this.selectedTypeKey,
                            name: this.name,
                            startTime: this.$DateUtil.formatDateTimeForTimestamp(this.startTime, false, true),
                            endTime: this.$DateUtil.formatDateTimeForTimestamp(this.endTime, false, true),
                            page: this.currentPage,
                            pageSize: this.pageSize
                        },
                        function (self, data) {
                            self.dbLogList = data.data.rows;
                            self.total = data.data.count;
                            if (!self.isPc) {
                                self.activeName = '2';
                            }
                        },
                        function (self) {

                        }
                    )
                } else {
                    this.emptyText = "您无查看权限！";
                }
            },
            /**
             * @Description : 修改每页加载条数
             * @Author : cheng fei
             * @CreateDate 2019/4/17 0:40
             * @Param pageSize 每页加载条数
             */
            handleSizeChange(pageSize) {
                this.currentPage = 1;
                this.pageSize = pageSize;
                this.loadDbLog();
            },
            /**
             * @Description : 修改加载页码
             * @Author : cheng fei
             * @CreateDate 2019/4/15 23:32
             * @Param page 页码
             */
            handleCurrentChange(page) {
                this.currentPage = page;
                this.loadDbLog();
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "dbLog.less";
    @import "../../../styles/commons.less";
</style>
