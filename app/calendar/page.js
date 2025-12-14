"use client";

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import './calendar.css'; //Default calendar comes in white, CSS is used to adapt it with the black bg
import { db, auth } from '../_utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AddTaskModal from '../components/add-task';
import TaskDetailsModal from '../components/task-details';
import { updateTodo, deleteTodo, getTodosDueOnDate } from '../_services/to-dos-service';
import TaskList from '../components/task-list';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date()); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setTasks([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

const toggleComplete = async (e, task) => {
    e.stopPropagation();
    if (!user) return;

    try {
      await updateTodo(user.uid, task.id, {
        completed: !task.completed
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error("Error updating quest:", error);
    }
  };  

  // Fetch Data
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const tasksData= tasksForChosenDay()
    
    setTasks(tasksData)

    setLoading(false);
  }, [date, user, isModalOpen]);

const tasksForChosenDay = async () => {
    await getTodosDueOnDate(user.uid, dateStr).then((todos) => {
      
      // Sort tasks by time
      const sortedTodos = todos.sort((a, b) => {
        const timeA = a.dueTime || '23:59';
        const timeB = b.dueTime || '23:59';
        return timeA.localeCompare(timeB);
      });

      setTasks(sortedTodos);
    });
  };

  // Delete from Databsase
const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!user) return;

    try {
      await deleteTodo(user.uid, id);
      console.log("Quest removed from log.");
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting quest:", error);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="calendar-container">
      {/* Calendar */}
      <div className="top-section">
        <h2 className="font-bold text-4xl md:text-6xl text-purple-400 text-center mb-10 tracking-wider drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">📆 Adventure Map</h2>
        <Calendar 
          onChange={setDate} 
          value={date} 
          className="custom-calendar" 
        />
      </div>

      {/* List of tasks for day */}
        <div className="bottom-section">
            <h3>Quests for {format(date, 'MMMM do')}</h3>

            {loading ? (
                <p className="loading-state">Summoning quests from your archives...</p>
            ) : !user ? (
                <p className="empty-state">Please log in to view your Adventure Map.</p>
            ) : tasks.length > 0 ? (
                
                <TaskList 
                tasks={tasks} 
                onToggleComplete={toggleComplete}
                onDelete={handleDelete}
                onSelect={setSelectedTask}
                />

            ) : (
                <p className="empty-state">No quests active for this day, adventurer.</p>
            )}
        </div>

        {/* Add Task */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-full mt-3"
        >
          + Add New Quest
        </button>


      {/* Modals */}
      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      <AddTaskModal isOpen={isModalOpen} addDate={dateStr} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CalendarPage;