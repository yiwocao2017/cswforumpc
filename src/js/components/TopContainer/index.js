import React, {Component} from 'react';
import {Affix} from 'antd';
import Menus from './Menus';
import TopInfo from './TopInfo';
import TopBgInfo from './TopBgInfo';
import './index.scss';

export default class TopContainer extends Component {
    menuClick(key, name){
        this.topInfo.setState({result: null, searchValue: ""});
        this.props.menuClick(key, name);
    }
    render() {
        let {current, menuData, menuClick, isLogin, signOut} = this.props;

        return (
            <div>
                <TopInfo ref={(topInfo) => this.topInfo = topInfo} isLogin={isLogin} signOut={signOut}/>
                <TopBgInfo />
                <Menus current={current} menuData={menuData} menuClick={this.menuClick.bind(this)}/>
            </div>
        )
    }
}
