import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard(){
    const [sports, setSpots] = useState([]);
    useEffect(() =>{
        async function loadSports(){
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });

            setSpots(response.data);
        }

        loadSports();
    }, []);
    //nesse pode ter varias variaveis e quando sofrer alterações vai executar a função novamente. Quanod o array estiver vazio, ele só ira executar uma vez
    return (
        <>
            <ul className="spot-list">
                {sports.map(spot => (
                    <li key={spot._id}>
                        <header/>
                        <strong>{spot.company}</strong>
                        <span>{spot.prince}</span>
                    </li>
                ))}
            </ul>
        </>
    )
}