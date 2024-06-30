import React from 'react';
import './styles/CustomGrid.css';

const CustomGrid = ({ children }) => (
  <div className="custom-grid">
    {children}
  </div>
);

const CustomBox = ({ children, gridColumn, gridRow }) => (
  <div style={{ gridColumn, gridRow }} className="custom-box">
    {children}
  </div>
);

export { CustomGrid, CustomBox };

