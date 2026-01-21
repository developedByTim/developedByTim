import type { ChangeEvent } from "react";

 

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  onRenderIcon?: () => JSX.Element;
  min?: number;
  max?: number;
  step?: number;
}

function NumberInput({
  value,
  onChange,
  label,
  onRenderIcon,
  min,
  max,
  step = 1,
}: NumberInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.valueAsNumber);
  };

  return (
    <div className="flex items-center gap-4 p-1 border border-solid border-neutral-200">
      <label className='flex items-center gap-4 font-["Open-sans", sans-serif]'>
        {onRenderIcon && <span className="w-4 h-4">{onRenderIcon()}</span>}
        <span className="uppercase opacity-50 font-semibold">{label}</span>
      </label>

      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-20"
      />
    </div>
  );
}

export default NumberInput;