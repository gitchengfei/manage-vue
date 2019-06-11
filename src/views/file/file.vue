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
                        <el-form-item label="类型：" size="mini">
                            <el-dropdown @command="changType" style="font-size: 1.6vh">
                                <span class="el-dropdown-link">{{query.selectTypeName}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                 </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="(item, index) in typeList" :command="item">{{item.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                        <el-form-item label="用途：" size="mini">
                            <el-dropdown @command="changFilePurpose" style="font-size: 1.6vh">
                                <span class="el-dropdown-link">{{query.selectFilePurposeName}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="(item, index) in filePurposeList" :command="item">
                                        {{item.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                        <el-form-item label="文件名：" size="mini">
                            <el-input v-model="query.fileName" placeholder="请输人文件名" @change="changName" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="上传时间：" size="mini">
                            <p>
                                <el-date-picker
                                    v-model="query.startTime"
                                    type="date"
                                    placeholder="请选择上传开始时间">
                                </el-date-picker>
                            </p>
                            <p>
                                <el-date-picker
                                    v-model="query.endTime"
                                    type="date"
                                    placeholder="请选择上传结束时间">
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
                        <p>

                            <el-button type="primary" size="mini" @click="resetSearch()">重置
                            </el-button>
                            <el-button type="primary" size="mini" @click="doSearch()">查询
                            </el-button>
                        </p>
                    </el-form>
                </el-collapse-item>

                <!-- 数据列表 -->
                <el-collapse-item name="2">
                    <template slot="title">
                        <span style="padding-left: 5px;font-size: 2vh">数据列表</span>
                    </template>
                    <el-table :data="fileList" :show-header="false" border :border="true"
                              :row-class-name="tableRowClassNameByFileUsed" :empty-text="emptyText">
                        <el-table-column>
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item size="mini">
                                        <div>
                                            <div style="float: left">
                                                <span style="line-height: 100px">缩略图：</span>
                                            </div>
                                            <div style="float: left;padding-left: 20px">
                                                <img v-if="FILE_CONSTANT.TYPE.IMAGE === props.row.type"
                                                     :src="props.row.path"
                                                     @click="openOrCloseImgWindow(true, props.row.path)"
                                                     style="width: 100px;">
                                                <img v-else :src="getFileTypeImgUrl(props.row.fileExtension)"
                                                     style="width: 100px;"
                                                     @click="openOrCloseImgWindow(true, getFileTypeImgUrl(props.row.fileExtension))">
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="文件名称：" size="mini">
                                        <span>{{ props.row.fileName }}</span>
                                    </el-form-item>
                                    <el-form-item label="是否引用：" size="mini">
                                        <el-button type="text" @click="seeFileUseInfo(props.row)" v-if="props.row.used">
                                            {{props.row.used ? '是' : '否'}}
                                        </el-button>
                                        <span v-else>{{props.row.used ? '是' : '否'}}</span>
                                    </el-form-item>
                                    <p>
                                        <el-form-item label="类型：" size="mini">
                                            <span>{{ props.row.typeName }}</span>
                                        </el-form-item>
                                        <el-form-item label="用途：" size="mini">
                                            <span>{{ props.row.filePurpose }}</span>
                                        </el-form-item>
                                    </p>
                                    <el-collapse-transition>
                                        <div class="transition-box" v-show="props.row.showMore">
                                            <el-form-item label="文件类型：" size="mini">
                                                <span>{{ props.row.fileType }}</span>
                                            </el-form-item>
                                            <p>
                                                <el-form-item label="上传人：" size="mini">
                                                    <span>{{ props.row.createName }}</span>
                                                </el-form-item>
                                                <el-form-item label="上传时间：" size="mini">
                                                    <span>{{ props.row.createTime ? $DateUtil.getDateTime(props.row.createTime) : '-' }}</span>
                                                </el-form-item>
                                            </p>
                                            <p>
                                                <el-form-item label="修改人：" size="mini">
                                                    <span>{{ props.row.updateName }}</span>
                                                </el-form-item>
                                                <el-form-item label="修改时间：" size="mini">
                                                    <span>{{ props.row.updateTime ? $DateUtil.getDateTime(props.row.updateTime) : '-'}}</span>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </el-collapse-transition>
                                    <p>
                                        <el-form-item size="mini">
                                            <el-button type="text" size="mini"
                                                       :disabled="!pagePermission.FileDownload"
                                                       @click="downFile($Config.serverUrl + 'file/download?fileId=' + props.row.id)">
                                                下载
                                            </el-button>
                                            <el-button type="text" size="mini"
                                                       :disabled="!pagePermission.FileUpdateName"
                                                       @click="openOrCloseUpdateFIleNameWindow(true, props.row)">
                                                编辑
                                            </el-button>
                                            <el-button type="text" size="mini"
                                                       :disabled="!pagePermission.FileDelete"
                                                       @click="deleteFiles(props.row)">删除
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

        <!-- PC端 -->
        <div style="min-width: 1000px" v-else>
            <div class="header-item border-r">
                <div class="header-top t-h2">
                    <span style="color: #000000;font-size: 2vh;">筛选条件</span>
                </div>
                <div style="height: 60px;">
                    <div class="search_div">
                        <span style="color: #000000;font-size: 1.6vh">类型：</span>
                        <el-dropdown @command="changType" style="font-size: 1.6vh">
                        <span class="el-dropdown-link">{{query.selectTypeName}}<i
                            class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in typeList" :command="item">{{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="search_div">
                        <span style="color: #000000;font-size: 1.6vh">用途：</span>
                        <el-dropdown @command="changFilePurpose" style="font-size: 1.6vh">
                        <span class="el-dropdown-link">{{query.selectFilePurposeName}}<i
                            class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in filePurposeList" :command="item">{{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="search_div" style="margin: 1.3vh 1vw">
                        <span style="color: #000000;font-size: 1.6vh">文件名：</span>
                        <el-input v-model="query.fileName" placeholder="请输人文件名" @change="changName" clearable
                                  style="width: 10vw"></el-input>
                    </div>
                    <div class="search_div" style="margin: 1.3vh 1vw">
                        <span style="color: #000000;font-size: 1.6vh">上传时间：</span>
                        <el-date-picker
                            v-model="query.startTime"
                            type="date"
                            @change="changStartTime"
                            placeholder="请选择上传开始时间">
                        </el-date-picker>
                        <span style="color: #000000;font-size: 1.6vh"> -- </span>
                        <el-date-picker v-model="query.endTime" type="date" @change="changEndTime"
                                        placeholder="请选择上传结束时间">
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
                    <div style="float: right;margin-right: 2vw;">
                        <el-button type="danger" size="small" @click="deleteFiles()" v-if="pagePermission.FileDelete"
                                   style="margin-left: 1vw;">删除
                        </el-button>
                    </div>
                </div>
                <div>
                    <el-table :data="fileList" :border="true" style="width: 100%" row-key="id" @selection-change="selectionChange"
                              :row-class-name="tableRowClassNameByFileUsed" :empty-text="emptyText">
                        <el-table-column type="selection" width="60" align="center"></el-table-column>
                        <el-table-column label="编号" align="center" width="70">
                            <template scope="scope">
                                <span v-text="scope.$index+1"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountName" label="略缩图" align="center" width="120">
                            <template scope="scope">
                                <img v-if="FILE_CONSTANT.TYPE.IMAGE === scope.row.type" :src="scope.row.path"
                                     @click="openOrCloseImgWindow(true, scope.row.path)"
                                     style="width: 100px;">
                                <img v-else :src="getFileTypeImgUrl(scope.row.fileExtension)" style="width: 100px;"
                                     @click="openOrCloseImgWindow(true, getFileTypeImgUrl(scope.row.fileExtension))">
                            </template>
                        </el-table-column>
                        <el-table-column prop="fileName" label="文件名称" align="center">
                            <template scope="scope">
                                <span>{{scope.row.fileName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="used" label="是否引用" align="center" width="80">
                            <template scope="scope">
                                <el-button type="text" @click="seeFileUseInfo(scope.row)" v-if="scope.row.used">
                                    {{scope.row.used ? '是' : '否'}}
                                </el-button>
                                <span v-else>{{scope.row.used ? '是' : '否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="size" label="文件大小" align="center" width="100" :formatter="$StringUtil.formatFileSizeByElementTable"></el-table-column>
                        <el-table-column prop="typeName" label="类型" align="center" width="80"></el-table-column>
                        <el-table-column prop="filePurpose" label="用途" align="center" width="100"></el-table-column>
                        <el-table-column prop="fileType" label="文件类型" align="center" width="100"></el-table-column>
                        <el-table-column prop="createTime" label="上传时间" align="center"
                                         :formatter="$DateUtil.formatByElementTable" width="160"></el-table-column>
                        <el-table-column prop="createName" label="上传人" align="center"
                                         :formatter="$StringUtil.formatByElementTable" width="130"></el-table-column>
                        <el-table-column prop="updateTime" label="修改时间" align="center"
                                         :formatter="$DateUtil.formatByElementTable" width="160"></el-table-column>
                        <el-table-column prop="updateName" label="修改人" align="center"
                                         :formatter="$StringUtil.formatByElementTable" width="130"></el-table-column>
                        <el-table-column label="操作" align="center" width="110">
                            <template slot-scope="scope">
                                <p style="margin-bottom: 1vh">
                                    <el-button type="primary" size="mini"
                                               :disabled="!pagePermission.FileDownload"
                                               @click="downFile($Config.serverUrl + 'file/download?fileId=' + scope.row.id)">
                                        下载
                                    </el-button>
                                </p>
                                <p style="margin-bottom: 1vh">
                                    <el-button type="primary" size="mini" :disabled="!pagePermission.FileUpdateName"
                                               @click="openOrCloseUpdateFIleNameWindow(true, scope.row)">
                                        编辑
                                    </el-button>
                                </p>
                                <p>
                                    <el-button type="danger" size="mini"
                                               :disabled="!pagePermission.FileDelete"
                                               @click="deleteFiles(scope.row)">删除
                                    </el-button>
                                </p>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <!-- 分页 -->
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

        <!-- 修改文件名称表单 -->
        <el-dialog title="修改文件名" :visible.sync="updateFileForm.openOrClose" :width="isPc ? '30%' : '90%'" top="15%">
            <el-form :model="updateFileForm" :rules="updateFileFormRules" ref="updateFileForm">
                <el-form-item label="文件名" prop="fileName">
                    <el-input type="text" v-model="updateFileForm.fileName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseUpdateFIleNameWindow(false)">取消</el-button>
                <el-button type="primary" @click="submitUpdateFIleNameForm()">提交</el-button>
            </div>
        </el-dialog>

        <!-- 文件引用信息 -->
        <el-dialog title="文件引用信息：" :visible.sync="fileInfo.openOrClose" :width="isPc ? '30%' : '90%'">
            <div>
                <el-table :data="fileInfo.useFile" :show-header="false" border :border="true">
                    <el-table-column label="文件引用信息：" content="left">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item>
                                    <el-form>
                                        <el-form-item label="引用表：">
                                            <span>{{props.row.tableName}}</span>
                                        </el-form-item>
                                        <span style="margin-right: 5vw"></span>
                                        <el-form-item label="引用表记录主键：">
                                            <span style="margin-right: 2vw">{{props.row.columnId}}</span>
                                        </el-form-item>
                                    </el-form>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="closeSeeFileUseInfo">确认</el-button>
            </div>
        </el-dialog>

        <!--显示大图-->
        <el-dialog :visible.sync="imgWindow.openOrClose" align="center">
            <div style="max-width: 100%">
                <img :src="imgWindow.url" style="max-width: 100%">
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import FILE_CONSTANT from "../../config/FileConstant"
    import {getFileTypeImgUrl} from "../../utils/img/ImgUtil"
    import {downFile} from "../../utils/file/download/DownLoadUtil"
    import { tableRowClassNameByFileUsed } from "../../utils/table/ElementTableUtil"

    export default {
        name: "file",
        data() {
            let _this = this;
            /**
             * @Description : 校验文件名
             * @Author : cheng fei
             * @CreateDate 2019/6/5 13:53
             * @param rule
             * @param value
             * @param callback
             */
            let validateFileName = function (rule, value, callback) {
                if (value) {
                    if (!/^(?!\.)[^\\\/:\*\?"<>\|]{1,255}$/.test(value)) {
                        callback("文件名不能包含/ \\ : * ? \\\" < > |,并且不能以.开头！");
                    } else {
                        callback()
                    }
                } else {
                    callback("文件名不能为空！");
                }

            };
            return {
                FILE_CONSTANT: FILE_CONSTANT,
                //是否是PC端
                isPc: true,

                //移动端显示内容
                activeName: "2",

                //页面按钮权限
                pagePermission: {
                    FileList: false,
                    FileDownload: false,
                    FileUpdateName: false,
                    FileDelete: false,
                },

                //类型列表
                typeList: [],

                //用途列表
                filePurposeList: [],

                //查询条件
                query: {
                    //文件类型
                    type: "",

                    //选中的文件类型
                    selectTypeName: "",

                    // 文件用途key
                    filePurposeKey: "",

                    // 文件用途Name
                    selectFilePurposeName: "",

                    //文件名
                    fileName: '',

                    //上传开始时间
                    startTime: "",

                    //上传结束时间
                    endTime: ""
                },
                // 文件多选
                selectedFileIds : [],
                //文件列表
                fileList: [],

                //修改文件表单
                updateFileForm: {
                    //修改文件名称窗口开关
                    openOrClose: false,
                    //文件Id
                    fileId: "",
                    //文件名称
                    fileName: "",
                    //旧名称
                    oldFIleName: "",
                    //文件修改时间
                    updateTime: "",
                    //文件后缀名
                    suffix: ""
                },
                //修改文件表单数据校验
                updateFileFormRules: {
                    fileName: [
                        {required: true, message: "文件名不能不为空！", trigger: "blur"},
                        {validator: validateFileName}
                    ]
                },

                //文件详情数据
                fileInfo: {
                    openOrClose: false,
                    file: [
                        {
                            type: "",
                            fileExtension: "",
                            fileName: "",
                        }
                    ],
                    useFile: [],
                },

                //显示大图开关窗口
                imgWindow: {
                    openOrClose: false,
                    url: ""
                },

                //分页
                currentPage: 1,
                pageSize: 10,
                total: 0,


            }
        },
        computed: {
            //数据为空时描述
            emptyText() {
                if (this.pagePermission.FileList) {
                    return "暂无数据"
                } else {
                    return "您无查看权限！"
                }
            },
        },
        async mounted() {
            this.isPc = this.$IsPC();
            this.pageSize = this.isPc ? 10 : 5;
            await this.$GetAccountMenuPermission(this.pagePermission);
            this.loadTypList();
            this.loadFilePurposeList();
            this.loadFileList();
        },
        methods: {
            getFileTypeImgUrl,
            downFile,
            tableRowClassNameByFileUsed,
            /**
             * @Description : 移动端查看更多
             * @Author : cheng fei
             * @CreateDate 2019/5/29 15:40
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
             * @Description : 移动端执行查询
             * @Author : cheng fei
             * @CreateDate 2019/6/7 10:09
             */
            doSearch() {
                this.currentPage = 1;
                this.loadFileList();
            },
            /**
             * @Description : 修改每页显示条数
             * @Author : cheng fei
             * @CreateDate 2019/6/4 13:44
             */
            handleSizeChange(pageSize) {
                this.currentPage = 1;
                this.pageSize = pageSize;
                this.loadFileList()
            },
            /**
             * @Description : 修改页码
             * @Author : cheng fei
             * @CreateDate 2019/6/4 13:46
             */
            handleCurrentChange(page) {
                this.currentPage = page;
                this.loadFileList()
            },
            /**
             * @Description : 修改类型
             * @Author : cheng fei
             * @CreateDate 2019/6/5 11:56
             */
            changType(item) {
                this.query.type = item.key;
                this.query.selectTypeName = item.name;
                this.currentPage = 1;
                if (this.isPc) {
                    this.loadFileList();
                }
            },
            /**
             * @Description : 修改文件用途
             * @Author : cheng fei
             * @CreateDate 2019/6/5 11:56
             */
            changFilePurpose(item) {
                this.query.filePurposeKey = item.key;
                this.query.selectFilePurposeName = item.name;
                this.currentPage = 1;
                if (this.isPc) {
                    this.loadFileList();
                }
            },
            /**
             * @Description : 修改文件名
             * @Author : cheng fei
             * @CreateDate 2019/6/4 16:25
             */
            changName() {
                this.currentPage = 1;
                if (this.isPc) {
                    this.loadFileList()
                }
            },
            /**
             * @Description : 修改上传开始时间
             * @Author : cheng fei
             * @CreateDate 2019/6/4 13:47
             */
            changStartTime() {
                let startTime = new Date(this.query.startTime);
                let endTime = new Date(this.query.endTime);
                if (startTime.getTime() > endTime.getTime()) {
                    this.$confirm("开始时间不能大于结束时间！", '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        showClose: true,
                    }).then(() => {
                        this.query.startTime = "";
                    }).catch(() => {
                        this.query.startTime = "";
                    });
                } else {
                    this.currentPage = 1;
                    if (this.isPc) {
                        this.loadFileList();
                    }
                }
            },
            /**
             * @Description : 修改上传结束时间
             * @Author : cheng fei
             * @CreateDate 2019/6/4 13:47
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
                        this.query.endTime = ""
                    }).catch(() => {
                        this.query.endTime = ""
                    });
                } else {
                    this.currentPage = 1;
                    if (this.isPc) {
                        this.loadFileList();
                    }
                }
            },
            /**
             * @Description : 重置筛选条件
             * @Author : cheng fei
             * @CreateDate 2019/6/4 11:29
             */
            resetSearch() {
                this.query = {
                    type: "",
                    selectTypeName: "",
                    filePurposeKey: "",
                    selectFilePurposeName: "",
                    fileName: '',
                    startTime: "",
                    endTime: ""
                };
                if (this.isPc) {
                    this.loadFileList();
                }
            },
            /**
             * @Description : PC端多选
             * @Author : cheng fei
             * @CreateDate 2019/6/10 19:07
             */
            selectionChange(selection) {
                this.selectedFileIds = [];
                for (let i in selection) {
                    this.selectedFileIds.push(selection[i].id)
                }
            },
            /**
             * @Description : 加载数据字典中的文件类型
             * @Author : cheng fei
             * @CreateDate 2019/6/4 11:32
             */
            loadTypList() {
                this.$GetDictionarySelectByAsync(
                    "FILE_TYPE",
                    this,
                    function (self, data) {
                        self.typeList = data.data;
                        self.typeList.unshift({
                            key: "",
                            value: "",
                            name: "全部分类"
                        });
                        self.query.selectTypeName = self.typeList[0].name
                    }
                )
            },
            /**
             * @Description : 加载文件用途列表
             * @Author : cheng fei
             * @CreateDate 2019/6/4 16:15
             */
            loadFilePurposeList() {
                this.$GetDictionarySelectByAsync(
                    "FILE_PURPOSE",
                    this,
                    function (self, data) {
                        self.filePurposeList = data.data;
                        self.filePurposeList.unshift({
                            key: "",
                            value: "",
                            name: "全部用途"
                        });
                        self.query.selectFilePurposeName = self.filePurposeList[0].name
                    }
                )
            },
            /**
             * @Description : 删除文件
             * @Author : cheng fei
             * @CreateDate 2019/6/10 19:11
             * @param file 文件
             */
            deleteFiles(file){
                let type = 0;
                let msg = "";
                if (file) {
                    type = 1;
                    if (file.used) {

                        msg = "确认要删除文件【 " + file.fileName + " 】，该文件已使用，删除后文件的所有引用将失效！"
                    } else {
                        msg = "确认要删除文件【 \" + file.fileName + \" 】?"
                    }
                } else if (this.selectedFileIds.length > 0) {
                    type = 2;
                    msg = "确认要删除选中的文件，删除后文件的所有引用将失效！"
                } else {
                    msg = "未选中文件！"
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    if (type !== 0) {
                        let param = "";
                        if (type === 1) {
                            param = file.id
                        } else {
                            param = this.selectedFileIds.join(",")
                        }
                        this.doDeleteFiles(param);
                    }
                }).catch(() => {

                });
            },
            /**
             * @Description : 执行删除文件
             * @Author : cheng fei
             * @CreateDate 2019/6/10 19:30
             */
            doDeleteFiles (fileIds) {
                this.$Http.doPostForForm(
                    this,
                    '/file/delete',
                    {
                        fileIds : fileIds
                    },
                    function (self, data) {
                        self.$message({
                            type: 'success',
                            message: '删除文件成功！'
                        });
                        self.loadFileList();
                    },
                    function (self) {
                        self.loadFileList();
                    }
                )
            },
            /**
             * @Description : 加载文件列表
             * @Author : cheng fei
             * @CreateDate 2019/6/4 16:17
             */
            loadFileList() {
                if (this.pagePermission.FileList) {
                    this.$Http.doPostForForm(
                        this,
                        "/file/list",
                        {
                            fileName: this.query.fileName,
                            type: this.query.type,
                            filePurpose: this.query.filePurposeKey,
                            startTime: this.$DateUtil.formatDateTimeForTimestamp(this.query.startTime, false, true),
                            endTime: this.$DateUtil.formatDateTimeForTimestamp(this.query.endTime, false, true),
                            page: this.currentPage,
                            pageSize: this.pageSize
                        },
                        function (self, data) {
                            self.fileList = data.data.rows;
                            self.total = data.data.count;
                            if (!self.isPc) {
                                if (self.fileList && self.fileList.length > 0) {
                                    self.fileList.forEach((item) => {
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
             * @Description : 开启关闭修改文件名称窗口
             * @Author : cheng fei
             * @CreateDate 2019/6/5 13:22
             */
            openOrCloseUpdateFIleNameWindow(value, file) {
                this.updateFileForm.openOrClose = value;
                if (value) {
                    let fileName = file.fileName;
                    let point = fileName.lastIndexOf(".");
                    let fileNamePre = fileName.substr(0, point);
                    this.updateFileForm.fileId = file.id;
                    this.updateFileForm.fileName = fileNamePre
                    this.updateFileForm.oldFIleName = fileNamePre;
                    this.updateFileForm.updateTime = file.updateTime;
                    this.updateFileForm.suffix = fileName.substr(point);
                } else {
                    this.updateFileForm.fileId = "";
                    this.updateFileForm.fileName = "";
                    this.updateFileForm.oldFIleName = "";
                    this.updateFileForm.updateTime = "";
                    this.updateFileForm.suffix = "";
                    //重置验证
                    this.$refs["updateFileForm"].resetFields();
                }
            },
            /**
             * @Description : 提交修改文件名称
             * @Author : cheng fei
             * @CreateDate 2019/6/5 13:38
             */
            submitUpdateFIleNameForm() {
                this.$refs["updateFileForm"].validate(valid => {
                    if (valid) {
                        if (this.updateFileForm.fileName === this.updateFileForm.oldFIleName) {
                            this.openOrCloseUpdateFIleNameWindow(false);
                            return;
                        }
                        this.$Http.doPostForForm(
                            this,
                            "/file/update/name",
                            {
                                fileId: this.updateFileForm.fileId,
                                fileName: this.updateFileForm.fileName + this.updateFileForm.suffix,
                                updateTime: this.$DateUtil.formatTimestampForDateTime(this.updateFileForm.updateTime)
                            },
                            function (self, data) {
                                self.$message({
                                    type: 'success',
                                    message: '修改文件名成功！',
                                });
                                self.openOrCloseUpdateFIleNameWindow(false);
                                self.loadFileList();
                            }
                        )
                    }
                });
            },
            /**
             * @Description : 查看文件详情
             * @Author : cheng fei
             * @CreateDate 2019/6/5 14:30
             * @param file
             */
            seeFileUseInfo(file) {
                this.fileInfo.openOrClose = true;
                this.fileInfo.file = [];
                this.fileInfo.file.push(file);
                if (file.used) {
                    this.$Http.doPostForForm(
                        this,
                        "file/use/info",
                        {
                            fileId: file.id
                        },
                        function (self, data) {
                            if (data && data.data) {
                                self.fileInfo.useFile = data.data
                            }
                        }
                    )
                }
            },
            /**
             * @Description : 关闭文件详情
             * @Author : cheng fei
             * @CreateDate 2019/6/5 15:47
             */
            closeSeeFileUseInfo() {
                this.fileInfo.openOrClose = false;
                this.fileInfo.file = [];
                this.fileInfo.useFile = [];
            },
            /**
             * 开启关闭大图窗口
             * @param value
             * @param url
             */
            openOrCloseImgWindow(value, url) {
                this.imgWindow.openOrClose = value;
                this.imgWindow.url = url;
            },

        }
    }
</script>

<style scoped>
    @import "../../styles/commons.less";
    @import "file.less";
</style>
