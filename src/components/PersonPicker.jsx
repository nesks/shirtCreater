import React, { useState } from 'react';
import CustomButton from './CustomButton';
import useWebSocket from '../socket/useWebSocket'; // Este hook agora gerencia a conexão WebSocket
import { reader } from '../config/helpers';
import config from '../config/config';

const PersonPicker = () => {
    const [person, setPerson] = useState('');
    const [userId, setUserId] = useState('');
    const [image, setImage] = useState(null); // Para armazenar a imagem recebida via WebSocket
    const { messages, sendMessage } = useWebSocket(userId); // Passa o userId para o WebSocket

    // Função que faz a requisição para pegar o ID do servidor
    const fetchUserId = async () => {
        try {
            const canvas = document.querySelector("canvas");
            const shirt = canvas.toDataURL();
            const personImage = await reader(person); // Agora aguardamos a leitura
            const backendUrl = config.backendUrl+"v1/fashnai";
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                person: personImage,
                shirt: shirt
                })
            });
            const data = await response.json();
            setUserId(data.id); // Aqui você armazena o ID retornado
            // setUserId("53541ca7-3b41-4c5b-af85-5d3de21b6bce");
        } catch (error) {
            alert('Erro ao buscar ID: ' + error);
        }
    };

    // Função que vai processar a imagem
    const handleReceiveImage = async () => {
        // const id = "6beb70d1-5bbe-4fb6-91d3-1defd57bad9c";
        if(!userId){
            return;
        }
        const backendUrl = config.backendUrl+ `v1/fashnai/status?id=${userId}`;
        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json'
          }
        });

            
        const data = await response.json();
        console.log(data);
        if(data.output && data.output.error){
            alert(data.output.error)
        }else{
            alert(data.output.status)
        }
      return false;
    };

    // Quando o WebSocket receber a imagem
    React.useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.tipo === 'imagem') {
                setImage(lastMessage.imagem); // Armazena a imagem recebida
            }
        }
    }, [messages]);

    return (
        <div className='filepicker-container'>
            <div className='flex-1 flex flex-col'>
                <input
                    id='file-upload'
                    type='file'
                    accept="image/*"
                    onChange={(e) => setPerson(e.target.files[0])}
                />
                <label htmlFor='file-upload' className='filepicker-label'>
                    Upload File
                </label>

                <p className='mt-2 text-gray-500 text-xs truncate'>
                    {person === '' ? "Nenhum arquivo selecionado" : person.name}
                </p>
            </div>

            <div className='mt-4 flex flex-wrap gap-36'>
                <CustomButton
                    type="filled"
                    title="Carregar ID"
                    handleClick={fetchUserId} // Clicar aqui faz a requisição para pegar o ID
                    customStyles='text-xs'
                />
                <CustomButton
                    type="filled"
                    title="Verificar status da Imagem"
                    handleClick={handleReceiveImage} // Ao clicar, solicita a imagem via WebSocket
                    customStyles='text-xs'
                />
            </div>

            {image && (
                <div className="mt-4">
                    <h3>Imagem Recebida:</h3>
                    <img src={image} alt="Imagem recebida via WebSocket" />
                </div>
            )}
        </div>
    );
};

export default PersonPicker;
