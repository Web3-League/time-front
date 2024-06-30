import React from "react";
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent.js';
import  useAuth  from '../hooks/useAuth.js';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (userData) => {
        try {
            await login(userData);
            navigate('/home');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };




    return (
        <div>
            <LoginComponent handleLogin={handleLogin} />
        </div>
    );
};

export default Login;