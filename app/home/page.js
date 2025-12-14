"use client";
import { useState, useEffect } from "react";
import { getTodosDueOnDate } from "../_services/to-dos-service";
import { useUserAuth } from "../_utils/auth-context";
import WeatherWidget from "../components/weather";
import SnarkyAdviceWidget from "../components/snarky-advice";
import TaskStatusWidget from "../components/Task-Status";

export default function Page(){
    const {user}= useUserAuth();
    const [data, setData] = useState(null);
    const today= new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    useEffect(()=>{
        if (!user) return;
        fetchData();
    },[user])
    

    const fetchData=async ()=>{

        const todos= await getTodosDueOnDate(user.uid, todayStr);
        setData(todos);
        console.log("Fetched to-dos: ", todos);
    }

    const totalTasksCount= data ? data.length : 0;
    const completedTasksCount= data ? data.filter(task=> task.completed).length : 0;

    const checkOverdueTasks=()=>{
        if(!data) return 0;
        const now= new Date();
        const time= `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
        const overdueTasks= data.filter(task=>{
            if(task.dueTime < time) return true;
            return false;
        });
        return overdueTasks;
    }

    const overdueTasksCount= checkOverdueTasks().length;
    

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 m-2">
                <WeatherWidget user={user} />
                <SnarkyAdviceWidget />
            </div>
            <TaskStatusWidget totalTasks={totalTasksCount} completedTasks={completedTasksCount} overdueTasks={overdueTasksCount}  />
        </div>
    )
}