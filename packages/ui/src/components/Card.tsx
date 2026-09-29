import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2 | 3;
  accent?: 'primary' | 'secondary' | 'hazard' | 'neutral';
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  level = 1,
  accent = 'neutral',
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  const levelStyles = {
    0: 'bg-surface border-0 shadow-none',
    1: 'bg-surface-container-lowest border-2 border-outline-variant shadow-sm',
    2: 'bg-surface-container-lowest border-2 shadow-tactile',
    3: 'bg-surface-container-lowest border-3 border-on-surface shadow-xl'
  };

  const accentBorders = {
    primary: 'border-primary-container',
    secondary: 'border-secondary',
    hazard: 'border-tertiary',
    neutral: 'border-outline-variant'
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:translate-y-[-2px] active:translate-y-[1px] transition-transform'
    : '';

  const borderStyle = level === 2 ? accentBorders[accent] : '';

  return (
    <div
      className={`rounded-2xl p-space-md ${levelStyles[level]} ${borderStyle} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
