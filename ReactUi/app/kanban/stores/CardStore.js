/**
 * Created by phuttipong on 7/5/2559.
 */
import AppDispatcher from '../AppDispatcher';
import constants from '../constants';
import {ReduceStore} from 'flux/utils';
class CardStore extends ReduceStore {
    getInitialState() {
        return [];
    }

    reduce(state, action) {
        switch (action.type) {
            case constants.FETCH_CARDS_SUCCESS:
                return action.payload.response;
            default:
                return state;
        }
    }
}
export default new CardStore(AppDispatcher);