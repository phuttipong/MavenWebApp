/*
 * Created by phuttipong on 28/4/2559.
 */
import React, {Component, PropTypes} from 'react';
import List from './List';
import {Link} from 'react-router';

class KanbanBoard extends Component {
    render() {
        let cardModal = this.props.children && React.cloneElement(this.props.children, {
                cards: this.props.cards,
                cardCallbacks: this.props.cardCallbacks
            });

        return (
            <div className="app">
                <Link to='/new' className="float-button">+</Link>
                <List id='todo' title="To Do"
                      cards={this.props.cards.filter((card) => card.status === "todo")}
                      taskCallbacks={this.props.taskCallbacks}/>
                <List id='in-progress' title="In Progress"
                      cards={this.props.cards.filter((card) => card.status === "in-progress")}
                      taskCallbacks={this.props.taskCallbacks}
                />
                <List id='done' title='Done'
                      cards={this.props.cards.filter((card) => card.status === "done")}
                      taskCallbacks={this.props.taskCallbacks}
                />
                {cardModal}
            </div>
        );
    }
}

//  Help in debug process by throw WARNING message to browser console.
KanbanBoard.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object
};

export default KanbanBoard;