import { forwardRef } from 'react';

const InputField = forwardRef(({ label, id, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-lg border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
        } px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 sm:text-sm`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
