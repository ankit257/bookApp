import React from 'react';
import { register } from '../AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

var _book = {}
var _bookStatus = 'NA' // NA, OWN, WISH, LEND, RENT
var _showLoading = true;
const AddBookStore = createStore({
	get(){
		return _book;
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
	updateStatus(status){
		_bookStatus = status;
	},
	updateShowLoading(bool){
		_showLoading = bool;
	}
});
AddBookStore.dispathToken = register(action=>{
	
	const responseData = selectn('response.data', action);
	// console.log(responseBook);
	switch(action.type){
		case 'FETCH_BOOK_INFO_FROM_API':
			AddBookStore.updateShowLoading(true);
			break;
		case 'FETCH_BOOK_INFO_FROM_API_SUCCESS':
			if(responseData){
				var book = selectn('GoodreadsResponse.book', JSON.parse(responseData));
				var status = selectn('response.status', action);
				AddBookStore.updateShowLoading(false)
				AddBookStore.updateBook(book);
				AddBookStore.updateStatus(status);
			}
			break;
		case 'FETCH_BOOK_UPDATE_FROM_API_SUCCESS':
			console.log(action)
			if(responseData){
				console.log(responseData)
				AddBookStore.updateStatus(responseData.status);
			}
	}
	AddBookStore.emitChange();
});

export default AddBookStore;