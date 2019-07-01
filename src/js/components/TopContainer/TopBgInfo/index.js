import React, {Component} from 'react';
import {Link} from 'react-router';
import {Modal} from 'antd';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');

export default class TopBgInfo extends Component {
    constructor(){
        super();
        this.state = {
            modalVisible: false,
            companyList: []
        };
    }
    componentDidMount(){
        this.getGroupCompanyList();
    }
    // 选择城市的click事件
    handleCityClick(city, e){
        e.stopPropagation();
        e.preventDefault();
        let url = Util.findUrlByCompanyCode(city.code);
        if(url){
            location.href = url;
            return;
        }
        Util.setCompany(city);
        Util.setAddress(city);
        url = DEFAULT_URL || "/";
        location.href = url;
    }
    // 设置modal是否可见
    setModalVisible(modalVisible){
        this.setState({modalVisible});
    }
    // 列表获取company，并按字母分组
    getGroupCompanyList(){
        UserCtr.getGroupCompanyList()
            .then((data) => {
                let list = [];
                for(let tag in data){
                    let eachList =
                        <div class="chose-city-item" key={tag}>
                            <div class="chose-city-title">{tag}</div>
                            <div class="chose-city-list">
                                {
                                    data[tag].map((city, index) => (
                                        <a onClick={this.handleCityClick.bind(this, city)} key={city.code} href="javascript:void(0)">{city.name}</a>
                                    ))
                                }
                            </div>
                        </div>
                    list.push(eachList);
                }
                this.setState({
                    companyList: list
                });
            })
            .catch(() => {});
    }
    render() {
        let {companyList, modalVisible} = this.state;
        let company = Util.getCompany();
        let logo = company.logo ? Util.formatImg(company.logo) : require('../../../../images/logo.png');
        return (
            <div class="top-bg-container">
                <div class="top-bg-logo">
                    <Link className="block_hw100" to='/'>
                        <img src={logo}/>
                    </Link>
                </div>
                <div class="top-bg-web-name"><Link className="block_hw100" to='/'>城市网</Link></div>
                <div class="top-bg-dw-cont">
                    <div class="top-bg-cur-comp">{company.name}</div>
                    <div class="top-bg-chose" onClick={()=>this.setModalVisible(true)}>切换</div>
                </div>
                <Modal
                    title="选择城市"
                    wrapClassName="vertical-center-modal chose-city-modal"
                    visible={modalVisible}
                    onCancel={()=>this.setModalVisible(false)}
                    onOk={()=>this.setModalVisible(false)}>
                    <div>{companyList}</div>
                </Modal>
            </div>
        )
    }
}
