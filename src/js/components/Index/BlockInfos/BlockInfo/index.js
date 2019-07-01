import React, {Component} from 'react';
import './index.scss';

const Util = require('../../../../util/util');

export default class BlockInfo extends Component {
    constructor() {
        super();
    }
    handleClick(code, e){
        e.stopPropagation();
        e.preventDefault();
        Util.goPath(`/board/${code}`);
    }
    render() {
        let {info} = this.props;
        return (
            <div class="block-infos-item">
                <h1>{info.name}</h1>
                <div class="sm-block-infos clearfix">
                    {
                        info.arr.map((block, index) => (
                            <div onClick={this.handleClick.bind(this, block.code)} key={block.code} class="sm-block-cont clearfix">
                                <div class="sm-block-img"><img src={Util.formatImg(block.pic)}/></div>
                                <div class="p-r sm-block-info">
                                    <div class="sm-block-info-title">{block.name}</div>
                                    <div class="twoline-ellipsis sm-info-detail">{block.description}</div>
                                    <div class="sm-blcok-info-count">帖子数：<span>{block.PostNum}</span></div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}
