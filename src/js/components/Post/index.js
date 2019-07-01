import React, {Component} from 'react';
import {Link} from 'react-router';
import {Breadcrumb, Button, Pagination, Spin} from 'antd';
import WriteComment from './WriteComment';
import CommentItems from './CommentItems';
import {PostCtr} from '../../controller/PostCtr';
import './index.scss';

const Util = require('../../util/util.js');

export default class Post extends Component {
    constructor() {
        super();
        this.state = {
            post: {},           //帖子
            comments: [],       //评论
            start: 1,
            limit: 20,
            loading: true,      //是否处于加载中
            totalCount: 0,      //评论总页数
            parentCode: "",     //评论针对的code
            placeholder: "回复帖子",    //评论框的placeholder
        };
    }
    componentDidMount() {
        this.getPostDetail(true);
        this.getPageComment(true);
        // 阅读帖子
        PostCtr.read(this.props.params.code);
    }
    // 获取帖子详情
    getPostDetail(refresh){
        return PostCtr.getPostDetail(this.props.params.code, refresh)
            .then((data) => {
                document.title = data.title;
                this.setState({
                    post: data,
                    loading: false
                });
            }).catch(() => {
                this.setState({
                    loading: false
                });
            });
    }
    // 分页获取评论
    getPageComment(refresh){
        let {start, limit} = this.state;
        return PostCtr.getPageComment({
            start,
            limit,
            postCode: this.props.params.code
        }, refresh).then((data) => {
            this.setState({
                comments: data.list,
                totalCount: data.totalCount || 1,
                loading: false
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
        });
    }
    // 翻页
    onChange(start){
        this.setState({
            start,
            loading: true
        }, () => this.getPageComment());
    }
    /*
     * 用户点击 回复 的回调函数
     * @param params --> object
     *          {
     *             parentCode: 评论的parentCode,
     *             placeholder: 评论的placeholder
     *          }
     */
    handleReply(params){
        if(!Util.isLogin()){
            this.props.showLoginModal();
            return;
        }
        this.setState({
            placeholder: params.placeholder,
            parentCode: params.parentCode
        });
        Util.scroll2Bottom();
    }
    // 评论发布成功的回调函数
    publishSuccess(){
        this.props.updateAccount();
        this.setState({
            placeholder: "回复帖子",
            parentCode: this.state.post.code,
            loading: true
        });
        this.getPageComment(true);
        let {post} = this.state;
        post.sumComment = +post.sumComment + 1;
        this.setState({post});
        Util.setScrollTop(0);
    }
    handleTopReply(e){
        e.stopPropagation();
        e.preventDefault();
        this.handleReply({
            placeholder: "回复帖子",
            parentCode: this.state.post.code
        });
    }
    render() {
        let {post, comments, start, limit, totalCount, loading, parentCode, placeholder} = this.state;
        return (
            <div class="container post-container">
                <Breadcrumb>
                    <Breadcrumb.Item>城市网</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to={`/board/${post.plateCode}`}>{post.splateName}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>帖子详情</Breadcrumb.Item>
                </Breadcrumb>
                <Button type="primary" onClick={this.handleTopReply.bind(this)}>回复</Button>
                <div class="post-wrap">
                    <div class="post-header clearfix">
                        <div class="fl p-header-l">
                            <div class="p-header-l-t1">{ post.sumRead }</div>
                            <div class="p-header-l-t2">阅读</div>
                        </div>
                        <div class="fl p-header-border"></div>
                        <div class="fl p-header-l p-header-ll">
                            <div class="p-header-l-t1">{ post.sumComment }</div>
                            <div class="p-header-l-t2">回复</div>
                        </div>
                        <div class="fl p-header-title v-middle"><span>{ post.title }</span></div>
                    </div>
                    <div class="post-cont">
                        <Spin spinning={loading}>
                            <CommentItems
                                showLoginModal={this.props.showLoginModal}
                                handleReply={this.handleReply.bind(this)}
                                comments={comments}
                                post={post}
                                start={start}/>
                        </Spin>
                    </div>
                </div>
                <Pagination current={start} pageSize={limit} onChange={this.onChange.bind(this)} total={totalCount} />
                <WriteComment
                    showLoginModal={this.props.showLoginModal}
                    publishSuccess = {this.publishSuccess.bind(this)}
                    placeholder={placeholder}
                    parentCode={parentCode || this.props.params.code}
                    postCode={this.props.params.code}/>
            </div>
        )
    }
}
