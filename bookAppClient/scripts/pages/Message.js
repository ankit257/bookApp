import React, { Component, PropTypes } from 'react';

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { Slider, FlatButton, FontIcon, Dialog, Toggle, List, ListItem, Avatar, ListDivider, Card, CardHeader, CardMedia, CardTitle, CardText, CardActions } = mui;

import injectTapEventPlugin from 'react-tap-event-plugin';

import MessageActions from '../actions/MessageActions';

import SelectBox from 'react-select-box';

injectTapEventPlugin();

import addons from 'react/addons'
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const allGenres = ["Adventure", "Animals", "Art and design", "Audiobooks", "Autobiography and memoir", "Ballet", "Biography", "Children and teenagers", "Business and finance", "Chick lit", "Children's books: 7 and under", "Children's fantasy books", "Children's books: 8-12 years", "Classics", "Comics and graphic novels", "Computing and the net", "Craft and hobbies", "Crime fiction", "Disaster fiction", "Dystopian fiction", "Economics", "Fairies", "Fantasy", "Fiction", "Film", "Food and drink", "Friendship", "Funny books", "Health, mind and body", "Historical fiction", "History", "Horror", "House and garden", "Literary criticism", "Music", "Non-fiction", "Paranormal romance", "Philosophy", "Picture books", "Poetry", "Politics", "Reference and languages", "Religion", "Romance", "School", "Sci-fi", "Science and nature", "Science fiction", "Short stories", "Society", "Sport and leisure", "Stage", "Teen books", "Teen romance", "Thrillers", "Travel guides", "Travel writing", "True crime", "TV and radio", "Vampires", "War", "Witches, Wizards and magic"];

export default class Message extends Component{
	constructor(props){
		super(props);
		this.onSlide = this.onSlide.bind(this);
		this.showDialog = this.showDialog.bind(this);
		this.toggleSwitch = this.toggleSwitch.bind(this);
		this.navigateToMessage = this.navigateToMessage.bind(this);
		this.acceptRequest = this.acceptRequest.bind(this);
		this.cancelRequest = this.cancelRequest.bind(this);
		this.state = {
			radius : 0.2,
			colors: [],
			modal : false,
		}
	}
	static propTypes = {
		params : PropTypes.shape({
			id : PropTypes.string.isRequired
		}).isRequired
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
	      left : '278px',
	      maxWidth : '80%',
	      minWidth : '480px'
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
	    },
	    cardHolder : {
	    },
	    flatButtonIcon : {
	    	float: 'left',
		    left: '12px',
		    top: '9px',
		    fontSize: 'medium',
		    color : '#8CBB30'
	    },
	    userInfo : {
	    	fontSize : '12px',
	    	marginLeft : '12px'
	    }
	}
	onSlide(e, value){
		this.state.radius = value;
		this.setState(this.state);
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
	navigateToMessage(e){
		this.context.router.transitionTo(`message/${e}`);
	}
	cancelRequest(){
		console.log(this.params)
	}
	acceptRequest(){

		console.log(this.props.params.id)
	}
	render(){
		let customActions = [
		  <FlatButton
		    label="Cancel"
		    secondary={true}
		    onTouchTap={this.cancelRequest}>
		    <FontIcon style={this.Styles.flatButtonIcon} className="fa fa-times"/>
		  </FlatButton>,
		  <FlatButton
		    label="Submit"
		    primary={true}
		    onTouchTap={this.acceptRequest}>
		      <FontIcon style={this.Styles.flatButtonIcon} className="fa fa-search"/>
		  </FlatButton>
		];
		var Colors = {
			darkBlack : '#000',
		}
		var self = this;
		return (
			<ReactCSSTransitionGroup transitionName="example">
				<div>
					<div style={this.Styles.Center}>
						<div style={this.Styles.cardHolder}>
						<Card>
							<CardHeader
								title="Pyare Mohan"
								avatar={<Avatar>A</Avatar>}/>
								<div style={this.Styles.userInfo}>
									<h3><i className="fa fa-location"></i>23 kms</h3>
									<span>152 Followers</span><span>&nbsp;</span><span>257 Books</span>
								</div>
							<CardText>
								He requested you to request book.
							</CardText>
							<div style={{position: 'relative', 'float':'right'}}>
								{customActions}
							</div>
							<div style={{clear:'both'}}></div>
						</Card>
					</div>
					</div>
				</div>
			</ReactCSSTransitionGroup>
		)
	}
}
// <CardHeader
// 	title="Title"
// 	subtitle="Subtitle"
// 	avatar={<Avatar>A</Avatar>}/>
// <CardHeader
// 	title="Demo Url Based Avatar"
// 	subtitle="Subtitle"
// 	avatar="http://lorempixel.com/100/100/nature/"/>
// <CardMedia overlay={<CardTitle title="Title" subtitle="Subtitle"/>}>
// 	<img src="http://lorempixel.com/600/337/nature/"/>
// </CardMedia>
// <CardTitle title="Title" subtitle="Subtitle"/>
