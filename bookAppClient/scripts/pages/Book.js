import React, { Component, PropTypes } from 'react';
import { addons } from 'react/addons'
const ReactCSSTransitionGroup = addons.CSSTransitionGroup

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { FloatingActionButton } = mui;

import Loading from '../components/Loading';

import * as BookActions from '../actions/BookActions';

import GetBookStore from '../stores/GetBookStore'

import injectTapEventPlugin from 'react-tap-event-plugin';

import connectToStores from '../utils/connectToStores';

import selectn from 'selectn';

import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

import classNames from 'classnames/dedupe';

import { getDistanceFromLatLonInKm } from '../utils/HelperUtils';

function getState(props){
	var book 		=  	GetBookStore.get();
	var users 	= 	GetBookStore.getBookUsers();
	var showLoading = GetBookStore.getLoadingStatus();
	return {
		book,
		users,
		showLoading
	}
}
//Google Books API
//https://www.googleapis.com/books/v1/volumes?q=isbn13:9781405088831&key=AIzaSyB-RcG0iuq22z44pnqx3QDCQD38ErUFuRM
//Image
//https://books.google.com/books?id=A8bAPdi_TOAC&printsec=frontcover&img=2&zoom=2&edge=curl&source=gbs_api
/*
* Higher order Component
*/
class AnimatingElement extends Component{
	constructor(props){
		super(props);
		this.state = {
			style : {
				left : '-110px',
				bottom : '-100px',	
			}
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.animation == 'enter'){
			this.enter()
		}else{
			this.leave()
		}
	}
	leave(){
		this.state = {
			style : {
				left : '-110px',
				bottom : '-100px',	
			}
		}
		this.setState(this.state)
	}
	enter(){
		this.state = {
			style : {
				left : '0px',
				bottom : '100px',	
			}
		}
	}
	componentWillUnmount(){
		console.log(this.props.animation);
		this.leave()
	}
	render(){
		return (
			<div className="animation" style={this.state.style}>
				{this.props.children}
			</div>
		)
	}
}
@connectToStores([GetBookStore], getState)
export default class Book extends Component{
	static propTypes = {
		params : PropTypes.shape({
			id : PropTypes.string.isRequired
		}).isRequired,
		book : PropTypes.object,
	}
	static contextTypes = {
	    router: PropTypes.object.isRequired
	}
	static childContextTypes = {
		muiTheme: PropTypes.object,
	}
	constructor(props){
		super(props);
		this.state = {
			showMenuItems : false,
			animateMenu : 'enter'
		}
	}
	/*
	*Properties/Object which need to be transfered down to Component Hierarchy
	*/
	getChildContext(){
		var theme = ThemeManager.getCurrentTheme();
		theme.component.textField.focusColor = "#8CBB30";
		return {
		  muiTheme: theme,
		}
	}
	componentWillRecieveProps(nextProps){
		console.log(nextProps)
	}
	componentWillMount(){
	 	var url = '/getbookinfonearby';
	 	var data = {
	 		id : this.props.params.id,
	 		format : 'xml',
	 	}
	 	BookActions.getBookInfo(url, data);
	}
	updateBookStatus(action){
		var url = '/updatestatus'
		var data = {
			id : this.props.params.id,
			action : action
		}
		BookActions.updateBookStatusAPI(url, data);
	}
	Styles = {
	    Center : {
	      position : 'relative',
	      left : 0,
	      right : 0,
	      top : '50px',
	      margin : '0 auto',
	      maxWidth : '800px',
	    },
	    Slider : {
	    	color : '#8CBB30'
	    },
	    container : {
	    	padding : '12px',
	    	color : '#8CBB30',
	    },
	    exampleFlatButtonIcon : {
	    	float : 'left',
	    	color: '#ccc',
    		top: '4px',
    		left: '8px',
	    }
	}
	handleClickUp(key){
		console.log(key);
	}
	showMenuItems(){
		if(this.state.showMenuItems){
			this.state.animateMenu = 'enter';
			this.state.showMenuItems = false;	
		}else{
			this.state.animateMenu = 'leave';
			this.state.showMenuItems = true;	
		}
		this.setState(this.state);
	}
	addBook(e){
		var url = '/addbook'
		var data = {
			isbn13 	: this.props.book.isbn13,
			status 	: e,
			title 	: this.props.book.title,
			author 	: this.props.book.authors.author.name,
			image 	: this.props.book.authors.author.image_url
		}
		BookActions.addBookAPI(url, data);
	}
	componentDidMount(){
		setTimeout(function(){
			componentHandler.upgradeAllRegistered()	
		},500)
	}
	handleBookRequestAction(e){
		var userId = e.split('id_')[1];
		var id = this.props.params.id;
	}
	render(){
		const { book, users, showLoading } = this.props;

		var divBox = <div ref="lastElement" style={{height:'20px'}}></div>
		if(showLoading){
			var divBox = <div><Loading/></div>
		}
		if(book){
			var bookElement = '<div></div>';
		}
		var bookStatus = book.status;
		switch(bookStatus){ //NA, OWN, WISH, LEND, RENT
			case 'NA':
				break;
			case 'OWN':
				break;
			case 'WISH':
				break;
			case 'LEND':
				break;
			case 'RENT':
				break;
		}
		var getBookInfoComponent = function (book){
			// var author = <span className="author-name">{book.authors.author.name}</span>
			var author = selectn('author', book);
			return (
				<div>
					<div style={{float:'left'}}>
						<img src={book['image_url']} />
					</div>
					<div style={{float:'left'}}>
						<h3 dangerouslySetInnerHTML={{__html: book.title}} />
						<h3>
							{author}
						</h3>
						<h4>{book['average-rating']}</h4>
					</div>
					<div style={{clear:'both'}}></div>
				</div>
			)
		}
		//var c = this.props.users;
		/*var userInfoComponent = function(users){
				var userArr = []
				var x = users.map(function (user, index){
					var userCoordinates = user.loc.coordinates;
					var dist = getDistanceFromLatLonInKm(userCoordinates[1], userCoordinates[0], coordinates[1], coordinates[0]);
				})	
			var classNamesTabArray = ['mdl-tabs', 'mdl-js-tabs', 'mdl-js-ripple-effect'];
			return(
				<div className={classNames(classNamesTabArray)}>
				  <div className="mdl-tabs__tab-bar">
				      <a href="#asd" className="mdl-tabs__tab is-active"><span>Starks</span></a>
				      <a href="#lannisters-panel" className="mdl-tabs__tab"><span>Lannisters</span></a>
				      <a href="#targaryens-panel" className="mdl-tabs__tab"><span>Targaryens</span></a>
				  </div>

				  <div className="mdl-tabs__panel is-active" id="asd">
				    <ul>
				      <li>Eddard</li>
				      <li>Catelyn</li>
				      <li>Robb</li>
				      <li>Sansa</li>
				      <li>Brandon</li>
				      <li>Arya</li>
				      <li>Rickon</li>
				    </ul>
				  </div>
				  <div className="mdl-tabs__panel" id="lannisters-panel">
				    <ul>
				      <li>Tywin</li>
				      <li>Cersei</li>
				      <li>Jamie</li>
				      <li>Tyrion</li>
				    </ul>
				  </div>
				  <div className="mdl-tabs__panel" id="targaryens-panel">
				    <ul>
				      <li>Viserys</li>
				      <li>Daenerys</li>
				    </ul>
				  </div>
				</div>
			)
		}
		*/
		var parentObj = this;
		var userInfoComponent = function(users){
				var userArrTab = [];
				var userArrElem = [];
				var self = this;
				users.map(function (user, index){
					var userCoordinates = user.loc.coordinates;
					var dist = getDistanceFromLatLonInKm(userCoordinates[1], userCoordinates[0], coordinates[1], coordinates[0]);
					dist = Math.round( dist * 10) / 10
					var classNamesSubTabArray = ['mdl-tabs__tab'];
					var classNamesElemArray = ['mdl-tabs__panel']
					if(index == 0){
						classNamesSubTabArray.push('is-active');
						classNamesElemArray.push('is-active');
					}
					var id = 'id_'+user.id;
					var Href = '#'+id;
					var rippleBtnClassNames = ['mdl-button', 'mdl-js-button', 'mdl-button--raised', 'mdl-js-ripple-effect', 'mdl-button--accent'];
					var userElem =  (<div key={index} className={classNames(classNamesElemArray)} id={id}>
										<h5>{user.facebook.firstName}</h5>
										<div style={{float:'right'}}>
											<button className={classNames(rippleBtnClassNames)} onClick={parentObj.handleBookRequestAction.bind(parentObj, id)}>
						  						Request Exchange
											</button>
										</div>
										<div style={{clear:'both'}}></div>
									</div>)
					
					userArrElem.push(userElem);
					userArrTab.push(<a key={index} href={Href} className={classNames(classNamesSubTabArray)}><span><i className="fa fa-location-arrow">{dist} km</i></span></a>)
				}.bind(self))
			var classNamesTabArray = ['mdl-tabs', 'mdl-js-tabs', 'mdl-js-ripple-effect'];
			var classNamesSubTabArray = ['mdl-tabs__tab'];
			return(
					<div className={classNames(classNamesTabArray)}>
					  <div className="mdl-tabs__tab-bar">
					      { userArrTab }
					  </div>
					  { userArrElem }
					</div>
				)
		}
		if(book.hasOwnProperty('title')){
			var bookInfoComponent = getBookInfoComponent(book);
		}else{
			var bookInfoComponent = <div></div>
		}
		var NearbyInfoComponent = function(){
			return (
				<div className="nearby-info"></div>
			)
		}
		return (
			<div style={this.Styles.Center}>
				<div style={{paddingTop:'50px'}}>
					{ bookInfoComponent }
					{ NearbyInfoComponent }
					{ userInfoComponent(users) }
					
				</div>
				{divBox}
			</div>
		)
	}
}