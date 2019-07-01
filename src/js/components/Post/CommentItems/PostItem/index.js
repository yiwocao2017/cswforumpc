import React, {Component} from 'react';
import CommentUser from '../CommentUser';
import './index.scss';

const Util = require('../../../../util/util.js');
const postEmojiUtil = require('../../../../util/postEmoji.js');

export default class PostItem extends Component {
    handleReply(e){
        e.preventDefault();
        e.stopPropagation();
        let {post} = this.props;
        this.props.handleReply({
            parentCode: post.code,
            placeholder: "回复帖子",
        });
    }
    render() {
        let {post} = this.props;
        let showBtn = true;
        if(post && post.publisher && post.publisher == Util.getUserId()){
            showBtn = false;
        }
        return (
            <div class="comment-item clearfix">
                <CommentUser showLoginModal={this.props.showLoginModal} showBtn={showBtn} user={post}/>
                <div class="comment-item-cont">
                    <div class="c-item-header"><span class="c-item-owner">楼主</span>发表于：{Util.formatDate(post.publishDatetime)}</div>
                    <div class="c-item-content" onClick={this.props.handleContentClick}>
                        {postEmojiUtil.parseEmojiContent(post.content)}
                        {
                            post.picArr && post.picArr.length ?
                                <div style={{marginTop: "10px"}}>
                                    {post.picArr.map((pic, index) => (
                                        <img src={Util.formatImg(pic)} key={index}/>
                                    ))}
                                </div> : ""
                        }
                    </div>
                    <div class="c-item-footer tr"><span onClick={this.handleReply.bind(this)}>回复</span></div>
                </div>
            </div>
        )
    }
}
