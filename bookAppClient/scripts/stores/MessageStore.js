import { register } from '../AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import ActionTypes from '../constants/ActionTypes'

const Message = {};

const MessageStore = createStore({
	updateStatus (status){
		Message.status = status;
	},
	getStatus(){
		return Message.status;
	},
	getMessage(){
		return Message;
	},
	reject(){

	},
	accept(){

	},
	delMessage(response){
		delete Message.status;
	}
})
//AuthStore.dispathToken =
register(action => {
	const { type }  = action;
		switch(type){
			case 'SEND_CHAT':
				MessageStore.updateStatus(action.response);
				break;
			case 'REJECT_REQUEST':
				MessageStore.reject(action.response);
				break;
			default:
			case 'ACCEPT_REQUEST':
				MessageStore.accept(action.response);
				break;
		}
		MessageStore.emitChange();
});
export default MessageStore;