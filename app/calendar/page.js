"use client";

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import './calendar.css';// Default calendar is in white, had to use CSS to adapt to dark mode
// Need DB imports
// Fetch tasks from DB
// Delete tasks from DB

const CalendarPage = () => {
  const [date, setDate] = useState(new Date()); // State for Calendar
  const [selectedTask, setSelectedTask] = useState(null); // State for Modal

  //Mock Data
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Defeat the Python Bug', 
      priority: 'urgent', 
      category: 'work', 
      completed: false, 
      description: "Trace the error in the login module.", 
      dueDate: '2025-13-12',
      dueTime: "14:00" 
    },
    { 
      id: 2, 
      title: 'Gym Quest', 
      priority: 'important', 
      category: 'health', 
      completed: false, 
      description: "30 minute run in the park.", 
      dueDate: format(new Date(), 'yyyy-dd-MM'),
      dueTime: "18:00" 
    },
    {
        id: 3,
        title: 'Read the Ancient Texts "The Hobbit"',
        priority: 'someday',
        category: 'personal development',
        completed: false,
        description: "Immerse yourself in Middle-earth.",
        dueDate: '2025-15-12',
        dueTime: "20:00"
    },
    {
        id: 4,
        title: 'Plan Weekend Adventure',
        priority: 'icebox',
        category: 'leisure',
        completed: false,
        description: "Scout destinations and accommodations.",
        dueDate: format(new Date(), 'yyyy-dd-MM'),
        dueTime: "16:00"
    }
  ]);

  //Filter tasks based on selected date
  const selectedDateStr = format(date, 'yyyy-dd-MM');
  const tasksForDay = tasks.filter(task => task.dueDate === selectedDateStr);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Color-code priorities
  const getPriorityColor = (p) => {
    if (p === 'urgent') return '#ef4444'; // Red
    if (p === 'important') return '#ffff00'; // Yellow
    if (p === 'someday') return '#10b981'; // Green
    if (p === 'icebox') return '#97C1E6'; // Blue
    return '#ccc';
  };

  return (
    <div className="calendar-container">
      {/* Calendar */}
      <div className="top-section">
        <h2>Adventure Map</h2>
        <Calendar 
          onChange={setDate} 
          value={date} 
          className="custom-calendar" 
        />
      </div>

      {/* List of tasks for day */}
      <div className="bottom-section">
        <h3>Quests for {format(date, 'MMMM do')}</h3>
        
        {tasksForDay.length > 0 ? (
          <div className="task-list">
            {tasksForDay.map(task => (
              <div 
                key={task.id} 
                className="task-item" 
                onClick={() => setSelectedTask(task)}
                style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}
              >
                <div className="task-info">
                  <span className="task-time">{task.dueTime}</span>
                  <span className="task-title">{task.title}</span>
                </div>
                <button 
                  className="delete-btn" 
                  onClick={(e) => handleDelete(e, task.id)}
                  title="Abandon Quest"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No quests active for this day, adventurer.</p>
        )}
      </div>

      {/* Modal View */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTask.title}</h3>
              <span className="task-category-badge">{selectedTask.category}</span>
            </div>
            
            <div className="modal-meta">
              <p><strong>🕒 Time:</strong> {selectedTask.dueTime}</p>
              <p><strong>⚠️ Priority:</strong> <span style={{color: getPriorityColor(selectedTask.priority)}}>{selectedTask.priority.toUpperCase()}</span></p>
            </div>

            <hr />
            <p className="task-desc">{selectedTask.description}</p>
            
            <button className="close-btn" onClick={() => setSelectedTask(null)}>
              Close Quest Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;