<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "app"
    };
</script>

<style type="text/scss" lang="scss">
    @import "./styles/base";

    html {
        height: 100%;
    }

    body {
        height: 100%;
        overflow: hidden;
    }

    #app {
        height: 100%;
    }


    //element 表格样式
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
