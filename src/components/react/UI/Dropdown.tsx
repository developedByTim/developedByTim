import { useState } from "react";

interface DropdownProps<T> {
  onChange: (v: T) => void;
  label: string;
  onRenderIcon?: () => JSX.Element;
  onLabelClick?: () => void;
  options: DropdownOptions<T>[];
  value: T;
}

export interface DropdownOptions<T> {
  key: T;
  text: string;
}

function Dropdown<T extends string | number>({ onChange, label, onRenderIcon, options, value, onLabelClick }: DropdownProps<T>) {
 

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as T;
    onChange(newValue);
  };

  return (
   <div className="flex items-center gap-4 p-2 bg-panel border border-border rounded-md text-text">

      <label onClick={onLabelClick} className='flex items-center gap-4 font-["Open-sans", sans-serif] cursor-pointer'>
        {onRenderIcon && <span className="w-4 h-4 flex items-center justify-center">{onRenderIcon()}</span>}
      <span className="uppercase text-text-muted font-semibold">{label} </span>
      </label>
      <select className="
    bg-panel
    outline-none
    text-text
    cursor-pointer
  " value={value} onChange={handleSelectChange}>
        {options.map((option, index) => (
          <option key={index} value={option.key}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;

