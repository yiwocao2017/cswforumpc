import React, {Component} from 'react';
import {Link} from 'react-router';
import {Breadcrumb, Button, Table} from 'antd';
import WritePost from '../WritePost';
import {PostCtr} from '../../controller/PostCtr';
import './index.scss';

const Util = require('../../util/util.js');

export default class Board extends Component {
    constructor() {
        super();
        this.state = {
            data: [],           //帖子列表
            pagination: {       //table分页参数
                total: 0,
                pageSize: 10
            },
            loading: true,      //table是否处于加载
            plateName: "",      //小板块名称
            bPlateName: "",     //大板块名称
        };
        this.columns = [
            {
                title: '标题',
                dataIndex: 'title',
                render: (name, data) => <div className="board-post-title">{
                    this.getIconByLocation(data.location)
                }{name}</div>
            }, {
                title: '作者',
                dataIndex: 'nickname',
                render: (nickname, data) => <span class="white_nowrap">{nickname}</span>
            }, {
                title: '回复',
                dataIndex: 'sumComment',
                render: (sumComment, data) => <span class="white_nowrap">{sumComment}</span>
            }, {
                title: '更新时间',
                dataIndex: 'publishDatetime',
                sorter: true,
                render: (publishDatetime) => <span class="white_nowrap">{Util.formatDate(publishDatetime, "yyyy-MM-dd hh:mm")}</span>
            }
        ];
        this.sorter = {
            "field": "",
            "order": ""
        };
    }
    componentDidMount() {
        this.getPagePost({
            start: 1,
            limit: 10,
            plateCode: this.props.params.code
        });
        this.getBlockDetail(this.props.params.code);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.params.code != this.props.params.code){
            this.getPagePost({
                start: 1,
                limit: 10,
                plateCode: nextProps.params.code,
                orderColumn: this.sorter.field,
                orderDir: this.sorter.order
            }, true);
            this.getBlockDetail(nextProps.params.code);
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
    // 详情查询论坛小板块
    getBlockDetail(code){
        PostCtr.getBlockDetail(code)
            .then((data) => {
                this.getBigBlockDetail(data.splate.bplateCode);
                document.title = data.splate.name;
                this.setState({
                    plateName: data.splate.name
                });
            }).catch(() => {});
    }
    // 详情查询大板块
    getBigBlockDetail(code){
        PostCtr.getBigBlockDetail(code)
            .then((data) => this.setState({bPlateName: data.name}))
            .catch(() => {});
    }
    // 分页查询帖子
    getPagePost(params, refresh) {
        this.setState({ loading: true });
        params.status = "BD";
        params.isLock = "0";
        if(!params.orderColumn){
            params.orderColumn = "location";
            params.orderDir = "asc";
        }
        PostCtr.getBoardPagePost(params, refresh).then((data) => {
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
            plateCode: this.props.params.code,
            orderColumn: sorter.field,
            orderDir: sorter.order
        });
    }
    // table行click事件
    handleRowClick(record, index){
        Util.goPath(`/post/${record.code}`, true);
    }
    // 帖子发布成功后的回调函数
    publishSuccess(code){
        this.props.updateAccount();
        // this.getPagePost({
        //     limit: 10,
        //     start: this.state.pagination.current,
        //     plateCode: this.props.params.code,
        //     orderColumn: this.sorter.field,
        //     orderDir: this.sorter.order
        // }, true);
        setTimeout(() => Util.goPath(`/post/${code}`), 1000);
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
        let {plateName, bPlateName} = this.state;
        return (
            <div class="container board-container">
                <Breadcrumb>
                    <Breadcrumb.Item><Link to='/'>城市网</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{bPlateName}</Breadcrumb.Item>
                    <Breadcrumb.Item>{plateName}</Breadcrumb.Item>
                </Breadcrumb>
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
                    showLoginModal={this.props.showLoginModal}
                    publishSuccess={this.publishSuccess.bind(this)}
                    plateCode={this.props.params.code}/>
            </div>
        )
    }
}
