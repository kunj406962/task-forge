"use client";

import React from 'react';

const TaskDetailsModal = ({ task, onClose }) => {
  // Return null if no task is selected (modal is closed)
  if (!task) return null;

  // Helper logic for colors (now encapsulated inside the component!)
  const getPriorityColor = (p) => {
    const priority = p ? p.toLowerCase() : '';
    if (priority === 'urgent') return '#ef4444'; 
    if (priority === 'important') return '#ffff00'; 
    if (priority === 'someday') return '#10b981'; 
    if (priority === 'icebox') return '#97C1E6'; 
    return '#ccc';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h3>{task.title}</h3>
          <span className="task-category-badge">{task.category || 'General'}</span>
        </div>

        {/* Metadata */}
        <div className="modal-meta">
          <p>
            <strong>📅 Date:</strong> {task.dueDate || 'No Date'} 
            {task.dueTime && ` at ${task.dueTime}`}
          </p>
          <p>
            <strong>⚠️ Priority:</strong> 
            <span style={{ color: getPriorityColor(task.priority), marginLeft: '8px', fontWeight: 'bold' }}>
              {task.priority?.toUpperCase()}
            </span>
          </p>
        </div>

        <hr className="modal-divider" />

        {/* Description */}
        <div className="description-box">
          <p className="task-desc">{task.description || "No description provided."}</p>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close Log
          </button>
        </div>
      </div>

    </div>
  );
};

export default TaskDetailsModal;