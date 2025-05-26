// src/components/ui/input.jsx
import React from 'react';

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{ fontSize: "1.0rem" }}
      {...props}
    />
  );
});

Input.displayName = 'Input';