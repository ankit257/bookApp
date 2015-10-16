import React from 'react';
import { register } from '../AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

var _book = {}
var _bookUsers = []
var _bookStatus = 'NA' // NA, OWN, WISH, LEND, RENT
var _showLoading = true;
const GetBookStore = createStore({
	get(){
		return _book;
	},
	getBookUsers(){
		return _bookUsers
	},
	getStatus(){
		return _bookStatus;
	},
	getLoadingStatus(){
		return _showLoading;
	},
	updateBook(book){
		_book = book;
	},
	updateBookUsers(users){
		_bookUsers = users;
	},
	updateStatus(status){
		_bookStatus = status;
	},
	updateShowLoading(bool){
		_showLoading = bool;
	}
});
GetBookStore.dispathToken = register(action=>{
	const responseData = selectn('response.data', action);
	switch(action.type){
		case 'FETCH_GET_BOOK_INFO_FROM_API':
			GetBookStore.updateShowLoading(true);
			break;
		case 'FETCH_GET_BOOK_INFO_FROM_API_SUCCESS':
			if(responseData){
				var book = selectn('book', responseData);
				var users = selectn('users', responseData);
				GetBookStore.updateBook(book);
				GetBookStore.updateBookUsers(users);
				GetBookStore.updateShowLoading(false);
			}
			break;
	}
	GetBookStore.emitChange();
});

export default GetBookStore;