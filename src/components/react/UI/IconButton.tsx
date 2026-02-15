import React, { useEffect, useState } from 'react';

interface IconButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  onToggle?: (checked: boolean) => void;
  onRenderIcon: (checked?: boolean) => React.ReactNode;

  toggle?: boolean;
  checked?: boolean;
  disabled?: boolean;

  className?: string;
  ariaLabel?: string;
}

function IconButton({
  onClick,
  onToggle,
  onRenderIcon,
  toggle = false,
  checked = false,
  disabled = false,
  className,
  ariaLabel,
}: IconButtonProps) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    if (toggle) setIsChecked(checked);
  }, [checked, toggle]);

  const handleClick = (e: React.MouseEvent  ) => {
    if (disabled) return;

    onClick?.(e);

    if (toggle) {
      setIsChecked((prev) => {
        const next = !prev;
        onToggle?.(next);
        return next;
      });
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={toggle ? isChecked : undefined}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        h-10 w-10 rounded-lg
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${
          toggle && isChecked
            ? 'bg-blue-600 text-[var(--text)] shadow-md'
            : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-700'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className ?? ''}
      `}
    >
      {onRenderIcon(toggle ? isChecked : undefined)}
    </button>
  );
}

export default IconButton;