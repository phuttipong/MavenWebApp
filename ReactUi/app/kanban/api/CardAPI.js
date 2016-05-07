/**
 * Created by phuttipong on 7/5/2559.
 */
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'any-string-you-like'// The Authorization is not needed for local server
};

let CardAPI = {
    fetchCards() {
        return fetch(API_URL + '/cards', {headers: API_HEADERS})
            .then((response) => response.json());
    }
};
export default CardAPI;