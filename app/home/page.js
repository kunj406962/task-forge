"use client";
import { useState, useEffect } from "react";
import { getToDos, addTodo, deleteTodo, updateTodo } from "../_services/to-dos-service";
import { useUserAuth } from "../_utils/auth-context";
import WeatherWidget from "./components/weather";
import SnarkyAdviceWidget from "./components/snarky-advice";

export default function Page(){
    const {user}= useUserAuth();
    const [data, setData] = useState(null);
    useEffect(()=>{
        if (!user) return;
        fetchData();
        fetchAdvice();
    },[user])
    

    const fetchData=async ()=>{
        const todos= await getToDos(user.uid);
        setData(todos);
        console.log("Fetched to-dos: ", todos);
    }

    const fetchAdvice= async ()=>{
        try{
            const response= await fetch ("https://api.adviceslip.com/advice").then(res=> res.json());
            console.log("Fetched advice: ", response);
        }catch (error){
            console.error("Advice fetch failed:", error);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 m-2">
            <WeatherWidget user={user} />
            <SnarkyAdviceWidget />
        </div>
    )
}

 const handleAdd= async (todoData)=>{
        await addTodo (user.uid, {
            title: 'Buy groceries',
            priority: 'important',
            category: 'shopping',
            completed: false,
            description: "30 minute run in the park",
            dueDate: "2025-12-12",
            dueTime: "10:00"
        });
        await fetchData();
    }