// src/components/custom/CustomBox.js
import React from 'react';
import './styles/CustomBox.css';

const CustomBox = ({ children, gridColumn, gridRow }) => {
  return (
    <div className="custom-box" style={{ gridColumn , gridRow}}>
      {children}
    </div>
  );
};

export default CustomBox;
