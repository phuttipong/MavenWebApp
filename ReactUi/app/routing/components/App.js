/**
 * Created by phuttipong on 3/5/2559.
 */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';

import Home from './Home';

class App extends Component {
    render() {
        return (
            <div>
                <header>App</header>
                <menu>
                    <ul>
                        <li><Link to="/about" activeClassName="active">About</Link></li>
                        <li><Link to="/repos" activeClassName="active">Repos</Link></li>
                    </ul>
                </menu>
                {this.props.children || <Home/>}
            </div>
        )
    }
}

export default App;

