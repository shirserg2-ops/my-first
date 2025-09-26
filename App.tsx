import React, { useState } from 'react';
import { IngredientInput } from './components/IngredientInput';
import { RecipeDisplay } from './components/RecipeDisplay';
import { Loader } from './components/Loader';
import { generateRecipe, generateImage, generateMealPlan } from './services/geminiService';
import { Recipe, WeeklyPlan } from './types';
import { MealPlanGenerator } from './components/MealPlanGenerator';

const App: React.FC = () => {
  // State for view
  const [view, setView] = useState<'recipe' | 'mealPlan'>('recipe');

  // State for single recipe
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [recipeHistory, setRecipeHistory] = useState<string[]>([]);
  const [lastUsedIngredients, setLastUsedIngredients] = useState<{ ingredients: string[], cookingMethod: string } | null>(null);
  
  // State for meal plan
  const [mealPlan, setMealPlan] = useState<WeeklyPlan | null>(null);
  const [isMealPlanLoading, setIsMealPlanLoading] = useState(false);
  const [mealPlanError, setMealPlanError] = useState<string | null>(null);
  const [mealPlanInputs, setMealPlanInputs] = useState({calories: '2000', preferences: '', exclusions: ''});


  const handleGenerateRecipe = async (ingredients: string[], cookingMethod: string) => {
    setIsRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);
    
    const isNewQuery = !lastUsedIngredients ||
        JSON.stringify(lastUsedIngredients.ingredients.sort()) !== JSON.stringify(ingredients.sort()) ||
        lastUsedIngredients.cookingMethod !== cookingMethod;

    const historyForAPI = isNewQuery ? [] : recipeHistory;

    try {
      const newRecipe = await generateRecipe(ingredients, cookingMethod, historyForAPI);
      const imageUrl = await generateImage(newRecipe.recipeName, newRecipe.description);
      
      setRecipe({ ...newRecipe, imageUrl });
      setLastUsedIngredients({ ingredients, cookingMethod });

      if (isNewQuery) {
        setRecipeHistory([newRecipe.recipeName]);
      } else {
        setRecipeHistory(prev => [newRecipe.recipeName, ...prev].slice(0, 5));
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setRecipeError(err.message);
      } else {
        setRecipeError('Произошла неизвестная ошибка.');
      }
    } finally {
      setIsRecipeLoading(false);
    }
  };

  const handleGenerateMealPlan = async (inputs: {calories: string, preferences: string, exclusions: string}) => {
    setIsMealPlanLoading(true);
    setMealPlanError(null);
    setMealPlan(null);
    setMealPlanInputs(inputs); // Save inputs for re-generation
    try {
        const newPlan = await generateMealPlan(inputs.calories, inputs.preferences, inputs.exclusions);
        setMealPlan(newPlan);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setMealPlanError(err.message);
        } else {
            setMealPlanError('Произошла неизвестная ошибка.');
        }
    } finally {
        setIsMealPlanLoading(false);
    }
  };

  const handleRegenerateMealPlan = () => {
      handleGenerateMealPlan(mealPlanInputs);
  }

  // Header component for navigation
  const Header = () => (
    <div className="w-full max-w-7xl mb-6">
      <div className="flex bg-slate-800/50 rounded-xl p-2 gap-2">
        <button
          onClick={() => setView('recipe')}
          aria-current={view === 'recipe'}
          className={`w-1/2 py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 ${view === 'recipe' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-300 hover:bg-slate-700'}`}
        >
          Рецепт по ингредиентам
        </button>
        <button
          onClick={() => setView('mealPlan')}
          aria-current={view === 'mealPlan'}
          className={`w-1/2 py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 ${view === 'mealPlan' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-300 hover:bg-slate-700'}`}
        >
          План питания на неделю
        </button>
      </div>
    </div>
  );

  return (
    <main 
      className="bg-slate-900 min-h-screen text-white p-4 sm:p-8 flex flex-col items-center"
    >
      <div className="w-full flex flex-col items-center h-full max-h-screen">
        <Header />
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 flex-grow h-[calc(100vh-140px)]">
          {view === 'recipe' && (
            <>
              <IngredientInput 
                onGenerate={handleGenerateRecipe} 
                isLoading={isRecipeLoading}
                lastUsedIngredients={lastUsedIngredients}
              />
              <div className="w-full lg:w-3/5 xl:w-2/3 flex items-center justify-center">
                  {isRecipeLoading ? <Loader /> : <RecipeDisplay recipe={recipe} error={recipeError} />}
              </div>
            </>
          )}
          {view === 'mealPlan' && (
            <MealPlanGenerator
              onGenerate={handleGenerateMealPlan}
              onRegenerate={handleRegenerateMealPlan}
              isLoading={isMealPlanLoading}
              error={mealPlanError}
              plan={mealPlan}
            />
          )}
        </div>
        <footer className="text-center text-slate-500 mt-4 text-sm">
          <p>Создано с помощью Gemini API</p>
        </footer>
      </div>
    </main>
  );
};

export default App;