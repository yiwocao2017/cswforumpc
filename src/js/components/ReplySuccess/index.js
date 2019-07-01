import React, {Component} from 'react';
import className from 'classnames';
import './index.scss';

export default class ReplySuccess extends React.Component {

    render(){
        let {amount, replyType, active} = this.props;
        let msg = replyType == 1 ? '发布帖子，' : "回复帖子，";
        return (
            <div class="reply-success-wrap">
                <div class={
                    className({
                        "reply-success-cont": true,
                        "active": active
                    })
                }>{msg}奖励<span>{amount}</span>赏金</div>
            </div>
        );
    }
}
