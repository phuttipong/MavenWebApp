/**
 * Created by phuttipong on 7/5/2559.
 */
import AppDispatcher from '../AppDispatcher';
import constants from '../constants';
import TaskAPI from '../api/TaskAPI';
let TaskActionCreator = {
    addTask(cardId, task) {
        AppDispatcher.dispatchAsync(TaskAPI.addTask(cardId, task), {
            request: constants.CREATE_TASK,
            success: constants.CREATE_TASK_SUCCESS,
            failure: constants.CREATE_TASK_ERROR
        }, {cardId, task});
    },

    toggleTask(cardId, task, taskIndex) {
        AppDispatcher.dispatchAsync(TaskAPI.toggleTask(cardId, task), {
            request: constants.TOGGLE_TASK,
            success: constants.TOGGLE_TASK_SUCCESS,
            failure: constants.TOGGLE_TASK_ERROR
        }, {cardId, task, taskIndex});
    },

    deleteTask(cardId, task, taskIndex) {
        AppDispatcher.dispatchAsync(TaskAPI.deleteTask(cardId, task), {
            request: constants.DELETE_TASK,
            success: constants.DELETE_TASK_SUCCESS,
            failure: constants.DELETE_TASK_ERROR
        }, {cardId, task, taskIndex});
    }
};
export default TaskActionCreator;