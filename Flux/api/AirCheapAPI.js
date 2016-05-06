/**
 * Created by phuttipong on 6/5/2559.
 */
import 'whatwg-fetch';
import AirportActionCreators from '../actions/AirportActionCreators';
let AirCheapAPI = {
    fetchAirports() {
        fetch('airports.json')
            .then((response) => response.json())
            .then((responseData) => {
                // Call the AirportActionCreators success action with the parsed data
                AirportActionCreators.fetchAirportsSuccess(responseData);
            })
            .catch((error) => {
                // Call the AirportActionCreators error action with the error object
                AirportActionCreators.fetchAirportsError(error);
            });
    }
};
export default AirCheapAPI;