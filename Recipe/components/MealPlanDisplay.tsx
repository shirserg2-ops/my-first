import React, { useState } from 'react';
import { WeeklyPlan, Meal } from '../types';
import { AccordionItem } from './Accordion';

const MealDetails: React.FC<{ meal: Meal }> = ({ meal }) => (
    <div className="text-slate-300">
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 mb-4 text-sm flex flex-wrap gap-x-4 gap-y-2 justify-around">
            <span className="font-semibold text-white">{meal.calories} ккал</span>
            <span>Белки: {meal.pfc.proteins}г</span>
            <span>Жиры: {meal.pfc.fats}г</span>
            <span>Углеводы: {meal.pfc.carbs}г</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-semibold text-lg mb-2 text-indigo-400">Ингредиенты</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {meal.ingredients.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-2 text-indigo-400">Инструкция</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {meal.instructions.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
            </div>
        </div>
    </div>
);


export const MealPlanDisplay: React.FC<{ plan: WeeklyPlan }> = ({ plan }) => {
    const [openDay, setOpenDay] = useState<number | null>(0); // Open first day by default
    const [openMeal, setOpenMeal] = useState<string | null>(null); // e.g., '0-breakfast'

    const handleDayClick = (index: number) => {
        setOpenDay(openDay === index ? null : index);
        setOpenMeal(null); // Close meals when day is toggled
    };
    
    const handleMealClick = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner') => {
        const mealId = `${dayIndex}-${mealType}`;
        setOpenMeal(openMeal === mealId ? null : mealId);
    };

    return (
        <div className="w-full bg-slate-800 p-6 rounded-2xl shadow-2xl text-white animate-fade-in overflow-y-auto h-full">
            <h2 className="text-3xl font-bold text-indigo-400 mb-4">Ваш План Питания на Неделю</h2>
            <div>
                {plan.map((dayPlan, dayIndex) => (
                    <AccordionItem
                        key={dayIndex}
                        title={<span className="text-2xl font-bold">{dayPlan.day}</span>}
                        isOpen={openDay === dayIndex}
                        onClick={() => handleDayClick(dayIndex)}
                    >
                        <div className="flex flex-col gap-2 pl-4">
                            <AccordionItem
                                title={<span className="text-xl font-semibold">Завтрак: <span className="font-normal italic">{dayPlan.meals.breakfast.name}</span></span>}
                                isOpen={openMeal === `${dayIndex}-breakfast`}
                                onClick={() => handleMealClick(dayIndex, 'breakfast')}
                            >
                                <MealDetails meal={dayPlan.meals.breakfast} />
                            </AccordionItem>
                             <AccordionItem
                                title={<span className="text-xl font-semibold">Обед: <span className="font-normal italic">{dayPlan.meals.lunch.name}</span></span>}
                                isOpen={openMeal === `${dayIndex}-lunch`}
                                onClick={() => handleMealClick(dayIndex, 'lunch')}
                            >
                                <MealDetails meal={dayPlan.meals.lunch} />
                            </AccordionItem>
                             <AccordionItem
                                title={<span className="text-xl font-semibold">Ужин: <span className="font-normal italic">{dayPlan.meals.dinner.name}</span></span>}
                                isOpen={openMeal === `${dayIndex}-dinner`}
                                onClick={() => handleMealClick(dayIndex, 'dinner')}
                            >
                                <MealDetails meal={dayPlan.meals.dinner} />
                            </AccordionItem>
                        </div>
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};