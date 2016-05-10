import React from 'react'; //save typing React.Component
import {render} from 'react-dom'; //save typing ReactDom.render
import {Router, hashHistory} from 'react-router';

const rootRoute = {
    path: '/',
    component: require('./blocks/App').default, //since Babel 6 we need to add ".default" after require()
    childRoutes: [  //?? can not use getChildRoutes
        require('./pages/about').default,
        require('./pages/services').default,
        require('./pages/top3-trans').default
    ]
};

render(
    <Router history={hashHistory} routes={rootRoute}/>,
    document.getElementById('root')
);
