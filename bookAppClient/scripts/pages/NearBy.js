import React, { Component, PropTypes } from 'react';

import injectTapEventPlugin from 'react-tap-event-plugin';

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { Slider, FlatButton, FontIcon, Dialog, Toggle } = mui;

import Loading from '../components/Loading';


import SearchPreferenceActions from '../actions/SearchPreferenceActions';

import * as SearchActionCreators from '../actions/SearchActionCreators';

import NearByBookStore from '../stores/NearByBookStore';

import connectToStores from '../utils/connectToStores';

import SelectBox from 'react-select-box';

import addons from 'react/addons'

import selectn from 'selectn';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const allGenres = ["Adventure", "Animals", "Art and design", "Audiobooks", "Autobiography and memoir", "Ballet", "Biography", "Children and teenagers", "Business and finance", "Chick lit", "Children's books: 7 and under", "Children's fantasy books", "Children's books: 8-12 years", "Classics", "Comics and graphic novels", "Computing and the net", "Craft and hobbies", "Crime fiction", "Disaster fiction", "Dystopian fiction", "Economics", "Fairies", "Fantasy", "Fiction", "Film", "Food and drink", "Friendship", "Funny books", "Health, mind and body", "Historical fiction", "History", "Horror", "House and garden", "Literary criticism", "Music", "Non-fiction", "Paranormal romance", "Philosophy", "Picture books", "Poetry", "Politics", "Reference and languages", "Religion", "Romance", "School", "Sci-fi", "Science and nature", "Science fiction", "Short stories", "Society", "Sport and leisure", "Stage", "Teen books", "Teen romance", "Thrillers", "Travel guides", "Travel writing", "True crime", "TV and radio", "Vampires", "War", "Witches, Wizards and magic"];

injectTapEventPlugin();

function getState(props){
	var books =  NearByBookStore.get();
	var pageNo = NearByBookStore.getPageNo();
	var showLoading = NearByBookStore.showLoading();
	var endOfResults = NearByBookStore.endOfResults();
	return {
		books,
		pageNo,
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

@connectToStores([NearByBookStore], getState)
export default class NearBy extends Component{
	constructor(props){
		super(props);
		this.onSlide = this.onSlide.bind(this);
		this.showDialog = this.showDialog.bind(this);
		this.toggleSwitch = this.toggleSwitch.bind(this);
		this.state = {
			radius : 0.2,
			colors: [],
			modal : false,
		}
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
		theme.component.slider.selectionColor = "#8CBB30";
		theme.component.flatButton.primaryTextColor = "#8CBB30";
		theme.component.flatButton.secondaryTextColor = "#8CBB30";
		theme.component.toggle.thumbOnColor = "#8CBB30";
		theme.component.toggle.thumbRequiredColor = "#8CBB30";
		theme.component.toggle.trackOnColor = "#8CBB30";
		theme.component.toggle.trackRequiredColor = "#8CBB30";
		return {
		  muiTheme: theme,
		}
	}
	Styles = {
	    Center : {
	      position : 'relative',
	      left : 0,
	      right : 0,
	      top : '30%',
	      margin : '0 auto',
	      textAlign : 'center',
	      maxWidth : '400px',
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
	onSlide(e, value){
		this.state.radius = value;
		this.setState(this.state);
	}
	componentWillMount(){
		var url = '/getnearby'
		SearchActionCreators.getNearByBooks(url);
	}
	handleMultiChange(value){
		this.setState({
			colors : value	
		})
	}
	_handleCustomDialogCancel(){
		this.refs.dialog.dismiss();
	}
	_handleCustomDialogSubmit(){
		this.refs.dialog.dismiss();
	}
	showDialog(){
		this.refs.dialog.show();
		this.setState({
			dialog : true
		})
	}
	toggleSwitch(ev, toggled, value){
		console.log(value);
	}
	handleClickUp(bookId){
		this.context.router.transitionTo(`/book/${bookId}`);
	}
	render(){
		const { books, pageNo, endOfResults, showLoading } = this.props;
		let customActions = [
		  <FlatButton
		    label="Cancel"
		    secondary={true}
		    onTouchTap={this._handleCustomDialogCancel.bind(this)} />,
		  <FlatButton
		    label="Submit"
		    primary={true}
		    onTouchTap={this._handleCustomDialogSubmit.bind(this)} />
		];
		var self = this;
		var GenresNode = allGenres.map(function (genre, index){
			var elemKey = genre.split(' ').join('_');
			return (
			    	<Toggle style={{width:'50%', float:'left', padding:'0.3em', borderBottom: '1px solid #eee'}}
			    		key={elemKey}
				        name={genre}
				        value={genre}
				        label={genre}
				        defaultToggled={true}
				        onToggle = {self.toggleSwitch.bind(self, genre)}>
				    </Toggle>
				)
		});
		var autoSuggestionList =[];
		if(hasBooks(books)){
			for(var key in books){
				autoSuggestionList.push(<ListComponent key={key} book={books[key]} clickHandler={this.handleClickUp.bind(this, key)}/>)
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
			<ReactCSSTransitionGroup transitionName="example">
				<div>
					<div style={this.Styles.Center}>
						<div style={this.Styles.container}>
						  <FlatButton secondary={true} label="Genres" onTouchTap={this.showDialog}>
						    <FontIcon style={this.Styles.exampleFlatButtonIcon} className="fa fa-filter"/>
						  </FlatButton>
						</div>
						<Dialog title="Filter by Genres" actions={customActions} modal={this.state.modal} autoDetectWindowHeight={true} autoScrollBodyContent={true} ref="dialog">
						  		{GenresNode}
						</Dialog>
						{autoSuggestionList}
						{divBox}
					</div>
				</div>
			</ReactCSSTransitionGroup>
		)
	}
}
// <SelectBox label="Genres" onChange={this.handleMultiChange.bind(this)} value={this.state.colors} multiple="true" >
// 	<option value="red">Red</option>
// 	<option value="green">Green</option>
// </SelectBox>