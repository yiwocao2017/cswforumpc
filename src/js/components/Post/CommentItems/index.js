import React, {Component} from 'react';
import {message} from 'antd';
import PostItem from './PostItem';
import CommentItem from './CommentItem';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util.js');

export default class CommentItems extends Component {
    // 处理帖子内容点击事件，判断如果点击@用户 时，跳转到用户中心
    handleContentClick(e){
        e.preventDefault();
        e.stopPropagation();
        let target = e.target;
        // 如果点击的是@用户 这个区域，则根据当前区域的nickname去获取userId，然后跳转到用户中心
        if(/^goUserCenterSpan$/.test(target.className)){
            this.showLoading();
            UserCtr.getUserByNickname(target.innerText.substr(1))
                .then((data) => {
                    message.destroy();
                    if(data.list.length)
                        Util.goPath(`/user/${data.list[0].userId}`, true);
                    else
                        message.error("非常抱歉，未找到该用户");
                }).catch(() => {
                    message.destroy();
                    message.error("非常抱歉，未找到该用户");
                });
        }
    }
    // 加载中
    showLoading(msg = "加载中...") {
        if(this.loading) this.loading();
        this.loading = message.loading(msg, 0);
    }

    render() {
        let {post, comments, start} = this.props;
        return (
            <div class="post-items">
                {
                    start == 1
                        ? <PostItem showLoginModal={this.props.showLoginModal} handleReply={this.props.handleReply} post={post} handleContentClick={this.handleContentClick.bind(this)}/>
                        : ""
                }
                {
                    comments.length ? comments.map((comment, index) => (
                        <CommentItem handleReply={this.props.handleReply} key={comment.code} comment={comment} publisher={post.publisher} handleContentClick={this.handleContentClick.bind(this)}/>
                    )) : ""
                }
            </div>
        )
    }
}
