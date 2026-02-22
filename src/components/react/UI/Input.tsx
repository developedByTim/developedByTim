import React, { useState, useEffect } from 'react';

interface InputProps{
    onChange: React.ChangeEventHandler<HTMLInputElement>
    value?: string
    className?:string
    placeholder?:string
    password?:boolean
}

function Input({ className , placeholder, value, onChange, password}:InputProps) {

    return (
 
            <input 
            className={`p-5 text-black bg-neutral-100 ${className}`}
                type={password?'password':"text"} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder ?? '...'}
            />
 
    );
}

export default Input;