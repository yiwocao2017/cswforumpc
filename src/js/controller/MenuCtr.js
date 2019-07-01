const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const MenuCtr = {
    // 列表获取小板块
    getBlockList: (refresh) => (
        Ajax.get("610048", {
          "companyCode": Util.getCompany().code,
          "status": "2",
          "orderColumn": "order_no",
          "orderDir": "asc"
        }, refresh)
    ),
    // 获取banner列表
    getBannerList: (refresh) => (
        Ajax.get('610107', {
            "companyCode": Util.getCompany().code,
            location: "1",
            orderColumn:"order_no",
            orderDir:"asc"
        }, refresh)
    ),
};
