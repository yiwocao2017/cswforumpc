import React, {Component} from 'react';
import {Link} from 'react-router';
import {UserCtr} from '../../controller/UserCtr';
import {GeneralCtr} from '../../controller/GeneralCtr';
import { Form, Icon, Input, Button, message } from 'antd';
import './index.scss';

const FormItem = Form.Item;
const Util = require('../../util/util');

class ResetPwd extends Component {
    constructor() {
        super();
        this.state = {
            loading: false
        };
    }
    componentDidMount() {
        document.title = "修改密码";
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
                this.resetPwd(param);
            }
        });
    }
    // 找回密码
    resetPwd(param){
        UserCtr.resetPwd(param)
            .then((data) => {
                message.success("密码修改成功");
                Util.historyBack();
            }).catch(() => {
                this.setState({
                    loading: false
                });
            });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let {loading} = this.state;
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
                <h1>修改密码</h1>
                <Form className="page-form" onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="原密码">
                        {getFieldDecorator('oldLoginPwd', {
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
                    <FormItem {...formItemLayout} label="新密码">
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
                        <Button type="primary" className="big-primary-btn" htmlType="submit" size="large" loading={loading}>修改密码</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
export default Form.create()(ResetPwd);
