import React, { useState } from 'react';
import { AppView, IngredientInput, User, UserPreferences, Recipe } from './types';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { InputStep } from './components/InputStep';
import { PreferenceStep } from './components/PreferenceStep';
import { RecipeCard } from './components/RecipeCard';
import { Loading } from './components/Loading';
import { Button } from './components/Button';
import { generateRecipes } from './services/geminiService';

const defaultPreferences: UserPreferences = {
  hungerLevel: 2,
  objective: 'Healthy',
  texture: 'Balanced',
};

const defaultInput: IngredientInput = {
  text: '',
  image: null,
  imagePreviewUrl: null,
  audioBlob: null,
  audioUrl: null,
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [inputData, setInputData] = useState<IngredientInput>(defaultInput);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setView(AppView.INPUT);
  };

  const handleLogout = () => {
    setUser(null);
    setRecipes([]);
    setInputData(defaultInput);
    setView(AppView.LOGIN);
  };

  const handleGenerate = async () => {
    setView(AppView.LOADING);
    setError(null);
    try {
      // Pass the entire inputData object which now contains text, image, and audio
      const generatedRecipes = await generateRecipes(
        inputData, 
        preferences
      );
      setRecipes(generatedRecipes);
      setView(AppView.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar receitas. Por favor, tente novamente.");
      setView(AppView.PREFERENCES); // Go back to let them try again
    }
  };

  const resetFlow = () => {
    setRecipes([]);
    setInputData(defaultInput);
    setPreferences(defaultPreferences);
    setView(AppView.INPUT);
  };

  if (!user || view === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        
        {view === AppView.INPUT && (
          <InputStep 
            data={inputData} 
            onChange={setInputData} 
            onNext={() => setView(AppView.PREFERENCES)} 
          />
        )}

        {view === AppView.PREFERENCES && (
          <PreferenceStep 
            data={preferences} 
            onChange={setPreferences} 
            onSubmit={handleGenerate}
            onBack={() => setView(AppView.INPUT)}
          />
        )}

        {view === AppView.LOADING && <Loading />}

        {view === AppView.RESULTS && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Seu Menu</h2>
                <p className="text-slate-500">Selecionado para você.</p>
              </div>
              <Button variant="secondary" onClick={resetFlow}>Começar de Novo</Button>
            </div>
            
            <div className="space-y-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} delay={index * 150} />
              ))}
            </div>

            {recipes.length === 0 && (
               <div className="text-center py-20">
                 <p className="text-slate-500">Nenhuma receita encontrada. Tente ingredientes diferentes.</p>
                 <Button variant="outline" onClick={resetFlow} className="mt-4">Tentar Novamente</Button>
               </div>
            )}
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg animate-bounce z-50">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <span className="sr-only">Fechar</span>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;