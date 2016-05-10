import React, {Component} from 'react'; //save typing React.Component
import {Link} from 'react-router';

class Home extends Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/top3Trans">Top 3 transactions</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
}

export default Home;
