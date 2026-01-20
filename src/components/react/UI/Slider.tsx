import React, { useState, useEffect } from 'react';

interface InputProps{
    onChange: React.ChangeEventHandler<HTMLInputElement>
    value?: number
    className?:string
    placeholder?:string
    min?:number
    max?:number
    step?:number
}

function Slider({ className , placeholder, value, onChange, min, max, step}:InputProps) {

    return (
 
            <input 
            className={`p-5  bg-neutral-100 ${className}`}
                type="range" 
                value={value} 
                min={min}
                max={max}
                step={step}
                onChange={onChange} 
                placeholder={placeholder ?? '...'}
            />
 
    );
}

export default Slider;