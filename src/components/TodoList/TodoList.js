import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { loadTasks, deleteTask } from '../../actions/actionCreators'
import API from '../../utils/API';
import history from '../../history';
import { getAuthHeader, handleError } from '../../helpers/requestHelper';
import TodoListItem from '../TodoListItem';

import './TodoList.css';

const TodoList = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(state => state.auth.authenticated);
  const tasks = useSelector(state => state.todos)

  useEffect( () => {
    if (!authenticated) {
      return history.push('/login');
    }

    const config = getAuthHeader();

    API.get('tasks', config)
    .then(response => {
      const todos = response.data.data.map(({id, attributes}) => {
        return {id, ...attributes}
      });
      dispatch(loadTasks(todos));
    })
    .catch(error => {
      handleError(error, history);
    })
  }, [authenticated, dispatch]);

  const onDeleteTask = (id) => {
    const config = getAuthHeader();

    API.delete(`tasks/${id}`, config)
    .then(response => {
      dispatch(deleteTask(id));
    })
    .catch(error => {
      handleError(error, history);
    })
  }

  const elements = tasks.map((task) => {
    return (
      <li key={task.id} className="list-group-item">
        <TodoListItem
          { ...task }
          onDelete={ () => onDeleteTask(task.id) } 
        />
      </li>
    );
  });

  return (<ul className="todo-list list-group">{ elements }</ul>);
};

export default TodoList;
