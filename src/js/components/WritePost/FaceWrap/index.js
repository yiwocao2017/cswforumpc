import React, {Component} from 'react';
import {Button, Icon, Pagination} from 'antd';
import className from 'classnames';
import './index.scss';

const postEmojiUtil = require('../../../util/postEmoji.js');

export default class FaceWrap extends Component {
    constructor() {
        super();
        this.state = {
            current: 1
        };
    }
    // 翻页
    onChange(page){
        this.setState({
            current: page,
        });
    }
    // 表情点击事件
    handleEmojiClick(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.handleEmojiClick(e.target.getAttribute("data-text"));
    }
    render() {
        let {current} = this.state;
        return (
            <div class="write-face-wrap">
                <div class="W_layer_arrow">
                    <span class="W_arrow_bor W_arrow_bor_t face-arrow">
                        <i class="S_line3"></i>
                        <em class="S_bg2_br"></em>
                    </span>
                </div>
                <Button onClick={this.props.closeFace} class="write-close-btn face-close-btn" icon="close" size="small"></Button>
                <div onClick={this.handleEmojiClick.bind(this)}>
                    <div class={className({
                        "face-page": true,
                        "clearfix": true,
                        "show": current == 1
                    })}>
                        <div class="fl face-item" data-text="→_→"><i class="face icon_0 face_1" data-text="→_→"></i></div>
                        <div class="fl face-item" data-text="[微笑]"><i class="face icon_1 face_1" data-text="[微笑]"></i></div>
                        <div class="fl face-item" data-text="[嘻嘻]"><i class="face icon_2 face_1" data-text="[嘻嘻]"></i></div>
                        <div class="fl face-item" data-text="[哈哈]"><i class="face icon_3 face_1" data-text="[哈哈]"></i></div>
                        <div class="fl face-item" data-text="[爱你]"><i class="face icon_4 face_1" data-text="[爱你]"></i></div>
                        <div class="fl face-item" data-text="[挖鼻]"><i class="face icon_5 face_1" data-text="[挖鼻]"></i></div>
                        <div class="fl face-item" data-text="[吃惊]"><i class="face icon_6 face_1" data-text="[吃惊]"></i></div>
                        <div class="fl face-item" data-text="[晕]"><i class="face icon_7 face_1" data-text="[晕]"></i></div>
                        <div class="fl face-item" data-text="[泪]"><i class="face icon_8 face_1" data-text="[泪]"></i></div>
                        <div class="fl face-item" data-text="[馋嘴]"><i class="face icon_9 face_1" data-text="[馋嘴]"></i></div>
                        <div class="fl face-item" data-text="[抓狂]"><i class="face icon_10 face_1" data-text="[抓狂]"></i></div>
                        <div class="fl face-item" data-text="[哼]"><i class="face icon_11 face_1" data-text="[哼]"></i></div>
                        <div class="fl face-item" data-text="[可爱]"><i class="face icon_12 face_1" data-text="[可爱]"></i></div>
                        <div class="fl face-item" data-text="[怒]"><i class="face icon_13 face_1" data-text="[怒]"></i></div>
                        <div class="fl face-item" data-text="[汗]"><i class="face icon_14 face_1" data-text="[汗]"></i></div>
                        <div class="fl face-item" data-text="[害羞]"><i class="face icon_15 face_1" data-text="[害羞]"></i></div>
                        <div class="fl face-item" data-text="[困]"><i class="face icon_16 face_1" data-text="[困]"></i></div>
                        <div class="fl face-item" data-text="[钱]"><i class="face icon_17 face_1" data-text="[钱]"></i></div>
                        <div class="fl face-item" data-text="[偷笑]"><i class="face icon_18 face_1" data-text="[偷笑]"></i></div>
                        <div class="fl face-item" data-text="[笑cry]"><i class="face icon_19 face_1" data-text="[笑cry]"></i></div>
                        <div class="fl face-item" data-text="[doge]"><i class="face icon_20 face_1" data-text="[doge]"></i></div>
                        <div class="fl face-item" data-text="[喵喵]"><i class="face icon_21 face_1" data-text="[喵喵]"></i></div>
                        <div class="fl face-item" data-text="[酷]"><i class="face icon_22 face_1" data-text="[酷]"></i></div>
                        <div class="fl face-item" data-text="[衰]"><i class="face icon_23 face_1" data-text="[衰]"></i></div>
                        <div class="fl face-item" data-text="[闭嘴]"><i class="face icon_24 face_1" data-text="[闭嘴]"></i></div>
                        <div class="fl face-item" data-text="[鄙视]"><i class="face icon_25 face_1" data-text="[鄙视]"></i></div>
                        <div class="fl face-item" data-text="[色]"><i class="face icon_26 face_1" data-text="[色]"></i></div>
                        <div class="fl face-item" data-text="[鼓掌]"><i class="face icon_27 face_1" data-text="[鼓掌]"></i></div>
                    </div>
                    <div class={className({
                        "face-page": true,
                        "clearfix": true,
                        "show": current == 2
                    })}>
                        <div class="fl face-item" data-text="[悲伤]"><i class="face icon_0 face_2" data-text="[悲伤]"></i></div>
                        <div class="fl face-item" data-text="[思考]"><i class="face icon_1 face_2" data-text="[思考]"></i></div>
                        <div class="fl face-item" data-text="[生病]"><i class="face icon_2 face_2" data-text="[生病]"></i></div>
                        <div class="fl face-item" data-text="[亲亲]"><i class="face icon_3 face_2" data-text="[亲亲]"></i></div>
                        <div class="fl face-item" data-text="[怒骂]"><i class="face icon_4 face_2" data-text="[怒骂]"></i></div>
                        <div class="fl face-item" data-text="[太开心]"><i class="face icon_5 face_2" data-text="[太开心]"></i></div>
                        <div class="fl face-item" data-text="[白眼]"><i class="face icon_6 face_2" data-text="[白眼]"></i></div>
                        <div class="fl face-item" data-text="[右哼哼]"><i class="face icon_7 face_2" data-text="[右哼哼]"></i></div>
                        <div class="fl face-item" data-text="[左哼哼]"><i class="face icon_8 face_2" data-text="[左哼哼]"></i></div>
                        <div class="fl face-item" data-text="[嘘]"><i class="face icon_9 face_2" data-text="[嘘]"></i></div>
                        <div class="fl face-item" data-text="[委屈]"><i class="face icon_10 face_2" data-text="[委屈]"></i></div>
                        <div class="fl face-item" data-text="[吐]"><i class="face icon_11 face_2" data-text="[吐]"></i></div>
                        <div class="fl face-item" data-text="[可怜]"><i class="face icon_12 face_2" data-text="[可怜]"></i></div>
                        <div class="fl face-item" data-text="[睡]"><i class="face icon_13 face_2" data-text="[睡]"></i></div>
                        <div class="fl face-item" data-text="[挤眼]"><i class="face icon_14 face_2" data-text="[挤眼]"></i></div>
                        <div class="fl face-item" data-text="[失望]"><i class="face icon_15 face_2" data-text="[失望]"></i></div>
                        <div class="fl face-item" data-text="[顶]"><i class="face icon_16 face_2" data-text="[顶]"></i></div>
                        <div class="fl face-item" data-text="[疑问]"><i class="face icon_17 face_2" data-text="[疑问]"></i></div>
                        <div class="fl face-item" data-text="[困]"><i class="face icon_18 face_2" data-text="[困]"></i></div>
                        <div class="fl face-item" data-text="[感冒]"><i class="face icon_19 face_2" data-text="[感冒]"></i></div>
                        <div class="fl face-item" data-text="[拜拜]"><i class="face icon_20 face_2" data-text="[拜拜]"></i></div>
                        <div class="fl face-item" data-text="[黑线]"><i class="face icon_21 face_2" data-text="[黑线]"></i></div>
                        <div class="fl face-item" data-text="[阴险]"><i class="face icon_22 face_2" data-text="[阴险]"></i></div>
                        <div class="fl face-item" data-text="[互粉]"><i class="face icon_23 face_2" data-text="[互粉]"></i></div>
                        <div class="fl face-item" data-text="[心]"><i class="face icon_24 face_2" data-text="[心]"></i></div>
                        <div class="fl face-item" data-text="[伤心]"><i class="face icon_25 face_2" data-text="[伤心]"></i></div>
                        <div class="fl face-item" data-text="[猪头]"><i class="face icon_26 face_2" data-text="[猪头]"></i></div>
                        <div class="fl face-item" data-text="[熊猫]"><i class="face icon_27 face_2" data-text="[熊猫]"></i></div>
                    </div>
                    <div class={className({
                        "face-page": true,
                        "clearfix": true,
                        "show": current == 3
                    })}>
                        <div class="fl face-item" data-text="[兔子]"><i class="face icon_0 face_3" data-text="[兔子]"></i></div>
                        <div class="fl face-item" data-text="[握手]"><i class="face icon_1 face_3" data-text="[握手]"></i></div>
                        <div class="fl face-item" data-text="[作揖]"><i class="face icon_2 face_3" data-text="[作揖]"></i></div>
                        <div class="fl face-item" data-text="[赞]"><i class="face icon_3 face_3" data-text="[赞]"></i></div>
                        <div class="fl face-item" data-text="[耶]"><i class="face icon_4 face_3" data-text="[耶]"></i></div>
                        <div class="fl face-item" data-text="[good]"><i class="face icon_5 face_3" data-text="[good]"></i></div>
                        <div class="fl face-item" data-text="[弱]"><i class="face icon_6 face_3" data-text="[弱]"></i></div>
                        <div class="fl face-item" data-text="[NO]"><i class="face icon_7 face_3" data-text="[NO]"></i></div>
                        <div class="fl face-item" data-text="[ok]"><i class="face icon_8 face_3" data-text="[ok]"></i></div>
                        <div class="fl face-item" data-text="[haha]"><i class="face icon_9 face_3" data-text="[haha]"></i></div>
                        <div class="fl face-item" data-text="[来]"><i class="face icon_10 face_3" data-text="[来]"></i></div>
                        <div class="fl face-item" data-text="[威武]"><i class="face icon_11 face_3" data-text="[威武]"></i></div>
                        <div class="fl face-item" data-text="[鲜花]"><i class="face icon_12 face_3" data-text="[鲜花]"></i></div>
                        <div class="fl face-item" data-text="[钟]"><i class="face icon_13 face_3" data-text="[钟]"></i></div>
                        <div class="fl face-item" data-text="[浮云]"><i class="face icon_14 face_3" data-text="[浮云]"></i></div>
                        <div class="fl face-item" data-text="[飞机]"><i class="face icon_15 face_3" data-text="[飞机]"></i></div>
                        <div class="fl face-item" data-text="[月亮]"><i class="face icon_16 face_3" data-text="[月亮]"></i></div>
                        <div class="fl face-item" data-text="[太阳]"><i class="face icon_17 face_3" data-text="[太阳]"></i></div>
                        <div class="fl face-item" data-text="[微风]"><i class="face icon_18 face_3" data-text="[微风]"></i></div>
                        <div class="fl face-item" data-text="[下雨]"><i class="face icon_19 face_3" data-text="[下雨]"></i></div>
                        <div class="fl face-item" data-text="[给力]"><i class="face icon_20 face_3" data-text="[给力]"></i></div>
                        <div class="fl face-item" data-text="[神马]"><i class="face icon_21 face_3" data-text="[神马]"></i></div>
                        <div class="fl face-item" data-text="[围观]"><i class="face icon_22 face_3" data-text="[围观]"></i></div>
                        <div class="fl face-item" data-text="[话筒]"><i class="face icon_23 face_3" data-text="[话筒]"></i></div>
                        <div class="fl face-item" data-text="[奥特曼]"><i class="face icon_24 face_3" data-text="[奥特曼]"></i></div>
                        <div class="fl face-item" data-text="[草泥马]"><i class="face icon_25 face_3" data-text="[草泥马]"></i></div>
                        <div class="fl face-item" data-text="[萌]"><i class="face icon_26 face_3" data-text="[萌]"></i></div>
                        <div class="fl face-item" data-text="[囧]"><i class="face icon_27 face_3" data-text="[囧]"></i></div>
                    </div>
                    <div class={className({
                        "face-page": true,
                        "clearfix": true,
                        "show": current == 4
                    })}>
                        <div class="fl face-item" data-text="[织]"><i class="face icon_0 face_4" data-text="[织]"></i></div>
                        <div class="fl face-item" data-text="[礼物]"><i class="face icon_1 face_4" data-text="[礼物]"></i></div>
                        <div class="fl face-item" data-text="[喜]"><i class="face icon_2 face_4" data-text="[喜]"></i></div>
                        <div class="fl face-item" data-text="[围脖]"><i class="face icon_3 face_4" data-text="[围脖]"></i></div>
                        <div class="fl face-item" data-text="[音乐]"><i class="face icon_4 face_4" data-text="[音乐]"></i></div>
                        <div class="fl face-item" data-text="[绿丝带]"><i class="face icon_5 face_4" data-text="[绿丝带]"></i></div>
                        <div class="fl face-item" data-text="[蛋糕]"><i class="face icon_6 face_4" data-text="[蛋糕]"></i></div>
                        <div class="fl face-item" data-text="[蜡烛]"><i class="face icon_7 face_4" data-text="[蜡烛]"></i></div>
                        <div class="fl face-item" data-text="[干杯]"><i class="face icon_8 face_4" data-text="[干杯]"></i></div>
                        <div class="fl face-item" data-text="[男孩儿]"><i class="face icon_9 face_4" data-text="[男孩儿]"></i></div>
                        <div class="fl face-item" data-text="[女孩儿]"><i class="face icon_10 face_4" data-text="[女孩儿]"></i></div>
                        <div class="fl face-item" data-text="[肥皂]"><i class="face icon_11 face_4" data-text="[肥皂]"></i></div>
                        <div class="fl face-item" data-text="[照相机]"><i class="face icon_12 face_4" data-text="[照相机]"></i></div>
                        <div class="fl face-item" data-text="[浪]"><i class="face icon_13 face_4" data-text="[浪]"></i></div>
                        <div class="fl face-item" data-text="[沙尘暴]"><i class="face icon_14 face_4" data-text="[沙尘暴]"></i></div>
                    </div>
                </div>
                <Pagination current={current} onChange={this.onChange.bind(this)} pageSize={28} total={99} />
            </div>
        )
    }
}
