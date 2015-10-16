import { dispatch, dispatchAsync } from '../AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import { getBookFromGRAPI, updateBookStatus, addEditBookAPI, getBookInfoAPI }  from '../utils/APIUtils';
import { getGeoLocation }  from '../utils/HelperUtils';

export function getBookFromGR(url, data) {
	dispatchAsync(getBookFromGRAPI(url, data), {
	    request: ActionTypes.FETCH_BOOK_INFO_FROM_API,
	    success: ActionTypes.FETCH_BOOK_INFO_FROM_API_SUCCESS,
	    failure: ActionTypes.FETCH_BOOK_INFO_FROM_API_ERROR
	}, {data});
}
export function getBookInfo(url, data) {
	getGeoLocation.then(function (val) {
		data['coordinates'] = [val['longitude'], val['latitude']];
		coordinates = data['coordinates'];
		dispatchAsync(getBookInfoAPI(url, data), {
		    request: ActionTypes.FETCH_GET_BOOK_INFO_FROM_API,
		    success: ActionTypes.FETCH_GET_BOOK_INFO_FROM_API_SUCCESS,
		    failure: ActionTypes.FETCH_GET_BOOK_INFO_FROM_API_ERROR
		}, {data});
	})
}

export function updateBookStatusAPI(action) {
	dispatchAsync(updateBookStatusAPI(url, data), {
	    request: ActionTypes.FETCH_BOOK_INFO_FROM_API,
	    success: ActionTypes.FETCH_BOOK_INFO_FROM_API_SUCCESS,
	    failure: ActionTypes.FETCH_BOOK_INFO_FROM_API_ERROR
	}, {data});
}
export function addBookAPI(url, data){
	dispatchAsync(addEditBookAPI(url, data), {
	    request: ActionTypes.FETCH_BOOK_UPDATE_FROM_API,
	    success: ActionTypes.FETCH_BOOK_UPDATE_FROM_API_SUCCESS,
	    failure: ActionTypes.FETCH_BOOK_UPDATE_FROM_API_ERROR
	}, {data});	
}

export function getBookInfoFromGoogleAPIWithISBN(){
	dispatchAsync(getBookFromGoogleAPI(url, data), {
	    request: ActionTypes.FETCH_GET_BOOK_INFO_FROM_GOOGLE_API_WITH_ISBN,
	    success: ActionTypes.FETCH_GET_BOOK_INFO_FROM_GOOGLE_API_WITH_ISBN_SUCCESS,
	    failure: ActionTypes.FETCH_GET_BOOK_INFO_FROM_GOOGLE_API_WITH_ISBN_ERROR
	}, {data});	


}