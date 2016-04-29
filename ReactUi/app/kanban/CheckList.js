/*
 * Created by phuttipong on 28/4/2559.
 */
import React, {Component, PropTypes} from 'react';

class CheckList extends Component {
    render() {
        let tasks = this.props.tasks.map((task) => (
            <li key={task.id} className="checklist__task">
                <input type="checkbox" checked={task.done}
                       readOnly="true"/> {/*read-only controlled input UI won't changed by user*/}
                {" "}
                {task.name}
                {" "}
                <a href="#" className="checklist__task--remove"/>
            </li>
        ));

        return (
            <div className="checklist">
                <ul>{tasks}</ul>
                <input type="text"
                       className="checklist--add-task"
                       placeholder="Type then hit Enter to add a task"/>
            </div>
        );
    }
}

CheckList.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.object)
};
export default CheckList;