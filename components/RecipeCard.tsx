import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  delay: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, delay }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{recipe.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {recipe.calories} kcal
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {recipe.timeToCook}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {recipe.description}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Ingredientes</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <span key={idx} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Instruções</h4>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="text-sm text-slate-600 leading-relaxed pl-1">
                  <span className="text-slate-800">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};