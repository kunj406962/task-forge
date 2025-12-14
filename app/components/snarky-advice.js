"use client"
import { useState, useEffect } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

const SnarkyAdviceWidget = () => {
    const [advice, setAdvice] = useState("");
    const [loading, setLoading] = useState(true);
    const [emoji, setEmoji] = useState("🤔");

    const fetchAdvice = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://api.adviceslip.com/advice");
            const data = await response.json();
            setAdvice(data.slip.advice);
            
            // Random emoji
            const emojis = ["💡", "🎯", "✨", "🧠", "🌟", "🫠", "😏", "🙃", "🤨", "😌"];
            setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        } catch (error) {
            console.error("Advice fetch failed:", error);
            setAdvice("Even advice needs advice sometimes.");
            setEmoji("😅");
        } finally {
            setLoading(false);
        }
    };

    const addSnark = (text) => {
        const snarks = [
            " (Probably 🤷‍♂️)",
            " (Or don't 🙃)",
            " (Maybe 🫠)",
            " (Take with salt 🧂)",
            " (¯\\_(ツ)_/¯)",
            " (YMMV 📊)",
            " (No guarantees 🎲)",
            " (Results may vary 🎭)"
        ];
        return text + snarks[Math.floor(Math.random() * snarks.length)];
    };

    useEffect(() => {
        fetchAdvice();
    }, []);

    return (
        <div className="flex flex-col justify-between bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">{emoji}</span>
                    <h3 className="font-bold text-purple-800">Random Wisdom</h3>
                </div>
                <button 
                    onClick={fetchAdvice}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center hover:underline"
                >
                    <FaSyncAlt className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Loading...' : 'New'}
                </button>
            </div>
            
            <div className="mb-4">
                {loading ? (
                    <div className="text-purple-700 text-center py-2">
                        💭 Thinking...
                    </div>
                ) : (
                    <p className="text-purple-900 text-lg">
                        "{addSnark(advice)}"
                    </p>
                )}
            </div>
            
            <div className="text-xs text-purple-600 italic text-center border-t border-purple-100 pt-3">
                ⚠️ Not responsible for life choices made here
            </div>
        </div>
    );
};

export default SnarkyAdviceWidget;