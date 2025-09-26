import React, { useState } from 'react';
import { WeeklyPlan } from '../types';
import { MealPlanDisplay } from './MealPlanDisplay';
import { Loader } from './Loader';

interface MealPlanGeneratorProps {
    onGenerate: (inputs: { calories: string; preferences: string; exclusions: string; }) => void;
    onRegenerate: () => void;
    isLoading: boolean;
    error: string | null;
    plan: WeeklyPlan | null;
}

export const MealPlanGenerator: React.FC<MealPlanGeneratorProps> = ({ onGenerate, onRegenerate, isLoading, error, plan }) => {
    const [calories, setCalories] = useState('2000');
    const [preferences, setPreferences] = useState('');
    const [exclusions, setExclusions] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({ calories, preferences, exclusions });
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-8 h-full">
            {/* Form Section */}
            <div className="w-full lg:w-2/5 xl:w-1/3 bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 h-full">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">План Питания</h2>
                        <p className="text-slate-300">Настройте ваш рацион на неделю.</p>
                    </div>
                    
                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium text-slate-200 mb-2">Количество ккал в сутки</label>
                        <input
                            id="calories"
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            placeholder="Например, 2000"
                            disabled={isLoading}
                            required
                            className="w-full bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                        />
                    </div>

                    <div className="flex-grow flex flex-col">
                        <label htmlFor="preferences" className="block text-sm font-medium text-slate-200 mb-2">Пожелания</label>
                        <textarea
                            id="preferences"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                            placeholder="Например, 'Больше рыбы, вегетарианские ужины'"
                            disabled={isLoading}
                            rows={4}
                            className="w-full flex-grow bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 resize-none"
                        />
                    </div>
                    
                    <div className="flex-grow flex flex-col">
                        <label htmlFor="exclusions" className="block text-sm font-medium text-slate-200 mb-2">Исключения</label>
                        <textarea
                            id="exclusions"
                            value={exclusions}
                            onChange={(e) => setExclusions(e.target.value)}
                            placeholder="Например, 'Без свинины, аллергия на орехи'"
                            disabled={isLoading}
                            rows={4}
                            className="w-full flex-grow bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 resize-none"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !calories}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg py-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition transform hover:scale-105 duration-300 shadow-lg"
                    >
                        {isLoading ? 'Составляем план...' : 'Разработать меню'}
                    </button>
                </form>
            </div>
            
            {/* Display Section */}
            <div className="w-full lg:w-3/5 xl:w-2/3 flex items-center justify-center">
                {isLoading && <Loader />}
                {!isLoading && error && (
                    <div className="w-full bg-red-900 bg-opacity-50 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center text-white animate-fade-in">
                        <h3 className="text-2xl font-bold text-red-300 mb-4">Произошла ошибка</h3>
                        <p className="text-red-200">{error}</p>
                    </div>
                )}
                {!isLoading && !error && plan && (
                    <div className="w-full h-full flex flex-col gap-4">
                        <MealPlanDisplay plan={plan} />
                        <button
                            onClick={onRegenerate}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-lg py-4 rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition transform hover:scale-105 duration-300 shadow-lg mt-auto"
                        >
                            {isLoading ? 'Генерация...' : 'Еще вариант!'}
                        </button>
                    </div>
                )}
                {!isLoading && !error && !plan && (
                     <div className="w-full bg-slate-800 bg-opacity-30 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-400 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7V3a1 1 0 011-1h4a1 1 0 011 1v4m-4 5v6m-6-3h12M4 11h16M4 7h16" />
                        </svg>
                        <h3 className="text-3xl font-bold mb-2">Ваш персональный диетолог</h3>
                        <p className="text-slate-400 max-w-md">Заполните форму, чтобы получить индивидуальный план питания на целую неделю.</p>
                    </div>
                )}
            </div>
        </div>
    );
};