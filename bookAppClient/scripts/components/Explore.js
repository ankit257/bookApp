import React, { Component, PropTypes, findDOMNode } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import injectTapEventPlugin from 'react-tap-event-plugin';

import addons from 'react/addons'
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { RaisedButton, IconButton, Paper } = mui;

import CommonLayout from './CommonLayout';
import Loading from './Loading';
import Home from './Home';

import  * as LoginActionCreators from '../actions/LoginActionCreators';
import AuthStore from '../stores/AuthStore';



const DEFAULT_LOGIN = 'gaearon';
const GITHUB_REPO = 'https://github.com/gaearon/flux-react-router-example';

injectTapEventPlugin();


function parseFullName(params) {
  if (!params.login) {
    return DEFAULT_LOGIN;
  }
  return params.login + (params.name ? '/' + params.name : '');
}

export default class Explore extends Component {
  static propTypes = {
    params: PropTypes.shape({
      login: PropTypes.string,
      name: PropTypes.string
    })
  }
  /*
  * Router object used from context declared in Parent Component(Like Dependency Injection)
  */
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  static childContextTypes = {
    muiTheme: PropTypes.object,
  }
  /*
  *Properties/Object which need to be transfered down to Component Hierarchy
  */
  getChildContext(){
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    }
  }
  shouldComponentUpdate = shouldPureComponentUpdate;
  constructor(props) {
    console.log(props.location);
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);       // In React.createElement auto binds the function,
    this.handleOnChange = this.handleOnChange.bind(this); // when we use the same in <Component onClick={this.click}>. 
    this.handleGoClick = this.handleGoClick.bind(this);   // While in ES6 we have to Explicitly bind it.
    this.getInputValue = this.getInputValue.bind(this);   // e.g. <Component onClick={this.click.bind(this)} 
    this.state = {                                        // Hence defined in constructor
      loginOrRepo: parseFullName(props.params),
      location : props.location.pathname
    }
  }
  componentWillMount(){
    let currentRouteName = this.context.router;
    console.log(currentRouteName);
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      loginOrRepo: parseFullName(nextProps.params),
      location : nextProps.location.pathname
    });
  }
  handleRefresh(){
    return null
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
      top : '50px',
      margin : '0 auto',
      textAlign : 'center',
      maxWidth : '400px',
    }
  }
  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleGoClick();
    }
  }
  handleOnChange() {
    // Update the internal state because we are using a controlled input.
    // This way we can update it *both* in response to user input *and*
    // in response to navigation in `componentWillReceiveProps`.
    this.setState({
      loginOrRepo: this.getInputValue()
    });
  }
  handleGoClick() {
    this.context.router.transitionTo(`/${this.getInputValue()}`);
  }
  getInputValue() {
    return findDOMNode(this.refs.loginOrRepo).value;
  }
  render() {
    let ComponentToRender;
    switch(this.state.location){
      case '/':
        ComponentToRender = <Home {...this.props} />
        break;
      default:
        ComponentToRender = <div></div>
        break;
    }
    return (
      <div>
        <CommonLayout {...this.props} /> 
        <ReactCSSTransitionGroup transitionName="example">
          <div style = {{paddingTop:'1em'}}></div>
          {ComponentToRender} 
          </ReactCSSTransitionGroup>
      </div>
    )
  }
}