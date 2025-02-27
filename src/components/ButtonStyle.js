import React from 'react';

const Button = ({ onClick, style, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 15px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...style, // Permite a personalização do estilo através de props
      }}
    >
      {children}
    </button>
  );
};

export default Button;