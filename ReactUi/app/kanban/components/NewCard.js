/**
 * Created by phuttipong on 3/5/2559.
 */
import React, {Component, PropTypes} from 'react';
import CardForm from './CardForm'
import CardActionCreator from '../actions/CardActionCreator';

class NewCard extends Component {

    //setting the state in this phase will not trigger a re-rendering.
    componentWillMount() {
        this.setState({
            id: Date.now(),
            title: '',
            description: '',
            status: 'todo',
            color: '#c9c9c9',
            tasks: []
        });
    }

    handleChange(field, value) {
        this.setState({[field]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        CardActionCreator.createCard(this.state);
        this.props.history.pushState(null, '/');
    }

    handleClose(e) {
        this.props.history.pushState(null, '/');
    }

    render() {
        return (
            <CardForm draftCard={this.state}
                      buttonLabel="Create Card"
                      handleChange={this.handleChange.bind(this)}
                      handleSubmit={this.handleSubmit.bind(this)}
                      handleClose={this.handleClose.bind(this)}/>
        );
    }
}

export default NewCard;