import React from "react";

function Button({ onClick, text, style, ...props }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        borderRadius: "10px",
        padding: "8px 16px",
        cursor: "pointer",
      }}
      {...props}
    >
      {text}
    </button>
  );
}

export default Button;
