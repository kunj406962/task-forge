"use client";
import { useState, useEffect } from "react";
import { getTodosDueOnDate } from "../_services/to-dos-service";
import { useUserAuth } from "../_utils/auth-context";
import WeatherWidget from "../components/weather";
import SnarkyAdviceWidget from "../components/snarky-advice";
import TaskStatusWidget from "../components/Task-Status";

export default function Page() {
    const { user } = useUserAuth();
    const [data, setData] = useState(null);
    const [overdueTasksCount, setOverdueTasksCount] = useState(0);
    
    // Fetch data once when page loads
    useEffect(() => {
        if (!user) return;
        fetchData();
    }, [user]);

    // Check overdue every minute using the existing data
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (data) {
                checkOverdueTasks(data);
            }
        }, 60000); // Every minute
        
        // Check immediately on mount
        if (data) {
            checkOverdueTasks(data);
        }
        
        return () => clearInterval(intervalId);
    }, [data]); // Run when data changes

    const checkOverdueTasks = (taskList) => {
        if (!taskList || taskList.length === 0) {
            setOverdueTasksCount(0);
            return;
        }
        
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const currentDateStr = `${year}-${month}-${day}` // YYYY-MM-DD
        const hours=now.getHours().toString().padStart(2, '0');
        const minutes=now.getMinutes().toString().padStart(2, '0');
        const currentTimeStr = `${hours}:${minutes}` // HH:MM
        
        const overdueTasks = taskList.filter(task => {
            // If task is already completed, it's not overdue
            if (task.completed) return false;
            
            // Compare dates first
            if (task.dueDate < currentDateStr) return true;
            
            // If same date, compare times
            if (task.dueDate === currentDateStr && task.dueTime < currentTimeStr) return true;
            
            return false;
        });
        
        console.log("Checked overdue at:", currentTimeStr, "Found:", overdueTasks.length);
        setOverdueTasksCount(overdueTasks.length);
    };

    const fetchData = async () => {
        try {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            
            const todos = await getTodosDueOnDate(user.uid, todayStr);
            setData(todos);
            console.log("Initial fetch:", todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
            setData([]);
        }
    };

    const totalTasksCount = data ? data.length : 0;
    const completedTasksCount = data ? data.filter(task => task.completed).length : 0;

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <WeatherWidget user={user} />
                <SnarkyAdviceWidget />
            </div>
            
            <TaskStatusWidget 
                totalTasks={totalTasksCount} 
                completedTasks={completedTasksCount} 
                overdueTasks={overdueTasksCount} 
            />
        </div>
    );
}