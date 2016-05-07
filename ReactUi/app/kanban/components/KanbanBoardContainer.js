/**
 * Created by phuttipong on 30/4/2559.
 */
import React, {Component} from 'react'; //save typing React.Component
import {Container} from '../../../../Flux/node_modules/flux/utils';

import 'whatwg-fetch';
import update from 'react-addons-update';//support update()
import 'babel-polyfill'; //support find() and findIndex()

import CardStore from './../stores/CardStore';
import CardActionCreator from './../actions/CardActionCreator';

class KanbanBoardContainer extends Component {

    addCard(card) {
        // Keep a reference to the original state prior to the mutations
        // in case we need to revert the optimistic changes in the UI
        let prevState = this.state;
        // Add a temporary ID to the card
        if (card.id === null) {
            let card = Object.assign({}, card, {id: Date.now()});
        }
        // Create a new object and push the new card to the array of cards
        let nextState = update(this.state.cards, {$push: [card]});
        // set the component state to the mutated object
        this.setState({cards: nextState});
        // Call the API to add the card on the server
        fetch(`${API_URL}/cards`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(card)
        }).then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    // Throw an error if server response wasn't 'ok'
                    // so we can revert back the optimistic changes
                    // made to the UI.
                    throw new Error("Server response wasn't OK")
                }
            })
            .then((responseData) => {
                // When the server returns the definitive ID
                // used for the new Card on the server, update it on React
                card.id = responseData.id;
                this.setState({cards: nextState});
            })
            .catch((error) => {
                this.setState(prevState);
            });
    }

    updateCard(card) {
        // Keep a reference to the original state prior to the mutations
        // in case we need to revert the optimistic changes in the UI
        let prevState = this.state;
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((c)=>c.id == card.id);
        // Using the $set command, we will change the whole card
        let nextState = update(
            this.state.cards, {
                [cardIndex]: {$set: card}
            });
        // set the component state to the mutated object
        this.setState({cards: nextState});
        // Call the API to update the card on the server
        fetch(`${API_URL}/cards/${card.id}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(card)
        })
            .then((response) => {
                if (!response.ok) {
                    // Throw an error if server response wasn't 'ok'
                    // so we can revert back the optimistic changes
                    // made to the UI.
                    throw new Error("Server response wasn't OK")
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                this.setState(prevState);
            });
    }

    componentDidMount() {
        CardActionCreator.fetchCards();
    }

    render() {
        let kanbanBoard = this.props.children && React.cloneElement(this.props.children, {
                cards: this.state.cards,
                cardCallbacks: {
                    addCard: this.addCard.bind(this),
                    updateCard: this.updateCard.bind(this)
                }
            });
        return kanbanBoard;
    }
}

KanbanBoardContainer.getStores = () => ([CardStore]);
KanbanBoardContainer.calculateState = (prevState) => ({
    cards: CardStore.getState()
});
export default Container.create(KanbanBoardContainer);