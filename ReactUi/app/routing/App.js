/**
 * Created by phuttipong on 3/5/2559.
 */
import React, {Component} from 'react';
import {render} from 'react-dom';

// first we import some components
import {Router, Route, IndexRoute, Link} from 'react-router';

import About from './About';
import Home from './Home';
import Repos from './Repos';
import RepoDetails from './RepoDetails';
import ServerError from './ServerError';

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
                {this.props.children}
            </div>
        )
    }
}

render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="about" component={About}/>
            <Route path="repos" component={Repos}>
                {/* Add the route, nested where we want the UI to nest */}
                <Route path="/repo/:repo_name" component={RepoDetails}/>
            </Route>
            <Route path="error" component={ServerError}/>
        </Route>
    </Router>
), document.getElementById('root'));