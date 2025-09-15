// Login.js
import { useState } from 'react';
import api from '../../config';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import socketIo from 'socket.io-client';
import Content from '../../components/Content';
import Header from '../../components/Header';

const Tables = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    // Conectar ao servidor WebSocket (ajuste o URL se necessário)
    const socket = socketIo('http://10.0.0.110:3000', {
      transports: ['websocket'],  // Certifique-se de que está usando WebSocket
    });

    // Escutar o evento 'orders@new'
    socket.on('orders@new', (order) => {
      setOrders(prevState => [...prevState, order]);  // Adiciona o pedido à lista
    });

    socket.on('order@deleted', (order) => {
    
      if (!order || !order._id) {
        console.warn('Pedido inválido recebido:', order);
        return;
      }
    
      setOrders((prevState) => {
        const validOrders = prevState.filter((o) => o && o._id); // Remove objetos inválidos
        return validOrders.filter((o) => o._id !== order._id);
      });
    });

    socket.on('order@checked', (updatedOrder) => {
      setOrders((prevState) => {
    
        // Atualiza ou adiciona o pedido, sem removê-lo
        const orderExists = prevState.some((order) => order._id === updatedOrder._id);
        if (orderExists) {
          // Atualiza o pedido existente
          return prevState.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          );
        } else {
          // Adiciona um novo pedido
          return [...prevState, updatedOrder];
        }
      });
    });

    // Limpeza ao desmontar o componente
    return () => {
      socket.disconnect();
    };
  }, []);
  

  const fetchTables = async () => {
    const {data} = await api.get('/orders');

    setOrders(data);
  };

  const handleSelectChange = (e) => {
  const value = e.target.value;

  if (value === "product") {
    navigate("/products");
  } else if (value === "user") {
    navigate("/users");
  }
};
  
  
  
  return (
    <>
      <Header />

      <div className='division'>

        <select onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>
          Selecione uma opção
        </option>
        <option value="product">+ Criar Produto</option>
        <option value="user">+ Criar Usuário</option>
        </select>
        
      </div>
        <div className='container'>
          {orders.map((order) => (
            <Content key={order._id} order={order} onFetchTable={fetchTables}/>
          ))}
        </div>
    </>
  );
};

export default Tables;