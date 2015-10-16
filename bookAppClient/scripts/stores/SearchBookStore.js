import React from 'react';
import { register } from '../AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const listBooks = [] // For Pagination, e.g. say In one Chuck  10 books are loaded
const _books = {}
const srchData = {
	pageNo : 1,
	srchString : ''
}
const endOfResultsOptions = {
	showLoading : false,
	endOfResults : false,
}
const SearchBookStore = createStore({
	get(){
		return _books;
	},
	// updateBooksFromGoogle(books){
	// 	this.cleanBookList();
	// 	var x = (Object.keys(books)).length;
	// 	if(x == 0){
	// 		n = 40
	// 	}else{
	// 		var n = Math.min(20, books.length);	
	// 	}
	// 	for(var i = 0; i < n; i++){
	// 		var id = books[i]['id'];
	// 		_books[id] = books[i]['volumeInfo'];
	// 	}
	// },
	updateBooksFromGR(books){
		if(this.getPageNo() == 1){
			this.cleanBookList()	
		}
		for (var i = books.length - 1; i >= 0; i--) {
			var id = books[i]['best_book']['id']['$t'];
			var book = {
				title : books[i]['best_book']['title'],
				image : books[i]['best_book']['image_url'],
				rating : books[i]['best_book']['average_rating'],
				author : books[i]['best_book']['author']['name'],
			}
			_books[id] = book;
		}
	},
	updateEndOfResultsOption(showLoading, endOfResults){
		endOfResultsOptions['showLoading'] = showLoading;
		endOfResultsOptions['endOfResults'] = endOfResults;
	},
	updateSrchData(pageNo, string){
		srchData['pageNo'] = pageNo;
		srchData['srchString'] = string;
	},
	showLoading(){
		return endOfResultsOptions['showLoading'];
	},
	endOfResults(){
		return endOfResultsOptions['endOfResults'];
	},
	getPageNo(){
		return srchData['pageNo'];
	},
	getSrchString(){
		return srchData['srchString'];
	},
	cleanBookList(){
		for(var key in _books){
			delete _books[key];
		}
	}
});
SearchBookStore.dispathToken = register(action=>{
	const responseBook = selectn('response.data', action);
	switch(action.type){
		case 'FETCH_BOOKS_FROM_API':
			SearchBookStore.updateEndOfResultsOption(true, false)
			break;
		case 'FETCH_BOOKS_FROM_API_SUCCESS':
			if(responseBook){
				var showLoading = false;
				var endOfResults = false
				var responseBookObj = JSON.parse(responseBook);
				var resultsBook = responseBookObj.GoodreadsResponse.search.results.work;
				var pageNo = Math.floor(responseBookObj.GoodreadsResponse.search['results-end']/20);
				var srchString = responseBookObj.GoodreadsResponse.search.query;
				if(responseBookObj.GoodreadsResponse.search['results-end'] == responseBookObj.GoodreadsResponse.search['total-results']){
					endOfResults = true;
				}
				SearchBookStore.updateEndOfResultsOption(showLoading, endOfResults)
				SearchBookStore.updateSrchData(pageNo, srchString);
				SearchBookStore.updateBooksFromGR(resultsBook);
			}
			break;
	}
	SearchBookStore.emitChange();
});

export default SearchBookStore;