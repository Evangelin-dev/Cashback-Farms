
import React from 'react';

interface CardShellProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CardShell: React.FC<CardShellProps> = ({ children, className = '', onClick }) => {
  const clickableStyles = onClick ? 'hover:shadow-xl transition-shadow duration-300 cursor-pointer' : '';
  return (
    <div 
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CardShell;
    