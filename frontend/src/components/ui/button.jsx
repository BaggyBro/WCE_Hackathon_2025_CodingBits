// src/components/ui/button.jsx
import PropTypes from 'prop-types';

export function Button({ children, className, ...props }) {
    return (
      <button
        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  
  Button.propTypes = {
    children: PropTypes.node.isRequired,  // Ensures children are passed (React nodes)
    className: PropTypes.string,          // Class should be a string
    onClick: PropTypes.func,              // onClick should be a function
    type: PropTypes.oneOf(["button", "submit", "reset"]), // Restricts type to valid button types
  };
  
  Button.defaultProps = {
    className: "",
    type: "button",
  };