"use client";

import React, { useState, useEffect } from 'react';
import '../calendar/calendar.css'; 
import { db, auth } from '../_utils/firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import AddTaskModal from '../components/add-task';
import TaskDetailsModal from '../components/task-details';
import { updateTodo, deleteTodo } from '../_services/to-dos-service';
import TaskList from '../components/task-list';

const QuestLog = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortBy, setSortBy] = useState('priority');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
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

  // Fetch tasks
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const todosRef = collection(db, "users", user.uid, "todos");

    const unsubscribeDocs = onSnapshot(todosRef, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching quest log:", error);
      setLoading(false);
    });

    return () => unsubscribeDocs();
  }, [user]);

  const toggleComplete = async (e, task) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await updateTodo(user.uid, task.id, { completed: !task.completed });
    } catch (error) { console.error("Error updating quest:", error); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!user) return;
    try { await deleteTodo(user.uid, id); } 
    catch (error) { console.error("Error deleting quest:", error); }
  };

  const priorityRank = { urgent: 1, important: 2, normal: 3, someday: 4, icebox: 5 };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Secondary Sort: Time
    const dateA = (a.dueDate || '9999-99-99') + (a.dueTime || '23:59');
    const dateB = (b.dueDate || '9999-99-99') + (b.dueTime || '23:59');
    const timeCompare = dateA.localeCompare(dateB);

    if (sortBy === 'priority') {
      const pA = a.priority ? a.priority.toLowerCase() : 'normal';
      const pB = b.priority ? b.priority.toLowerCase() : 'normal';
      const rankA = priorityRank[pA] || 99;
      const rankB = priorityRank[pB] || 99;
      if (rankA !== rankB) return rankA - rankB;
      return timeCompare;
    } else if (sortBy === 'category') {
      const cA = a.category || '';
      const cB = b.category || '';
      const catCompare = cA.localeCompare(cB);
      if (catCompare !== 0) return catCompare;
      return timeCompare;
    }
    return timeCompare;
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = now.getDate().toString().padStart(2, '0');
  const currentDateStr = `${currentYear}-${currentMonth}-${currentDay}`;
  const currentTimeStr = now.toTimeString().slice(0, 5);

  const overdueTasks = [];
  const upcomingTasks = [];

  sortedTasks.forEach(task => {
    if (task.completed) {
      upcomingTasks.push(task);
      return;
    }

    const tDate = task.dueDate || '9999-99-99';
    const tTime = task.dueTime || '23:59';

    const isPastDate = tDate < currentDateStr;
    const isTodayButPastTime = tDate === currentDateStr && tTime < currentTimeStr;

    if (isPastDate || isTodayButPastTime) {
      overdueTasks.push(task);
    } else {
      upcomingTasks.push(task);
    }
  });

  return (
    <div className="calendar-container">
      
      {/* Header */}
      <div className="top-section" style={{ height: 'auto', textAlign: 'center', paddingBottom: '10px' }}>
        <h2 className="font-bold text-4xl md:text-6xl text-purple-400 text-center mb-2 tracking-wider drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">📜 Quest Log</h2>
        <p className="font-bold text-4xl md:text-xl text-purple-400 text-center mb-10 tracking-wider drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
            All Active Quests
        </p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-full mt-3"
        >
          + Add New Quest
        </button>

        {/* Sort Buttons */}
        <div className="filter-container flex-col md:flex-row" style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '15px 0', alignItems: 'center' }}>
          <span style={{color: '#aaa', fontSize: '0.9rem'}}>Sort By:</span>
          <button onClick={() => setSortBy('priority')} className={`filter-btn border rounded-2xl p-2 transition-colors hover:cursor-pointer ${sortBy === 'priority' ? 'border-[#d946ef]' : 'text-gray-400'}`}>⚠️ Priority</button>
          <button onClick={() => setSortBy('category')} className={`filter-btn border rounded-2xl p-2 transition-colors hover:cursor-pointer ${sortBy === 'category' ? 'border-[#d946ef]' : 'text-gray-400'}`}>🏷️ Category A-Z</button>
        </div>

        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
          {tasks.length} Total Quests • Sorted by {sortBy === 'priority' ? 'Importance' : 'Class'}
        </p>
      </div>

      <div className="bottom-section">
        {loading ? (
            <p className="loading-state" style={{textAlign:'center', marginTop: '20px', color: '#888'}}>
              Reading quest scrolls...
            </p>
        ) : !user ? (
            <p className="empty-state">Please log in to view your Quest Log.</p>
        ) : tasks.length > 0 ? (
          
          <div className="grid grid-cols-1 lg:grid-cols-16 gap-6 mt-4">
            
            {/* Overdue Column */}
            {overdueTasks.length > 0 && (
              <div className="lg:col-span-8">
                <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 sticky top-4">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2 text-lg text-center">
                    ⚠️ Overdue <span className="text-xs bg-red-900/50 px-2 py-1 rounded-full text-white">{overdueTasks.length}</span>
                  </h3>
                  <TaskList 
                    tasks={overdueTasks} 
                    onToggleComplete={toggleComplete}
                    onDelete={handleDelete}
                    onSelect={setSelectedTask}
                    sortBy={sortBy}
                  />
                </div>
              </div>
            )}

            {/* Task Column */}
            <div className={overdueTasks.length > 0 ? "lg:col-span-8" : "lg:col-span-16"}>
               <h3 className="text-purple-300 font-bold mb-4 text-lg pl-2 text-center">
                 🛡️ Active Quests
               </h3>
               {upcomingTasks.length > 0 ? (
                 <TaskList 
                    tasks={upcomingTasks} 
                    onToggleComplete={toggleComplete}
                    onDelete={handleDelete}
                    onSelect={setSelectedTask}
                    sortBy={sortBy}
                  />
               ) : (
                 <p className="text-gray-500 italic pl-2">No active quests remaining.</p>
               )}
            </div>
          </div>

        ) : (
          <p className="empty-state">Your Quest Log is empty.</p>
        )}
      </div>

      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addDate={todayStr} />
    </div>
  );
};

export default QuestLog;