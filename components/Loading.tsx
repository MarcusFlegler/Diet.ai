import React from 'react';

export const Loading: React.FC = () => {
  const loadingMessages = [
    "Analisando seus ingredientes...",
    "Consultando chefs renomados...",
    "Calculando valores nutricionais...",
    "Criando a textura perfeita...",
    "Adicionando uma pitada de amor..."
  ];
  
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          👨‍🍳
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Dietai está pensando</h3>
      <p className="text-slate-500 text-sm animate-pulse min-h-[1.25rem]">
        {loadingMessages[msgIndex]}
      </p>
    </div>
  );
};