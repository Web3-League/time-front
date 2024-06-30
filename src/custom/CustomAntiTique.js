import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';

const CustomAntiTique = ({ selectedRace, userId }) => {
    const [antiTiques, setAntiTiques] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [newAntiTiqueValue, setNewAntiTiqueValue] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles === 'ROLE_ADMIN');

        const fetchAntiTiques = async () => {
            try {
                let response;
                if (userRoles === 'ROLE_ADMIN') {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antitiques', { params: { raceId: selectedRace } });
                } else {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antitiques', { params: { userId, raceId: selectedRace } });
                }
                setAntiTiques(response.data);
            } catch (error) {
                console.error('Error fetching antitiques:', error);
            }
        };

        if (selectedRace) {
            fetchAntiTiques();
        }
    }, [selectedRace, userId, userRoles]);

    const handleSecondDropdownChange = (event) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
            setIsDeleteMode(false);
        } else if (value === 'delete-mode') {
            setIsDeleteMode(true);
            setIsEditMode(false);
        } else {
            setIsEditMode(false);
            setIsDeleteMode(false);
        }
    };

    const handleBooleanChange = (event) => {
        setNewAntiTiqueValue(event.target.value === 'true');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antitiques', { anti_tique: newAntiTiqueValue, raceId: selectedRace });
            const data = response.data;
            setAntiTiques([...antiTiques, data]);
            setNewAntiTiqueValue(false);
            setIsEditMode(false);
        } catch (error) {
            console.error('Error creating antitique:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            if (!selectedRace) {
                console.error('No race selected for update');
                return;
            }
            const response = await axios.put(`http://localhost:8083/api/veterinaire/antitiques/${selectedRace}`, { anti_tique: newAntiTiqueValue });
            const data = response.data;
            const updatedAntiTiques = antiTiques.map((antiTique) => (antiTique.raceId === selectedRace ? data : antiTique));
            setAntiTiques(updatedAntiTiques);
        } catch (error) {
            console.error('Error updating antitique:', error);
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {

            await axios.delete(`http://localhost:8083/api/veterinaire/antitiques/${selectedRace}`);
            const updatedAntiTiques = antiTiques.filter((antiTique) => antiTique.raceId !== selectedRace);
            setAntiTiques(updatedAntiTiques);
        } catch (error) {
            console.error('Error deleting antitique:', error);
        }
    };

    return (
        <div>
            <h2>AntiTiques</h2>
            <select value={selectedRace} onChange={handleSecondDropdownChange}>
                <option value="">Select an option</option>
                <option value="edit-mode">Edit Mode</option>
                <option value="delete-mode">Delete Mode</option>
            </select>
            {isEditMode && (
                <div>
                    <div>SLECTED RACE ID: {selectedRace} </div>
                    <form onSubmit={handleUpdate}>
                        <select value={newAntiTiqueValue.toString()} onChange={handleBooleanChange}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                        <button type="submit">Update</button>
                    </form>
                </div>
            )}
            {isAdmin && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <select value={newAntiTiqueValue.toString()} onChange={handleBooleanChange}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                        <button type="submit">Create</button>
                    </form>
                </div>
            )}
            {isAdmin && isDeleteMode && (
                <div>
                    <form onSubmit={handleDelete}>
                        <button type="submit">Delete</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CustomAntiTique;

