import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';

const CustomTraitement = () => {
    const [traitements, setTraitements] = useState([]);
    const [selectedTraitement, setSelectedTraitement] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [newTraitementName, setNewTraitementName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { userId, userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles === 'ROLE_ADMIN');

        const fetchTraitements = async () => {
            try {
                let response;

                if (userRoles === 'ROLE_ADMIN') {
                    response = await axios.get('http://localhost:8083/api/veterinaire/traitement');
                } else {
                    response = await axios.get('http://localhost:8083/api/veterinaire/traitement', { params: { userId } });
                }

                const data = response.data;
                setTraitements(data);
            } catch (error) {
                console.error('Error fetching traitements:', error);
            }
        };

        fetchTraitements();
    }, [userId, userRoles]);

    const handleChange = (event) => {
        setSelectedTraitement(event.target.value);
        const selected = traitements.find(t => t.id === event.target.value);
        if (selected) {
            setNewTraitementName(selected.traitement);
        }
    };

    const handleModeChange = (event) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
            setIsCreateMode(false);
        } else if (value === 'create-mode') {
            setIsEditMode(false);
            setIsCreateMode(true);
            setNewTraitementName('');
        }
    };

    const handleInputChange = (event) => {
        setNewTraitementName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/traitement', { traitement: newTraitementName });
            const data = response.data;
            setTraitements([...traitements, data]);
            setSelectedTraitement(data.id);
        } catch (error) {
            console.error('Error creating traitement:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8083/api/veterinaire/traitement/${selectedTraitement}`, { traitement: newTraitementName });
            const data = response.data;
            const updatedTraitements = traitements.map((traitement) => (traitement.id === data.id ? data : traitement));
            setTraitements(updatedTraitements);
            setSelectedTraitement(data.id);
        } catch (error) {
            console.error('Error updating traitement:', error);
        }
    };

    return (
        <div>
            <h2>Traitement</h2>
            <select value={selectedTraitement} onChange={handleChange}>
                <option value="">Select a traitement</option>
                {traitements.map((traitement) => (
                    <option key={traitement.id} value={traitement.id}>
                        {traitement.traitement}
                    </option>
                ))}
            </select>
            <select onChange={handleModeChange}>
                <option value="">Select an action</option>
                <option value="edit-mode">Edit Mode</option>
                <option value="create-mode">Create Mode</option>
            </select>
            {isEditMode && (
                <div>
                    <input type="text" value={newTraitementName} onChange={handleInputChange} />
                    <button onClick={handleUpdate}>Update</button>
                </div>
            )}
            {isCreateMode && (
                <div>
                    <input type="text" value={newTraitementName} onChange={handleInputChange} />
                    <button onClick={handleSubmit}>Create</button>
                </div>
            )}
        </div>
    );
};

export default CustomTraitement;
