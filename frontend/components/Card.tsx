
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', actions }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b border-neutral-200 ${titleClassName}`}>
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
      {actions && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
    