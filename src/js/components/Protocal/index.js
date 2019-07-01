import React, {Component} from 'react';
import {GeneralCtr} from '../../controller/GeneralCtr';
import './index.scss';

export default class Protocal extends React.Component {

    constructor(){
        super();
        this.state = {
            content: ""
        };
    }

    componentDidMount(){
        document.title = "城市网服务协议";
        GeneralCtr.getProtocal()
            .then((data) => this.setState({content: data.note}));
    }

    render(){
        return (
            <div class="normal-content container">
                <h1>城市网服务协议</h1>
                <div class="normal-cont" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
            </div>
        );
    }
}
