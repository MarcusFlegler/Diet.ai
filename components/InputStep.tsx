import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';
import { IngredientInput } from '../types';

interface InputStepProps {
  data: IngredientInput;
  onChange: (data: IngredientInput) => void;
  onNext: () => void;
}

export const InputStep: React.FC<InputStepProps> = ({ data, onChange, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);

  // --- Image Handling ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onChange({ ...data, image: file, imagePreviewUrl: url });
    }
  };

  const clearImage = () => {
    onChange({ ...data, image: null, imagePreviewUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Audio Handling ---
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onChange({ ...data, audioBlob, audioUrl });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteAudio = () => {
    onChange({ ...data, audioBlob: null, audioUrl: null });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate if at least one input method is used
  const isFormValid = data.text.length > 2 || data.image !== null || data.audioBlob !== null;

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">O que temos hoje?</h2>
        <p className="text-slate-500">Combine fotos, áudio e texto para descrever seus ingredientes.</p>
      </div>

      <div className="space-y-6">
        
        {/* Media Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Image Upload Area */}
          <div 
            className={`relative h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden ${
              data.imagePreviewUrl 
                ? 'border-emerald-500 bg-slate-900' 
                : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50 cursor-pointer'
            }`}
            onClick={() => !data.imagePreviewUrl && fileInputRef.current?.click()}
          >
            {data.imagePreviewUrl ? (
              <>
                <img 
                  src={data.imagePreviewUrl} 
                  alt="Prévia" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs font-medium">
                  Foto adicionada
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">Adicionar Foto</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* Audio Recorder Area */}
          <div className={`h-48 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
            isRecording ? 'border-red-400 bg-red-50' : 
            data.audioUrl ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white'
          }`}>
            
            {data.audioUrl ? (
              <div className="w-full px-6 text-center">
                <div className="w-12 h-12 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <audio controls src={data.audioUrl} className="w-full h-8 mb-3" />
                <button 
                  onClick={deleteAudio}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center justify-center gap-1 mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir Áudio
                </button>
              </div>
            ) : (
              <div className="text-center w-full">
                 {isRecording ? (
                   <>
                    <div className="mb-3">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-ping mr-2"></span>
                      <span className="text-red-600 font-mono text-xl font-bold">{formatTime(recordingTime)}</span>
                    </div>
                    <button 
                      onClick={stopRecording}
                      className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 font-medium transition-colors shadow-md"
                    >
                      Parar Gravação
                    </button>
                   </>
                 ) : (
                   <>
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-3">Descreva por Voz</p>
                    <button 
                      onClick={startRecording}
                      className="px-4 py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium transition-colors"
                    >
                      Iniciar Gravação
                    </button>
                   </>
                 )}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">COMPLEMENTE COM TEXTO</span>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <textarea
            value={data.text}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
            placeholder="Digite aqui mais detalhes, restrições alimentares ou ingredientes extras..."
            className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all h-32 resize-none text-base shadow-sm"
          />
        </div>

        <div className="pt-2">
          <Button 
            onClick={onNext} 
            disabled={!isFormValid || isRecording} 
            fullWidth 
            className="shadow-lg shadow-emerald-200"
          >
            {isRecording ? 'Pare a gravação para continuar' : 'Continuar para Preferências'}
          </Button>
        </div>
      </div>
    </div>
  );
};