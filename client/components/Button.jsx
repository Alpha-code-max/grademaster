const sizeClasses = {
    sm: "text-sm p-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };
  
  export default function Button({ size = "md", children, className = "", ...props }) {
    const sizeClass = sizeClasses[size] || sizeClasses["md"];
  
    return (
      <button
        {...props}
        className={`bg-primary hover:bg-secondary text-white rounded-md cursor-pointer ${sizeClass} ${className}`}
      >
        {children}
      </button>
    );
  }
  