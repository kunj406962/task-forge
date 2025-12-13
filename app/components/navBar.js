"use client";
import { useState, useEffect } from "react"; // NEW: Added useState and useEffect
import Image from "next/image";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'; // NEW: Added FaBars and FaTimes

export default function NavBar(){
    const{user, firebaseSignOut }=useUserAuth();  
    
    const router=useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // NEW: State for mobile menu

    // NEW: Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const logout=async()=>{
        await firebaseSignOut();
        router.push("/");
    }

    if (!user || pathname === "/") {
        return null;
    }

    return (
    <>
        <header className="sticky top-0 z-50 bg-linear-to-b from-lavender-50 to-lilac-100 border-b-4 border-purple-200 mb-5">
            {/* Wavy divider */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-pink-300 via-purple-300 to-blue-300"></div>
            
            <div className="px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo with Character & Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        {/* NEW: Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-purple-700 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                        </button>
                        
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="relative">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-lavender-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg transform hover:-rotate-6 transition-transform">
                                    {/* Lavender background container */}
                                    <div className="w-10 h-10 md:w-14 md:h-14 bg-linear-to-br from-lavender-400 to-purple-400 rounded-2xl flex items-center justify-center">
                                        <Image
                                        src="/TaskForge(full).png"
                                        alt="TaskForge Logo"
                                        width={40}
                                        height={40}
                                        className="w-7 h-7 md:w-10 md:h-10 object-contain filter drop-shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text">
                                TaskForge
                                </h1>
                                <p className="text-xs md:text-sm text-purple-400">🎮 Game on! Let's conquer tasks!</p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-3">
                        <PlayfulLink icon="🏠" text="Home Base" href="/home" isActive={pathname === "/home"} />
                        <PlayfulLink icon="📋" text="Quest Log" href="/tasks" isActive={pathname === "/tasks"} />
                        <PlayfulLink icon="📅" text="Adventure Map" href="/calendar" isActive={pathname === "/calendar"} />
                    </div>

                    {/* User with Fun Elements */}
                    <div className="flex items-center space-x-2 md:space-x-4">                        
                        {/* Desktop User Section */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="relative group">
                                <div className="flex items-center space-x-3 bg-white rounded-2xl px-4 py-2 shadow-lg hover:shadow-2xl transition-all">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                            <FaUser className="text-white text-xl" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                                            👑
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-purple-800 font-bold">
                                            {user?.displayName || "Super Star"}
                                        </p>
                                        <p className="text-xs text-purple-500">{user?.email}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={logout}
                                        className="ml-2 p-2 bg-linear-to-r from-pink-200 to-purple-200 rounded-lg hover:from-pink-300 hover:to-purple-300 transition-all hover:rotate-12"
                                        title="Sign out"
                                    >
                                        <FaSignOutAlt className="text-purple-700" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* NEW: Mobile Menu Overlay */}
        {isMenuOpen && (
            <>
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Mobile Menu Panel */}
                <div className="fixed top-0 left-0 h-full w-64 bg-linear-to-b from-purple-100 to-white shadow-2xl z-50 md:hidden animate-slide-in">
                    <div className="p-6">
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                                    <div className="w-10 h-10 bg-linear-to-br from-lavender-300 to-purple-300 rounded-xl flex items-center justify-center">
                                        <Image
                                            src="/TaskForge(full).png"
                                            alt="TaskForge Logo"
                                            width={28}
                                            height={28}
                                            className="w-7 h-7 object-contain"
                                        />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-purple-800">Menu</h2>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-purple-700 hover:bg-purple-100 rounded-lg"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        {/* Mobile Navigation Links */}
                        <div className="space-y-3 mb-8">
                            <MobileNavLink 
                                icon="🏠" 
                                text="Home Base" 
                                href="/home" 
                                isActive={pathname === "/home"}
                            />
                            <MobileNavLink 
                                icon="📋" 
                                text="Quest Log" 
                                href="/tasks" 
                                isActive={pathname === "/tasks"}
                            />
                            <MobileNavLink 
                                icon="📅" 
                                text="Adventure Map" 
                                href="/calendar" 
                                isActive={pathname === "/calendar"}
                            />
                        </div>
                        
                        {/* User Info in Mobile Menu */}
                        <div className="mt-auto pt-8 border-t border-purple-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                                    <FaUser className="text-white text-lg" />
                                </div>
                                <div>
                                    <p className="font-bold text-purple-800">
                                        {user?.displayName || "Super Star"}
                                    </p>
                                    <p className="text-sm text-purple-600">
                                        {user?.email || "Ready to play?"}
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-linear-to-r from-pink-400 to-purple-400 text-white rounded-xl hover:shadow-xl transition-all"
                            >
                                <FaSignOutAlt /> 
                                <span className="font-medium">Sign Out</span>
                                <span className="ml-auto">🚪</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
    );
}

function PlayfulLink({ icon, text, href, isActive }) {
    return (
        <Link href={href}>
            <div className="relative">
                <div className={`
                flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300
                ${isActive 
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
                    : 'bg-white/90 text-purple-700 hover:bg-linear-to-r from-purple-400 to-pink-400 hover:text-white'
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

// NEW: Mobile NavLink Component
function MobileNavLink({ icon, text, href, isActive }) {
    return (
        <Link href={href} className="m-2">
            <div className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white/50 text-purple-700 hover:bg-linear-to-r from-purple-400 to-pink-400 hover:text-white'
                }
            `}>
                <div className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                    {icon}
                </div>
                <span className="font-medium text-lg">{text}</span>
                {isActive && (
                    <div className="ml-auto w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                )}
            </div>
        </Link>
    );
}