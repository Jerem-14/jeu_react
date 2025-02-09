
import { io } from 'socket.io-client';
import { config } from './config';

export const socket = io(config.apiUrl, {
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
    cors: {
        origin: config.clientUrl,
        credentials: true
    }
});


export default socket;