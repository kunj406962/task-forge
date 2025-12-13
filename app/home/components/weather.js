"use client"
import { useEffect, useState } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiDayHaze } from 'react-icons/wi';
import { FaCloudSun, FaCloudMoonRain, FaTemperatureHigh, FaTemperatureLow } from 'react-icons/fa';

const WEATHER_API={
    key: process.env.NEXT_PUBLIC_WEATER_API_KEY,
    base: "https://api.openweathermap.org/data/2.5/"
}

const WeatherWidget = ({ user }) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        if (!user) return;
        fetchWeather();
        const intervalId = setInterval(fetchWeather, 6 * 60 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [user]);

    const fetchWeather = async () => {
        try {
            const response = await fetch(
                `${WEATHER_API.base}weather?q=Calgary&units=metric&appid=${WEATHER_API.key}`
            );
            const result = await response.json();
            setWeather(result);
        } catch (error) {
            console.error("Weather fetch failed:", error);
        }
    };

    const getWeatherIcon = () => {
        if (!weather?.weather?.[0]) return <WiDaySunny className="w-12 h-12 text-yellow-400" />;
        const condition = weather.weather[0].main.toLowerCase();
        if (condition.includes('rain')) return <WiRain className="w-12 h-12 text-blue-500" />;
        if (condition.includes('snow')) return <WiSnow className="w-12 h-12 text-blue-300" />;
        if (condition.includes('cloud')) return <WiCloudy className="w-12 h-12 text-gray-500" />;
        if (condition.includes('haze') || condition.includes('mist')) return <WiDayHaze className="w-12 h-12 text-gray-400" />;
        return <WiDaySunny className="w-12 h-12 text-yellow-400" />;
    };

    const getFunMessage = () => {
        if (!weather?.weather?.[0]) return "🌤️ Checking the forecast...";
        const temp = weather.main.temp;
        const condition = weather.weather[0].main.toLowerCase();
        
        if (condition.includes('rain')) return "🌧️ Rain's falling - perfect excuse for more coffee!";
        if (condition.includes('snow')) return "❄️ Snow day! Hot chocolate mandatory!";
        if (temp > 28) return "🔥 Hotter than your laptop processor!";
        if (temp < -5) return "🥶 Colder than your ex's heart!";
        if (temp > 22) return "😎 Perfect weather for outdoor... procrastination!";
        return "🌈 Decent day to be productive (or not)!";
    };

    const getMoodEmoji = () => {
        if (!weather?.weather?.[0]) return "🤔";
        const temp = weather.main.temp;
        if (temp > 25) return "🥵";
        if (temp < 0) return "🥶";
        if (weather.weather[0].main.includes('Rain')) return "☔";
        if (weather.weather[0].main.includes('Snow')) return "⛄";
        return "😊";
    };

    return (
        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-sm">
            {/* Fun header with emoji */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🌦️</span>
                    </div>
                    <h3 className="font-bold text-purple-800">Sky Mood</h3>
                </div>
                <span className="text-2xl">{getMoodEmoji()}</span>
            </div>
            
            {/* Fun message bubble */}
            <div className="bg-white/70 rounded-xl p-3 mb-4 border border-purple-100">
                <p className="text-sm text-purple-800 font-medium">
                    {getFunMessage()}
                </p>
            </div>
            
            {/* Weather content */}
            <div className="flex items-center justify-between">
                {/* Left: Icon and temp */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        {getWeatherIcon()}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-300 rounded-full flex items-center justify-center">
                            <span className="text-xs">✨</span>
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-3xl font-bold bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                            {weather ? `${Math.round(weather.main.temp)}°C` : "--"}
                        </div>
                        <div className="text-xs text-purple-600 flex items-center space-x-2 mt-1">
                            {weather?.main?.feels_like && (
                                <>
                                    {weather.main.feels_like > weather.main.temp ? (
                                        <FaTemperatureHigh className="text-orange-500" />
                                    ) : (
                                        <FaTemperatureLow className="text-blue-500" />
                                    )}
                                    <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Right: Details */}
                <div className="text-right">
                    <div className="text-sm font-semibold text-purple-900 mb-1">Calgary</div>
                    <div className="text-xs text-purple-600 capitalize mb-2">
                        {weather?.weather?.[0]?.description || "Loading..."}
                    </div>
                    <button 
                        onClick={fetchWeather}
                        className="text-xs bg-linear-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-purple-800 px-3 py-1 rounded-full font-medium transition-all hover:scale-105"
                    >
                        ↻ Refresh
                    </button>
                </div>
            </div>
            
            {/* Tiny extra info */}
            {weather && (
                <div className="flex justify-between mt-4 pt-3 border-t border-purple-100">
                    <div className="text-xs text-purple-700 flex items-center">
                        💨 <span className="ml-1">{weather.wind?.speed || 0} m/s</span>
                    </div>
                    <div className="text-xs text-purple-700 flex items-center">
                        💧 <span className="ml-1">{weather.main?.humidity || 0}%</span>
                    </div>
                    <div className="text-xs text-purple-700 flex items-center">
                        🏔️ <span className="ml-1">Calgary</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;