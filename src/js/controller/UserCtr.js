const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const UserCtr = {
    // 登录
    login: (params) => {
        params.kind = "f1";
        return Ajax.post("805043", params);
    },
    // 注册
    register: (params) => {
        params.loginPwdStrength = Util.calculateSecurityLevel(params.loginPwd);
        params.isRegHx = "1";
        return Ajax.post("805076", params);
    },
    // 找回密码
    findPwd: (params) => {
        params.loginPwdStrength = Util.calculateSecurityLevel(params.newLoginPwd);
        params.kind = "f1";
        return Ajax.post("805048", params);
    },
    // 修改密码
    resetPwd: (params) => {
        params.loginPwdStrength = Util.calculateSecurityLevel(params.newLoginPwd);
        params.kind = "f1";
        params.userId = Util.getUserId();
        return Ajax.post("805049", params);
    },
    // 获取用户详情
    getUserInfo: (refresh) => (
        Ajax.get("805056", {userId: Util.getUserId()}, refresh)
    ),
    // 根据昵称获取用户的userId
    getUserByNickname: (nickname, refresh) => (
        Ajax.get("805255", {
            start: 1,
            limit: 1,
            kind: "f1",
            nickname
        }, refresh)
    ),
    // 根据关键字获取用户列表
    getUserByKeyword: (keyword, refresh) => (
        Ajax.get("805255", {
            start: 1,
            limit: 10,
            kind: "f1",
            nickname: keyword,
            status: 0,
            companyCode: Util.getCompany().code
        }, refresh)
    ),
    // 获取用户账户信息
    getUserAccount: (refresh) => (
        Ajax.get("802503", {
            userId: Util.getUserId()
        }, refresh)
    ),
    // 分页获取关注的人
    getPageAttention: (params, refresh) => {
        params.userId = Util.getUserId();
        return Ajax.get("805090", params, refresh);
    },
    // 列表获取关注的人
    getListAttention: (params, refresh) => {
        params.userId = Util.getUserId();
        return Ajax.get("805091", params, refresh);
    },
    // 查询是否关注某个用户
    isAttention: (toUser) => (
        Ajax.post("805092", {
            userId: Util.getUserId(),
            toUser
        })
    ),
    // 关注
    attention: (toUser) => (
        Ajax.post("805080", {
            userId: Util.getUserId(),
            toUser
        })
    ),
    // 取消关注
    cancelAttention: (toUser) => (
        Ajax.post("805081", {
            userId: Util.getUserId(),
            toUser
        })
    ),
    // 根据省市区获取公司
    getCompanyByAddr: (province = 1, city = 1, area = 1, refresh = false) => (
        Ajax.get("806012", {
            province,
            city,
            area
        }, refresh)
    ),
    // 根据公司编号获取公司
    getCompanyByCode: (code, refresh) => (
        Ajax.get("806010", {code}, refresh)
    ),
    // 列表获取company，并按字母分组
    getGroupCompanyList: () => (
        Ajax.get("806017", {
            status: 2
        })
    )
};
