import React from 'react';
import { Button } from './Button';
import { UserPreferences } from '../types';

interface PreferenceStepProps {
  data: UserPreferences;
  onChange: (data: UserPreferences) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const PreferenceStep: React.FC<PreferenceStepProps> = ({ data, onChange, onSubmit, onBack }) => {
  
  const objectives = [
    { id: 'Healthy', label: '🥗 Alimentação Saudável', desc: 'Equilibrada e nutritiva' },
    { id: 'Comfort', label: '🍲 Comida Confortável', desc: 'Quente e saborosa' },
    { id: 'Quick', label: '⚡ Refeição Rápida', desc: 'Pronto em < 20 min' },
    { id: 'Muscle', label: '💪 Ganho de Massa', desc: 'Rico em proteína' },
  ];

  const textureLabels: Record<string, string> = {
    'Dry': 'Seco',
    'Balanced': 'Equilibrado',
    'Moist': 'Úmido'
  };

  const update = (key: keyof UserPreferences, value: any) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Personalize sua refeição</h2>
        <p className="text-slate-500">Ajude a IA a entender o que você deseja.</p>
      </div>

      <div className="space-y-8">
        
        {/* Hunger Level */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-4">
            Qual o tamanho da sua fome? (1-3)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => update('hungerLevel', level)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                  data.hungerLevel === level 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-slate-100 bg-white text-slate-400 hover:border-emerald-200'
                }`}
              >
                <span className="text-2xl mb-2">
                  {level === 1 ? '🍎' : level === 2 ? '🍽️' : '🦁'}
                </span>
                <span className="font-medium text-sm">
                  {level === 1 ? 'Lanche' : level === 2 ? 'Refeição' : 'Banquete'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-4">
            Objetivo da Refeição
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {objectives.map((obj) => (
              <button
                key={obj.id}
                onClick={() => update('objective', obj.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  data.objective === obj.id 
                    ? 'border-emerald-500 ring-1 ring-emerald-500 bg-white' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-800">{obj.label}</div>
                <div className="text-xs text-slate-500 mt-1">{obj.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Texture */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-4">
            Preferência de Textura
          </label>
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {['Dry', 'Balanced', 'Moist'].map((tex) => (
              <button
                key={tex}
                onClick={() => update('texture', tex)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  data.texture === tex 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {textureLabels[tex]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button onClick={onSubmit} className="flex-[2] shadow-lg shadow-emerald-200">
            Gerar Receitas ✨
          </Button>
        </div>
      </div>
    </div>
  );
};