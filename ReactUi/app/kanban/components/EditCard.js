/**
 * Created by phuttipong on 3/5/2559.
 */
import React, {Component, PropTypes} from 'react';
import CardForm from './CardForm';
import CardActionCreator from '../actions/CardActionCreator';
import CardStore from '../stores/CardStore';

class EditCard extends Component {

    componentWillMount() {
        let card = CardStore.getCard(parseInt(this.props.params.card_id));
        this.setState(card);
    }

    handleChange(field, value) {
        this.setState({[field]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        CardActionCreator.updateCard(CardStore.getCard(parseInt(this.props.params.card_id)), this.state);
        this.props.history.pushState(null, '/');
    }

    handleClose(e) {
        this.props.history.pushState(null, '/');
    }

    render() {
        return (
            <CardForm draftCard={this.state}
                      buttonLabel="Edit Card"
                      handleChange={this.handleChange.bind(this)}
                      handleSubmit={this.handleSubmit.bind(this)}
                      handleClose={this.handleClose.bind(this)}/>
        )
    }
}

export default EditCard;