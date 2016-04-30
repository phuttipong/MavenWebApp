/**
 * Created by phuttipong on 29/4/2559.
 */
import React, {Component, PropTypes} from 'react';
class SearchBar extends Component {

    handleChange(event) {
        this.props.onTextChange(event.target.value);
    }

    render() {
        return <input type="search"
                      placeholder="search"
                      value={this.props.filterText}
                      onChange={this.handleChange.bind(this)}/>
    }
}
// Don't forget to add the new propType requirements
SearchBar.propTypes = {
    filterText: PropTypes.string.isRequired,
    onTextChange: PropTypes.func.isRequired
};
export default SearchBar;