import React, { useState } from 'react';

interface IngredientInputProps {
  onGenerate: (ingredients: string[], cookingMethod: string) => void;
  isLoading: boolean;
  lastUsedIngredients: { ingredients: string[], cookingMethod: string } | null;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ onGenerate, isLoading, lastUsedIngredients }) => {
  const [ingredients, setIngredients] = useState<string[]>(['Картофель', 'Лук', 'Курица']);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.map(i => i.toLowerCase()).includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const isSameQueryAsLast = lastUsedIngredients !== null &&
    JSON.stringify(lastUsedIngredients.ingredients.sort()) === JSON.stringify(ingredients.sort()) &&
    lastUsedIngredients.cookingMethod === cookingMethod;
  
  const buttonText = isSameQueryAsLast ? 'Еще рецепт!' : 'Сгенерировать Рецепт';
  const buttonTitle = isSameQueryAsLast ? 'Сгенерировать другой вариант из тех же продуктов' : 'Сгенерировать рецепт из указанных продуктов';

  return (
    <div className="w-full lg:w-2/5 xl:w-1/3 bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Ваши Ингредиенты</h2>
        <p className="text-slate-300">Что у вас есть в холодильнике?</p>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Например, 'Томаты'"
          disabled={isLoading}
          className="flex-grow bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
        />
        <button
          onClick={handleAddIngredient}
          disabled={isLoading || !currentIngredient.trim()}
          className="bg-indigo-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200"
        >
          Добавить
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="bg-slate-700 text-white rounded-full flex items-center gap-2 px-4 py-2 text-sm animate-fade-in">
              <span>{ingredient}</span>
              <button onClick={() => handleRemoveIngredient(ingredient)} disabled={isLoading} className="text-slate-400 hover:text-white transition">
                &times;
              </button>
            </div>
          ))}
          {ingredients.length === 0 && (
              <p className="text-slate-500 w-full text-center py-4">Список ингредиентов пуст.</p>
          )}
        </div>
      </div>

      <div>
          <label htmlFor="cookingMethod" className="block text-sm font-medium text-slate-200 mb-2">Способ приготовления (необязательно)</label>
          <input
              id="cookingMethod"
              type="text"
              value={cookingMethod}
              onChange={(e) => setCookingMethod(e.target.value)}
              placeholder="Например, 'Жарка', 'В духовке'"
              disabled={isLoading}
              className="w-full bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
          />
      </div>
      
      <button
        onClick={() => onGenerate(ingredients, cookingMethod)}
        disabled={isLoading || ingredients.length === 0}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg py-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition transform hover:scale-105 duration-300 shadow-lg mt-auto"
        title={buttonTitle}
      >
        {isLoading ? 'Генерация...' : buttonText}
      </button>
    </div>
  );
};