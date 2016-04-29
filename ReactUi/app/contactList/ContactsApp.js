/**
 * Created by phuttipong on 29/4/2559.
 */
import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import ContactList from './ContactList';
import SearchBar from './SearchBar';

// Main component. Renders a SearchBar and a ContactList
class ContactsApp extends Component {
    render() {
        return (
            <div>
                <SearchBar />
                <ContactList contacts={this.props.contacts}/>
            </div>
        )
    }
}
ContactsApp.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object)
};


let contacts = [
    {name: "Cassio Zen", email: "cassiozen@gmail.com"},
    {name: "Dan Abramov", email: "gaearon@somewhere.com"},
    {name: "Pete Hunt", email: "floydophone@somewhere.com"},
    {name: "Paul O’Shannessy", email: "zpao@somewhere.com"},
    {name: "Ryan Florence", email: "rpflorence@somewhere.com"},
    {name: "Sebastian Markbage", email: "sebmarkbage@here.com"},
];

render(<ContactsApp contacts={contacts}/>, document.getElementById('root'));