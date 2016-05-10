export default {
    path: '/about',

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./blocks/About').default)
        })
    }
};