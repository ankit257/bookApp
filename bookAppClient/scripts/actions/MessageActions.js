import { dispatch, dispatchAsync } from '../AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import MessageStore from '../stores/MessageStore';


export function AcceptRequet(id){
	//call API
	// console.log(id) // response = {}
	// dispatch(ActionTypes.ACCEPT_REQUEST, {response} );
}
export function RejectRequest(id) {
	console.log(id);
	// dispatch(ActionTypes.REJECT_REQUEST, {response} );
}
export function SendMessage(id, user, text) {
	console.log(id);
	console.log(user);
	console.log(text);
	// response = {success : true}
	// dispatch(ActionTypes.SEND_CHAT, {chatObject} );
}
export function retrieveMessage() {
	// body...
}
export function RequestReview(id, user, text) {
	console.log(id);
	console.log(user);
	console.log(text);
	// dispatch(ActionTypes.SEND_CHAT, {chatObject} );
}
