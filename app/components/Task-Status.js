"use client"
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaFire } from 'react-icons/fa';

const TaskStatusWidget = ({ 
    totalTasks = 0, 
    completedTasks = 0, 
    overdueTasks = 0 
}) => {
    const [motivation, setMotivation] = useState("");
    const [productivityScore, setProductivityScore] = useState(0);
    
    useEffect(() => {
        calculateMotivation();
        calculateProductivityScore();
    }, [totalTasks, completedTasks, overdueTasks]);
    
    const calculateProductivityScore = () => {
        if (totalTasks === 0) return 0;
        const score = Math.round((completedTasks / totalTasks) * 100);
        setProductivityScore(isNaN(score) ? 0 : score);
    };
    
    const calculateMotivation = () => {
        if (totalTasks === 0) {
            setMotivation("No tasks? Time to relax! 🎉");
            return;
        }
        
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        if (overdueTasks > completedTasks) {
            const messages = [
                "🫠 Behind schedule? Just call it 'strategic delay'!",
                "🔥 Behind but on fire (in a good way... right?)",
                "🎪 Welcome to the procrastination circus!",
                "🔄 Overdue tasks are just... future tasks!"
            ];
            setMotivation(messages[Math.floor(Math.random() * messages.length)]);
        } else if (completionRate >= 80) {
            const messages = [
                "🏆 Crushing it! Almost too productive!",
                "🌟 You're on fire! Take a well-deserved break!",
                "💪 Productivity machine! Keep going!",
                "✨ Making progress look easy!"
            ];
            setMotivation(messages[Math.floor(Math.random() * messages.length)]);
        } else if (completionRate >= 50) {
            setMotivation("📈 Making progress! Keep that momentum! 💪");
        } else {
            const messages = [
                "🚧 Progress is progress! Baby steps count!",
                "🌱 Every completed task is a win!",
                "🎯 One task at a time, you got this!",
                "💫 Starting is the hardest part - you're doing it!"
            ];
            setMotivation(messages[Math.floor(Math.random() * messages.length)]);
        }
    };
    
    const getProgressColor = () => {
        if (totalTasks === 0) return "from-purple-300 to-pink-300";
        const rate = completedTasks / totalTasks;
        if (rate >= 0.8) return "from-green-400 to-emerald-500";
        if (rate >= 0.5) return "from-yellow-400 to-orange-400";
        if (rate >= 0.3) return "from-orange-400 to-pink-500";
        return "from-pink-500 to-purple-600";
    };
    
    const getMoodEmoji = () => {
        if (totalTasks === 0) return "😴";
        if (completedTasks === totalTasks) return "🏆";
        const rate = completedTasks / totalTasks;
        if (rate >= 0.8) return "🚀";
        if (rate >= 0.6) return "💪";
        if (rate >= 0.4) return "😌";
        if (rate >= 0.2) return "🤔";
        if (overdueTasks > 0) return "🔥";
        return "🎯";
    };
    
    return (
        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                        <FaFire className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="font-bold text-purple-900">Task Forge Status</h3>
                        <p className="text-xs text-purple-600">Current mission progress</p>
                    </div>
                </div>
                <span className="text-3xl">{getMoodEmoji()}</span>
            </div>
            
            {/* Progress bar */}
            <div className="mb-5">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Completion</span>
                    <span className="text-sm font-bold text-purple-900">{productivityScore}%</span>
                </div>
                <div className="h-3 bg-purple-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full bg-linear-to-r ${getProgressColor()} transition-all duration-500`}
                        style={{ 
                            width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` 
                        }}
                    ></div>
                </div>
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/60 rounded-xl p-3 text-center border border-purple-100">
                    <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 bg-linear-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white text-sm" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{completedTasks}</div>
                    <div className="text-xs text-purple-700">Done ✅</div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-3 text-center border border-purple-100">
                    <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-300 to-cyan-300 rounded-full flex items-center justify-center">
                            <FaClock className="text-white text-sm" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{totalTasks - completedTasks}</div>
                    <div className="text-xs text-purple-700">Pending ⏳</div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-3 text-center border border-purple-100">
                    <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 bg-linear-to-br from-orange-300 to-red-300 rounded-full flex items-center justify-center">
                            <FaExclamationTriangle className="text-white text-sm" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{overdueTasks}</div>
                    <div className="text-xs text-purple-700">Overdue 🔥</div>
                </div>
            </div>
            
            {/* Motivation message */}
            <div className="bg-white/70 rounded-xl p-3 border border-purple-100">
                <p className="text-sm text-purple-800 font-medium text-center">
                    {motivation}
                </p>
            </div>
            
            {/* Footer */}
            <div className="text-center mt-4 pt-3 border-t border-purple-100">
                <p className="text-xs text-purple-600">
                    {totalTasks === 0 ? "📝 Add some tasks to begin!" : 
                     completedTasks === totalTasks ? "🎉 All tasks completed!" :
                     `📊 ${completedTasks} of ${totalTasks} conquered`}
                </p>
            </div>
        </div>
    );
};

export default TaskStatusWidget;