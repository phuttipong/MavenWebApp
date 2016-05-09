/**
 * Created by Home on 9/5/2559.
 */
import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory} from 'react-router';


const rootRoute = {
    path: '/',
    component: require('./components/App').default,
    childRoutes: [
        require('./routes/About').default,
        require('./routes/Repos').default,
        require('./routes/ServerError').default
    ]
};

render(
    <Router history={hashHistory} routes={rootRoute}/>,
    document.getElementById('root')
);