import React, {Component} from 'react';
import {Link} from 'react-router';
import {UserCtr} from '../../controller/UserCtr';
import {GeneralCtr} from '../../controller/GeneralCtr';
import { Form, Icon, Input, Button, Checkbox, message, Row, Col, Select } from 'antd';
import './index.scss';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const Util = require('../../util/util');

class Register extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            companyList: [],
            captDisabled: false,
            captchaText: '获取验证码',
            captLoading: false,         //验证码按钮loading状态
        };
    }
    componentDidMount() {
        document.title = "注册";
        this.getGroupCompanyList();
    }
    componentWillUnmount(){
        clearInterval(this.sendCaptcha.timer);
    }

    // 列表获取company，并按字母分组
    getGroupCompanyList(){
        UserCtr.getGroupCompanyList()
            .then((data) => {
                let list = [];
                for(let tag in data){
                    let eachList =
                        <OptGroup key={tag} label={tag}>
                            {
                                data[tag].map((city, index) => (
                                    <Option key={city.code} value={city.code}>{city.name}</Option>
                                ))
                            }
                        </OptGroup>
                    list.push(eachList);
                }
                this.setState({
                    companyList: list
                })
            })
            .catch(() => {
                let company = Util.getCompany();
                this.setState({
                    companyList: [<Option key={company.code} value={company.code}>{company.name}</Option>]
                });
            })
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
                GeneralCtr.sendCaptcha(param.mobile, "805076")
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
    // 注册前的校验
    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, param) => {
            if (!err) {
                this.setState({loading: true});
                try{
                    delete param.rePwd;
                }catch(e){}
                this.register(param);
            }
        });
    }
    // 注册
    register(param){
        UserCtr.register(param)
            .then((data) => {
                UserCtr.login({
                    loginName: param.mobile,
                    loginPwd: param.loginPwd
                }).then((data) => {
                    message.success("注册成功");
                    Util.setUser(data);
                    this.props.updateLogin();
                    Util.goPath('/');
                }).catch(() => {
                    message.success("注册成功");
                    Util.goPath('/');
                });
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
        let {companyList, captDisabled, captchaText, captLoading, loading} = this.state;
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
            <div class="page-form-container container register-form">
                <h1>立即注册</h1>
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
                        {getFieldDecorator('loginPwd', {
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
                                pattern: new RegExp(this.props.form.getFieldValue("loginPwd")),
                                message: "两次密码不一致"
                            }]
                        })(
                            <Input type="password" placeholder="请再次输入您的密码"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="注册地">
                        {getFieldDecorator('companyCode', {
                            initialValue: Util.getCompany().code,
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }]
                        })(
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.indexOf(input.toLowerCase()) >= 0}
                            >
                                {companyList}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        {getFieldDecorator('agreement', {
                            valuePropName: 'checked',
                            initialValue: true,
                            rules: [{
                                validator: (rule, value, callback)=>{
                                    const { getFieldValue } = this.props.form
                                    if(!value){
                                        callback('您还未接受城市网服务协议');
                                    }
                                    callback();
                                }
                            }]
                        })(
                            <Checkbox>阅读并接受 <Link to="/protocal" target="_blank">《城市网服务协议》</Link></Checkbox>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" className="big-primary-btn" htmlType="submit" size="large" loading={loading}>注册</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
export default Form.create()(Register);
