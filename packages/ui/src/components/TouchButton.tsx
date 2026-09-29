import React from 'react';

export interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'affirmative' | 'payout' | 'hazard' | 'secondary' | 'outline';
  size?: 'md' | 'lg' | 'xl';
  icon?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  variant = 'affirmative',
  size = 'lg',
  icon,
  fullWidth = true,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    affirmative: 'bg-primary text-on-primary border-2 border-primary hover:bg-primary-container shadow-tactile-primary',
    payout: 'bg-secondary text-on-secondary border-2 border-secondary hover:bg-secondary-container shadow-tactile-secondary',
    hazard: 'bg-tertiary text-on-tertiary border-2 border-tertiary hover:bg-tertiary-container shadow-tactile',
    secondary: 'bg-surface-container-high text-on-surface border-2 border-outline hover:bg-surface-container-highest shadow-tactile',
    outline: 'bg-surface text-primary border-2 border-primary hover:bg-surface-container-low shadow-sm'
  };

  const sizeStyles = {
    md: 'min-h-[50px] px-4 text-label-md rounded-xl',
    lg: 'min-h-[60px] px-6 text-label-lg rounded-2xl',
    xl: 'min-h-[68px] px-8 text-headline-md rounded-2xl'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-3 font-bold transition-all active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed select-none ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-[26px]">progress_activity</span>
      ) : (
        icon && <span className="material-symbols-outlined text-[28px] flex-shrink-0">{icon}</span>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};
