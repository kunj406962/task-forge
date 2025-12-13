"use client";

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import './calendar.css'; //Default calendar comes in white, CSS is used to adapt it to dark mode
import { db, auth } from '../_utils/firebase';
import { collection, onSnapshot} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import AddTaskModal from '../components/add-task';
import TaskDetailsModal from '../components/task-details';
import { updateTodo, deleteTodo } from '../_services/to-dos-service';
import TaskList from '../components/task-list';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date()); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    } catch (error) {
      console.error("Error updating quest:", error);
    }
  };  

  // Fetch Data
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const todosRef = collection(db, "users", user.uid, "todos");
    
    const unsubscribeDocs = onSnapshot(todosRef, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(), 
          updatedAt: data.updatedAt?.toDate()
        };
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching quests:", error);
      setLoading(false);
    });

    return () => unsubscribeDocs();
  }, [user]);

  const selectedDateStr = format(date, 'yyyy-MM-dd');
  const tasksForDay = tasks.filter(task => task.dueDate === selectedDateStr);

  // Delete from Databsase
const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!user) return;

    try {
      await deleteTodo(user.uid, id);
      console.log("Quest removed from log.");
    } catch (error) {
      console.error("Error deleting quest:", error);
      alert("Failed to delete.");
    }
  };

  const getPriorityColor = (p) => {
    const priority = p ? p.toLowerCase() : '';
    if (priority === 'urgent') return '#ef4444'; 
    if (priority === 'important') return '#ffff00'; 
    if (priority === 'someday') return '#10b981'; 
    if (priority === 'icebox') return '#97C1E6'; 
    return '#ccc';
  };

  return (
    <div className="calendar-container">
      {/* Calendar */}
      <div className="top-section">
        <h2 className="font-bold text-center">📆 Adventure Map</h2>
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
            ) : tasksForDay.length > 0 ? (
                
                <TaskList 
                tasks={tasksForDay} 
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
    <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CalendarPage;