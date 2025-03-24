import { useEffect, useState } from 'react';
import config from '../config/config';

const useWebSocket = (userId) => {
   
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if(!userId){return};
        const ws = new WebSocket(config.socketUrl+`?id=${userId}`);

        ws.onopen = () => {
            console.log(`Conectado como ${userId}`);
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(`Mensagem recebida para ${userId}:`, data);
            setMessages((prev) => [...prev, data]);
        };

        ws.onclose = () => {
            console.log(`Conexão fechada para ${userId}`);
        };

        return () => {
            ws.close();
        };
    }, [userId]);

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
