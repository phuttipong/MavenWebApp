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
    },

    createCard(card) {
        AppDispatcher.dispatchAsync(CardAPI.createCard(card), {
            request: constants.CREATE_CARD,
            success: constants.CREATE_CARD_SUCCESS,
            failure: constants.CREATE_CARD_ERROR
        }, {card});
    },

    updateCard(card, draftCard) {
        AppDispatcher.dispatchAsync(CardAPI.updateCard(card, draftCard), {
            request: constants.UPDATE_CARD,
            success: constants.UPDATE_CARD_SUCCESS,
            failure: constants.UPDATE_CARD_ERROR
        }, {card, draftCard});
    }
};
export default CardActionCreator;