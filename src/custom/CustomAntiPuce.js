import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';

const CustomAntiPuce = ({ selectedRace }) => {
    const [antiPuces, setAntiPuces] = useState([]);
    const [selectedAntiPuce, setSelectedAntiPuce] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [newAntiPuceValue, setNewAntiPuceValue] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { userId, userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles === 'ROLE_ADMIN');

        const fetchAntiPuces = async () => {
            try {
                let response;

                if (userRoles === 'ROLE_ADMIN') {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antipuces', { params: { raceId: selectedRace } });
                } else {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antipuces', { params: { userId, raceId: selectedRace } });
                }

                const data = response.data;
                setAntiPuces(data);
            } catch (error) {
                console.error('Error fetching antipuces:', error);
            }
        };

        if (selectedRace) {
            fetchAntiPuces();
        }

    }, [selectedRace, userId, userRoles]);

    const handleChange = (event) => {
        setSelectedAntiPuce(event.target.value);
    };

    const handleSecondDropdownChange = (event) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
        } else {
            setIsEditMode(false);
            setSelectedAntiPuce(value);
        }
    };

    const handleBooleanChange = (event) => {
        setNewAntiPuceValue(event.target.value === 'true');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newAntiPuceValue === '') {
            alert('Please select a value before submitting.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antipuces', { anti_puce: newAntiPuceValue, raceId: selectedRace });
            const data = response.data;
            setAntiPuces([...antiPuces, data]);
            setSelectedAntiPuce(data.id);
        } catch (error) {
            console.error('Error creating antipuce:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            if (!selectedRace) {
                console.error('Please select a race before submitting.');
                return;
            }

            const response = await axios.put(`http://localhost:8083/api/veterinaire/antipuces/${selectedRace}`, { anti_puce: newAntiPuceValue });
            const data = response.data;
            const updatedAntiPuces = antiPuces.map((antiPuce) => (antiPuce.raceId === selectedRace ? data : antiPuce));
            setAntiPuces(updatedAntiPuces);
        } catch (error) {
            console.error('Error updating antipuce:', error);
        }
    };

    return (
        <div>
            <h2>AntiPuces</h2>
            <div>SLECTED RACE ID: {selectedRace} </div>
            <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
                <select value={selectedAntiPuce} onChange={handleChange}>
                    <option value=''>Select an antipuce</option>
                    {antiPuces.map((antipuce) => (
                        <option key={antipuce.id} value={antipuce.id}>{antipuce.antipuce.toString()}</option>
                    ))}
                </select>
                <select onChange={handleSecondDropdownChange}>
                    <option value=''>Select an action</option>
                    <option value='edit-mode'>Edit</option>
                </select>
                {isEditMode && (
                    <select value={newAntiPuceValue} onChange={handleBooleanChange}>
                        <option value=''>Select a value</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                )}
                <button type='submit'>{isEditMode ? 'Update' : 'Submit'}</button>
            </form>
        </div>
    );
};

export default CustomAntiPuce;

