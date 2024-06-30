import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';

const CustomRace = ({ selectedRace, setSelectedRace }) => {
    const [races, setRaces] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newRaceName, setNewRaceName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { userId, userRoles } = useToken();


    useEffect(() => {
        setIsAdmin(userRoles === 'ROLE_ADMIN');

        const fetchRaces = async () => {
            try {
                let response;
                if (userRoles === 'ROLE_ADMIN') {
                    response = await axios.get('http://localhost:8083/api/veterinaire/races');
                } else {
                    let id = userId;
                    response = await axios.get('http://localhost:8083/api/veterinaire/races/' + id);
                }
                setRaces(response.data);
            } catch (error) {
                console.error('Error fetching races:', error);
            }
        };

        fetchRaces();
    }, [userId, userRoles, isAdmin]);

    const handleChange = (event) => {
        setSelectedRace(event.target.value);
    };

    const handleSecondDropdownChange = (event) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
            setNewRaceName('');
        } else {
            setIsEditMode(false);
            setSelectedRace(value);
        }
    };

    const handleInputChange = (event) => {
        setNewRaceName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (isEditMode && selectedRace) {
                const response = await axios.put(`http://localhost:8083/api/veterinaire/races/${selectedRace}`, { race: newRaceName });
                const updatedRace = response.data;
                setRaces(races.map((race) => (race.id === updatedRace.id ? updatedRace : race)));
                setSelectedRace(updatedRace.id);
            } else {
                const response = await axios.post('http://localhost:8083/api/veterinaire/races', { owners: userId, race: newRaceName });
                const data = response.data;
                setRaces([...races, data]);
                setSelectedRace(data.id);
            }
            setNewRaceName('');
            setIsEditMode(false);
        } catch (error) {
            console.error('Error creating/updating race:', error);
        }
    };

    return (
        <div>
            <h2>Races</h2>
            <div>
                <div>ANIMAL ID: {selectedRace} USER ID: {userId}</div>
                <select className="form-control" name="race" value={selectedRace} onChange={handleChange}>
                    <option value="">Select a race</option>
                    {races.map((race) => (
                        <option key={race.id} value={race.id}>
                            {race.race}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <input type="text" className="form-control" placeholder="Enter new race name" value={newRaceName} onChange={handleInputChange} />
                <button onClick={handleSubmit}>Submit</button>
            </div>
            {isAdmin && (
                <div>
                    <div>ROLE_ADMIN: {isAdmin ? 'Yes' : 'No'}</div>
                    <select className="form-control" name="race" value={selectedRace} onChange={handleSecondDropdownChange}>
                        <option value="">Select a race</option>
                        {races.map((race) => (
                            <option key={race.id} value={race.id}>
                                {race.race}
                            </option>
                        ))}
                        <option value="edit-mode">Edit Mode</option>
                    </select>
                    {isEditMode && (
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new race name"
                                value={newRaceName}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    <button onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomRace;

