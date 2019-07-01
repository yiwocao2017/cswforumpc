import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './App';

// 404
const NotFoundPage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/NotFoundPage').default)
    }, 'NotFoundPage');
};
// 首页
const Index = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Index').default)
    }, 'Index');
};
// 小板块详情
const Board = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Board').default)
    }, 'Board');
};
// 帖子详情
const Post = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Post').default)
    }, 'Post');
};
// 登录
const Login = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Login').default)
    }, 'Login');
};
// 注册
const Register = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Register').default)
    }, 'Register');
};
// 找回密码
const FindPwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/FindPwd').default)
    }, 'FindPwd');
};
// 修改密码
const ResetPwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ResetPwd').default)
    }, 'ResetPwd');
};
// 用户帖子列表
const User = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User').default)
    }, 'User');
};
// 城市网服务协议
const Protocal = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Protocal').default)
    }, 'Protocal');
};
// 关于城市网
const AboutCSW = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/AboutCSW').default)
    }, 'AboutCSW');
};

export default (
    <Route path="/" component={App}>
        {/* 首页 */}
        <IndexRoute getComponent={Index}/>
        {/* 小板块详情 */}
        <Route path="board/:code" getComponent={Board}/>
        {/* 帖子详情 */}
        <Route path="post/:code" getComponent={Post}/>
        {/* 用户帖子列表 */}
        <Route path="user/:userId" getComponent={User}/>
        {/* 登录 */}
        <Route path="login" getComponent={Login}/>
        {/* 注册 */}
        <Route path="register" getComponent={Register}/>
        {/* 找回密码 */}
        <Route path="findPwd" getComponent={FindPwd}/>
        {/* 修改密码 */}
        <Route path="resetPwd" getComponent={ResetPwd}/>
        {/* 城市网服务协议 */}
        <Route path="protocal" getComponent={Protocal}/>
        {/* 关于城市网 */}
        <Route path="aboutus" getComponent={AboutCSW}/>

        <Route path="*" getComponent={NotFoundPage}/>
    </Route>
);
