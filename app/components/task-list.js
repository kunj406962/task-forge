"use client";

import React from 'react';

const TaskList = ({ tasks, onToggleComplete, onDelete, onSelect, sortBy }) => {
  
  // Helper for colors
  const getPriorityColor = (p) => {
    const priority = p ? p.toLowerCase() : '';
    if (priority === 'urgent') return '#ef4444'; 
    if (priority === 'important') return '#ffff00'; 
    if (priority === 'someday') return '#10b981'; 
    if (priority === 'icebox') return '#97C1E6'; 
    return '#ccc';
  };

  if (!tasks || tasks.length === 0) {
    return <p className="empty-state">No quests found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => {
        const showHeader = sortBy === 'category' && (index === 0 || tasks[index - 1].category !== task.category);
        
        return (
          <React.Fragment key={task.id}>
            {showHeader && (
              <h4 style={{ color: '#d946ef', marginTop: '15px', marginBottom: '5px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                {task.category || 'Uncategorized'}
              </h4>
            )}
            
            <div 
              className={`task-item transition-all duration-200 ${task.completed ? 'opacity-50' : 'opacity-100'}`} 
              onClick={() => onSelect(task)}
              style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}
            >
              <div className="task-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                
                {/* Checkbox */}
                <input 
                  type="checkbox" 
                  checked={task.completed || false} 
                  onChange={(e) => onToggleComplete(e, task)} 
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 accent-[#d946ef] cursor-pointer" 
                  style={{ zIndex: 10 }} 
                />

                <span className="task-time" style={{background: '#444'}}>
                  {task.dueDate || 'No Date'} Due:{task.dueTime || 'No Time'}
                </span>
                
                <span className={`task-title ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </span>
              </div>
              
              <button 
                className="delete-btn text-red-500 hover:text-red-700 transition-colors" 
                onClick={(e) => onDelete(e, task.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TaskList;