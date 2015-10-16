import React, { Component, PropTypes } from 'react';

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { TextField } = mui;

import Loading from '../components/Loading';

import * as SearchActionCreators from '../actions/SearchActionCreators';

import SearchBookStore from '../stores/SearchBookStore'

import injectTapEventPlugin from 'react-tap-event-plugin';

import connectToStores from '../utils/connectToStores';

import selectn from 'selectn';

import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

function getState(){
	var books =  SearchBookStore.get();
	var pageNo = SearchBookStore.getPageNo();
	var srchString = SearchBookStore.getSrchString();
	var showLoading = SearchBookStore.showLoading();
	var endOfResults = SearchBookStore.endOfResults();
	return {
		books,
		pageNo,
		srchString,
		showLoading,
		endOfResults
	}
}
function hasBooks (books) {
	if(Object.keys(books).length > 0){
		return true;
	}
}
class ListComponent extends Component{
	componentWillMount(){
		console.log(this.props)
	}	
	handleClick(e){
		this.props.clickHandler(e);
	}
	componentWillRecieveProps(){
		this.forceUpdate();
	}
	componentWillMount(){
		
	}
	render(){
		/*var imageLink = selectn('imageLinks.smallThumbnail', this.props.book);
		var authorsArray = selectn('authors', this.props.book);
		var authors = [];
		if(authorsArray){
			authorsArray.map(function (author, index){
				authors.push(<span className="authors" key={index}>{author}</span>)
			});
		}
		var title = this.props.book.title;
		*/
		var imageLink = selectn('image', this.props.book);
		var title = selectn('title', this.props.book);
		var authors = <span className="authors">{selectn('author', this.props.book)}</span>
		var rating = <span className="rating">{selectn('rating', this.props.book)}</span>
		return(
			<div onClick={this.handleClick.bind(this)} className="book-list-item" style={{borderBottom : '1px solid #aaa'}}>
				<div style={{padding : '2px', float:'left', backgroundImage : 'url('+imageLink+')'}}>
					<img src={imageLink} height="128" width="80" />
				</div>
				<div style={{padding : '4px', float:'left'}}>
					<h3 dangerouslySetInnerHTML={{__html: title}} />
					<h6>{rating}</h6>
					<div>{authors}</div>
				</div>
				<div style={{clear: 'both'}}></div>
			</div>
		)
	}
}
@connectToStores([SearchBookStore], getState)
export default class AddBook extends Component{
	static propTypes = {
			books : PropTypes.object,
			pageNo : PropTypes.number.isRequired,
			srchString : PropTypes.string.isRequired,
			showLoading : PropTypes.bool.isRequired,
			endOfResults : PropTypes.bool.isRequired
		}
	constructor(props){
		super(props);
		this.initSearch = this.initSearch.bind(this);
		// this.state = {
		// 	enter : true,
		// 	entered : false,
		// 	exit : false,
		// 	books : getState().books,
		// 	pageNo : getState().pageNo,
		// 	srchString : getState().srchString,
		// 	showLoading : getState().showLoading,
		// 	endOfResults : getState().endOfResults
		// }
	}
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
		var theme = ThemeManager.getCurrentTheme();
		theme.component.textField.focusColor = "#8CBB30";
		return {
		  muiTheme: theme,
		}
	}
	componentWillMount(){
		if (ExecutionEnvironment.canUseDOM) {
	      	window.addEventListener('scroll', this.handleScroll.bind(this));
	    }
	}
	componentWillRecieveProps(nextProps){
		console.log(nextProps)
	}
	componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll.bind(this));
	}
	handleScroll(){
		if(this.props.showLoading){
			return false;
		}
		var windowTop = window.scrollTop;
		var c = window.scrollY+window.innerHeight;
		var d = this.refs.lastElement.getDOMNode().scrollHeight+this.refs.lastElement.getDOMNode().offsetTop;
		if((d-c)<0){
			var url = '/getbooksbyname';
			var value = SearchBookStore.getSrchString(); 
			var pageNo = SearchBookStore.getPageNo();
			pageNo++;
			var data = {
					string : value,
					pageNo : pageNo
				}
			//Call Fn Search For Books in Search Actions
			SearchActionCreators.SearchBookFromGoogleAPI(url, data);
		}
	}
	initSearch(e){
		var value = this.refs.searchComponent.getValue();
		var url = '/getbooksbyname';
		var string = SearchBookStore.getSrchString(); 
		var pageNo = SearchBookStore.getPageNo();
		if(value == string){
			pageNo++;
		}else{
			pageNo = 1;
		}
		var data = {
			string : value,
			pageNo : pageNo
		}
		if(value.length > 2){
			SearchActionCreators.SearchBookFromGoogleAPI(url, data);
		}
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
	handleClickUp(id){
		this.context.router.transitionTo(`/addbook/${id}`);
	}
	render(){
		// if(this.state.enter){
		// 	this.Styles.Center.transform = 'translateX(-100px)';
		// 	this.Styles.Center.transition = 'all 0s linear';
		// }
		// if(this.state.entered){
		// 	this.Styles.Center.transform = 'translateX(0px)';
		// 	this.Styles.Center.transition = 'all 0.1s linear';
		// }
		// if(this.state.exit){
		// 	this.Styles.Center.transform = 'translateX(100px)';
		// 	this.Styles.Center.transition = 'all 0.1s linear';
		// }
		const { books, srchString, pageNo, endOfResults, showLoading } = this.props;
		if(hasBooks(books)){
			var autoSuggestionList =[];
			for(var key in books){
				autoSuggestionList.push(<ListComponent book={books[key]} clickHandler={this.handleClickUp.bind(this, key)}/>)
			}
		}
		var divBox = <div ref="lastElement" style={{height:'20px'}}></div>
		if(showLoading){
			var divBox = <div><Loading/></div>
		}
		if(endOfResults){
			var divBox = <div>No more books to Show</div>	
		}
		return (
			<div style={this.Styles.Center}>
			<div style={{paddingTop:'50px'}}>
				<TextField style={{width: '70%'}} hintText="Enter Book Name" ref="searchComponent" onChange={this.initSearch}/>
				<i style={{position:'relative',right:'1em', color : '#aaa'}} className="fa fa-search"></i>
			</div>
			{autoSuggestionList}
			{divBox}
			</div>
		)
	}
}