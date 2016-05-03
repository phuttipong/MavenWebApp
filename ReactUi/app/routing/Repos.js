/**
 * Created by phuttipong on 3/5/2559.
 */
import React, {Component} from 'react';

import 'whatwg-fetch';
import {Link} from 'react-router';

class Repos extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            repositories: []
        };
    }

    componentDidMount() {
        fetch('https://api.github.com/users/pro-react/repos')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Server response wasn't OK");
                }
            })
            .then((responseData) => {
                this.setState({repositories: responseData});
            })
            .catch((error) => {
                this.props.history.pushState(null, '/error');
            });
    }

    render() {
        let repos = this.state.repositories.map((repo) => (
            <li key={repo.id}>
                <Link to={"/repo/"+repo.name} activeClassName="active">{repo.name}</Link>
            </li>
        ));

        {/* if props.children is not null then add repositories property to it, otherwise return null*/
        }
        let child = this.props.children && React.cloneElement(this.props.children,
                {repositories: this.state.repositories}
            );

        return (
            <div>
                <h1>Github Repos</h1>
                <ul>
                    {repos}
                </ul>
                {child}
            </div>
        );
    }
}
export default Repos;