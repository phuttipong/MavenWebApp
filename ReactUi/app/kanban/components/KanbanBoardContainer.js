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
    
    componentDidMount() {
        CardActionCreator.fetchCards();
    }

    render() {
        let kanbanBoard = this.props.children && React.cloneElement(this.props.children, {
                cards: this.state.cards
            });
        return kanbanBoard;
    }
}

KanbanBoardContainer.getStores = () => ([CardStore]);
KanbanBoardContainer.calculateState = (prevState) => ({
    cards: CardStore.getState()
});
export default Container.create(KanbanBoardContainer);