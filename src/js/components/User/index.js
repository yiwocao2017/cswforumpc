import React, {Component} from 'react';
import {Link} from 'react-router';
import {Breadcrumb, Button, Table, Popconfirm, Modal} from 'antd';
import WritePost from '../WritePost';
import {PostCtr} from '../../controller/PostCtr';
import {Dict} from '../../util/dict';
import './index.scss';

const Util = require('../../util/util');

export default class User extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            pagination: {
                total: 0,
                pageSize: 10
            },
            loading: true
        };
        this.sorter = {
            "field": "",
            "order": ""
        };
    }
    componentWillMount(){
        document.title = "用户中心";
        this.columns = this.getColumn(this.props.params.userId);
    }
    componentDidMount() {
        this.getPagePost({
            start: 1,
            limit: 10,
        });
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.params.userId != this.props.params.userId){
            this.columns = this.getColumn(nextProps.params.userId);
            this.getPagePost({
                limit: 10,
                start: 1,
                orderColumn: this.sorter.field,
                orderDir: this.sorter.order,
                publisher: nextProps.params.userId
            }, true);
        }
    }
    // 根据location生成图标
    getIconByLocation(location){
        if(!location){
            return null;
        }
        return location.split(",").map((loca, index) => (
            loca == "A" ? <img key={index} class="title-icon" src={require('../../../images/top.png')}/>
                : loca == "B" ? <img key={index} class="title-icon jing-icon" src={require('../../../images/jing.png')}/>
                    : loca == "C" ? <img key={index} class="title-icon" src={require('../../../images/hot.png')}/>
                        : ""
        ));
    }
    // 获取表格title
    getColumn(userId){
        // location: A置顶 B 精华 C 头条
        if(Util.getUserId() == userId){
            return [
                {
                    title: '标题',
                    dataIndex: 'title',
                    render: (name, data) => <div className="user-post-title">{
                        this.getIconByLocation(data.location)
                    }{name}</div>
                }, {
                    title: '板块',
                    dataIndex: 'plateName',
                    render: (plateName, data) => <Link className="white_nowrap" onClick={this.stopProp.bind(this)} to={`/board/${data.plateCode}`} target="_blank">{plateName}</Link>
                }, {
                    title: '作者',
                    dataIndex: 'nickname',
                    render: (nickname, data) => <span class="white_nowrap">{nickname}</span>
                }, {
                    title: '回复',
                    dataIndex: 'sumComment',
                    render: (sumComment) => <span class="white_nowrap">{sumComment}</span>
                }, {
                    title: "状态",
                    dataIndex: 'status',
                    render: (status) => <span class="white_nowrap">{Dict.postStatus[status]}</span>
                }, {
                    title: '更新时间',
                    dataIndex: 'publishDatetime',
                    sorter: true,
                    render: (publishDatetime, data) => (
                        <div class="deleteWrap">
                            {Util.formatDate(publishDatetime, "yyyy-MM-dd hh:mm")}
                            <Popconfirm onClick={this.stopProp.bind(this)} title="确认删除帖子吗？" onConfirm={this.deletePost.bind(this, data.code)}>
                                <img
                                    class="deleteIcon"
                                    src={require('../../../images/delete.png')}/>
                            </Popconfirm>
                        </div>
                    )
                }
            ];
        }
        return [
            {
                title: '全部帖子',
                dataIndex: 'title',
                render: (name, data) => <div className="user-post-title">{
                    this.getIconByLocation(data.location)
                }{name}</div>
            }, {
                title: '板块',
                dataIndex: 'plateName',
                render: (plateName, data) => <Link className="white_nowrap" onClick={this.stopProp.bind(this)} to={`/board/${data.plateCode}`} target="_blank">{plateName}</Link>
            }, {
                title: '作者',
                dataIndex: 'nickname',
                render: (nickname, data) => <span class="white_nowrap">{nickname}</span>
            }, {
                title: '回复',
                dataIndex: 'sumComment',
                render: (sumComment) => <span class="white_nowrap">{sumComment}</span>
            }, {
                title: '更新时间',
                dataIndex: 'publishDatetime',
                sorter: true,
                render: (value, data) => <span class="white_nowrap">{Util.formatDate(data.publishDatetime, "yyyy-MM-dd hh:mm")}</span>
            }
        ];
    }
    // 删除帖子
    deletePost(code, e){
        e.stopPropagation();
        this.setState({
            loading: true
        });
        PostCtr.deletePost(code)
            .then(() => {
                let pager = {
                    ...this.state.pagination
                }
                // 当前删除的帖子是列表中最后一页的最后一条帖子（最后一页只有一条帖子，删除后就没了）
                if((pager.current - 1) * pager.pageSize + 1 == pager.total){
                    pager.current = (pager.current - 1) || 1;
                }
                this.setState({
                    pagination: pager
                }, () => this.reloadPage());
            })
            .catch(() => {});
    }
    // 点击帖子列表的板块时，防止事件冒泡触发tr的click事件
    stopProp(e){
        e.stopPropagation();
    }
    // 分页查询帖子
    getPagePost(params, refresh) {
        this.setState({ loading: true });
        // 自己的帖子
        if(Util.getUserId() == this.props.params.userId){
            params.status = "NO_A";     //非草稿
        }else{      //别人的帖子
            params.status = "BD";       //已发布 或 审批通过
            params.isLock = "0";
        }
        params.publisher = params.publisher || this.props.params.userId;

        PostCtr.getPagePost(params, refresh).then((data) => {
            const pagination = { ...this.state.pagination };
            pagination.total = data.totalCount;
            pagination.current = params.start;
            this.setState({
                loading: false,
                data: data.list,
                pagination,
            });
        });
    }
    // 上一页或下一页
    handleTableChange(pagination, filters, sorter) {
        if(sorter.field == "publishDatetime"){
            sorter.field = "publish_datetime";
        }
        if(sorter.order == "descend"){
            sorter.order = "desc";
        }else if(sorter.order == "ascend"){
            sorter.order = "asc";
        }
        sorter.field && (this.sorter = sorter);
        const pager = {
            ...this.state.pagination
        };
        pager.current = pagination.current;
        this.setState({pagination: pager});
        this.getPagePost({
            limit: pagination.pageSize,
            start: pagination.current,
            orderColumn: sorter.field,
            orderDir: sorter.order
        });
    }
    // table行click事件
    handleRowClick(record, index){
        Util.goPath(`/post/${record.code}`, true);
    }
    // 帖子发布成功后的回调函数
    publishSuccess(){
        if(Util.getUserId() == this.props.params.userId)
            this.reloadPage();
    }
    // 重新加载表格中的数据
    reloadPage(){
        this.getPagePost({
            limit: 10,
            start: this.state.pagination.current,
            orderColumn: this.sorter.field,
            orderDir: this.sorter.order
        }, true);
    }
    // 点击发帖按钮
    publish(e){
        e.stopPropagation();
        e.preventDefault();
        if(Util.isLogin()){
            Util.scroll2Bottom();
        }else{
            this.props.showLoginModal();
        }
    }

    render() {
        return (
            <div class="container user-container">
                <div class="user-big-primary">帖子列表</div>
                <Button type="primary" onClick={this.publish.bind(this)}>发帖</Button>
                <Table
                    columns={this.columns}
                    rowKey={record => record.code}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange.bind(this)}
                    onRowClick={this.handleRowClick.bind(this)}/>
                <WritePost
                    showPlateChose={true}
                    showLoginModal={this.props.showLoginModal}
                    publishSuccess={this.publishSuccess.bind(this)}
                    plateCode={this.props.params.code}/>
            </div>
        )
    }
}
