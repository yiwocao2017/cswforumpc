import React, {Component} from 'react';
import BlockInfo from './BlockInfo';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const Util = require('../../../util/util');

export default class BlockInfos extends Component {
    constructor() {
        super();
        this.state = {
            blocks: null,   //小板块信息object
            bBlock: []      //小板块对应的所有大板块
        }
    }
    componentDidMount() {
        this.getBlockList();
    }
    // 列表获取小板块
    getBlockList(){
        return PostCtr.getBlockList()
            .then((data) => {
                let {bBlock, result} = this.parseBlockInfo(data);
                this.setState({blocks: result, bBlock});
            });
    }
    // 解析小板块信息
    parseBlockInfo(data){
        let result = {}, bBlock = [];
        data = Util.bubbleSort(data, "orderNo");
        data.forEach((block, index) => {
            if(!result[block.bplateCode]){
                result[block.bplateCode] = {
                    name: block.bplateName,
                    arr: []
                }
                bBlock.push({
                    code: block.bplateCode,
                    orderNo: block.bplateOrderNo
                });
            }
            result[block.bplateCode].arr.push(block);
        });
        bBlock = Util.bubbleSort(bBlock, "orderNo");
        return {
            bBlock,
            result
        };
    }
    render() {
        let {blocks, bBlock} = this.state;
        return (
            <div class="block-infos-container">
                {
                    bBlock.length
                    ? bBlock.map((data, index) => (
                        <BlockInfo key={data.code} info={blocks[data.code]}/>
                    ))
                    : null
                }
            </div>
        )
    }
}
