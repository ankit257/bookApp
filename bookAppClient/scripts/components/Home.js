import React, { Component, PropTypes, findDOMNode } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import injectTapEventPlugin from 'react-tap-event-plugin';

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { RaisedButton, IconButton, Paper } = mui;

import  * as LoginActionCreators from '../actions/LoginActionCreators';
import AuthStore from '../stores/AuthStore';

import Loading from './Loading';

export default class Home extends Component{
	constructor(props) {
	    super(props);
	    this.loginWithFb = this.loginWithFb.bind(this);
	  }
	Styles = {
	    LeftNav : {
	      top : '65px',
	    },
	    AppBar : {
	      backgroundColor : '#8CBB30'
	    },
	    fbButton : {
	      width : '100%',
	      height : '55px'
	    },
	    Center : {
	      position : 'relative',
	      left : 0,
	      right : 0,
	      top : '30%',
	      margin : '0 auto',
	      textAlign : 'center',
	      maxWidth : '400px',
	    }
	}
	loginWithFb(){
	    LoginActionCreators.LoginWithFB();
	  }
	render(){
		return(
			<div style={this.Styles.Center}>
	            <img height="320" width="420" src='http://localhost:3000/assets/images/books.png'></img>
	            <Loading />
	            <div className="social-block">
	              <Paper zDepth={2} onTouchTap={this.loginWithFb} onClick={this.loginWithFb}>
	              <RaisedButton style={this.Styles.fbButton} >
	                <a href="#" className="button">
	                <i className="fa fa-facebook"></i>
	                <span>&nbsp;&nbsp;Login with Facebook</span></a>
	                </RaisedButton>
	                </Paper>
	            </div>
	        </div>
		)
	}
}