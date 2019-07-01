import React, {Component} from 'react';
import {Link} from 'react-router';
import {Carousel, Button, Spin} from 'antd';
import {MenuCtr} from '../../../controller/MenuCtr';
import {PostCtr} from '../../../controller/PostCtr';

import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import './index.scss';

const Util = require('../../../util/util');
const BgElement = Element.BgElement;

export default class BannerAndInfos extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,      //是否处于加载中
            swiperData: [],     //banner
            posts: [],          //头条
        };
    }
    componentDidMount() {
        Promise.all([
            this.getBannerList(),
            this.getPageTopPost()
        ])
        .then(() => this.setState({loading: false}))
        .catch(() => this.setState({loading: false}));
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    // 获取banner列表
    getBannerList(){
        return MenuCtr.getBannerList(true)
            .then((swiperData) => {
                this.setState({swiperData});
            });
    }
    // 分页查询头条
    getPageTopPost(){
        return PostCtr.getPageTopPost({
            "start": 1,
            "limit": 5,
            "status": "BD",
            "isLock": "0"
        }, true).then((data) => {
            this.setState({posts: data.list});
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.getPageTopPost();
            }, 1e4);
        });
    }
    render() {
        let {loading, swiperData, posts} = this.state;
        return (
            <Spin spinning={loading} >
                <div class="bInfo-container clearfix">
                    <div class="banner-cont">
                        {
                            swiperData.length
                                ? (
                                    <BannerAnim autoPlay prefixCls="custom-arrow-thumb" >
                                        {
                                            swiperData.map((data) => {
                                                let url = data.url;
                                                if(/^http/.test(url)){
                                                    return <Element
                                                      prefixCls="banner-user-elem cur_pointer"
                                                      key={data.code}
                                                      onClick={() => Util.openWindow(url)}
                                                    >
                                                      <BgElement
                                                        key="bg"
                                                        className="bg"
                                                      ><img src={Util.formatImg(data.pic)}/></BgElement>
                                                      <TweenOne className="banner-user-text"
                                                        animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
                                                      >
                                                        {data.name}
                                                      </TweenOne>
                                                    </Element>
                                                }
                                                if(/page:board,code:(.+)/.exec(url)){
                                                    url = `/board/${RegExp.$1}`;
                                                    return <Element
                                                      prefixCls="banner-user-elem cur_pointer"
                                                      key={data.code}
                                                      onClick={() => Util.goPath(url)}
                                                    >
                                                      <BgElement
                                                        key="bg"
                                                        className="bg"
                                                      ><img src={Util.formatImg(data.pic)}/></BgElement>
                                                      <TweenOne className="banner-user-text"
                                                        animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
                                                      >
                                                        {data.name}
                                                      </TweenOne>
                                                    </Element>
                                                }
                                                return <Element
                                                  prefixCls="banner-user-elem"
                                                  key={data.code}
                                                >
                                                  <BgElement
                                                    key="bg"
                                                    className="bg"
                                                  ><img src={Util.formatImg(data.pic)}/></BgElement>
                                                  <TweenOne className="banner-user-text"
                                                    animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
                                                  >
                                                    {data.name}
                                                  </TweenOne>
                                                </Element>
                                            })
                                        }
                                      </BannerAnim>
                                )
                                : null
                        }
                    </div>
                    <div class="top-infos-cont">
                        {
                            posts.length
                            ? (
                                posts.map((post, index) => (
                                    <Link to={`/post/${post.code}`} target="_blank" class="top-infos-item" key={post.code}>
                                        <Button type="primary">头条</Button>
                                        <span class="top-infos-title">{post.title}</span>
                                    </Link>
                                ))
                            )
                            : null
                        }
                    </div>
                </div>
            </Spin>
        )
    }
}
