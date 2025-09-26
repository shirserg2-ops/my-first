import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, WeeklyPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: {
      type: Type.STRING,
      description: "Название блюда на русском языке.",
    },
    description: {
      type: Type.STRING,
      description: "Краткое, аппетитное описание блюда на русском языке.",
    },
    prepTime: {
        type: Type.STRING,
        description: "Примерное время приготовления, например '30 минут'.",
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Список необходимых ингредиентов с количеством/пропорциями, на русском языке. Включи как предоставленные ингредиенты, так и возможные дополнительные (например, соль, перец, масло).",
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Пошаговая инструкция приготовления на русском языке.",
    },
  },
  required: ["recipeName", "description", "prepTime", "ingredients", "instructions"],
};

export async function generateRecipe(ingredients: string[], cookingMethod: string, history: string[]): Promise<Recipe> {
  const cookingMethodPrompt = cookingMethod 
    ? `Особое внимание удели способу приготовления: '${cookingMethod}'.` 
    : 'Выбери наиболее подходящий способ приготовления.';

  const historyPrompt = history.length > 0
    ? `Важно: не предлагай следующие рецепты, так как они уже были показаны пользователю: ${history.join(', ')}. Предложи что-то совершенно новое.`
    : '';
    
  const prompt = `
    Ты - опытный шеф-повар. Твоя задача - создать вкусный и простой рецепт на русском языке, используя в основном следующие ингредиенты: ${ingredients.join(', ')}.
    ${cookingMethodPrompt}
    ${historyPrompt}
    Ты можешь добавлять базовые ингредиенты, такие как соль, перец, вода, растительное масло, если это необходимо для рецепта.
    Сгенерируй только один рецепт. Ответ должен быть строго в формате JSON, соответствующем предоставленной схеме. Не добавляй никаких других слов или объяснений до или после JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const recipeData = JSON.parse(jsonText);
    return recipeData as Recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Не удалось сгенерировать рецепт. Проверьте консоль для получения дополнительной информации и попробуйте еще раз.");
  }
}

export async function generateImage(recipeName: string, recipeDescription: string): Promise<string> {
    const prompt = `Фотография блюда "${recipeName}". ${recipeDescription}. Еда выглядит очень аппетитно. Профессиональная фуд-фотография, высокое качество, студийный свет, 16:9 соотношение сторон.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            console.warn("Image generation returned no images.");
            return "";
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return ""; // Return empty string on error to not block UI
    }
}

// New Schema and function for Meal Plan
const mealObjectSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Название блюда." },
        calories: { type: Type.INTEGER, description: "Количество килокалорий в блюде." },
        pfc: {
            type: Type.OBJECT,
            properties: {
                proteins: { type: Type.INTEGER, description: "Количество белков в граммах." },
                fats: { type: Type.INTEGER, description: "Количество жиров в граммах." },
                carbs: { type: Type.INTEGER, description: "Количество углеводов в граммах." },
            },
            required: ["proteins", "fats", "carbs"]
        },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Список ингредиентов для блюда."
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Пошаговая инструкция приготовления."
        }
    },
    required: ["name", "calories", "pfc", "ingredients", "instructions"]
};

const mealPlanSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            day: {
                type: Type.STRING,
                description: "Название дня недели на русском языке (например, 'Понедельник')."
            },
            meals: {
                type: Type.OBJECT,
                properties: {
                    breakfast: mealObjectSchema,
                    lunch: mealObjectSchema,
                    dinner: mealObjectSchema,
                },
                required: ["breakfast", "lunch", "dinner"]
            }
        },
        required: ["day", "meals"]
    }
};

export async function generateMealPlan(calories: string, preferences: string, exclusions: string): Promise<WeeklyPlan> {
    const prompt = `
      Ты - профессиональный диетолог и шеф-повар.
      Твоя задача - составить разнообразный, сбалансированный и вкусный план питания на 7 дней (с понедельника по воскресенье).

      Требования:
      1.  **Калорийность:** Суточная калорийность должна строго соответствовать ${calories} ккал. Распредели калории равномерно между тремя приемами пищи: завтрак, обед и ужин.
      2.  **Баланс БЖУ:** Обеспечь хороший баланс белков, жиров и углеводов в течение дня и недели.
      3.  **Разнообразие:** Блюда не должны повторяться в течение недели.
      4.  **Предпочтения:** Учти следующие пожелания пользователя: "${preferences || 'Нет особых пожеланий.'}".
      5.  **Исключения:** Полностью исключи из меню следующие продукты и ингредиенты: "${exclusions || 'Нет исключений.'}".
      6.  **Рецепты:** Для каждого блюда предоставь краткий, но понятный рецепт (список ингредиентов и пошаговую инструкцию).
      7.  **Формат:** Ответ должен быть строго в формате JSON, соответствующем предоставленной схеме. Не добавляй никаких других слов или объяснений до или после JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: mealPlanSchema,
            },
        });

        const jsonText = response.text.trim();
        const mealPlanData = JSON.parse(jsonText);
        return mealPlanData as WeeklyPlan;
    } catch (error) {
        console.error("Error generating meal plan:", error);
        throw new Error("Не удалось сгенерировать план питания. Проверьте консоль для получения дополнительной информации и попробуйте еще раз.");
    }
}