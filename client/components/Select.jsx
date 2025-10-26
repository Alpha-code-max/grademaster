// components/Dropdown.jsx
export default function Dropdown({ id, label, options = [], placeholder = "Select an option", ...props }) {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
  
        <select
          id={id}
          {...props}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-text focus:ring-primary"
        >
          <option value={placeholder}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-sm">
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
  