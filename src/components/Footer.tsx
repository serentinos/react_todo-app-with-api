import cn from 'classnames';
import { FC, useCallback, useMemo } from 'react';
import { FilterType } from '../Enums/FilterType';
import { Todo } from '../types/Todo';
import { TodosFilter } from './TodosFilter';
import { getCompletedTodos } from '../utils/getCompletedTodos';
import { getUncompletedTodos } from '../utils/getUncompletedTodos';

interface Props {
  todos: Todo[],
  filterType: FilterType,
  setFilterType:React.Dispatch<React.SetStateAction<FilterType>>,
  removeTodoByID: (todoID: number) => Promise<void>
  setLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>
}

export const Footer:FC<Props> = ({
  todos,
  setFilterType,
  filterType,
  removeTodoByID,
  setLoadingTodos,
}) => {
  const completedTodosIds = useMemo(() => (
    getCompletedTodos(todos).map(todo => todo.id)
  ), [todos]);

  const isCompletedTodosAreNotPresent = completedTodosIds.length === 0;

  const handleremoveTodosByID = useCallback(async () => {
    setLoadingTodos(completedTodosIds);

    await Promise.all(
      completedTodosIds.map((todoId) => (
        removeTodoByID(todoId)
      )),
    );

    setLoadingTodos([]);
  }, [completedTodosIds, removeTodoByID, setLoadingTodos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${getUncompletedTodos(todos).length} items left`}
      </span>

      <TodosFilter
        setFilterType={setFilterType}
        currentFilterType={filterType}
      />

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: isCompletedTodosAreNotPresent,
        })}
        onClick={handleremoveTodosByID}
      >
        Clear completed
      </button>
    </footer>
  );
};
