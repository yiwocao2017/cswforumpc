import React, {Component} from 'react';
import {Input, Form, Button, Upload, Modal, Icon, message, Select} from 'antd';
import FaceWrap from './FaceWrap';
import ATWrap from './ATWrap';
import ReplySuccess from '../ReplySuccess';
import className from 'classnames';
import {PostCtr} from '../../controller/PostCtr';
import {GeneralCtr} from '../../controller/GeneralCtr';
import './index.scss';

const Option = Select.Option;
const FormItem = Form.Item;
const Util = require('../../util/util');

class WritePost extends Component {
    constructor() {
        super();
        this.state = {
            previewVisible: false,      //图片预览框是否可见
            previewImage: '',           //图片预览框里的图片
            fileList: [],               //帖子的图片response.key
            token: "",                  //七牛token
            showPhoto: false,           //是否显示图片框
            showFace: false,            //是否显示表情框
            showUser: false,            //是否显示关注人框
            start: 0,                   //光标开始位置
            end: 0,                     //光标结束位置
            iconLoading: false,         //发布loading
            plateList: [],              //板块列表
            initPlateCode: '',          //如果showPlateChose时，初始化选择的板块
            amount: 0,                  //发帖成功后获得的赏金
            active: false,              //发帖成功后的图标是否显示
        };
    }
    componentWillMount(){
        this.getQiniuToken();
        if(this.props.showPlateChose){
            this.getPlateList();
        }
    }
    // 列表获取板块
    getPlateList(){
        PostCtr.getBlockList()
            .then((data) => {
                this.setState({
                    plateList: data,
                    initPlateCode: this.getDefaultBlock(data)
                });
            })
            .catch(() => {});
    }
    /*
     * 获取默认板块，若没有设置，则取第一个
     */
    getDefaultBlock(blockArr){
        if(blockArr && blockArr.length){
            for(let i = 0; i < blockArr.length; i++){
                if(blockArr[i].isDefault == 1){
                    return blockArr[i].code;
                }
            }
            return blockArr[0].code;
        }
        return "";
    }
    // 发布帖子
    handleSubmit(e){
        e.preventDefault();
        if(!Util.isLogin()){
            this.props.showLoginModal();
            return;
        }
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                return;
            }
            let {fileList} = this.state;
            if(fileList.length && fileList.length > 9){
                message.warning("图片不能超过9张");
                return;
            }
            this.setState({
                iconLoading: true
            });
            values.pic = fileList.length ? fileList.filter((file, index) => file.status == "done")
                            .map((file, index) => file.response.key).join("||") : "";
            if(!this.props.showPlateChose){
                values.plateCode = this.props.plateCode;
            }else{
                values.plateCode = values.plateCode;
            }
            values.isPublish = "1";
            PostCtr.publish(values).then((data)=>{
                const {setFieldsValue} = this.props.form;
                setFieldsValue({
                    "content": "",
                    "title": ""
                });
                this.setState({
                    iconLoading: false,
                    showPhoto: false,
                    showFace: false,
                    showUser: false
                });
                if(/;filter:true/.test(data.code)){
                    message.error("帖子内容中包含敏感字符");
                    return;
                }
                this.setState({amount: Util.formatMoney(data.amount), active: true});
                setTimeout(() => this.setState({active: false}), 1000);
                this.props.publishSuccess && this.props.publishSuccess(data.code);
            }).catch(()=>{
                this.setState({
                    iconLoading: false
                });
            });
       });
    }
    // 图片change
    handleChange({fileList}){
        this.setState({ fileList })
    }
    // 关闭预览图片框
    handleCancel (){
        this.setState({ previewVisible: false });
    }
    // 预览图片
    handlePreview (file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    // 加载七牛token
    getQiniuToken(){
        GeneralCtr.getQiniuToken()
            .then((data) => {
                this.setState({token: data.uploadToken});
            });
    }
    // 显示图片上传框
    showPic(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            this.props.showLoginModal();
            return;
        }
        this.setState({showFace: false, showUser: false, showPhoto: true}, () => {
            this.upload.scrollIntoView();
        });
    }
    // 关闭图片上传框
    closePic(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({showPhoto: false});
    }
    // 显示表情框
    showFaces(e) {
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            this.props.showLoginModal();
            return;
        }
        this.setState({showPhoto: false, showUser: false, showFace: true}, () => {
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
        this.setState({showPhoto: false, showFace: false, showUser: true}, () => {
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
            previewVisible,      //图片预览框是否可见
            previewImage,        //图片预览框里的图片
            fileList,            //帖子的图片response.key
            token,               //七牛token
            showPhoto,           //是否显示图片框
            showFace,            //是否显示表情框
            showUser,            //是否显示关注人框
            iconLoading,         //发布loading
            plateList,           //板块列表
            initPlateCode,       //如果showPlateChose时，初始化选择的板块
            amount,              //发帖成功后获得的赏金
            active,              //发帖成功后的图标是否显示
        } = this.state;
        let {showPlateChose} = this.props;
        const uploadButton = (
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
              </div>
            );
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <div class="write-container container">
                <h1>发表帖子</h1>
                <div class="write-cont">
                    <Form layout="vertical">
                        {
                            showPlateChose && plateList.length ?
                                <FormItem>
                                    {getFieldDecorator('plateCode', {
                                        initialValue: initPlateCode,
                                        rules: [{
                                            required: true,
                                            message: "板块不能为空"
                                        }]
                                    })(
                                        <Select
                                            showSearch
                                            placeholder="请选择板块"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                plateList.map((plate, index) => (
                                                    <Option key={plate.code} value={plate.code}>{plate.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                : null
                        }
                        <FormItem>
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true,
                                    message: "标题不能为空"
                                }]
                            })(
                                <Input placeholder="标题"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('content', {
                                rules: [{
                                    required: true,
                                    message: "内容不能为空"
                                }]
                            })(
                                <Input
                                    type="textarea"
                                    placeholder={"帖子内容"}
                                    autosize={{ minRows: 6, maxRows: 10 }}
                                    onBlur={this.handleTextBlur.bind(this)}/>
                            )}
                        </FormItem>
                    </Form>
                    <div class="write-bottom clearfix">
                        <div onClick={this.showFaces.bind(this)} class="fl emoji-icon write-icon">表情</div>
                        {
                            token ?
                                <div class="fl" onClick={this.showPic.bind(this)}>
                                    <div class="photo-icon write-icon">图片</div>
                                </div> : null
                        }

                        <div class="fl at-icon write-icon" onClick={this.showUsers.bind(this)}>AT</div>
                        <Button loading={iconLoading} className="fr" type="primary" onClick={this.handleSubmit.bind(this)}>发布</Button>
                    </div>
                    <div style={{
                        display: showFace ? "inline-block": "none"
                    }} ref={(face) => this.faceWrap = face}>
                        <FaceWrap handleEmojiClick={this.handleEmojiClick.bind(this)} closeFace={this.closeFaces.bind(this)}/>
                    </div>
                    <div ref={(upload) => this.upload = upload} className={
                        className({
                            "clearfix": true,
                            "photo-container": true,
                            "show": showPhoto
                        })
                    }>
                        <Upload
                          action="http://up-z2.qiniu.com"
                          listType="picture-card"
                          fileList={fileList}
                          multiple={true}
                          accept="image/jpeg,image/gif,image/png"
                          data={{token}}
                          onPreview={this.handlePreview.bind(this)}
                          onChange={this.handleChange.bind(this)}
                        >
                            {fileList.length >= 9 ? null : uploadButton}
                        </Upload>
                        <div class="W_layer_arrow">
                            <span class="W_arrow_bor W_arrow_bor_t">
                                <i class="S_line3"></i>
                                <em class="S_bg2_br"></em>
                            </span>
                        </div>
                        <Button onClick={this.closePic.bind(this)} class="write-close-btn" icon="close" size="small"></Button>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                            <img class="wp100" src={previewImage} />
                        </Modal>
                    </div>
                    {
                        Util.isLogin() ?
                            <div style={{
                                display: showUser ? "inline-block": "none"
                            }} ref={(user) => this.userWrap = user}>
                                <ATWrap handleUserClick={this.handleUserClick.bind(this)} closeUser={this.closeUsers.bind(this)}/>
                            </div>
                            : null
                    }
                </div>
                <ReplySuccess active={active} amount={amount} replyType={1}/>
            </div>
        )
    }
}
export default Form.create()(WritePost)
