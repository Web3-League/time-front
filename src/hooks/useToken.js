import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const useToken = () => {
  const [userId, setUserId] = useState(null);
  const [userRoles, setUserRoles] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          setUserId(decodedToken.id); // Adjust according to your token structure
          setUserRoles(decodedToken.roles); // Adjust according to your token structure
        } else {
          console.error('No token found in localStorage');
        }
      } catch (error) {
        console.error('Failed to fetch or decode token:', error);
      }
    };

    fetchToken();
  }, []);

  return { userId, userRoles };
};

export default useToken;


