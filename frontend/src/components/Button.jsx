export default function Button({ children, variant = 'primary', type = 'button', className = '', disabled = false, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 px-5 py-2.5 shadow-sm hover:shadow active:scale-[0.98]",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-indigo-500 px-5 py-2.5 shadow-sm active:scale-[0.98]",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 px-4 py-2",
  };

  return (
    <button 
      type={type} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
