/**
 * Created by phuttipong on 29/4/2559.
 */
import React, {Component, PropTypes} from 'react';
import ContactList from './ContactList';
import SearchBar from './SearchBar';

// Main component. Renders a SearchBar and a ContactList
class ContactsApp extends Component {
    constructor() {
        super();
        this.state = {
            filterText: ''
        };
    }

    handleUserInput(searchText) {
        this.setState({filterText: searchText});
    }

    render() {
        return (
            <div>
                <SearchBar filterText={this.state.filterText} onTextChange={this.handleUserInput.bind(this)}/>
                <ContactList contacts={this.props.contacts}
                             filterText={this.state.filterText}/>
            </div>
        )
    }
}
ContactsApp.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object)
};

export default ContactsApp;