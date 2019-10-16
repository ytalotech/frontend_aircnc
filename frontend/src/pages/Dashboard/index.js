import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

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
                        {/* a primeira chave indica que quero incluir código js dentro e a segunda chave indica que quero colocar um objeto  */}
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }}/>
                        <strong>{spot.company}</strong>
                        <span>{spot.prince ? `R$${spot.price}/dia` : `GRATUITO`}</span>
                    </li>
                ))}
            </ul>
            <Link to="new">
                <button className="btn">Cadastrar novo spot</button>
            </Link>
        </>
    )
}