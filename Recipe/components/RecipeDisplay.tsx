import React from 'react';
import { Recipe } from '../types';

interface RecipeDisplayProps {
  recipe: Recipe | null;
  error: string | null;
}

const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
    </svg>
);


export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, error }) => {
  if (error) {
    return (
      <div className="w-full lg:w-3/5 xl:w-2/3 bg-red-900 bg-opacity-50 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center text-white animate-fade-in">
        <h3 className="text-2xl font-bold text-red-300 mb-4">Произошла ошибка</h3>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="w-full lg:w-3/5 xl:w-2/3 bg-slate-800 bg-opacity-30 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-400 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-3xl font-bold mb-2">Готовы к кулинарным открытиям?</h3>
        <p className="text-slate-400 max-w-md">Добавьте имеющиеся у вас продукты, и наш ИИ-шеф-повар предложит вам восхитительный рецепт.</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-3/5 xl:w-2/3 bg-slate-800 p-8 rounded-2xl shadow-2xl text-white animate-fade-in overflow-y-auto h-full">
      {recipe.imageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          <img src={recipe.imageUrl} alt={recipe.recipeName} className="w-full h-80 object-cover" />
        </div>
      )}
      <h2 className="text-4xl font-bold text-indigo-400 mb-3">{recipe.recipeName}</h2>
      <p className="text-slate-300 italic mb-6">{recipe.description}</p>
      
      <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 mb-6">
          <p className="text-lg font-medium text-slate-200 flex items-center"><ClockIcon />{recipe.prepTime}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4 border-b-2 border-indigo-500 pb-2">Ингредиенты</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 border-b-2 border-indigo-500 pb-2">Инструкция</h3>
          <ol className="list-decimal list-inside space-y-3 text-slate-300">
            {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
};