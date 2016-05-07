/**
 * Created by phuttipong on 7/5/2559.
 */
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'any-string-you-like'// The Authorization is not needed for local server
};

let TaskAPI = {
    addTask(cardId, task) {
        return fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(task)
        }).then((response) => {
            return response.json();
        });
    },

    deleteTask(cardId, task){
        return fetch(`${API_URL}/cards/${cardId}/tasks/${task.id}`, {
            method: 'delete',
            headers: API_HEADERS
        });
    },

    toggleTask(cardId, task){
        return fetch(`${API_URL}/cards/${cardId}/tasks/${task.id}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done: !task.done})
        });
    }
};
export default TaskAPI;