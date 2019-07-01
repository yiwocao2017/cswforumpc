const Ajax = require('../util/ajax.js');
// const Util = require('../util/util.js');

export const GeneralCtr = {
    // 加载七牛token
    getQiniuToken: () => (
        Ajax.get("807900")
    ),
    // 发送短信验证码
    sendCaptcha: (mobile, bizType) => (
        Ajax.post("805904", {
            mobile,
            bizType,
            kind: "f1"
        })
    ),
    // 获取城市网服务协议
    getProtocal: (refresh) => (
        Ajax.get("807717", {
            ckey: "cswRule"
        }, refresh)
    )
};
