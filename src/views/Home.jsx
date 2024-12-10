import { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Assurez-vous que l'URL correspond à votre serveur

const Home = () => {
    const [roomName, setRoomName] = useState('');

    const handleCreateRoom = () => {
        socket.emit('createRoom', roomName);
    };

    const handleJoinRoom = () => {
        socket.emit('joinRoom', roomName);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <h1 className="text-2xl font-bold mb-4 text-base-content">Room Management</h1>
            <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="input input-bordered w-64 mb-4"
            />
            <div className="flex space-x-4">
                <button onClick={handleCreateRoom} className="btn btn-primary">
                    Créer Room
                </button>
                <button onClick={handleJoinRoom} className="btn btn-secondary">
                    Rejoindre Room
                </button>
            </div>
        </div>
    );
};

export default Home;
