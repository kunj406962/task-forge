"use client";
import Image from "next/image";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function NavBar(){
    const{user, firebaseSignOut }=useUserAuth();  
    
    const router=useRouter();

    const pathname = usePathname();

    const logout=async()=>{
        router.push("/");
        await firebaseSignOut();
        
    }

    if (!user) {
        return null; // or a loading indicator
    }

    return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-lavender-50 to-lilac-100 border-b-4 border-purple-200">
        {/* Wavy divider */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"></div>
        
        <div className="px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo with Character */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-lavender-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg transform hover:-rotate-6 transition-transform">
                            {/* Lavender background container */}
                            <div className="w-14 h-14 bg-gradient-to-br from-lavender-400 to-purple-400 rounded-2xl flex items-center justify-center">
                                <Image
                                src="/TaskForge(full).png"
                                alt="TaskForge Logo"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain filter drop-shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text">
                        TaskForge
                        </h1>
                        <p className="text-sm text-purple-400">🎮 Game on! Let's conquer tasks!</p>
                    </div>
                </div>

                {/* Playful Navigation */}
                <div className="hidden md:flex items-center space-x-3">
                <PlayfulLink icon="🏠" text="Home Base" href="/home" isActive={pathname === "/home"} />
                <PlayfulLink icon="📋" text="Quest Log" href="/tasks" isActive={pathname === "/tasks"} />
                <PlayfulLink icon="📅" text="Adventure Map" href="/calendar"isActive={pathname === "/calendar"} />
                </div>

                {/* User with Fun Elements */}
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <div className="flex items-center space-x-3 bg-white rounded-2xl px-4 py-2 shadow-lg hover:shadow-2xl transition-all">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                <FaUser className="text-white text-xl" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                                👑
                                </div>
                            </div>
                            
                            <div className="hidden md:block">
                                <p className="text-purple-800 font-bold">
                                {user?.displayName || "Super Star"}
                                </p>
                                <p className="text-xs text-purple-500">{user?.email} </p>
                            </div>
                            
                            <button 
                                onClick={logout}
                                className="ml-2 p-2 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg hover:from-pink-300 hover:to-purple-300 transition-all hover:rotate-12"
                                title="Exit Game"
                            >
                                <FaSignOutAlt className="text-purple-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    );
}

function PlayfulLink({ icon, text, href, isActive }) {
  return (
    <Link href={href}>
      <div className="relative">
        <div className={`
          flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300
          ${isActive 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
            : 'bg-white/90 text-purple-700 hover:bg-gradient-to-r from-purple-400 to-pink-400 hover:text-white'
          }
        `}>
          <div>{icon}</div>
          <span className="font-medium">{text}</span>
        </div>
        
        {/* Floating bubble for active state */}
        {isActive && (
          <>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>
          </>
        )}
      </div>
    </Link>
  );
}