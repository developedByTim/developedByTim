import React, { useState, useEffect, type ReactNode, type MouseEventHandler } from 'react';

interface ButtonProps{
    disabled?:boolean
    className?:string
    placeholder?:string
    children?: ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>
}

function SubmitButton({ disabled,className , placeholder, children, onClick}:ButtonProps) {
 


    return (
 
            <button disabled={disabled}
            className={`p-5 bg-[var(--panel-hover)] uppercase opacity-50 font-semibold ${className} `} onClick={onClick} >{children}</button>
 
    );
}

export default SubmitButton;