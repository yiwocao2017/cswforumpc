import React, { Component } from 'react';
import { Link } from 'react-router';
import Parallax from 'parallax-js';
import './index.scss';

export default class NotFoundPage extends Component {
    componentDidMount(){
        new Parallax(this.refs.scene)
    }
    render() {
        return (
            <div class="wrapper">
              <ul ref="scene" class="scene unselectable"
      			data-friction-x="0.1"
      			data-friction-y="0.1"
      			data-scalar-x="25"
      			data-scalar-y="15">
      			<li class="layer" data-depth="0.00"></li>
      			<li class="layer" data-depth="0.10"><div class="background"></div></li>
      			<li class="layer" data-depth="0.10"><div class="light orange b phase-4"></div></li>
      			<li class="layer" data-depth="0.10"><div class="light purple c phase-5"></div></li>
      			<li class="layer" data-depth="0.10"><div class="light orange d phase-3"></div></li>
      			<li class="layer" data-depth="0.15">
      				<ul class="rope depth-10">
      					<li><img src={require('../../../images/rope.png')} alt="Rope"/></li>
      					<li class="hanger position-2">
      						<div class="board cloud-2 swing-1"></div>
      					</li>
      					<li class="hanger position-4">
      						<div class="board cloud-1 swing-3"></div>
      					</li>
      					<li class="hanger position-8">
      						<div class="board birds swing-5"></div>
      					</li>
      				</ul>
      			</li>
      			<li class="layer" data-depth="0.20">
                    <h1 class="title">页面不存在哦</h1>
                </li>
      			<li class="layer" data-depth="0.30">
      				<ul class="rope depth-30">
      					<li><img src={require('../../../images/rope.png')} alt="Rope"/></li>
      					<li class="hanger position-1">
      						<div class="board cloud-1 swing-3"></div>
      					</li>
      					<li class="hanger position-5">
      						<div class="board cloud-4 swing-1"></div>
      					</li>
      				</ul>
      			</li>
      			<li class="layer" data-depth="0.30"><div class="wave paint depth-30"></div></li>
      			<li class="layer" data-depth="0.40"><div class="wave plain depth-40"></div></li>
      			<li class="layer" data-depth="0.50"><div class="wave paint depth-50"></div></li>
      			<li class="layer" data-depth="0.60"><div class="lighthouse depth-60"></div></li>
      			<li class="layer" data-depth="0.60">
      				<ul class="rope depth-60">
      					<li><img src={require('../../../images/rope.png')} alt="Rope"/></li>
      					<li class="hanger position-3">
      						<div class="board birds swing-5"></div>
      					</li>
      					<li class="hanger position-6">
      						<div class="board cloud-2 swing-2"></div>
      					</li>
      					<li class="hanger position-8">
      						<div class="board cloud-3 swing-4"></div>
      					</li>
      				</ul>
      			</li>
      			<li class="layer" data-depth="0.60"><div class="wave plain depth-60"></div></li>
      			<li class="layer" data-depth="0.80"><div class="wave plain depth-80"></div></li>
      			<li class="layer" data-depth="1.00"><div class="wave paint depth-100"></div></li>
      		</ul>
            <Link to="/" class="toggle i">返回首页</Link>
          </div>
      )
    }
}
