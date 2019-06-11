/**
 * @Description : 树结构工具类
 * @Author : cheng fei
 * @CreateDate 2019/3/27 0:43
 */
import ObjectUtil from "../object/ObjectUtil";
import StringUtil from "../string/StringUtil";

const TreeUtil = {
    /**
     * @Description : 通过节点获取当前节点的所有父节点
     * @Author : cheng fei
     * @CreateDate 2019/3/27 0:51
     * @param node 当前节点
     * @param data 树型数据
     * @param id id字段()
     * @param parentId 父节点字段
     * @param children 子节点字段
     * @param includeSelf 是否包含自己(默认包含)
     * @return 返回数组,父级节点按顺序依次排列
     *
     * 备注:
     *      1.返回数据与原属性结构数据为同一数据,请勿做修改操作,以免影响原树形结构
     *      2.默认父节点字段为null, undefined, ""时,当前节点为最顶级节点
     */
    getAllParentNodeById : function (nodeId, data, id, parentId, children, includeSelf) {
        let  node = getNode(nodeId, data, id, children);
        if (StringUtil.isBlank(node)){
            return null
        }
        return getAllParentNode(node, data, id, parentId, children, includeSelf)
    },
    /**
     * @Description : 通过节点获取当前节点的所有父节点
     * @Author : cheng fei
     * @CreateDate 2019/3/27 0:51
     * @param node 当前节点
     * @param data 树型数据
     * @param id id字段()
     * @param parentId 父节点字段
     * @param children 子节点字段
     * @param includeSelf 是否包含自己(默认包含)
     * @return 返回数组,父级节点按顺序依次排列
     *
     * 备注:
     *      1.返回数据与原属性结构数据为同一数据,请勿做修改操作,以免影响原树形结构
     *      2.默认父节点字段为null, undefined, ""时,当前节点为最顶级节点
     */
    getAllParentNodeByNode : function (node, data, id, parentId, children, includeSelf) {
        return getAllParentNode(node, data, id, parentId, children, includeSelf)
    },
    /**
     * @Description : 通过节点获取当前节点的所有父节点组成的路径
     * @Author : cheng fei
     * @CreateDate 2019/3/27 1:47
     * @param node 当前节点
     * @param data 树型数据
     * @param id id字段()
     * @param parentId 父节点字段
     * @param children 子节点字段
     * @param path 路径字段
     * @param includeSelf 是否包含自己(默认包含)
     * @return 返回数组,父级节点按顺序依次排列
     *
     * 备注:
     *      1.返回数据与原属性结构数据为同一数据,请勿做修改操作,以免影响原树形结构
     *      2.默认父节点字段为null, undefined, ""时,当前节点为最顶级节点
     */
    getAllParentNodePathById : function (nodeId, data, id, parentId, children, path, includeSelf) {
        let  node = getNode(nodeId, data, id, children);
        if (ObjectUtil.isBlank(node)) {
            return null
        }
        let parentNodes = getAllParentNode(node, data, id, parentId, children, includeSelf);
        if (ObjectUtil.isBlank(parentNodes)) {
            return null
        }
        return getPath(parentNodes, path)
    },

    /**
     * @Description : 通过节点获取当前节点的所有父节点组成的路径
     * @Author : cheng fei
     * @CreateDate 2019/3/27 1:47
     * @param node 当前节点
     * @param data 树型数据
     * @param id id字段()
     * @param parentId 父节点字段
     * @param children 子节点字段
     * @param path 路径字段
     * @param includeSelf 是否包含自己(默认包含)
     * @return 返回数组,父级节点按顺序依次排列
     *
     * 备注:
     *      1.返回数据与原属性结构数据为同一数据,请勿做修改操作,以免影响原树形结构
     *      2.默认父节点字段为null, undefined, ""时,当前节点为最顶级节点
     */
    getAllParentNodePathByNode : function (node, data, id, parentId, children, path, includeSelf) {
        let parentNodes = getAllParentNode(node, data, id, parentId, children, includeSelf);
        return getPath(parentNodes, path)
    }

};

