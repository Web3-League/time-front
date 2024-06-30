import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';

const CustomAntiBacterie = ({ selectedRace }) => {
    const [antiBacteries, setAntiBacteries] = useState([]);
    const [selectedAntiBacterie, setSelectedAntiBacterie] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [newAntiBacterieValue, setNewAntiBacterieValue] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { userId, userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles === 'ROLE_ADMIN');

        const fetchAntiBacteries = async () => {
            try {
                let response;

                if (userRoles === 'ROLE_ADMIN') {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antiBacterie', { params: { raceId: selectedRace } });
                } else {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antiBacterie', { params: { userId, raceId: selectedRace } });
                }

                const data = response.data;
                setAntiBacteries(data);
            } catch (error) {
                console.error('Error fetching antiBacteries:', error);
            }
        };

        if (selectedRace) {
            fetchAntiBacteries();
        }
    }, [selectedRace, userId, userRoles]);

    const handleChange = (event) => {
        setSelectedAntiBacterie(event.target.value);
    };

    const handleSecondDropdownChange = (event) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
        } else {
            setIsEditMode(false);
            setSelectedAntiBacterie(value);
        }
    };

    const handleBooleanChange = (event) => {
        setNewAntiBacterieValue(event.target.value === 'true');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antiBacterie', { anti_bacterie: newAntiBacterieValue, raceId: selectedRace });
            const data = response.data;
            setAntiBacteries([...antiBacteries, data]);
            setSelectedAntiBacterie(data.id);
        } catch (error) {
            console.error('Error creating antiBacterie:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            if (!selectedRace) {
                console.error('No race selected for update');
                return;
            }
            const response = await axios.put(`http://localhost:8083/api/veterinaire/antiBacterie/${selectedAntiBacterie}`, { anti_bacterie: newAntiBacterieValue });
            const data = response.data;
            const updatedAntiBacteries = antiBacteries.map((antiBacterie) => (antiBacterie.id === data.id ? data : antiBacterie));
            setAntiBacteries(updatedAntiBacteries);
            setSelectedAntiBacterie(data.id);
        } catch (error) {
            console.error('Error updating antiBacterie:', error);
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            if (!selectedAntiBacterie) {
                console.error('No antiBacterie selected for deletion');
                return;
            }
            await axios.delete(`http://localhost:8083/api/veterinaire/antiBacterie/${selectedAntiBacterie}`);
            const updatedAntiBacteries = antiBacteries.filter((antiBacterie) => antiBacterie.id !== selectedAntiBacterie);
            setAntiBacteries(updatedAntiBacteries);
            setSelectedAntiBacterie('');
        } catch (error) {
            console.error('Error deleting antiBacterie:', error);
        }
    };

    return (
        <div>
            <h2>Anti-Bacterie</h2>
            <div>
            <div>SLECTED RACE ID: {selectedRace} </div>
                <select value={selectedAntiBacterie} onChange={handleChange}>
                    <option value="">Select an antiBacterie</option>
                    {antiBacteries.map((antiBacterie) => (
                        <option key={antiBacterie.id} value={antiBacterie.id}>
                            {antiBacterie.anti_bacterie.toString()}
                        </option>
                    ))}
                </select>
                <select onChange={handleSecondDropdownChange}>
                    <option value="">Select an action</option>
                    <option value="edit-mode">Edit Mode</option>
                </select>
                {isEditMode && (
                    <select value={newAntiBacterieValue.toString()} onChange={handleBooleanChange}>
                        <option value="">Select a value</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                )}
            </div>
            <div>
                {isEditMode ? (
                    <form onSubmit={handleUpdate}>
                        <button type="submit">Update</button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <button type="submit">Create</button>
                    </form>
                )}
            </div>
            {isAdmin && (
                <div>
                    <form onSubmit={handleDelete}>
                        <button type="submit">Delete</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CustomAntiBacterie;
