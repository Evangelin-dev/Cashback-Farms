
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = "font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150";
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
      break;
    case 'secondary':
      variantStyles = 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500';
      break;
    case 'outline':
      variantStyles = 'bg-transparent text-green-600 border border-green-600 hover:bg-green-50 focus:ring-green-500';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-xs';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-sm';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-base';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
    