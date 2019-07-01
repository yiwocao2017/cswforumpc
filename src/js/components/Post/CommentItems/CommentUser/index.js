import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button} from 'antd';
import {UserCtr} from '../../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../../util/util');

export default class CommentUser extends Component {
    constructor(){
        super();
        this.state = {
            isAttention: false,         //是否关注
            loading: false              //按钮是否加载中
        };
    }
    componentWillReceiveProps(nextProps, nextState){
        let {user, isComment, showBtn} = this.props;
        if(user && showBtn && !isComment && Util.isLogin() && this.publisher != user.publisher){
            this.publisher = user.publisher;
            UserCtr.isAttention(user.publisher)
                .then((data) => {
                    this.setState({isAttention: data});
                })
                .catch(() => {});
        }
    }
    // 关注 或 取消关注
    handleClick(action, toUser, e){
        e.preventDefault();
        if(Util.isLogin()){
            this.setState({loading: true});
            if(action == "plus"){       // 关注
                UserCtr.attention(toUser)
                    .then(() => this.setState({isAttention: true, loading: false}))
                    .catch(() => this.setState({loading: false}));
            }else{      //取消关注
                UserCtr.cancelAttention(toUser)
                    .then(() => this.setState({isAttention: false, loading: false}))
                    .catch(() => this.setState({loading: false}));
            }
        }else{
            this.props.showLoginModal && this.props.showLoginModal();
        }
    }
    render() {
        let {
                user,
                isComment,
                showBtn
            } = this.props;
        let {isAttention, loading, isMine} = this.state;
        let userId = isComment ? user.commer : user.publisher;
        return (
            <div class="fl comment-user-wrap">
                <div class="c-user-nickname">{user.nickname}</div>
                <Link class="c-user-avatar" to={`/user/${userId}`} target="_blank">
                    <img src={Util.formatListThumbanailAvatar(user.photo)}/>
                </Link>
                {showBtn
                    ? isAttention
                        ? <div class="c-user-btn-wrap"><Button onClick={this.handleClick.bind(this, "delete", userId)} loading={loading} size="large">取消关注</Button></div>
                        : <div class="c-user-btn-wrap"><Button onClick={this.handleClick.bind(this, "plus", userId)} icon="plus" loading={loading} size="large">关注</Button></div>
                    : ""}
            </div>
        )
    }
}
