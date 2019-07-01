import React, {Component} from 'react';
import {Modal, message, BackTop} from 'antd';
import TopContainer from './components/TopContainer';
import ModalLogin from './components/ModalLogin';
import {UserCtr} from './controller/UserCtr';
import {PostCtr} from './controller/PostCtr';
import {MenuCtr} from './controller/MenuCtr';

const Util = require('./util/util');
const Ajax = require('./util/ajax');

const loadingIcon = require('../images/loading.png');


export const globalInfo = {
    user: {
        userId: "",
        nickname: "",
        userExt: {
            photo: ""
        }
    },
    amount: 0,
    cache: {}
};

export default class App extends Component {
    constructor(){
        super();
        this.state = {
            menuData: null,             //头部菜单
            current: "",                //当前选中的菜单
            showLogin: false,           //是否显示登录框
            isLogin: Util.isLogin(),    //是否登录
            showBody: false,            //是否显示网站内容
        };
        this.loading = null;
    }
    componentWillMount() {
        let origin = location.origin;
        // 当前域名有对应的companyCode
        if(URL2COMPANY && URL2COMPANY[origin]){
            this.getCompanyByCode(URL2COMPANY[origin])
                .then((data) => {
                    this.hasCompany(data);
                }).catch(() => {
                    // 若根据companycode获取失败，则根据localStorage中的位置获取默认站点
                    this.getCompanyByAddr({
                        province: 1,
                        city: 1,
                        area: 1
                    }).then((data) => {
                        this.hasCompany(data, 1);
                    }).catch(() => {});
                });
        }else{
            let addr = Util.getAddress();
            let company = Util.getCompany();
            if(!addr){
                // this.showLoading("定位中...");
                this.getLocation();
            }else{
                // this.showLoading("获取站点中...");
                if(!company.code){
                    // 根据localStorage中的位置获取默认站点
                    this.getCompanyByAddr(addr)
                        .then((data) => {
                            this.hasCompany(data);
                        }).catch(() => {});
                }else{
                    // 根据localStorage中的company.code获取站点
                    this.getCompanyByCode(company.code)
                        .then((data) => {
                            this.hasCompany(data);
                        }).catch(() => {
                            // 若根据companycode获取失败，则根据localStorage中的位置获取默认站点
                            this.getCompanyByAddr(addr)
                                .then((data) => {
                                    this.hasCompany(data);
                                }).catch(() => {});
                        });
                }
            }
        }
    }
    componentDidMount() {
        // 若已经登录则获取用户详情
        let userId = Util.getUserId();
        if(userId && !globalInfo.user.userId){
            this.updateLogin();
        }
    }
    componentWillUpdate(){
        if(/board\/([^\?]+)/.exec(location.href)){
            let current = RegExp.$1;
            if(current != this.state.current){
                this.setState({current});
            }
        }else if(/\/#\/\?/.test(location.href)){
            if("index" != this.state.current){
                this.setState({current: "index"});
            }
        }else{
            let {current} = this.state;
            if(current != "")
                this.setState({current: ""});
        }

    }
    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.location.pathname != this.props.location.pathname){
            let userId = Util.getUserId();
            if(userId){
                if(!globalInfo.user.userId || globalInfo.user.userId != userId){
                    if(!this.loging && !this.accounting)
                        this.updateLogin();
                }
            }else if(globalInfo.user.userId || this.state.isLogin){
                Util.clearUser();
                this.setState({
                    isLogin: false
                });
            }
        }
    }
    // 显示loading图标
    showLoading(msg = "加载中...") {
        if(this.loading) this.loading();
        this.loading = message.loading(msg, 0);
    }
    // 登录后更新头部昵称
    updateLogin(){
        this.loging = true;
        this.accounting = true;
        UserCtr.getUserInfo()
            .then((data) => {
                globalInfo.user = data;
                this.setState({
                    isLogin: true
                });
                this.loging = false;
            }).catch(() => {
                this.loging = false;
            });
        this.updateAccount();
    }
    // 登录后更新头部账户信息
    updateAccount(){
        UserCtr.getUserAccount(true)
            .then((data) => {
                data.forEach((account, index) => {
                    if(account.currency == "JF")
                        globalInfo.amount = account.amount;
                });
                this.accounting = false;
                if(this.state.isLogin == true){
                    this.forceUpdate();
                }
            }).catch(() => {
                this.accounting = false;
            });
    }
    // 退出登录
    signOut(e){
        e.preventDefault();
        Util.clearUser();
        Util.goPath('/');
        this.setState({
            isLogin: false
        });
    }
    // 根据公司编号获取company
    getCompanyByCode(code){
        return UserCtr.getCompanyByCode(code)
            .then((data) => {
                Util.setCompany(data);
                return data;
            });
    }
    // 根据公司地址获取company
    getCompanyByAddr(addr){
        return UserCtr.getCompanyByAddr(addr.province, addr.city, addr.area)
            .then((data) => {
                Util.setCompany(data);
                return data;
            })
    }
    getLocation(){
        let me = this;
        var map, geolocation;
        //调用浏览器定位服务
        map = new AMap.Map('', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 5e3,          //超过5秒后停止定位，默认：无穷大
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', (data) => {
                let addressComponent = data.addressComponent,
                    province = addressComponent.province.substring(0, addressComponent.province.length - 1),
                    city = addressComponent.city.substring(0, addressComponent.city.length - 1),
                    area = addressComponent.district;
                Util.setAddress({province, city, area});
                me.getCompanyByAddr({
                    province,
                    city,
                    area
                }).then((data) => {
                    me.hasCompany(data);
                }).catch(() => {});
            });
            AMap.event.addListener(geolocation, 'error', (data) => {
                me.showLoading("定位失败，获取默认站点中...");
                me.getCompanyByAddr({
                    province: 1,
                    city: 1,
                    area: 1
                }).then((data) => {
                    // 定位失败后，根据默认站点的省市区 保存到 localStorage的address中
                    me.hasCompany(data, 1);
                }).catch(() => {});
            });      //定位出错信息
        });
    }
    // 根据data判断接口返回的数据是否有company
    hasCompany(data, saveAddrByCompany = false){
        if(data.code){
            this.setState({showBody: true});
            this.getModuleList(data);
            saveAddrByCompany && Util.setAddress(data);
        }else{
            Modal.error({
                title: '提示信息',
                content: '暂时没有站点',
            });
            // 隐藏loading
            this.loading && this.loading();
        }
    }

    // 获取头部菜单
    getModuleList(data){
        return MenuCtr.getBlockList(true)
            .then((data) => {
                this.loading && this.loading();
                this.setState({
                    menuData: data
                });
            }).catch(() => {this.loading && this.loading()});
    }
    // 头部菜单点击事件
    menuClick(key, name){
        document.title = name;
        this.setState({current: key});
        if(key != "index"){
            Util.goPath(`/board/${key}`);
        }else{
            Util.goPath('/');
        }
    }
    // 显示登录框
    showLoginModal(){
        this.setState({
            showLogin: true
        });
    }
    // 隐藏登录框
    hideLoginModal(){
        this.setState({
            showLogin: false
        });
    }
    // 生成子元素，并传入相关参数
    renderChildren() {
        //遍历所有子组件
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                //把父组件的props赋值给每个子组件
                showLoginModal: this.showLoginModal.bind(this),
                updateLogin: this.updateLogin.bind(this),
                updateAccount: this.updateAccount.bind(this)
            });
        })
    }
    render() {
        let {menuData, current, showLogin, isLogin, showBody} = this.state;
        let company = Util.getCompany();
        return (
            <div>
                <TopContainer
                    current={current}
                    menuData={menuData}
                    menuClick={this.menuClick.bind(this)}
                    isLogin={isLogin}
                    signOut={this.signOut.bind(this)}
                />
                {showBody ? this.renderChildren() : null}
                <ModalLogin visible={showLogin} updateLogin={this.updateLogin.bind(this)} hideLoginModal={this.hideLoginModal.bind(this)}/>
                <BackTop />
                <footer class="app-footer">{company && company.copyright || ""}</footer>
            </div>
        )
    }
}
