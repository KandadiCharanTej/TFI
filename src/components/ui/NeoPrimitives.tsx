import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'coral' | 'cobalt' | 'green' | 'lavender' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#FFCB45] text-[#171717] hover:bg-[#ffc32b]',
    coral: 'bg-[#FF704D] text-white hover:bg-[#ff5d36]',
    cobalt: 'bg-[#4385EA] text-white hover:bg-[#3277e0]',
    green: 'bg-[#83CBA2] text-[#171717] hover:bg-[#72c294]',
    lavender: 'bg-[#CBB8F5] text-[#171717] hover:bg-[#bfa8f2]',
    white: 'bg-white text-[#171717] hover:bg-neutral-50',
    dark: 'bg-[#171717] text-white hover:bg-neutral-800',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-bold neo-btn-sm',
    md: 'px-5 py-3 text-sm md:text-base font-extrabold neo-btn',
    lg: 'px-7 py-4 text-base md:text-lg font-black neo-btn',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 cursor-pointer transition-transform ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const NeoCard: React.FC<{
  children: React.ReactNode;
  bg?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}> = ({ children, bg = 'bg-white', className = '', size = 'md', onClick }) => {
  const boxSize = size === 'sm' ? 'neo-box-sm' : size === 'lg' ? 'neo-box-lg' : 'neo-box';
  return (
    <div
      onClick={onClick}
      className={`${bg} ${boxSize} p-4 md:p-6 transition-all ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const NeoBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'yellow' | 'coral' | 'cobalt' | 'green' | 'lavender' | 'white';
  className?: string;
}> = ({ children, variant = 'yellow', className = '' }) => {
  const colors = {
    yellow: 'bg-[#FFCB45] text-[#171717]',
    coral: 'bg-[#FF704D] text-white',
    cobalt: 'bg-[#4385EA] text-white',
    green: 'bg-[#83CBA2] text-[#171717]',
    lavender: 'bg-[#CBB8F5] text-[#171717]',
    white: 'bg-white text-[#171717]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-md border-2 border-[#171717] shadow-[1px_1px_0px_#171717] ${colors[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
