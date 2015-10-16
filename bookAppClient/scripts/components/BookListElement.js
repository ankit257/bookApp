import React, { Component, PropTypes, fimdDOMNode } from 'react';

export default class BookListElement{
	static propTypes = {
		params : PropTypes.shape({
			id : PropTypes.String,
			name : PropTypes.String,
		})
	}
	static contextTypes = {
		router : PropTypes.func.isRequired
	}
	return (<div></div>)
}