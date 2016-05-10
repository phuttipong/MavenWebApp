export default {
    path: '/top3Trans',

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./blocks/Top3Trans').default);  //since Babel 6 we need to add ".default" after require()
        })
    }
};