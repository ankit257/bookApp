import { dispatch, dispatchAsync } from '../AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthStore from '../stores/AuthStore';

import { loginUser } from '../utils/APIUtils';

window.fbAsyncInit = function(){
			//initialize FB Object
			FB.init({
				appId : "440773049460625",
				cookie : true,
				xfbml : true,
				version : "v2.1"
			});
			FB.getLoginStatus(function (response) {
				if(response.status == 'connected'){
					FB.api('/me', {fields: ['first_name', 'last_name', 'picture', 'email']}, function(data){
						dispatch(ActionTypes.LOGGED_IN_WITH_FB, {data});
					})
				}
			});
		}
export function LoginWithFB(){
	FB.getLoginStatus(function (response) {
		if(response.status == 'connected'){
			statusChangeCallback(response);
		}else{
			FB.login(function (response) {
				statusChangeCallback(response);
			}, { scope: 'email' });
		}
	});
}
export function checkLoginWithFB(){
	console.log(FB.getLoginStatus);
	FB.getLoginStatus(function (response) {
		if(response.status == 'connected'){
			dispatch(ActionTypes.LOGGED_IN_WITH_FB, {response});
		}
	});
}
export function checkLoginState() {
	FB.getLoginStatus(function (response){
		statusChangeCallback(response)
	});
}
export function statusChangeCallback(response){
	if(response.status == 'connected'){
		FB.api('/me', {fields: ['first_name', 'last_name', 'picture', 'email']}, function(response){
			// dispatch(ActionTypes.LOGGED_IN_WITH_FB, {response});
			addUpdateDb(response);
		})
	}
	//dispatch(ActionTypes.LOGGED_IN_WITH_FB, response);
}
export function addUpdateDb (data) {
	var url = '/login';
	data['username'] = 'username'; //Fake It
	data['password'] = 'password'; //Fake It
	getGeoLocation.then(function (val) {
		data['position'] = {
			latitude : val['latitude'],
			longitude : val['longitude']
		}
		dispatchAsync(loginUser(url, data), {
		    request: ActionTypes.LOGIN_REQUEST,
		    success: ActionTypes.LOGGED_IN_WITH_FB,
		    failure: ActionTypes.LOGGED_IN_WITH_FB_ERROR
		}, { data });
	})
	// dispatch(ActionTypes.LOGGED_IN_WITH_FB, {response});
}
export function LogOut() {
	FB.logout(function (response) {
		dispatch(ActionTypes.LOGGED_OUT, {response} );
	});
	
}
//Promise Function to Get GeoLocation for coordinates
var getGeoLocation = new Promise(function (resolve, reject) {
	navigator.geolocation.getCurrentPosition(function (position){
		resolve(position.coords);
	})
})