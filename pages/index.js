import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim() }]);
      setInput('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Test2 Todo List</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
          className={styles.input}
        />
        <button onClick={addTodo} className={styles.addButton}>Add</button>
      </div>
      <ul className={styles.todoList}>
        {todos.map(todo => (
          <li key={todo.id} className={styles.todoItem}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)} className={styles.deleteButton}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
