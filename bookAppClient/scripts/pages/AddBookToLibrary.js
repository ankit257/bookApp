import React, { Component, PropTypes } from 'react';
import { addons } from 'react/addons'
const ReactCSSTransitionGroup = addons.CSSTransitionGroup

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { FloatingActionButton } = mui;

import Loading from '../components/Loading';

import * as BookActions from '../actions/BookActions';

import AddBookStore from '../stores/AddBookStore'

import injectTapEventPlugin from 'react-tap-event-plugin';

import connectToStores from '../utils/connectToStores';

import selectn from 'selectn';

import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

function getState(){
	var book 		=  	AddBookStore.get();
	var bookStatus 	= 	AddBookStore.getStatus();
	var showLoading = AddBookStore.getLoadingStatus();
	return {
		book,
		bookStatus,
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
		console.log(88)
		this.state = {
			style : {
				left : '-110px',
				bottom : '-100px',	
			}
		}
		this.setState(this.state)
	}
	enter(){
		console.log(99)
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
		// console.log(this.props)
		return (
			<div className="animation" style={this.state.style}>
				{this.props.children}
			</div>
		)
	}
}
@connectToStores([AddBookStore], getState)
export default class AddBookToLibrary extends Component{
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
	 	var url = '/getbookinfo';
	 	var data = {
	 		id : this.props.params.id,
	 		format : 'xml',
	 	}
	 	BookActions.getBookFromGR(url, data);
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
	render(){
		const { book, showLoading, bookStatus } = this.props;
		
		var divBox = <div ref="lastElement" style={{height:'20px'}}></div>
		if(showLoading){
			var divBox = <div><Loading/></div>
		}
		if(book){
			var bookElement = '<div></div>';
		}
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
		var getBookInfoComponent = function (book) {
			var authors = [];
			var author = <span className="author-name">{book.authors.author.name}</span>
			return (
				<div>
					<div style={{float:'left'}}>
						<img src={book['image_url']} />
					</div>
					<div style={{float:'left'}}>
						<h2>
							{book.title}
						</h2>
						<h3>
							{author}
						</h3>
						<h4>{book['average-rating']}</h4>
					</div>
					<div style={{clear:'both'}}></div>
				</div>
			)
		}
		if(book.hasOwnProperty('title')){
			var bookInfoComponent = getBookInfoComponent(book);
		}else{
			var bookInfoComponent = <div></div>
		}
		var addOptions = {
			'OWN' : 'add to library',
			'WL' : 'add to wishlist'
		}
		var addOptionsComponent = [];
		for(var key in addOptions){
			addOptionsComponent.push(<div onClick={this.addBook.bind(this, key)}>{addOptions[key]}</div>);
		}
		var showMenuItemsComponent = function(){
			return (
				<div className="menu-items">
					<div className="menu-items-ul">
							{addOptionsComponent}
					</div>;
				</div>
			)
		}
		return (
			<div style={this.Styles.Center}>
				<div style={{paddingTop:'50px'}}>
					{bookInfoComponent}
					<AnimatingElement animation={this.state.animateMenu}>
						{this.state.showMenuItems ? showMenuItemsComponent.call(this) : ''}
					</AnimatingElement>
					<div className="icon-btn">
						<FloatingActionButton onClick={this.showMenuItems.bind(this)} iconClassName="fa fa-plus"/>
					</div>
				</div>
				{divBox}
			</div>
		)
	}
}