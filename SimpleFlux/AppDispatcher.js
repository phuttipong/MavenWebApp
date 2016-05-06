/**
 * Created by phuttipong on 4/5/2559.
 * your AppDispatcher file could be as simple as just instantiating a Flux dispatcher.
 * However, you do have the opportunity to extend the standard dispatcher in your application,
 * and one thing that will help you better comprehend the dispatcher role is making it log every action that gets dispatched, as shown
 */
import {Dispatcher} from 'flux';

class AppDispatcher extends Dispatcher {
    dispatch(action = {}) {
        console.log("Dispatched", action);
        super.dispatch(action);
    }
}

export default new AppDispatcher();