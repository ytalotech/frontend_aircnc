//useMemo é para memorizar o valor de uma variavel
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';
import './styles.css';
import { request } from 'https';

export default function Dashboard() {
    const [sports, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    //para se conectar com meu backend
    // const socket = socketio('http://localhost:3333');
    const socket = useMemo(() => socketio('http://localhost:3333', {
        query: { user_id },
    }), [user_id]);

    //quero disparar uma função assim que meu elemento for exibido em tela
    useEffect(() => {
        // //toda vez que receber uma memsagem com o nome hello
        // socket.on('hello', data => {
        //     console.log(data);
        // });

        // socket.emit('omni', 'Stack');

        socket.on('booking_request', data => {
            //console.log(data.user.email);
            //irei copiar todos os dados que ja tenho dentro da request, e esse data serve para adicionar uma nova request no final do array
            setRequests([...requests, data]);
            //console.log(requests);
        })
    }, [requests, socket]);

    useEffect(() => {
        async function loadSports() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });

            setSpots(response.data);
        }

        loadSports();
    }, []);
    
    async function handleAccept(id) {
        await api.post(`bookings/${id}/approvals`);

        //depoois tenho que remover aquela requisição que acabei de aprovar
        //esta colocando os ids no setRequests que não tem no id vindo da api
        setRequests(requests.filter(request => request._id != id));
    }

    async function handleReject(id) {
        await api.post(`bookings/${id}/rejections`);

        //depoois tenho que remover aquela requisição que acabei de aprovar
        //esta colocando os ids no setRequests que não tem no id vindo da api
        setRequests(requests.filter(request => request._id != id));
    }

    //nesse pode ter varias variaveis e quando sofrer alterações vai executar a função novamente. Quanod o array estiver vazio, ele só ira executar uma vez
    return (
        <>
            <ul className="notifications">
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
                        </p>
                        <button className="accept" onClick={() => handleAccept(request._id)}>ACEITAR</button>
                        <button className="reject" onClick={() => handleReject(request._id)}>REJEITAR</button>
                    </li>
                ))}                
            </ul>
            <ul className="spot-list">
                {sports.map(spot => (
                    <li key={spot._id}>
                        {/* a primeira chave indica que quero incluir código js dentro e a segunda chave indica que quero colocar um objeto  */}
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
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