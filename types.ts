export interface UserPreferences {
  hungerLevel: 1 | 2 | 3; // 1: Snack, 2: Meal, 3: Feast
  objective: string; // e.g., 'Healthy', 'Comfort', 'Quick', 'Muscle Gain'
  texture: 'Dry' | 'Moist' | 'Balanced';
}

export interface IngredientInput {
  text: string;
  image: File | null;
  imagePreviewUrl: string | null;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  timeToCook: string; // e.g., "15 mins"
  tags: string[];
}

export enum AppView {
  LOGIN = 'LOGIN',
  INPUT = 'INPUT',
  PREFERENCES = 'PREFERENCES',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
}

export interface User {
  email: string;
  name: string;
}