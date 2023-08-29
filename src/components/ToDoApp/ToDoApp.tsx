import React, { useState, useEffect } from 'react';
import ToDoList from '../ToDoList/ToDoList';
import { Task } from './TaskInterface';
import axios from 'axios';

const TodoApp: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3001/todos')
            .then(response => setTasks(response.data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const addTask = async (newTask: Task) => {
        try {
            const response = await axios.post('http://localhost:3001/todos', newTask);
            const addedTask = response.data;
            setTasks([...tasks, addedTask]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };
    
    const deleteTask = async (taskId: number) => {
        try {
            await axios.delete(`http://localhost:3001/todos/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    
    const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
        try {
            const taskToUpdate = tasks.find(task => task.id === taskId);
            if (!taskToUpdate) {
                console.error('Task not found for update');
                return;
            }
            await axios.put(`http://localhost:3001/todos/${taskId}`, {
                title: taskToUpdate.title,
                completed: completed,
            });
            const updatedTasks = tasks.map(task => {
                if (task.id === taskId) {
                    return { ...task, completed };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task completion:', error);
        }
    };
    
    const saveEditedTitle = async (taskId: number, newTitle: string) => {
        try {
            await axios.put(`http://localhost:3001/todos/${taskId}`, {
                title: newTitle,
            });
            const updatedTasks = tasks.map(task => {
                if (task.id === taskId) {
                    return { ...task, title: newTitle };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task title:', error);
        }
    };

    return (
        <div>
            <ToDoList tasks={tasks} deleteTask={deleteTask} toggleTaskCompletion={toggleTaskCompletion} saveEditedTitle={saveEditedTitle} addTask={addTask} />
        </div>
    );
};

export default TodoApp;
