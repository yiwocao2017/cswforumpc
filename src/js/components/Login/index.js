import React, {Component} from 'react';
import {Link} from 'react-router';
import {UserCtr} from '../../controller/UserCtr';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import './index.scss';

const FormItem = Form.Item;
const Util = require('../../util/util');

class Login extends Component {
    constructor() {
        super();
        this.state = {
            loading: false
        };
    }
    componentDidMount() {
        document.title = "登录";
    }
    // 登录
    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, param) => {
            if (!err) {
                this.setState({loading: true});
                UserCtr.login(param)
                    .then((data) => {
                        Util.setUser(data, !param.remember);
                        this.props.updateLogin();
                        message.success("登录成功");
                        this.setState({loading: false});
                        Util.goPath('/');
                    }).catch(() => this.setState({loading: false}));
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let {loading} = this.state;
        return (
            <div class="login container clearfix">
                <div class="login-left"></div>
                <div class="login-right">
                    <div class="login-right-name">登录</div>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <FormItem>
                            {getFieldDecorator('loginName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user"/>} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('loginPwd', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock"/>} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>自动登录</Checkbox>
                            )}
                            <Link className="login-form-forgot" to="findPwd">找回密码</Link>
                            <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">登录</Button>
                            <div class="login-message">还不是城市网用户？ <Link to="/register" class="login-regin"> 赶紧去注册 </Link></div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Form.create()(Login);
