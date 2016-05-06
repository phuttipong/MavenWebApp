/**
 * Created by phuttipong on 6/5/2559.
 */
import {Dispatcher} from 'flux';

class AppDispatcher extends Dispatcher {
    dispatch(action = {}) {
        console.log("Dispatched", action);
        super.dispatch(action);
    }
}

export default new AppDispatcher();