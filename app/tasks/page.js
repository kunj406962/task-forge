"use client";

import React, { useState, useEffect } from 'react';
import '../calendar/calendar.css'; //Keep styling consistent for list
import { db, auth } from '../_utils/firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import AddTaskModal from '../components/add-task';
import TaskDetailsModal from '../components/task-details';
import { updateTodo, deleteTodo } from '../_services/to-dos-service';
import TaskList from '../components/task-list';
import { getTodosDueOnDate } from '../_services/to-dos-service';
import { set } from 'date-fns';

const QuestLog = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortBy, setSortBy] = useState('priority');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayStr, setTodayStr] = useState('');
  const today= new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = today.getDate().toString().padStart(2, '0');

  useEffect(() => {
    setTodayStr(`${year}-${month}-${day}`);
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

  // Fetch tasks
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        console.log("Fetching tasks for date:", todayStr);
        const todos = await getTodosDueOnDate(user.uid, todayStr);
        console.log("Fetched tasks:", todos);
        setTasks(todos);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, isModalOpen]);
  

  const priorityRank = {
    urgent: 1,
    important: 2,
    normal: 3,
    someday: 4,
    icebox: 5
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const pA = a.priority ? a.priority.toLowerCase() : 'normal';
      const pB = b.priority ? b.priority.toLowerCase() : 'normal';
      return (priorityRank[pA] || 99) - (priorityRank[pB] || 99);
    } else if (sortBy === 'category') {
      const cA = a.category || '';
      const cB = b.category || '';
      return cA.localeCompare(cB);
    }
    return 0;
  });

  // Delete from Database
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!user) return;

    try {
      // Use the service function!
      await deleteTodo(user.uid, id);
      console.log("Quest removed from log.");
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
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
      
      {/* Header */}
      <div className="top-section" style={{ height: 'auto', textAlign: 'center', paddingBottom: '10px' }}>
        <h2 className="font-bold text-4xl md:text-6xl text-purple-400 text-center mb-2 tracking-wider drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">📜 Quest Log</h2>
        <p className="font-bold text-4xl md:text-xl text-purple-400 text-center mb-10 tracking-wider drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">Date: {today.toDateString()}</p>
        
        {/* Add Task */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-full mt-3"
        >
          + Add New Quest
        </button>

        {/* Sort Buttons */}
        <div className="filter-container flex-col md:flex-row" style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '15px 0', alignItems: 'center' }}>
          <span style={{color: '#aaa', fontSize: '0.9rem'}}>Sort By:</span>
          
          <button 
            onClick={() => setSortBy('priority')}
            className={`filter-btn border rounded-2xl p-2 transition-colors hover:cursor-pointer ${
              sortBy === 'priority' 
                ? 'border-[#d946ef]' 
                : 'text-gray-400'
            }`} 
          >
            ⚠️ Priority
          </button>

          <button 
            onClick={() => setSortBy('category')}
            className={`filter-btn border rounded-2xl p-2 transition-colors hover:cursor-pointer ${
              sortBy === 'category' 
                ? 'border-[#d946ef]' 
                : 'text-gray-400'
            }`} 
          >
            🏷️ Category A-Z
          </button>
        </div>

        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
          {tasks.length} Active Quests • Sorted by {sortBy === 'priority' ? 'Importance' : 'Class'}
        </p>
      </div>

      {/* List Sorted Tasks */}
      <div className="bottom-section">
        {loading ? (
            <p className="loading-state" style={{textAlign:'center', marginTop: '20px', color: '#888'}}>
              Reading quest scrolls...
            </p>
        ) : !user ? (
            <p className="empty-state">Please log in to view your Quest Log.</p>
        ) : sortedTasks.length > 0 ? (
          <TaskList 
              tasks={sortedTasks} 
              onToggleComplete={toggleComplete}
              onDelete={handleDelete}
              onSelect={setSelectedTask}
              sortBy={sortBy}
            />
        ) : (
          <p className="empty-state">Your Quest Log is empty.</p>
        )}
      </div>

    {/* Modals */}
    <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addDate={todayStr} />
    </div>
  );
};

export default QuestLog;