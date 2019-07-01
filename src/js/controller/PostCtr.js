const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const PostCtr = {
    // 发布帖子
    publish: (params) => {
        params.publisher = Util.getUserId();
        return Ajax.post("610110", params);
    },
    // 发布评论
    publishComment: (params) => {
        params.commer = Util.getUserId();
        return Ajax.post("610112", params);
    },
    // 阅读帖子
    read: (postCode) => (
        Ajax.post("610120", {postCode})
    ),
    // 分页查询帖子
    getPagePost: (params, refresh) => {
        if(Util.isLogin()){
            params.userId = Util.getUserId();
        }
        return Ajax.get("610130", params, refresh);
    },
    // 分页查询板块的帖子
    getBoardPagePost: (params, refresh) => {
        if(Util.isLogin()){
            params.userId = Util.getUserId();
        }
        return Ajax.get("610145", params, refresh);
    },
    // 详情查询帖子
    getPostDetail: (code, refresh) => (
        Ajax.get("610132", {
            code,
            userId: Util.getUserId(),
            commStatus:"BD"
        }, refresh)
    ),
    // 分页查询头条
    getPageTopPost: (params, refresh) => {
        params.location = "C";
        params.companyCode = Util.getCompany().code;
        return PostCtr.getPagePost(params, refresh);
    },
    // 根据关键字获取帖子列表
    getPostByKeyword: (keyword, refresh) => (
        PostCtr.getPagePost({
            keyword,
            isLock: "0",
            status: "BD",
            start: 1,
            limit: 10,
            companyCode: Util.getCompany().code
        }, refresh)
    ),
    // 删除帖子
    deletePost: (code) => (
        Ajax.post("610116", {
            codeList: [code],
            userId: Util.getUserId(),
            type: 1
        })
    ),
    // 删除帖子
    deleteComment: (code) => (
        Ajax.post("610116", {
            codeList: [code],
            userId: Util.getUserId(),
            type: 2
        })
    ),
    // 分页查询评论
    getPageComment: (params, refresh) => {
        params.status = "BD";
        return Ajax.get("610133", params, refresh);
    },
    // 详情查询论坛小板块
    getBlockDetail: (code, refresh) => (
        Ajax.get("610046", {code}, refresh)
    ),
    // 列表获取小板块
    getBlockList: (refresh) => (
        Ajax.get("610049", {"companyCode": Util.getCompany().code, "statusList": ["1", "2"]}, refresh)
    ),
    // 详情查询论坛大板块
    getBigBlockDetail: (code, refresh) => (
        Ajax.get("610026", {code}, refresh)
    )
};
