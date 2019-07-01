import React, {Component} from 'react';
import {Input, Form, Button, Upload, Modal, Icon, message} from 'antd';
import FaceWrap from '../../WritePost/FaceWrap';
import ATWrap from '../../WritePost/ATWrap';
import ReplySuccess from '../../ReplySuccess';
import className from 'classnames';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const FormItem = Form.Item;
const Util = require('../../../util/util.js');

class WriteComment extends Component {
    constructor() {
        super();
        this.state = {
            showFace: false,            //是否显示表情框
            showUser: false,            //是否显示关注人框
            start: 0,                   //光标开始位置
            end: 0,                     //光标结束位置
            iconLoading: false,         //发布loading
        };
    }
    // 发布帖子
    handleSubmit(e){
        e.preventDefault();
        if(!Util.isLogin()){
            this.props.showLoginModal();
            return;
        }
        this.props.form.validateFields((errors, params) => {
            if (errors) {
                return;
            }
            this.setState({
                iconLoading: true
            });
            let {postCode, parentCode} = this.props;
            params.parentCode = parentCode;
            // 1 帖子的评论 2 评论的评论
            params.type = postCode == parentCode ? "1" : "2";
            PostCtr.publishComment(params).then((data)=>{
                this.props.form.setFieldsValue({
                    "content": ""
                });
                this.setState({
                    iconLoading: false,
                    showFace: false,
                    showUser: false
                });
                if(/;filter:true/.test(data.code)){
                    message.error("评论内容中包含敏感字符");
                    return;
                }
                this.setState({amount: Util.formatMoney(data.amount), active: true});
                setTimeout(() => this.setState({active: false}), 1000);

                this.props.publishSuccess && this.props.publishSuccess();
            }).catch(()=>{
                this.setState({
                    iconLoading: false
                });
            });
       });
    }
    // 显示表情框
    showFaces(e) {
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            this.props.showLoginModal();
            return;
        }
        this.setState({showUser: false, showFace: true}, () => {
            this.faceWrap.scrollIntoView();
        });
    }
    // 关闭表情框
    closeFaces(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({showFace: false});
    }
    // 显示关注人框
    showUsers(e) {
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            this.props.showLoginModal();
            return;
        }
        this.setState({showFace: false, showUser: true}, () => {
            this.userWrap.scrollIntoView();
        });
    }
    // 关闭关注人框
    closeUsers(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({showUser: false});
    }
    /*
     * 处理textarea失去焦点事件,并保存最后一次的焦点位置
     */
    handleTextBlur(){
        this.setState({areaFocus: false});
        const {getFieldInstance} = this.props.form;
        let _context = getFieldInstance("content");
        this.savePos(_context.refs.input);
    }
    /*
     * 获取并保存textarea光标的位置
     * @param textBox    点击的表情
     */
    savePos(textBox) {
        let config = Util.savePos(textBox);
        this.setState({
            start: config.start,
            end: config.end
        });
    }
    /*
     * 处理表情点击事件,并把表情加入textarea中
     * @param el    点击的表情
     * @param index 点击的表情在数组中的下标
     */
    handleEmojiClick(text) {
        this.setTextAreaValue(text);
    }
    /*
     * 处理联系人列表点击事件,并把选中的用户名加入textarea中
     * @param username    选中的用户名
     */
    handleUserClick(username){
        this.setTextAreaValue("@" + username + " ");
    }
    /*
     * 在最后一次保存的textarea的光标处加入文本内容
     * @param text    文本内容
     */
    setTextAreaValue(text){
        const {setFieldsValue, getFieldValue} = this.props.form;
        let content = getFieldValue("content") || "";
        let {start, end} = this.state;
        let prev = content.substr(0, start),
            suffix = content.substr(end);
        setFieldsValue({
            "content": prev + text + suffix
        });
        if(start != end){
            end = start;
        }
        this.setState({
            start: start + text.length,
            end: end + text.length
        });
    }
    render() {
        const {
            showFace,            //是否显示表情框
            showUser,            //是否显示关注人框
            iconLoading,         //发布loading
            amount,              //回复成功后获得的赏金
            active,              //回复成功后的图标是否显示
        } = this.state;
        const {
            placeholder,         //textarea的placeholder
            parentCode           //评论针对的parentCode
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div class="write-container1 container">
                <h1>回复</h1>
                <div class="write-cont">
                    <Form layout="vertical">
                        <FormItem>
                            {getFieldDecorator('content', {
                                rules: [{
                                    required: true,
                                    message: "评论内容不能为空"
                                }]
                            })(
                                <Input
                                    type="textarea"
                                    placeholder={placeholder}
                                    autosize={{ minRows: 6, maxRows: 10 }}
                                    onBlur={this.handleTextBlur.bind(this)}/>
                            )}
                        </FormItem>
                    </Form>
                    <div class="write-bottom clearfix">
                        <div onClick={this.showFaces.bind(this)} class="fl emoji-icon write-icon">表情</div>
                        <div class="fl at-icon write-icon" onClick={this.showUsers.bind(this)}>AT</div>
                        <Button loading={iconLoading} className="fr" type="primary" onClick={this.handleSubmit.bind(this)}>发布</Button>
                    </div>
                    <div style={{
                        display: showFace ? "inline-block": "none"
                    }} ref={(face) => this.faceWrap = face}>
                        <FaceWrap handleEmojiClick={this.handleEmojiClick.bind(this)} closeFace={this.closeFaces.bind(this)}/>
                    </div>
                    {
                        Util.isLogin() ?
                            <div style={{
                                display: showUser ? "inline-block": "none"
                            }} ref={(user) => this.userWrap = user}>
                                <ATWrap comment={true} handleUserClick={this.handleUserClick.bind(this)} closeUser={this.closeUsers.bind(this)}/>
                            </div>
                            : null
                    }
                </div>
                <ReplySuccess active={active} amount={amount} replyType={2}/>
            </div>
        )
    }
}
export default Form.create()(WriteComment)
