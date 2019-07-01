import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory} from 'react-router';
import 'fetch-ie8';
import Root from './Root';
import '../css/global.scss';
import 'normalize.css';
const rootEl = document.getElementById('mainContainer');

ReactDOM.render(
    <Root history={hashHistory}/>, rootEl);