/**
 * @Description :
 * @Author : cheng fei
 * @CreateDate 2019/3/27 0:51
 * @param node 当前节点
 * @param data 树型数据
 * @param id id字段()
 * @param parentId 父节点字段
 * @param children 子节点字段
 * @param includeSelf 是否包含自己(默认包含)
 * @return 返回数组,父级节点按顺序依次排列
 *
 * 备注:
 *      1.返回数据与原属性结构数据为同一数据,请勿做修改操作,以免影响原树形结构
 *      2.默认父节点字段为null, 0, undefined, ""时,当前节点为最顶级节点
 */
function getAllParentNode(node, data, id, parentId, children, includeSelf) {
    let nodes = [];
    if (includeSelf === undefined) {
        includeSelf = true
    }

    if (includeSelf) {
        nodes.push(node)
    }

    if (StringUtil.isBlank(node[parentId])){
        return nodes
    }
    //递归查询所有父节点
    getParenNodeAll(node, data, id, parentId, children, nodes)
    //逆序
    return nodes.reverse()
}

/**
 * @Description : 递归获取所有父节点
 * @Author : cheng fei
 * @CreateDate 2019/3/27 1:14
 * @Param node 需要获取父节点的节点
 * @Param data 树形数据
 * @Param id 节点id字段
 * @Param parentId 节点父节点字段
 * @Param children 节点子节点字段
 * @Param nodes 所有父节点数组
 */
function getParenNodeAll(node, data, id, parentId, children, nodes){
    let pranetNode = getParenNode(node, data, id, parentId, children);
    if (pranetNode != null) {
        nodes.push(pranetNode)
        if (StringUtil.isBlank(pranetNode[parentId])){
            return nodes
        } else {
            getParenNodeAll(pranetNode, data, id, parentId, children, nodes)
        }
    }else {
        return nodes
    }
}
/**
 * @Description : 获取父节点
 * @Author : cheng fei
 * @CreateDate 2019/3/27 1:06
 * @Param node 需要获取父节点的节点
 * @Param data 树形数据
 * @Param id 节点id字段
 * @Param parentId 节点父节点字段
 * @Param children 节点子节点字段
 */
function getParenNode(node, data, id, parentId, children) {
    let result = null;
    if (StringUtil.isBlank(node[parentId])){
        return null;
    }
    for (var i in data) {
        if (data[i][id] === node[parentId]) {
            result = data[i];
            break
        }
        if (result != null) {
            break
        }
        result = getParenNode(node, data[i][children], id, parentId, children)
    }
    return result;
}


/**
 * @Description : 获取节点
 * @Author : cheng fei
 * @CreateDate 2019/3/27 1:06
 * @Param nodeId 节点ID
 * @Param data 树形结构数据
 * @Param id 节点id字段
 * @Param children 节点子节点字段
 */
function getNode(nodeId, data, id, children) {
    let result = null;
    if (StringUtil.isBlank(nodeId)){
        return null;
    }
    for (var i in data) {
        if (data[i][id] === nodeId) {
            result = data[i];
            break
        }
        if (result != null) {
            break
        }
        result = getNode(nodeId, data[i][children], id, children)
    }
    return result;
}

/**
 * @Description : 获取路径
 * @Author : cheng fei
 * @CreateDate 2019/3/27 1:48
 * @Param parentNodes 所有父节点数组
 * @Param path 表示路径的字段
 */
function getPath(parentNodes, path) {
    let parentNodesPath = "";
    for (let i in parentNodes) {
        parentNodesPath += parentNodes[i][path] + "/"
    }
    if (parentNodesPath.length > 0){
        parentNodesPath = parentNodesPath.substring(0, parentNodesPath.length -1);
    }
    return parentNodesPath
}

export default TreeUtil
