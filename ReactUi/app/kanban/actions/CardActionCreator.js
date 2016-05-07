/**
 * Created by phuttipong on 7/5/2559.
 */
import AppDispatcher from '../AppDispatcher';
import constants from '../constants';
import CardAPI from '../api/CardAPI';
let CardActionCreator = {
    fetchCards() {
        AppDispatcher.dispatchAsync(CardAPI.fetchCards(), {
            request: constants.FETCH_CARDS,
            success: constants.FETCH_CARDS_SUCCESS,
            failure: constants.FETCH_CARDS_ERROR
        });
    }
};
export default CardActionCreator;