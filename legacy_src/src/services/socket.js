import { io } from 'socket.io-client';

// IMPORTANT: Replace with your deployed backend URL in production
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bio-page-backend.onrender.com/' // Production URL
  : 'http://localhost:5001';

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
});
