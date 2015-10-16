import React from 'react';
import { register } from '../AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import { getDistanceFromLatLonInKm } from '../utils/HelperUtils';;
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
const NearByBookStore = createStore({
	get(){
		return _books;
	},
	updateBooks(booksArr, position){
		for (var i = 0; i < booksArr.length; i++) {
			var title 	= selectn('book.title', booksArr[i]);
			var image 	= selectn('book.image', booksArr[i]);
			var author 	= selectn('book.author', booksArr[i]);
			var id 		= selectn('book.id', booksArr[i]);
			var distance = getDistanceFromLatLonInKm(booksArr[i].users[0].loc[0], booksArr[i].users[0].loc[1], position['latitude'], position['longitude'])
			var book = {
				id 			: id,
				title 		: title,
				image 		: image,
				author 		: author,
				distance 	: distance
			}
			_books[book.id] = book;
		}
	},
	updateEndOfResultsOption(showLoading, endOfResults){
		endOfResultsOptions['showLoading'] = showLoading;
		endOfResultsOptions['endOfResults'] = endOfResults;
	},
	updateSrchData(pageNo){
		srchData['pageNo'] = pageNo;
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
	cleanBookList(){
		for(var key in _books){
			delete _books[key];
		}
	}
});
NearByBookStore.dispathToken = register(action=>{
	const responseBook = selectn('response.data', action);
	switch(action.type){
		case 'FETCH_NEARBY_BOOKS_FROM_API':
			NearByBookStore.updateEndOfResultsOption(true, false)
			NearByBookStore.emitChange();
			break;
		case 'FETCH_NEARBY_BOOKS_FROM_API_SUCCESS':
			if(responseBook){
				var showLoading = false;
				var endOfResults = false;
				NearByBookStore.updateEndOfResultsOption(showLoading, endOfResults)
				// NearByBookStore.updateSrchData(pageNo, srchString);
				getGeoLocation.then(function (val){
					var position = {
						latitude : val['latitude'],
						longitude : val['longitude']
					}
					NearByBookStore.updateBooks(responseBook, position);
					if(!responseBook || responseBook.length < 20){
						NearByBookStore.updateEndOfResultsOption(false, true)
					}
					NearByBookStore.emitChange()
				})
			}
			break;
	}
	
});
//Promise Function to Get GeoLocation for coordinates
var getGeoLocation = new Promise(function (resolve, reject) {
	navigator.geolocation.getCurrentPosition(function (position){
		resolve(position.coords);
	})
})
// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2-lat1);  // deg2rad below
//   var dLon = deg2rad(lon2-lon1); 
//   var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   var d = R * c; // Distance in km
//   return d;
// }

// function deg2rad(deg) {
//   return deg * (Math.PI/180)
// }
export default NearByBookStore;