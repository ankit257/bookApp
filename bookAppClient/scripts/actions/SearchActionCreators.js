import { dispatch, dispatchAsync } from '../AppDispatcher';
// import APIUtils from '../utils/APIUtils';
import ActionTypes from '../constants/ActionTypes';
import { getBooksFromGoogle, getNearByBooksAPI } from '../utils/APIUtils';
// import SearchBookStore from '../stores/SearchBookStore';

export function SearchBookFromGoogleAPI(url, data) {
	dispatchAsync(getBooksFromGoogle(url, data), {
	    request: ActionTypes.FETCH_BOOKS_FROM_API,
	    success: ActionTypes.FETCH_BOOKS_FROM_API_SUCCESS,
	    failure: ActionTypes.FETCH_BOOKS_FROM_API_ERROR
	  }, { data });
}

export function getNearByBooks(url) {
	getGeoLocation.then(function (val) {
		var data = {
			latitude : val['latitude'],
			longitude : val['longitude']
		}
		dispatchAsync(getNearByBooksAPI(url, data), {
		    request: ActionTypes.FETCH_NEARBY_BOOKS_FROM_API,
		    success: ActionTypes.FETCH_NEARBY_BOOKS_FROM_API_SUCCESS,
		    failure: ActionTypes.FETCH_NEARBY_BOOKS_FROM_API_ERROR
	  	}, { data });
	})
}

//Promise Function to Get GeoLocation for coordinates
var getGeoLocation = new Promise(function (resolve, reject) {
	navigator.geolocation.getCurrentPosition(function (position){
		resolve(position.coords);
	})
})