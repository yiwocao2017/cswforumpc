import { hashHistory } from 'react-router';
import React from 'react';
import {CookieUtil} from './cookie';

import {globalInfo} from '../App';

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
const Util = {
    formatDate: (date, format = "MM月dd日 hh:mm") => {
        if (!date)
            return "--";
        if (typeof date == "string")
            date = date.replace(/(12:\d\d:\d\d\s)AM$/, "$1PM");
        return new Date(date).format(format);
    },
    formatMoney: function(s, t) {
        s = +s;
        if(typeof s !== "number")
            return "--";
        var num = +s / 1000;
        num = (num+"").replace(/^(\d+\.\d\d)\d*/i, "$1");
        return (+num).toFixed(t || 2);
    },
    // 后退
    historyBack: (e) => {
        if(window.history.length == 1){
            Util.goPath('/');
        }else{
            window.history.back();
        }
    },
    historyGo: (index) => {
        window.history.go(index);
    },
    /*
     * 跳转到指定url
     * @param path 跳转路径
     * @param newPage 是否在新页面打开
     */
    goPath: (path, newPage) => {
        if(newPage){
            window.open(`${location.origin}/#${path}`);
        }else{
            hashHistory.push(path);
        }
    },
    // 在新页面打开
    openWindow: (url) => {
        window.open(url);
    },
    // 设置页面标题
    setTitle: (title) => {
        document.title = title;
    },
    // 从localStorage获取公司
    getCompany: () => {
        let company = localStorage["company"];
        return company ? JSON.parse(company) : {};
    },
    // 保存公司信息到localStorage
    setCompany: (company) => {
        company && (localStorage["company"] = JSON.stringify(company));
    },
    // 从localStorage里获取地址
    getAddress: () => {
        let address = localStorage["address"];
        return address ? JSON.parse(address) : null;
    },
    // 保存地址信息到localStorage
    setAddress: (address) => {
        if(address){
            let _addr = {
                province: address.province,
                city: address.city,
                area: address.area
            };
            localStorage["address"] = JSON.stringify(_addr);
        }
    },
    // 保存userId和token到localStorage
    setUser: (data, isSession) => {
        // localStorage["userId"] = data.userId;
        // localStorage["token"] = data.token;
        CookieUtil.set("userId", data.userId, isSession);
        CookieUtil.set("token", data.token, isSession);
    },
    // 把用户的userId和token从localStorage中移除
    clearUser: () => {
        // localStorage.removeItem("userId");
        // localStorage.removeItem("token");
        CookieUtil.del("userId");
        CookieUtil.del("token");
        globalInfo.user = {
            userId: "",
            nickname: "",
            userExt: {
                photo: ""
            }
        };
        globalInfo.amount = 0;
    },
    // 从localStorage获取userId
    getUserId: () => (
        // localStorage.getItem("userId")
        CookieUtil.get("userId")
    ),
    // 判断是否登录
    isLogin: () => (
        // !!localStorage.getItem("userId")
        !!CookieUtil.get("userId")
    ),
    // 跳转到登录页面
    goLogin: () => {
        let _hash = location.hash.substr(1).replace(/\?.*/i, "");
        sessionStorage.setItem("login-return", _hash);
        Util.goPath('/user/login');
    },
    // 登录后跳转到原来到页面
    goBackAfterLogin: () => {
        let returnUrl = sessionStorage.getItem("login-return");
        if(returnUrl)
            hashHistory.push(returnUrl);
        else
            hashHistory.push('/user');
    },
    // 计算密码强度
    calculateSecurityLevel: (password) => {
        var strength_L = 0;
        var strength_M = 0;
        var strength_H = 0;

        for (var i = 0; i < password.length; i++) {
            var code = password.charCodeAt(i);
            // 数字
            if (code >= 48 && code <= 57) {
                strength_L++;
                // 小写字母 大写字母
            } else if ((code >= 65 && code <= 90) ||
                (code >= 97 && code <= 122)) {
                strength_M++;
                // 特殊符号
            } else if ((code >= 32 && code <= 47) ||
                (code >= 58 && code <= 64) ||
                (code >= 94 && code <= 96) ||
                (code >= 123 && code <= 126)) {
                strength_H++;
            }
        }
        // 弱
        if ((strength_L == 0 && strength_M == 0) ||
            (strength_L == 0 && strength_H == 0) ||
            (strength_M == 0 && strength_H == 0)) {
            return "1";
        }
        // 强
        if (0 != strength_L && 0 != strength_M && 0 != strength_H) {
            return "3";
        }
        // 中
        return "2";
    },
    // 裁剪帖子详情的帖子图片
    formatThumbanailImg: (imgUrl) => (Util.formatImg(imgUrl, "?imageMogr2/auto-orient/thumbnail/!140x140r")),
    // 获取图片正确的地址
    formatImg: (imgUrl, suffix = "?imageMogr2/auto-orient") => {
        if(!imgUrl){
            return "";
        }
        imgUrl = imgUrl.split("||")[0];
        if(!/^http|^data:image/i.test(imgUrl)){
            imgUrl = PIC_PREFIX + imgUrl + suffix;
        }
        return imgUrl;
    },
    // 裁剪列表中到头像
    formatListThumbanailAvatar: (imgUrl) => {
        imgUrl = imgUrl || require('../../images/default-avatar.png');
        return Util.formatThumbanailImg(imgUrl);
    },
    formatUserCenter: (imgUrl) => (Util.formatImg(imgUrl || require('../../images/default-avatar.png'), "?imageMogr2/auto-orient/thumbnail/!110x110r")),
    // 从数组中根据key找到指定对象
    findItemInArr: (arr, item, key) => {
        for(let i = 0, len = arr.length; i < len; i++){
            let _item = arr[i];
            if(_item[key] == item[key]){
                return i;
            }
        }
        return -1;
    },
    // 是否是空字符串
    isEmptyString: (str) => {
        if(str && str.trim() !== "")
            return false;
        return true;
    },
    isUndefined: (str) => {
        if(!str || str === ""){
            return true;
        }
        return false;
    },
    /*
     * 获取并保存textarea光标的位置
     * @param textBox    点击的表情
     */
    savePos: (textBox) => {
        let start, end;
        //如果是Firefox(1.5)的话，方法很简单
        if (typeof(textBox.selectionStart) == "number") {
            start = textBox.selectionStart;
            end = textBox.selectionEnd;
            end = textBox.//下面是IE(6.0)的方法，麻烦得很，还要计算上'/n'
            selectionEnd;
        } else if (document.selection) {
            var range = document.selection.createRange();
            if (range.parentElement().id == textBox.id) {
                // create a selection of the whole textarea
                var range_all = document.body.createTextRange();
                range_all.moveToElementText(textBox);
                //两个range，一个是已经选择的text(range)，一个是整个textarea(range_all)
                //range_all.compareEndPoints() 比较两个端点，如果range_all比range更往左(further to the left)，则                //返回小于0的值，则range_all往右移一点，直到两个range的start相同。
                // calculate selection start point by moving beginning of range_all to beginning of range
                for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++)
                    range_all.moveStart('character', 1);

                // get number of line breaks from textarea start to selection start and add them to start
                // 计算一下/n
                for (var i = 0; i <= start; i++) {
                    if (textBox.value.charAt(i) == '/n')
                        start++;
                    }
                // create a selection of the whole textarea
                var range_all = document.body.createTextRange();
                range_all.moveToElementText(textBox);
                // calculate selection end point by moving beginning of range_all to end of range
                for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++)
                    range_all.moveStart('character', 1);

                // get number of line breaks from textarea start to selection end and add them to end
                for (var i = 0; i <= end; i++) {
                    if (textBox.value.charAt(i) == '/n')
                        end++;
                    }
                }
        }
        return {
            start: start,
            end: end
        }
    },
    /*
     * 冒泡排序，默认升序
     * @param list 排序数组
     * @param key 按数组的哪个key排序
     * @param isDesc 是否降序，默认升序,
     * @return {array}  排序好到数组
     */
    bubbleSort: (list, key, isDesc) => {
        for(var i = 0; i < list.length - 1; i++){
            for(var j = i + 1; j < list.length; j++){
                let value1 = list[i][key],
                    value2 = list[j][key];
                if(key == "orderNo"){
                    value1 = +value1;
                    value2 = +value2;
                }
                if(!isDesc){
                    if(value1 > value2){
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                }else{
                    if(value1 < value2){
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                }
            }
        }
        return list;
    },
    // 没有数据时的显示
    noData: (msg) => {
        return <div class="no-data">{msg}</div>
    },
    // 设置页面到scrollTop
    setScrollTop: (value) => {
        document.body.scrollTop = value;
        document.documentElement.scrollTop = value;
    },
    // 滚动到页面底部
    scroll2Bottom: () => {
        Util.setScrollTop(document.body.scrollHeight || document.documentElement.scrollHeight);
    },
    // 转译html中到特殊字符
    encode: (str) => {
        if (!str || str.length === 0) {
            return '';
        }
        var s = '';
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/<(?=[^o][^)])/g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    },
    // 根据companyCode找到url
    findUrlByCompanyCode: (code) => {
        if(URL2COMPANY){
            for(let url in URL2COMPANY){
                if(URL2COMPANY[url] == code){
                    return url;
                }
            }
        }
        return "";
    }
};
module.exports = Util;
