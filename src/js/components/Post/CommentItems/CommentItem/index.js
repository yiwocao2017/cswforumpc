import React, {Component} from 'react';
import {Link} from 'react-router';
import {Card} from 'antd';
import CommentUser from '../CommentUser';
import './index.scss';

const Util = require('../../../../util/util.js');
const postEmojiUtil = require('../../../../util/postEmoji.js');

export default class CommentItem extends Component {
    handleReply(comment, e){
        e.preventDefault();
        e.stopPropagation();
        // let {comment} = this.props;
        this.props.handleReply({
            parentCode: comment.code,
            placeholder: `@${comment.nickname} ${comment.content}`,
        });
    }
    render() {
        let {comment, publisher} = this.props;
        return (
            <div class="comment-item clearfix">
                <CommentUser user={comment} isComment={true}/>
                <div class="comment-item-cont">
                    <div class="c-item-header">{
                        comment.commer == publisher ?
                            <span class="c-item-owner">楼主</span>
                            : ""
                    }发表于：{Util.formatDate(comment.commDatetime)}</div>
                    <div class="c-item-content">
                        {
                            comment.parentComment ?
                                <Card
                                    className="mb10"
                                    title={<span>
                                            <Link to={`/user/${comment.parentComment.commer}`} target="_blank">{comment.parentComment.nickname}</Link>
                                            <span> 发表于 {Util.formatDate(comment.parentComment.commDatetime)}</span>
                                        </span>}
                                    extra={<a onClick={this.handleReply.bind(this, comment.parentComment)} href="javascript:void(0)">回复</a>}>
                                    <div onClick={this.props.handleContentClick}>{postEmojiUtil.parseEmojiContent(comment.parentComment.content)}</div>
                                </Card>
                                : null
                        }
                        <div onClick={this.props.handleContentClick}>{postEmojiUtil.parseEmojiContent(comment.content)}</div>
                    </div>
                    <div class="c-item-footer tr"><span onClick={this.handleReply.bind(this, comment)}>回复</span></div>
                </div>
            </div>
        )
    }
}
