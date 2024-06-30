import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';

const CustomAntiVirus = ({ selectedRace }) => {
    const [antiVirus, setAntiVirus] = useState([]);
    const [selectedAntiVirus, setSelectedAntiVirus] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [newAntiVirusValue, setNewAntiVirusValue] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { userId, userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles === 'ROLE_ADMIN');

        const fetchAntiVirus = async () => {
            try {
                let response;

                if (userRoles === 'ROLE_ADMIN') {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antiVirus', { params: { raceId: selectedRace } });
                } else {
                    response = await axios.get('http://localhost:8083/api/veterinaire/antiVirus', { params: { userId, raceId: selectedRace } });
                }

                const data = response.data;
                setAntiVirus(data);
            } catch (error) {
                console.error('Error fetching antiVirus:', error);
            }
        };

        if (selectedRace) {
            fetchAntiVirus();
        }
    }, [selectedRace, userId, userRoles]);

    const handleChange = (event) => {
        setSelectedAntiVirus(event.target.value);
    };

    const handleSecondDropdownChange = (event) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
        } else {
            setIsEditMode(false);
            setSelectedAntiVirus(value);
        }
    };

    const handleBooleanChange = (event) => {
        setNewAntiVirusValue(event.target.value === 'true');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antiVirus', { anti_virus: newAntiVirusValue, raceId: selectedRace });
            const data = response.data;
            setAntiVirus([...antiVirus, data]);
            setSelectedAntiVirus(data.id);
        } catch (error) {
            console.error('Error creating antiVirus:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            if (!selectedRace) {
                console.error('No race selected for update');
                return;
            }
            const response = await axios.put(`http://localhost:8083/api/veterinaire/antiVirus/${selectedRace}`, { anti_virus: newAntiVirusValue });
            const data = response.data;
            const updatedAntiVirus = antiVirus.map((item) => (item.id === data.id ? data : item));
            setAntiVirus(updatedAntiVirus);
        } catch (error) {
            console.error('Error updating antiVirus:', error);
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            if (!selectedRace) {
                console.error('No race selected for deletion');
                return;
            }
            await axios.delete(`http://localhost:8083/api/veterinaire/antiVirus/${selectedRace}`);
            const updatedAntiVirus = antiVirus.filter((item) => item.id !== selectedAntiVirus);
            setAntiVirus(updatedAntiVirus);
            setSelectedAntiVirus('');
        } catch (error) {
            console.error('Error deleting antiVirus:', error);
        }
    };

    return (
        <div>
            <h2>Anti-Virus</h2>
            <div>
                <div>SLECTED RACE ID: {selectedRace} </div>
                <select value={selectedRace} onChange={handleChange}>
                    <option value="">Select an antiVirus</option>
                    {antiVirus.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.anti_virus.toString()}
                        </option>
                    ))}
                </select>
                <select onChange={handleSecondDropdownChange}>
                    <option value="">Select an action</option>
                    <option value="edit-mode">Edit Mode</option>
                </select>
                {isEditMode && (
                    <select value={newAntiVirusValue.toString()} onChange={handleBooleanChange}>
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

export default CustomAntiVirus;
