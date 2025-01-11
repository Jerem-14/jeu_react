import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    path: '/socket.io/',
      transports: ['websocket', 'polling'],
      cors: {
          origin: "http://localhost:5173",
          credentials: true
      }
  }); // Assurez-vous que l'URL correspond à votre serveur

const Home = () => {
  const navigate = useNavigate();

    const [roomName, setRoomName] = useState('');

    const handleCreateRoom = () => {
        socket.emit('createRoom', roomName);
        navigate('/game/create');
    };

    const handleJoinRoom = () => {
        socket.emit('joinRoom', roomName);
        navigate('/game/join');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <h1 className="text-2xl font-bold mb-4 text-base-content">Room Management</h1>
            
            <div className="flex space-x-4">
                <button onClick={handleCreateRoom} className="btn btn-primary">
                    Créer une nouvelle partie !
                </button>
                <button onClick={handleJoinRoom} className="btn btn-secondary">
                    Rejoindre une partie
                </button>
            </div>
        </div>
    );
};

export default Home;
