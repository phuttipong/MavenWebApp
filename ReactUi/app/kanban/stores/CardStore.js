/**
 * Created by phuttipong on 7/5/2559.
 */
import AppDispatcher from '../AppDispatcher';
import constants from '../constants';
import {ReduceStore} from 'flux/utils';
import update from 'react-addons-update';
import 'babel-polyfill';

class CardStore extends ReduceStore {
    getInitialState() {
        return [];
    }

    getCard(id) {
        return this._state.find((card)=>card.id == id);
    }

    getCardIndex(id) {
        return this._state.findIndex((card)=>card.id == id);
    }

    reduce(state, action) {
        let cardIndex, taskIndex;

        switch (action.type) {
            case constants.FETCH_CARDS_SUCCESS:
                return action.payload.response;

            case constants.CREATE_TASK:
                cardIndex = this.getCardIndex(action.payload.cardId);
                return update(this.getState(), {
                    [cardIndex]: {
                        tasks: {$push: [action.payload.task]}
                    }
                });

            case constants.CREATE_TASK_SUCCESS:
                cardIndex = this.getCardIndex(action.payload.cardId);
                taskIndex = this.getState()[cardIndex].tasks.findIndex((task)=>(
                    task.id == action.payload.task.id
                ));
                return update(this.getState(), {
                    [cardIndex]: {
                        tasks: {
                            [taskIndex]: {
                                id: {$set: action.payload.response.id}
                            }
                        }
                    }
                });
            case constants.CREATE_TASK_ERROR:
                cardIndex = this.getCardIndex(action.payload.cardId);
                taskIndex = this.getState()[cardIndex].tasks.findIndex((task)=>(
                    task.id == action.payload.task.id
                ));
                return update(this.getState(), {
                    [cardIndex]: {
                        tasks: {
                            $splice: [[taskIndex, 1]]//remove 1 item from array start at taskIndex
                        }
                    }
                });
            case constants.DELETE_TASK:
                cardIndex = this.getCardIndex(action.payload.cardId);
                taskIndex = this.getState()[cardIndex].tasks.findIndex((task)=>(
                    task.id == action.payload.task.id
                ));
                return update(this.getState(), {
                    [cardIndex]: {
                        tasks: {
                            $splice: [[taskIndex, 1]]//remove 1 item from array start at taskIndex
                        }
                    }
                });
            case constants.DELETE_TASK_ERROR:
                cardIndex = this.getCardIndex(action.payload.cardId);
                return update(this.getState(), {
                    [cardIndex]: {
                        tasks: {$splice: [[action.payload.taskIndex, 0, action.payload.task]]}//remove 0 item start at taskIndex then insert new task.
                    }
                });

            case constants.TOGGLE_TASK:
                cardIndex = this.getCardIndex(action.payload.cardId);
                return update(this.getState(), {
                    [cardIndex]: {
                        tasks: {
                            [action.payload.taskIndex]: {done: {$apply: (done) => !done}}
                        }
                    }
                });
            case constants.TOGGLE_TASK_ERROR:
                cardIndex = this.getCardIndex(action.payload.cardId);
                return update(this.getState(), {
                    [cardIndex]: {
                        tasks: {
                            [action.payload.taskIndex]: {done: {$apply: (done) => !done}}
                        }
                    }
                });

            case constants.UPDATE_CARD:
                cardIndex = this.getCardIndex(action.payload.card.id);
                return update(this.getState(), {
                    [cardIndex]: {
                        $set: action.payload.draftCard
                    }
                });

            case constants.UPDATE_CARD_ERROR:
                cardIndex = this.getCardIndex(action.payload.card.id);
                return update(this.getState(), {
                    [cardIndex]: {
                        $set: action.payload.card
                    }
                });

            case constants.CREATE_CARD:
                return update(this.getState(), {$push: [action.payload.card]});

            case constants.CREATE_CARD_SUCCESS:
                cardIndex = this.getCardIndex(action.payload.card.id);
                return update(this.getState(), {
                    [cardIndex]: {
                        id: {$set: action.payload.response.id}
                    }
                });

            case constants.CREATE_CARD_ERROR:
                cardIndex = this.getCardIndex(action.payload.card.id);
                return update(this.getState(), {
                    $splice: [[taskIndex, 1]]//remove 1 item from array start at taskIndex
                });

            default:
                return state;
        }
    }
}
export default new CardStore(AppDispatcher);