import React, {Component} from 'react';
import {Button, Icon, Pagination, Spin} from 'antd';
import className from 'classnames';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');

export default class ATWrap extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 15,
            users: [],          //用户列表信息
            totalCount: 0,      //用户总数
            loading: false      //是否正在加载中
        };
    }
    componentDidMount(){
        this.setState({loading: true});
        this.getPageAttention(true)
            .then(() => this.setState({loading: false}))
            .catch(() => this.setState({loading: false}));
    }
    // 获取关注人列表
    getPageAttention(refresh){
        let {start, limit, users} = this.state;
        start = refresh && 1 || start;
        return UserCtr.getPageAttention({
            start,
            limit
        }, refresh).then((data) => {
            let totalCount = data.totalCount;
            this.setState({
                totalCount,
                users: data.list,
                start
            });
        });
    }
    // 翻页
    onChange(page){
        this.setState({
            start: page
        }, () => {
            this.setState({loading: true});
            this.getPageAttention()
                .then(() => this.setState({loading: false}))
                .catch(() => this.setState({loading: false}));
        });

    }
    // 用户点击事件
    handleUserClick(user, e){
        e.preventDefault();
        e.stopPropagation();
        this.props.handleUserClick(user.nickname);
    }
    render() {
        let {start, limit, users, totalCount, loading} = this.state;
        return (
            <div class="at-wrap p-r">
                <div class="W_layer_arrow">
                    <span class="W_arrow_bor W_arrow_bor_t at-user-arrow">
                        <i class="S_line3"></i>
                        <em class="S_bg2_br"></em>
                    </span>
                </div>
                <Button onClick={this.props.closeUser} class="write-close-btn face-close-btn" icon="close" size="small"></Button>
                <Spin spinning={loading} >
                    <div class="at-user-container clearfix">
                        {users.length ? users.map((user, index) => (
                            <div onClick={this.handleUserClick.bind(this, user)} class="at-user-item" key={user.userId}>
                                <div class="at-user-photo"><img src={Util.formatImg(user.photo)}/></div>
                                <div class="at-user-nickname">{user.nickname}</div>
                            </div>
                        )) : Util.noData("暂无关注")}
                    </div>
                    <Pagination current={start} onChange={this.onChange.bind(this)} pageSize={limit} total={totalCount} />
                </Spin>
            </div>
        )
    }
}
