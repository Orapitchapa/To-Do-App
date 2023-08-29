import React, { useEffect, useState } from 'react';
import { Task } from '../ToDoApp/TaskInterface';
import './Styles.scss';
import { FaEllipsisH } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

interface ToDoListProps {
    tasks: Task[];
    addTask: (newTask: Task) => void;
    deleteTask: (taskId: number) => void;
    toggleTaskCompletion: (taskId: number, completed: boolean) => void;
    saveEditedTitle: (taskId: number, newTitle: string) => void;
}

const ToDoList: React.FC<ToDoListProps> = ({ tasks, addTask, deleteTask, toggleTaskCompletion, saveEditedTitle }) => {
    console.log('task ==>', tasks)
    const [filterOption, setFilterOption] = useState('all');
    const [taskCompletion, setTaskCompletion] = useState<{ [taskId: string]: boolean }>({});
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [showFilterList, setShowFilterList] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [taskName, setTaskName] = useState<string>('');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>('');
    console.log(taskCompletion)

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progressPercentage = (completedTasks / totalTasks) * 100;
    const progressBarStyle: React.CSSProperties = {
        width: '480px',
        height: '7.34px',
        backgroundColor: '#3b3b3b',
        position: 'relative',
        borderRadius: '20px',
        
    };

    const progressOverlayStyle: React.CSSProperties = {
        width: `${progressPercentage}%`,
        height: '100%',
        backgroundColor: '#ffffff',
        transition: 'width 0.3s ease-in-out',
        borderRadius: '20px',
    };

    const handleFilterOptionClick = (option: 'all' | 'done' | 'undone') => {
        setSelectedFilter(option);
        handleFilterButtonClick();
        handleFilterChange(option);
    };

    const toggleMenu = (index: number) => {
        setClickedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleFilterButtonClick = () => {
        setShowFilterList(prevShow => !prevShow);
    };

    const handleTaskCompletionToggle = (taskId: number, isChecked: boolean) => {
        setTaskCompletion(prevCompletion => ({
            ...prevCompletion,
            [taskId]: isChecked,
        }));
        toggleTaskCompletion(taskId, isChecked);
    };

    const handleClickOutside = (event: MouseEvent) => {
        const filterButton = document.querySelector('.filter-dropdown');
        const filterContainer = document.querySelector('.filter-container');
        const taskOptionsMenus = document.querySelectorAll('.dropdown-menu');
        
        if (
            filterButton &&
            filterContainer &&
            !filterButton.contains(event.target as Node) &&
            !filterContainer.contains(event.target as Node) &&
            !Array.from(taskOptionsMenus).some(menu =>
                menu.contains(event.target as Node)
            )
        ) {
            setShowFilterList(false);
            setClickedIndex(null);
        }
    };
    
    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);
    

    const closeMenu = () => {
        setClickedIndex(null);
    };

    const handleFilterChange = (option: 'all' | 'done' | 'undone') => {
        setFilterOption(option);
    };

    const handleSubmit = () => {
        if (taskName.trim() === '') {
            return;
        }
        const newTask: Task = {
            id: 0,
            title: taskName,
            completed: false,
        };
        addTask(newTask);
        setTaskName('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <>
            <div className='centered-container'>
                <div className='progress-container container'>
                    <div>
                        <p className='progress-text'>Progress</p>
                    </div>
                    <div className='progress-bar'>
                        <div style={progressBarStyle}>
                            <div style={progressOverlayStyle}></div>
                        </div>
                    </div>
                    <div>
                        <p className='progress-completed'>{completedTasks} completed</p>
                    </div>
                </div>
            </div>
            <div className='container container-text-task'>
                <div>
                    <span className='tasks-text'>Tasks</span>
                </div>
                <div>
                    <button className='filter-dropdown' onClick={handleFilterButtonClick}>
                        <span className='filter-text'>
                            {selectedFilter === 'all' && 'All'}
                            {selectedFilter === 'done' && 'Done'}
                            {selectedFilter === 'undone' && 'Undone'}
                        </span>
                        <div className='filter-icon-container'>
                            <FiChevronDown
                                className='filter-icon' />
                        </div>
                    </button>
                    <div className='filter-container'>
                        {showFilterList && (
                            <ul className='filter-list'>
                                <li onClick={() => handleFilterOptionClick('all')}>All</li>
                                <li onClick={() => handleFilterOptionClick('done')}>Done</li>
                                <li onClick={() => handleFilterOptionClick('undone')}>Undone</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            {tasks
                .filter(task => {
                    if (filterOption === 'done') {
                        return task.completed;
                    } else if (filterOption === 'undone') {
                        return !task.completed;
                    }
                    return true;
                }).
                map((task, index) => (
                    <div className='container-task container' key={task.id}>
                        <div className='tasks-text-detail'>
                            {editingTaskId === task.id ? (
                                <div className='edit-container container'>
                                    <input className='edit-task'
                                        type='text'
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                    />
                                    <div>
                                        <button
                                            className='save-button'
                                            onClick={async () => {
                                                await saveEditedTitle(task.id, editedTitle);
                                                setEditingTaskId(null);
                                                setEditedTitle('');
                                                closeMenu();
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <label className='containercheckbox'>
                                        <input
                                            type='checkbox'
                                            checked={task.completed || false}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                handleTaskCompletionToggle(task.id, isChecked);
                                            }}
                                        />
                                        <span
                                            style={{ marginLeft: '20px', marginTop: '10px' }}
                                            className='checkmark'
                                        >
                                        </span>
                                        <span
                                            style={{ paddingLeft: '40px' }}
                                            className={`${task.completed ? 'completed-task' : ''}`}>
                                            {task.title}
                                        </span>
                                    </label>
                                    <div className='dropdown-menu' onClick={(e) => e.stopPropagation()}>
                                        <FaEllipsisH
                                            onClick={() => toggleMenu(index)}
                                            className={`dropdown-icon ${clickedIndex === index ? 'active' : ''}`}
                                        />
                                        {clickedIndex === index && (
                                            <ul className='menu-list'>
                                                <li onClick={() => {
                                                    setEditingTaskId(task.id);
                                                    setEditedTitle(task.title);
                                                }}>
                                                    Edit
                                                </li>
                                                <li
                                                    style={{ color: '#E07C7C' }}
                                                    onClick={() => {
                                                        deleteTask(task.id);
                                                        closeMenu();
                                                    }}
                                                >
                                                    Delete
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            <div className='container-task container'>
                <input
                    className='input-task'
                    type='text'
                    placeholder='Add your todo...'
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </>
    );
};

export default ToDoList;

