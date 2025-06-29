import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500 dark:bg-primary-800 dark:hover:bg-primary-700 dark:focus:ring-primary-400 dark:ring-offset-dark-300 font-semibold shadow-md',
    secondary: 'bg-secondary-700 text-white hover:bg-secondary-800 focus:ring-secondary-500 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:focus:ring-secondary-400 dark:ring-offset-dark-300 font-semibold shadow-md',
    outline: 'border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-50 focus:ring-primary-500 dark:border-gray-500 dark:bg-dark-200 dark:text-white dark:hover:bg-dark-100 dark:focus:ring-primary-400 dark:ring-offset-dark-300 font-semibold shadow-md',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-500 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-400 dark:ring-offset-dark-300 font-semibold shadow-md',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : 'cursor-pointer';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 