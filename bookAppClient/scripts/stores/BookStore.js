import React from 'react';
import { register } from '../AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const listBooks = [] // For Pagination, e.g. say In one Chuck  10 books are loaded
const _books = {}

const BookStore = createStore({
	getList(i){

	},
	removeBook (id) {
		// body...
	},
	updateReviews(id){
		
	}
});

BookStore.dispathToken = register(action=>{
	const responseBook = selectn('response.entities.users', action);
	if(responseBook){
		//
	}
	BookStore.emitChange();

	
})