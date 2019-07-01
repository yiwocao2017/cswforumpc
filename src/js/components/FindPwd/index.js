import React, {Component} from 'react';
import {Link} from 'react-router';
import {UserCtr} from '../../controller/UserCtr';
import {GeneralCtr} from '../../controller/GeneralCtr';
import { Form, Icon, Input, Button, message, Row, Col } from 'antd';
import './index.scss';

const FormItem = Form.Item;
const Util = require('../../util/util');

class FindPwd extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            captDisabled: false,
            captchaText: '获取验证码',
            captLoading: false,         //验证码按钮loading状态
        };
    }
    componentDidMount() {
        document.title = "找回密码";
    }
    componentWillUnmount(){
        clearInterval(this.sendCaptcha.timer);
    }

    // 发送验证码
    sendCaptcha(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.form.validateFields(["mobile"], (error, param) => {
            if(!error){
                this.setState({
                    captLoading: true
                });
                GeneralCtr.sendCaptcha(param.mobile, "805048")
                    .then((data) => {
                        this.setState({
                            captDisabled: true,
                            captchaText: '60s',
                            captLoading: false
                        });
                        clearInterval(this.sendCaptcha.timer);
                        let i = 60;
                        this.sendCaptcha.timer = setInterval(() => {
                            this.setState({
                                captchaText: (i--) + "s"
                            });
                            if(i <= 0){
                                clearInterval(this.sendCaptcha.timer);
                                this.setState({
                                    captchaText: "获取验证码",
                                    captDisabled: false
                                });
                            }
                        }, 1e3);
                    })
                    .catch(()=>{
                        this.setState({
                            captLoading: false
                        });
                    });
            }
        });
    }
    // 找回密码前的校验
    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, param) => {
            if (!err) {
                this.setState({loading: true});
                try{
                    delete param.rePwd;
                }catch(e){}
                this.findPwd(param);
            }
        });
    }
    // 找回密码
    findPwd(param){
        UserCtr.findPwd(param)
            .then((data) => {
                message.success("密码找回成功");
                Util.goPath('/login');
            }).catch(() => {
                clearInterval(this.sendCaptcha.timer);
                this.setState({
                    loading: false,
                    captchaText: "获取验证码",
                    captDisabled: false,
                    captLoading: false
                });
            });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let {captDisabled, captchaText, captLoading, loading} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: 14,
                  offset: 6,
                },
            },
        };
        return (
            <div class="page-form-container container">
                <h1>找回密码</h1>
                <Form className="page-form" onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="手机">
                        {getFieldDecorator('mobile', {
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }, {
                                pattern: /^1[3|4|5|7|8]\d{9}$/,
                                message: "格式错误"
                            }]
                        })(
                            <Input placeholder="请输入手机号码"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="验证码">
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('smsCaptcha', {
                                    rules: [{
                                        required: true,
                                        message: "不能为空"
                                    }, {
                                        pattern: /^\d{4}$/,
                                        message: "格式错误"
                                    }]
                                })(
                                    <Input size="large" placeholder="请输入验证码"/>
                                )}
                            </Col>
                            <Col span={12}>
                                <Button className="captButton" size="large" type="primary" loading={captLoading} disabled={captDisabled} onClick={this.sendCaptcha.bind(this)}>{captchaText}</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码">
                        {getFieldDecorator('newLoginPwd', {
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }, {
                                pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,16})$/,
                                message: "密码须必为6~16位,同时包含数字和字母"
                            }]
                        })(
                            <Input type="password" placeholder="密码 (6~16)位，同时包含数字和字母"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="确认密码">
                        {getFieldDecorator('rePwd', {
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }, {
                                pattern: new RegExp(this.props.form.getFieldValue("newLoginPwd")),
                                message: "两次密码不一致"
                            }]
                        })(
                            <Input type="password" placeholder="请再次输入您的密码"/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" className="big-primary-btn" htmlType="submit" size="large" loading={loading}>找回密码</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
export default Form.create()(FindPwd);
