import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm",
    secondary: "border-transparent text-emerald-900 bg-emerald-100 hover:bg-emerald-200 focus:ring-emerald-500",
    outline: "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500",
    ghost: "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};