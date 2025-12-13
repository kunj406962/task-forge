"use client";

import React, { useState } from 'react';
import { db, auth } from '../_utils/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { addTodo } from '../_services/to-dos-service';

const AddTaskModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    priority: 'normal',
    category: 'personal',
    dueDate: '',
    dueTime: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be logged in to add a quest!");
      return;
    }

    setLoading(true);

try {
      await addTodo(auth.currentUser.uid, {
        title: formData.title,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        description: formData.description,
        completed: false,
      });

      setFormData({
        title: '',
        priority: 'normal',
        category: 'personal',
        dueDate: '',
        dueTime: '',
        description: ''
      });
      onClose();
    } catch (error) {
      console.error("Error adding quest:", error);
      alert("Failed to add quest. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay
    <div 
      className="fixed inset-0 bg-black/85 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-[#1a1a1a] w-full max-w-[500px] rounded-xl border border-[#333] shadow-2xl p-6 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-[#333] pb-3">
          <h3 className="text-xl font-semibold">✨ New Quest</h3>
          <button 
            className="text-gray-400 hover:text-white text-2xl leading-none"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-400">Quest Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Slay the Dragon..." 
              required 
              maxLength={200}
              className="w-full p-2.5 bg-[#222] border border-[#444] rounded-md text-white focus:outline-none focus:border-[#d946ef]"
            />
          </div>

          {/* Row: Priority & Category */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm text-gray-400">Priority</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                className="w-full p-2.5 bg-[#222] border border-[#444] rounded-md text-white focus:outline-none focus:border-[#d946ef]"
              >
                <option value="urgent">🔥 Urgent</option>
                <option value="important">⚠️ Important</option>
                <option value="normal">✅ Normal</option>
                <option value="someday">🌱 Someday</option>
                <option value="icebox">❄️ Icebox</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm text-gray-400">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full p-2.5 bg-[#222] border border-[#444] rounded-md text-white focus:outline-none focus:border-[#d946ef]"
              >
                <option value="work">💼 Work</option>
                <option value="personal">👤 Personal</option>
                <option value="health">❤️ Health</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="learning">📚 Learning</option>
              </select>
            </div>
          </div>

          {/* Row: Date & Time */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm text-gray-400">Due Date</label>
              <input 
                type="date" 
                name="dueDate" 
                value={formData.dueDate} 
                onChange={handleChange} 
                className="w-full p-2.5 bg-[#222] border border-[#444] rounded-md text-white focus:outline-none focus:border-[#d946ef]"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm text-gray-400">Time</label>
              <input 
                type="time" 
                name="dueTime" 
                value={formData.dueTime} 
                onChange={handleChange} 
                className="w-full p-2.5 bg-[#222] border border-[#444] rounded-md text-white focus:outline-none focus:border-[#d946ef]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-1 text-sm text-gray-400">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Quest details..." 
              rows={3}
              maxLength={1000}
              className="w-full p-2.5 bg-[#222] border border-[#444] rounded-md text-white focus:outline-none focus:border-[#d946ef]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2 bg-[#d946ef] hover:bg-[#c026d3] text-white font-bold rounded-md disabled:bg-[#555] disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Summoning..." : "Add Quest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;