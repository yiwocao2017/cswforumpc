import React, {Component} from 'react';
import BannerAndInfos from './BannerAndInfos';
import BlockInfos from './BlockInfos';
import './index.scss';

const Util = require('../../util/util');

export default class Index extends Component {
    constructor() {
        super();
    }
    componentWillMount() {
        document.title = "首页";
    }
    render() {
        return (
            <div class="index-container">
                <div class="container">
                    <BannerAndInfos />
                    <BlockInfos />
                </div>
                <div class="aboutus-cont">
                    <div class="container">
                        <img src={require('../../../images/logo.png')} />
                        <span class="aboutus-title">关于城市网</span>
                        <div class="fr aboutus-more" onClick={() => Util.goPath('/aboutus')}>
                            <span>更多</span><span class="aboutus-more-icon">>></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
