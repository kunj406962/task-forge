"use client";
import Image from "next/image";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome, FaCalendarAlt, FaTasks, FaUser, FaSignOutAlt } from 'react-icons/fa';
import NavBar from "../components/navBar";

export default function Page(){
    const{user, firebaseSignOut }=useUserAuth();  
    
    const router=useRouter();

    const logout=async()=>{
        await firebaseSignOut();
        router.push("/");
    }

    return (
        <h1>This is the home page</h1>
    )
}