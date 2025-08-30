import React from "react";

interface ButtonProps {
  BtnText: string;
  BtnFunction?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  BtnText,
  BtnFunction,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      disabled={disabled}
      onClick={BtnFunction}
      className={`
        w-full 
        rounded-xl sm:rounded-2xl 
        py-1.5 sm:py-2 lg:py-3 
        text-base sm:text-lg lg:text-xl 
        font-medium 
        text-white 
        bg-primary 
        hover:bg-primary/90 
        active:scale-[0.98] 
        disabled:bg-primary/50 
        disabled:cursor-not-allowed 
        transition-all duration-200 
        shadow-md hover:shadow-lg 
        ${className}
      `}
    >
      {BtnText}
    </button>
  );
};

export default Button;
