/**
 * Created by Home on 9/5/2559.
 */
export default  {
    path: '/about',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/About').default)
        })
    }
}