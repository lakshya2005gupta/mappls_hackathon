import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden dark:bg-dark-200 dark:border dark:border-dark-100 transition-all duration-300';
  const paddingClasses = padding ? 'p-6' : '';
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 dark:hover:shadow-xl dark:hover:shadow-dark-400/10' : '';
  
  const cardClasses = `${baseClasses} ${paddingClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card; 