import { forwardRef } from 'react';

const InputField = forwardRef(({ label, id, error, ...props }, ref) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col w-full text-left">
      {label && (
        <label htmlFor={id} className="mb-1.5 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
export default InputField;
