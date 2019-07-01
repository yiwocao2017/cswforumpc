import React, {Component} from 'react';
import {Link} from 'react-router';
import { Input, Select, Button, Dropdown, Icon, Menu } from 'antd';
import {UserCtr} from '../../../controller/UserCtr';
import {PostCtr} from '../../../controller/PostCtr';
import {globalInfo} from '../../../App';
import './index.scss';

const Util = require('../../../util/util');
const Search = Input.Search;
const Option = Select.Option;

export default class TopInfo extends Component {
    constructor() {
        super();
        this.state = {
            result: null,
            searchValue: ""
        };
        this.searchType = 1;
    }
    componentWillUnmount(){
        clearTimeout(this.timer);
    }
    // 搜索类型修改的回调
    searchTypeChange(value){
        this.searchType = value;
        if(!Util.isEmptyString(this.state.searchValue)){
            this.searchPostOrUser(this.state.searchValue);
        }
    }
    // 搜索框值改变时的回调
    searchChange(e){
        const { value } = e.target;
        this.setState({
            searchValue: value
        });
        if(!Util.isEmptyString(value)){
            clearTimeout(this.timer);
            if(this.searchType == 1){
                this.timer = setTimeout(() => this.searchPost(value), 300);
            }else{
                this.timer = setTimeout(() => this.searchUser(value), 300);
            }
        }else{
            clearTimeout(this.timer);
            this.setState({result: null});
        }
    }
    // 搜索帖子或用户
    searchPostOrUser(value){
        if(!Util.isEmptyString(value)){
            if(this.searchType == 1){
                this.searchPost(value);
            }else{
                this.searchUser(value);
            }
        }else{
            this.setState({result: null});
        }
    }
    // 搜索帖子
    searchPost(value){
        PostCtr.getPostByKeyword(value)
            .then((data) => {
                if(data.list.length){
                    this.setState({result: data.list});
                }else{
                    this.setState({result: []});
                }
            })
            .catch(() => this.setState({result: []}))
    }
    // 搜索用户
    searchUser(value){
        UserCtr.getUserByKeyword(value)
            .then((data) => {
                if(data.list.length){
                    this.setState({result: data.list});
                }else{
                    this.setState({result: []});
                }
            })
            .catch(() => this.setState({result: []}));
    }
    render() {
        let {isLogin} = this.props;
        let {result, searchValue} = this.state;
        const selectAfter = (
            <Select onChange={this.searchTypeChange.bind(this)} defaultValue="1" style={{ width: 70 }}>
                <Option value="1">帖子</Option>
                <Option value="2">用户</Option>
            </Select>
        );
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link className="top-normal-selected" to={`/user/${globalInfo.user.userId}`}>我的帖子</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link className="top-normal-selected" to="/resetPwd">修改密码</Link>
                </Menu.Item>
                <Menu.Item>
                    <a className="top-normal-selected" href="javascript:void(0)" onClick={this.props.signOut}>退出</a>
                </Menu.Item>
          </Menu>
        );
        return (
            <div class="top-container">
                <div class="container p-r">
                    <span class="top-title">欢迎来到城市网！</span>
                    <div class="top-search-container">
                        <Search
                            placeholder="帖子"
                            style={{ width: 356 }}
                            value={searchValue}
                            addonAfter={selectAfter}
                            onChange={this.searchChange.bind(this)}
                            onSearch={this.searchPostOrUser.bind(this)}
                        />
                        <div class="top-sResult">
                            {
                                this.searchType == 1 ?
                                    (
                                        <ul class="top-user-result">
                                            {
                                                result ?
                                                    result.length ?
                                                        result.map((post) => (
                                                            <li key={post.code} class="clearfix">
                                                                <Link to={`/post/${post.code}`} target="_blank" class="block_hw100">
                                                                    <div class="top-uAvatar">
                                                                        <img src={post.photo}/>
                                                                    </div>
                                                                    <div class="top-uNickname">
                                                                        <span>{post.title}</span>
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ))
                                                        : <li class="no-result">暂无相关帖子</li>
                                                    : null
                                            }
                                        </ul>
                                    )
                                    : (
                                        <ul class="top-user-result">
                                            {
                                                result ?
                                                    result.length ?
                                                        result.map((user) => (
                                                            <li key={user.userId} class="clearfix">
                                                                <Link to={`/user/${user.userId}`} target="_blank" class="block_hw100">
                                                                    <div class="top-uAvatar">
                                                                        <img src={user.userExt.photo}/>
                                                                    </div>
                                                                    <div class="top-uNickname">
                                                                        <span>{user.nickname}</span>
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ))
                                                        : <li class="no-result">暂无相关用户</li>
                                                    : null
                                            }
                                        </ul>
                                    )
                            }
                        </div>
                    </div>
                    <div class="fr top-right-user">
                        {
                            isLogin
                                ? <div>
                                    <span class="top-amount">赏金：<span class="">{Util.formatMoney(globalInfo.amount)}</span></span>
                                    <Dropdown className="top-right-user-dropdown" overlay={menu}>
                                        <span class="top-nickname">{globalInfo.user.nickname} <Icon type="down"/></span>
                                    </Dropdown>
                                </div>
                                : <div>
                                    <Link to='/login'><Button className="mr10">登录</Button></Link>
                                    <Link to='/register'><Button>注册</Button></Link>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
