/*
 * Created by phuttipong on 28/4/2559.
 */
import React, {Component, PropTypes} from 'react';
import TaskActionCreator from '../actions/TaskActionCreator'

class CheckList extends Component {
    checkInputKeyPress(evt) {
        if (evt.key === 'Enter') {
            let newTask = {id: Date.now(), name: evt.target.value, done: false};
            TaskActionCreator.addTask(this.props.cardId, newTask);
            evt.target.value = '';
        }
    }

    render() {
        let tasks = this.props.tasks.map((task, taskIndex) => (
            <li key={task.id} className="checklist__task">
                {/*read-only controlled input UI won't changed by user*/}
                <input type="checkbox"
                       checked={task.done}
                       onChange={TaskActionCreator.toggleTask.bind(null, this.props.cardId, task, taskIndex)}/>
                {" "}
                {task.name}
                {" "}
                <a href="#" className="checklist__task--remove"
                   onClick={TaskActionCreator.deleteTask.bind(null, this.props.cardId, task, taskIndex)}/>
            </li>
        ));

        return (
            <div className="checklist">
                <ul>{tasks}</ul>
                <input type="text"
                       className="checklist--add-task"
                       placeholder="Type then hit Enter to add a task"
                       onKeyPress={this.checkInputKeyPress.bind(this)}/>
            </div>
        );
    }
}

CheckList.propTypes = {
    cardId: PropTypes.number,
    tasks: PropTypes.arrayOf(PropTypes.object)
};
export default CheckList;