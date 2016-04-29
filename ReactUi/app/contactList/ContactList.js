/**
 * Created by phuttipong on 29/4/2559.
 */
import React, {Component, PropTypes} from 'react';
import ContactItem from './ContactItem';

class ContactList extends Component {
    render() {
        return (
            <ul>
                {this.props.contacts.map(
                    (contact) => <ContactItem key={contact.email}
                                              name={contact.name}
                                              email={contact.email}/>
                )}
            </ul>
        )
    }
}
ContactList.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object)
};

export default ContactList;