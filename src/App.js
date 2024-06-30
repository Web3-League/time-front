import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/register'; // Corrected import
import Login from './auth/login.js';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Logout from './auth/logout';
import HomePage from './page/HomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PrivateRoute component={HomePage} />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({ component: Component }) => {
  const { token } = useContext(AuthContext);
  console.log('Token in PrivateRoute:', token);
  return token ? <Component /> : <Navigate to="/login" />;
};

export default App;

