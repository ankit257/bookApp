import React, { Component, PropTypes, findDOMNode } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import injectTapEventPlugin from 'react-tap-event-plugin';

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { AppBar, RaisedButton, LeftNav, MenuItem, IconButton, Paper } = mui;
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import connectToStores from '../utils/connectToStores';
import AuthStore from '../stores/AuthStore';

// import ReactCSSTransitionGroup from 'react/addons';

import addons from 'react/addons'
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

import  * as LoginActionCreators from '../actions/LoginActionCreators';

const DEFAULT_LOGIN = 'gaearon';
const GITHUB_REPO = 'https://github.com/gaearon/flux-react-router-example';

injectTapEventPlugin();

function getState (props) {
	const Session = AuthStore.get();
	return {
		Session
	}
}
function parseFullName(params) {
  if (!params.login) {
    return DEFAULT_LOGIN;
  }
  return params.login + (params.name ? '/' + params.name : '');
}
function getMenuItems (Session) {
  if(Session.profile){
    var menuItems = [
      { route: 'get-started', image: Session.profile.picture.data.url, text: Session.profile['first_name'], menuItemClassName : 'Lol' },
      { route: 'library/myuserid', text: 'My Library' },
      { route: 'addbook', text: 'Add Book' },
      { route: 'nearby', text: 'Search NearBy' },
      { route: 'inbox', text: 'History' },//Chat and Book Exchange Information
      { type: MenuItem.Types.SUBHEADER, text: '' },
      { route: 'about', text: 'About' },
      { route: 'logout', icon: "", text: 'Logout' },
    ]
  }else{
    var menuItems = [
      { route: 'nearby', text: 'Search NearBy', className : 'lol' },
      { route: 'about', text: 'About' },
    ]
  }
  return menuItems;
}
/*
* Contains Top Navigation Bar and Left Menu
*/
@connectToStores([AuthStore], getState)
export default class CommonLayout extends Component {
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
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    }
  }
  constructor(props){
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.state = {
      loginOrRepo: parseFullName(props.params),
      title : 'BookLovers !!!',
      leftNavOpen : false,
      menuItems : getMenuItems(props.Session)
    };
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      loginOrRepo: parseFullName(nextProps.params),
      menuItems : getMenuItems(nextProps.Session)
    });
  }
  handleRefresh(){
    return null
  }
  closeNavigation(e){
    this.forceUpdate()
    this.refs.leftNav.toggle();
    // var state = this.state;
    // if(this.state.leftNavOpen){
    // 	state.leftNavOpen = false;
    // }else{
    // 	state.leftNavOpen = true;
    // }
    // this.setState(state);
  }
  navigateTo(e, i, j){
    if(j.route == 'logout'){
      LoginActionCreators.LogOut();
    }
    else if(j.route == 'about'){
      this.context.router.transitionTo('/about');
    }else{
      this.context.router.transitionTo(`/${j.route}`);
      // this.context.router.transitionTo(j.route);
    }
  }
  Styles = {
    LeftNav : {
      top : '65px',
    },
    AppBar : {
      backgroundColor : '#8CBB30',
      position : 'fixed',
      width : '100%'
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
    },
    Title : {
      color: '#ffffff',
      fontWeight: 300,
      left: '50px',
      top: '17px',
      position: 'absolute',
      fontSize: '26px'
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
  componentDidMount(){
    this.refs.leftNav.toggle();
    this.forceUpdate()
  }
  goHome(){
    //Replace href='/' command here
  }
  render() {
      if(this.refs.leftNav && this.refs.leftNav.state.open){
        var AppBarJSX = <AppBar onLeftIconButtonTouchTap={this.closeNavigation.bind(this)} iconClassNameRight="muidocs-icon-navigation-expand-more" style={this.Styles.AppBar}><a href="/"><span style={this.Styles.Title}>bookup</span></a></AppBar>
      }else{
        var AppBarJSX = <AppBar iconElementLeft={<IconButton onClick={this.closeNavigation.bind(this)}><NavigationClose/></IconButton>} onLeftIconButtonTouchTap={this.closeNavigation.bind(this)} iconClassNameRight="muidocs-icon-navigation-expand-more" style={this.Styles.AppBar}><a href="/"><span style={this.Styles.Title}>bookup</span></a></AppBar>
      }
    return (
      <div>
        <LeftNav ref="leftNav" onClick={this.navigateTo.bind(this)} onChange={this.navigateTo.bind(this)} menuItems = {this.state.menuItems} style={this.Styles.LeftNav}/>
        {AppBarJSX}
      </div>
    )
  }
}
//<AppBar href="#" onLeftIconButtonTouchTap={this.closeNavigation.bind(this)} iconClassNameRight="muidocs-icon-navigation-expand-more" style={this.Styles.AppBar}><span style={this.Styles.Title}>bookpop</span></AppBar>
//<AppBar title={this.state.title} iconElementLeft={<IconButton onClick={this.closeNavigation.bind(this)}><NavigationClose/></IconButton>} onLeftIconButtonTouchTap={this.closeNavigation.bind(this)} iconClassNameRight="muidocs-icon-navigation-expand-more" style={this.Styles.AppBar}/>

/*
{this.state.leftNavOpen ? 
          <AppBar title={this.state.title} href="#" onLeftIconButtonTouchTap={this.closeNavigation.bind(this)} iconClassNameRight="muidocs-icon-navigation-expand-more" style={this.Styles.AppBar}/>
          :<AppBar title={this.state.title} href="#" iconElementLeft={<IconButton onClick={this.closeNavigation.bind(this)}><NavigationClose/></IconButton>} onLeftIconButtonTouchTap={this.closeNavigation.bind(this)} iconClassNameRight="muidocs-icon-navigation-expand-more" style={this.Styles.AppBar}/>
      }
*/