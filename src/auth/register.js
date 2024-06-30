
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterComponent from '../components/RegisterComponent.js';
import { AuthContext } from '../context/AuthContext.js';

const Inscription = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      navigate('/home');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <RegisterComponent handleRegister={handleRegister} />
    </div>
  );
};

export default Inscription;
