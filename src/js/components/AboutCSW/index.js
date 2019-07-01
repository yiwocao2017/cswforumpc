import React, {Component} from 'react';
import './index.scss';

const Util = require('../../util/util');

export default class AboutCSW extends React.Component {
    componentDidMount(){
        document.title = "关于城市网";
    }

    render(){
        return (
            <div class="normal-content container">
                <h1>关于城市网</h1>
                <div class="normal-cont" dangerouslySetInnerHTML={{__html: Util.getCompany().description}}></div>
            </div>
        );
    }
}
