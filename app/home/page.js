"use client";
import { useState, useEffect } from "react";
import { getToDos, addTodo, deleteTodo, updateTodo } from "../_services/to-dos-service";
import { useUserAuth } from "../_utils/auth-context";

export default function Page(){
    const {user}= useUserAuth();
    const [data, setData] = useState(null);
    useEffect(()=>{
        if (!user) return;
        fetchData();
    },[user])
    
    const fetchData=async ()=>{
        const todos= await getToDos(user.uid);
        setData(todos);
        console.log("error here");
    }

    const handleAdd= async (todoData)=>{
        await addTodo (user.uid, {
            title: 'Buy groceries',
            priority: 'important',
            category: 'shopping',
            completed: false,
            description: "30 minute run in the park",
            dueDate: "2024-01-15",
            dueTime: "10:00"
        });
        await fetchData();
    }

    return (
        <button onClick={handleAdd}>Add To-Do</button>
    )
}