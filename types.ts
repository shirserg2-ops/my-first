export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  imageUrl?: string;
}

// New types for Meal Plan
export interface PFC {
    proteins: number;
    fats: number;
    carbs: number;
}

export interface Meal {
    name: string;
    calories: number;
    pfc: PFC;
    ingredients: string[];
    instructions: string[];
}

export interface DayPlan {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
}

export interface WeeklyPlanDay {
    day: string; // e.g., "Понедельник"
    meals: DayPlan;
}

export type WeeklyPlan = WeeklyPlanDay[];
