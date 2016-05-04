/*
 * Created by phuttipong on 28/4/2559.
 */
import React, {Component, PropTypes} from 'react';
import CheckList from './CheckList';
import marked from 'marked';
import {Link} from 'react-router';

class Card extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showDetails: false
        };
    }

    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails})
    }

    render() {
        let cardDetails;
        if (this.state.showDetails) {
            cardDetails = (
                <div className="card__details">
                    <span dangerouslySetInnerHTML={{__html:marked(this.props.description)}}/>
                    <CheckList cardId={this.props.id}
                               tasks={this.props.tasks}
                               taskCallbacks={this.props.taskCallbacks}/>
                </div>
            );
        }

        let sideColor = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color
        };

        return (
            <div className="card">
                <div style={sideColor}></div>
                <div className="card__edit"><Link to={'/edit/'+this.props.id}>&#9998;</Link></div>
                <div className={this.state.showDetails? "card__title card__title--is-open" : "card__title"}
                     onClick={this.toggleDetails.bind(this)}>
                    {" "}
                    {this.props.title}
                </div>
                {cardDetails}
            </div>
        );
    }
}

Card.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object
};

export default Card;