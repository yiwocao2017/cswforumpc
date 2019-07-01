import {globalInfo} from '../App';
import {message} from 'antd';
import { hashHistory } from 'react-router';
import {CookieUtil} from '../util/cookie';

const Ajax = {
    get: (code, json, reload = false) => {
        return Ajax.post(code, json, reload);
    },
    post: (code, json = {}, reload = true) => {
        let {cache} = globalInfo;
        let token = CookieUtil.get("token");
        json["systemCode"] = SYSTEM_CODE;
        token && (json["token"] = token);
        let param = {
            code: code,
            json: json
        };
        let cache_url = "/forward/api" + JSON.stringify(param);

        if (reload) {
            delete cache[code];
        }
        cache[code] = cache[code] || {};
        if (!cache[code][cache_url]) {
            json = encodeURIComponent(JSON.stringify(json));
            param = 'code=' + code + '&json=' + json;
            cache[code][cache_url] = fetch('/forward/api', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: param
            }).then((res) => res.json());
        }

        return new Promise((resolve, reject) => {
            cache[code][cache_url]
                .then((res) => {
                    if(res.errorCode == "0")
                        resolve(res.data);
                    else if(res.errorCode == "4"){
                        message.warning("登录超时，请重新登录");
                        CookieUtil.del("userId");
                        CookieUtil.del("token");
                        setTimeout(() => hashHistory.push('/login'), 1000);
                        reject(res.errorInfo);
                    } else{
                        message.error(res.errorInfo);
                        reject(res.errorInfo);
                    }
                }).catch((error) => {
                    message.error(error.toString());
                    reject(error);
                });
        });
    }
}
module.exports = Ajax;
