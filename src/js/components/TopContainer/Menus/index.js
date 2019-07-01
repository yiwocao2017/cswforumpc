import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Menu} from 'antd';
import './index.scss';

const Item = Menu.Item;
const Util = require('../../../util/util');

export default class Menus extends Component {
    constructor(){
        super();
        this.state = {
            affixStyle: null
        };
    }
    componentDidMount(){
        this.offsetTop = this.getOffset(findDOMNode(this.refs.fixedNode)).top;
        if(window.attachEvent){
            window.attachEvent("onscroll", (e) => this.updatePosition(e));
        }else{
            window.addEventListener("scroll", (e) => this.updatePosition(e), false);
        }
    }
    // 获取ele的offset
    getOffset(element) {
        let elemRect = element.getBoundingClientRect();
        let docElem = window.document.body;
        let clientTop = docElem.clientTop || 0;
        let clientLeft = docElem.clientLeft || 0;
        return {
            top: elemRect.top - clientTop,
            left: elemRect.left - clientLeft,
            width: elemRect.width,
            height: elemRect.height
        };
    }
    // 获取window的scrollTop
    getScrollTop(){
        let supportPageOffset = window.pageXOffset !== undefined;  // 判断是否支持pageXOffset
        let isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");  // 判断渲染模式是不是标准模式
        /**
        *  如果支持pageXOffset,直接用window.pageXOffset. 如不支持，判断渲染模式
        *  如果是标准模式，用document.documentElement.scrollLeft,
        *  如果是混杂模式，用document.body.scrollTop.
        **/
        return supportPageOffset
                    ? window.pageYOffset
                    : isCSS1Compat
                        ? document.documentElement.scrollTop
                        : document.body.scrollTop;
    }
    // 页面滚动更新菜单位置
    updatePosition(e){
        let affixNode = findDOMNode(this.refs.fixedNode);
        let elemOffset = this.getOffset(affixNode);
        let elemSize = {
            width: this.refs.fixedNode.offsetWidth,
            height: this.refs.fixedNode.offsetHeight
        };
        let scrollTop = this.getScrollTop();
        if(scrollTop >= this.offsetTop){
            this.setState({
                affixStyle: {
                    "position": "fixed",
                    "top": 0,
                    "left": elemOffset.left,
                    "width": elemOffset.width,
                    "height": affixNode.offsetHeight,
                    "zIndex": "1000"
                }
            })
        }else{
            this.setState({
                affixStyle: null
            });
        }
    }
    // 菜单点击事件
    handleClick(e){
        this.props.menuClick(e.key, e.item.props.name);
    }
    render() {
        let {current, menuData} = this.props;
        let {affixStyle} = this.state;
        return (
            <div>
                <div class="top-menu-wrap" style={affixStyle} ref="fixedNode">
                    <Menu
                        className="top-menu-cont"
                        onSelect={this.handleClick.bind(this)}
                        selectedKeys={[current]}
                        mode="horizontal">
                        <Item key={'index'} name="首页">首页</Item>
                        {
                            menuData && menuData.length ?
                                menuData.map((menu, index) => (
                                    <Item key={menu.code} name={menu.name}>{menu.name}</Item>
                                ))
                                : ""
                        }
                    </Menu>
                    {
                        Util.getCompany().domain ? <a className="old-website" href={Util.getCompany().domain}>切换到老地址</a> : ""
                    }
                </div>
                {affixStyle ? <div style={{height: `${this.refs.fixedNode.offsetHeight}px`}}></div> : null}
            </div>
        )
    }
}
