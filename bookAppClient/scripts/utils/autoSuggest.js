import React, { Component, PropTypes, findDOMNode } from 'react';
import _ from 'underscore';
import router, { Navigation }  from 'react-router';

class AutocompleteItem extends React.Component{
  defaultProps = {
      value: null, label: null, 
      onItemClick: function(){}, 
      onItemMouseOver: function(){}, 
      onItemMouseLeave: function(){}
  }
  constructor(props) {
        super(props);
        this.state = {
            hover: false
        }
      }
  _onClick(){
    if (this.props.selectAllTextOnClick){
      this.props.onItemClick(this.props);      
    }
  }
  _onMouseOver(){
    this.props.onItemMouseOver(this.props);
  }
  render(){
    return <li 
      style={{backgroundColor: this.props.highlighted? 'hsl(90,50%,50%)':'', zIndex: 9999}}
      onMouseDown={this._onClick.bind(this)} onMouseOver={this._onMouseOver.bind(this)}>{this.props.label}
    </li>;
  }
}

export default  class Autocomplete extends Component{
  static defaultProps = {
    defaultValue: 2,
      limitToList: true,
      maxItemsShown: 8,
      sourceUrl: null,
      defaultList: [
        { value: 1, label: 'apple' },
        { value: 2, label: 'banana' },
        { value: 3, label: 'orange' },
        { value: 4, label: 'grape' } ,
        { value: 5, label: 'cherry' } ,
        { value: 6, label: 'orange' } ,
        { value: 7, label: 'watermelon' }
      ],
      alsoSearchValues: false,
      loadUrlOnce: true,
      selectAllTextOnClick: true,
      onNoMatch: function(){}
  }
  static contextTypes = {
    router: PropTypes.func.isRequired
  }

  constructor(props) {
        super(props);
        this.state = {
            list: this._loadList(this.props.defaultList),
            currentValue: this.props.defaultValue,
            highlightedValue: this.props.defaultValue,
            showItems: false,
            isComponentMounted : false
        }
      }
  _loadList(listToLoad){
    if (!listToLoad || listToLoad.length === 0){
      this.setState({ list: [] });
    }
    var newList = listToLoad;
    newList.forEach(function(item){
      if (!item.hasOwnProperty('label')){
        item.label = item.value;      
      }
      if (!item.hasOwnProperty('value')){
        item.value = item.label;         
      }
    });
    return newList;
  }
  _renderMatches(){
    return this._currentMatches()
      .map(function(item, i){
        return <AutocompleteItem highlighted={item.value === this.state.highlightedValue}
          key={i} label={item.label} value={item.value} 
          selectAllTextOnClick={this.props.selectAllTextOnClick}
          onItemClick={this._onItemClick.bind(this)}
          onItemMouseOver = {this._onItemMouseOver.bind(this)} />
      }.bind(this));
  }
  _currentMatches(){
    return _((this.state.list)
      .filter(function(item){
        return item.label.indexOf(this._input()) > -1;
      }.bind(this)))
      .value();    
  }
  _highlightedIndex(){
    return _(this._currentMatches())
      .findIndex(function(item){
        return item.value === this.state.highlightedValue;
      }, this);
  }
  _updateHighlightedValue(){
    var newValue;
    if (this._highlightedIndex() < 0){
      newValue = this.state.list[0].value;
    } else {
      newValue = this.state.list[this._.highlightedIndex()];
    }
    this.setState({ highlightedValue: newValue });
  }
  componentDidMount(){
    this.setState({isComponentMounted : true});
    this._setInputFromValue();
    document.onkeydown = function(e){
      switch (e.keyCode){
        case 13: // enter
          this._setInputFromValue();
          break;
        case 9: // tab
          this._setFromHighlighted();
          break;
        case 27: // escape
          break;
        case 38: // up
          var hIndex = this._highlightedIndex();
          if (hIndex > 0){
            this.setState({
              highlightedValue: this._currentMatches()[hIndex - 1].value
            });
          }
          break;
        case 40: // down
          var hIndex = this._highlightedIndex();
          if (hIndex < this._currentMatches().length - 1){
            this.setState({
              highlightedValue: this._currentMatches()[hIndex + 1].value
            });   
          }
          break;
      }
    }.bind(this);
  }
  componentWillUnmount(){
    this.setState({isComponentMounted : false});
  }
  _setInputFromValue(){
    if (!this.state.isComponentMounted){
      return;
    }
    findDOMNode(this.refs.input).value = 
      _(this.state.list)
      .findWhere({ value: this.state.currentValue })
      .label;
  }
  _setValueFromInput(){
    if (!this.state.isComponentMounted){
      return;
    }
    var inputText = findDOMNode(this.refs.input).value;
    var foundItem =
      _(this.state.list)
      .find(function(item){
        return item.label.indexOf(inputText) > -1;
      });
    if (typeof foundItem !== 'undefined'){
      this.setState({
        currentValue: foundItem.value, highlightedValue: foundItem.value
      });
    }else{
      this.props.onNoMatch(this.state);
      if (this.props.limitToList){
        this.setState({
          currentValue: this.props.defaultValue, highlightedValue: this.props.defaultValue
        });
      }
    }     
  }
  _setFromHighlighted(){
    this.setState({
      currentValue: this.state.highlightedValue
    }, function(){
      this._setInputFromValue();
    }.bind(this));
  }
  _input(){
    if (!this.state.isComponentMounted){
      return '';
    }
    return findDOMNode(this.refs.input).value;
  }
  _onChange(){
    this._setValueFromInput();
  }
  _onFocus(){
    this.setState({ showItems: true });
  }
  _onBlur(){
    this._setFromHighlighted();
    this.setState({ showItems: false });
  }
  _onItemClick(item){
    this.context.router.transitionTo(`/addbook/${item.label}`);
    this.setState({
      currentValue: item.value
    }, function(){
      this._setInputFromValue();
    }.bind(this));
  }
  _onItemMouseOver(item){
    this.setState({ highlightedValue: item.value });
  }
  _onMouseLeave(item){
    this.setState({ highlightedValue: this.state.currentValue });
  }
  _onInputClick(){
    findDOMNode(this.refs.input).select();
  }
  render(){ 
    return <div>
      <input
        ref='input' 
        onChange={this._onChange.bind(this)} onFocus={this._onFocus.bind(this)} onBlur={this._onBlur.bind(this)} onClick={this._onInputClick.bind(this)}
         />
      {this.state.currentValue}<br/>
      {this.state.showItems?
         <ol style={{position: 'absolute', backgroundColor:'white', color:'black', listStyle: 'none', padding: 0, margin: 0}}
            onMouseLeave={this._onMouseLeave.bind(this)}>
           {this._renderMatches()}
         </ol>:
         null}
      {this._highlightedIndex()}
    </div>;
  }
}
