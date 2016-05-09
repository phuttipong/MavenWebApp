/**
 * Created by Home on 9/5/2559.
 */
export default {
    path: '/repos',

    childRoutes: [
        {
            path: '/repo/:repo_name',
            component: require('./components/RepoDetails').default
        }
    ],

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Repos').default)
        })
    }
}