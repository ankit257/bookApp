import React, { Component, PropTypes } from 'react';

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { Slider, FlatButton, FontIcon, Dialog, Toggle, List, ListItem, Avatar, ListDivider, Card, CardHeader, CardMedia, CardTitle, CardText, CardActions } = mui;

import injectTapEventPlugin from 'react-tap-event-plugin';

import SearchPreferenceActions from '../actions/SearchPreferenceActions';

import SelectBox from 'react-select-box';

injectTapEventPlugin();

import addons from 'react/addons'
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const allGenres = ["Adventure", "Animals", "Art and design", "Audiobooks", "Autobiography and memoir", "Ballet", "Biography", "Children and teenagers", "Business and finance", "Chick lit", "Children's books: 7 and under", "Children's fantasy books", "Children's books: 8-12 years", "Classics", "Comics and graphic novels", "Computing and the net", "Craft and hobbies", "Crime fiction", "Disaster fiction", "Dystopian fiction", "Economics", "Fairies", "Fantasy", "Fiction", "Film", "Food and drink", "Friendship", "Funny books", "Health, mind and body", "Historical fiction", "History", "Horror", "House and garden", "Literary criticism", "Music", "Non-fiction", "Paranormal romance", "Philosophy", "Picture books", "Poetry", "Politics", "Reference and languages", "Religion", "Romance", "School", "Sci-fi", "Science and nature", "Science fiction", "Short stories", "Society", "Sport and leisure", "Stage", "Teen books", "Teen romance", "Thrillers", "Travel guides", "Travel writing", "True crime", "TV and radio", "Vampires", "War", "Witches, Wizards and magic"];

export default class Inbox extends Component{
	constructor(props){
		super(props);
		this.onSlide = this.onSlide.bind(this);
		this.showDialog = this.showDialog.bind(this);
		this.toggleSwitch = this.toggleSwitch.bind(this);
		this.navigateToMessage = this.navigateToMessage.bind(this);
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
	      left : '278px',
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
	    },
	    cardHolder : {
	    	float : 'left',
	    	maxWidth : '500px'
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
		console.log(e);
		this.context.router.transitionTo(`message/${e}`);
	}
	render(){
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
		var Colors = {
			darkBlack : '#000',
		}
		var self = this;
		return (
			<ReactCSSTransitionGroup transitionName="example">
				<div>
					<div style={this.Styles.Center}>
						<List subheader="Today">
						<ListItem
						  leftAvatar={<Avatar src="images/ok-128.jpg" />}
						  primaryText="Brendan Lim"
						  secondaryText={
						    <p>
						      <span style={{color: Colors.darkBlack}}>Brunch this weekend?</span><br/>
						      I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
						    </p>
						  }
						  secondaryTextLines={2} onTouchTap={this.navigateToMessage.bind(this, 'asd')}/>
						<ListDivider inset={true} />
						<ListItem
						  leftAvatar={<Avatar src="images/kolage-128.jpg" />}
						  primaryText="me, Scott, Jennifer"
						  secondaryText={
						    <p>
						      <span style={{color: Colors.darkBlack}}>Summer BBQ</span><br/>
						      Wish I could come, but I&apos;m out of town this weekend.
						    </p>
						  }
						  secondaryTextLines={2} />
						<ListDivider inset={true} />
						<ListItem
						  leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
						  primaryText="Grace Ng"
						  secondaryText={
						    <p>
						      <span style={{color: Colors.darkBlack}}>Oui oui</span><br/>
						      Do you have any Paris recs? Have you ever been?
						    </p>
						  }
						  secondaryTextLines={2} />
						<ListDivider inset={true} />
						<ListItem
						  leftAvatar={<Avatar src="images/kerem-128.jpg" />}
						  primaryText="Kerem Suer"
						  secondaryText={
						    <p>
						      <span style={{color: Colors.darkBlack}}>Birthday gift</span><br/>
						      Do you have any ideas what we can get Heidi for her birthday? How about a pony?
						    </p>
						  }
						  secondaryTextLines={2} />
						<ListDivider inset={true} />
						<ListItem
						  leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
						  primaryText="Raquel Parrado"
						  secondaryText={
						    <p>
						      <span style={{color: Colors.darkBlack}}>Recipe to try</span><br/>
						      We should eat this: grated squash. Corn and tomatillo tacos.
						    </p>
						  }
						  secondaryTextLines={2} />
						</List>
					</div>
					// 
				</div>
			</ReactCSSTransitionGroup>
		)
	}
}
// <SelectBox label="Genres" onChange={this.handleMultiChange.bind(this)} value={this.state.colors} multiple="true" >
// 							<option value="red">Red</option>
// 							<option value="green">Green</option>
// 						</SelectBox>


					// <div style={this.Styles.cardHolder}>
					// 	<Card>
					// 		<CardHeader
					// 			title="Title"
					// 			subtitle="Subtitle"
					// 			avatar={<Avatar>A</Avatar>}/>
					// 		<CardHeader
					// 			title="Demo Url Based Avatar"
					// 			subtitle="Subtitle"
					// 			avatar="http://lorempixel.com/100/100/nature/"/>
					// 		<CardMedia overlay={<CardTitle title="Title" subtitle="Subtitle"/>}>
					// 			<img src="http://lorempixel.com/600/337/nature/"/>
					// 		</CardMedia>
					// 		<CardTitle title="Title" subtitle="Subtitle"/>
					// 		<CardActions>
					// 			<FlatButton label="Action1"/>
					// 			<FlatButton label="Action2"/>
					// 		</CardActions>
					// 		<CardText>
					// 			Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					// 			Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
					// 			Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
					// 			Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
					// 		</CardText>
					// 	</Card>
					// </div>