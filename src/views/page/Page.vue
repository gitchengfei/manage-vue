<template>
    <el-row>
        <el-col :span="24">
            <el-pagination style="float: right; margin-top: 10px; margin-right: 10px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.page"
                :page-sizes="pageSizes"
                :page-size="page.pageSize"
                :layout="layout"
                :small="small"
                :total="page.total"
                prev-text="上一页"
                next-text="下一页">
            </el-pagination>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Page",
        data () {
            return {

            }
        },
        props : {
            page: {
               type : Object,
               default: function () {
                   return {
                       page : 1,
                       pageSize : 10,
                       total : 0,
                   }
               }
            },
            pageSizes : {
                type : Array,
                default : function () {
                    return [5, 10, 20, 50, 100];
                }
            },
            layout : {
                type : String,
                default : 'total, sizes, prev, pager, next, jumper',
            },
            small : {
                type : Boolean,
                default : false
            },
        },
        methods : {
            /**
             * @Description : 调用分页插件, 查询分页数据方法
             * @Author : cheng fei
             * @CreateDate 2020/5/22 23:48
             */
            reload () {
                this.$emit('reload');
            },
            /**
             * @Description : 修改每页显示条数
             * @Author : cheng fei
             * @CreateDate 2020/5/22 23:45
             */
            handleSizeChange(pageSize) {
                this.$set(this.page, 'page', 1);
                this.$set(this.page, 'pageSize', pageSize);
                this.reload();
            },
            /**
             * @Description : 修改当前页码方法
             * @Author : cheng fei
             * @CreateDate 2020/5/22 23:49
             */
            handleCurrentChange(page) {
                this.$set(this.page, 'page', page);
                this.reload();
            },
        }
    }
</script>

<style scoped>

</style>
