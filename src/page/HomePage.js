import React, { useState, useContext } from 'react';
import { CustomGrid } from '../custom/CustomGrid';
import CustomBox from '../custom/CustomBox';
import CustomHeader from '../custom/CustomHeader';
import CustomFooter from '../custom/CustomFooter';
import { AuthContext } from '../context/AuthContext';
import { useAuthenticatedPage } from '../hooks/useAuthenticatedPage';
import Login from '../auth/login';
import CustomRace from '../custom/CustomRace';
import CustomTraitement from '../custom/CustomTraitement';
import CustomAntiTique from '../custom/CustomAntiTique';
import CustomAntiPuce from '../custom/CustomAntiPuce';
import CustomAntiVirus from '../custom/CustomAntiVirus';
import CustomAntiBacterie from '../custom/CustomAntiBacterie';
import UserProfile from '../custom/UserProfile';
import useToken from '../hooks/useToken';

const HomePage = () => {
    const { isAuthenticated, loading } = useAuthenticatedPage();
    const [selectedRace, setSelectedRace] = useState('');
    const { userId, userRoles } = useToken();


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <CustomGrid>
            <CustomBox gridColumn="1 / span 12" gridRow="1 / span 2">
                <CustomHeader userId={userId} />
            </CustomBox>
            <CustomBox gridColumn="1 / span 12" gridRow="3 / span 2">
                <CustomRace selectedRace={selectedRace} setSelectedRace={setSelectedRace} userId={userId} />
            </CustomBox>
            <CustomBox gridColumn="1 / span 12" gridRow="5 / span 2">
                <CustomTraitement selectedRace={selectedRace} />
            </CustomBox>
            <CustomBox gridColumn="1 / span 12" gridRow="7 / span 2">

                <CustomAntiTique selectedRace={selectedRace} userId={userId} />
            </CustomBox>
            <CustomBox gridColumn="1 / span 12" gridRow="9 / span 2">
                <CustomAntiPuce selectedRace={selectedRace} />
            </CustomBox>
            <CustomBox gridColumn="1 / span 12" gridRow="11 / span 2">
                <CustomAntiVirus selectedRace={selectedRace} />
            </CustomBox>
            <CustomBox gridColumn="1 / span 12" gridRow="13 / span 2">
                <CustomAntiBacterie selectedRace={selectedRace} />
            </CustomBox>
            <CustomBox gridColumn="1 / span 12" gridRow="15 / span 2">
                <UserProfile />
            </CustomBox>
        </CustomGrid>
    );
};

export default HomePage;
